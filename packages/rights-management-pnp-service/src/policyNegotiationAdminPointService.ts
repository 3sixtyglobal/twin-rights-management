// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ContextIdHelper, ContextIdKeys, ContextIdStore } from "@twin.org/context";
import {
	AlreadyExistsError,
	Coerce,
	ComponentFactory,
	Guards,
	Is,
	Mutex,
	NotFoundError
} from "@twin.org/core";
import { ComparisonOperator, SortDirection } from "@twin.org/entity";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyNegotiation,
	IPolicyNegotiationAdminPointComponent
} from "@twin.org/rights-management-models";
import { DataspaceProtocolContractNegotiationStateType } from "@twin.org/standards-dataspace-protocol";
import type { PolicyNegotiation } from "./entities/policyNegotiation.js";
import type { IPolicyNegotiationAdminPointServiceConstructorOptions } from "./models/IPolicyNegotiationAdminPointServiceConstructorOptions.js";

/**
 * Class implementation of Policy Negotiation Admin Point Component.
 */
export class PolicyNegotiationAdminPointService implements IPolicyNegotiationAdminPointComponent {
	/**
	 * The class name of the Policy Negotiation Admin Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<PolicyNegotiationAdminPointService>();

	/**
	 * The default time-to-live (TTL) for negotiation states in minutes.
	 * @default 1440
	 * @internal
	 */
	private static readonly _DEFAULT_NEGOTIATION_STATE_TTL_DEFAULT_MINUTES = 1440; // One Day

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The entity storage component for storing policy state.
	 * @internal
	 */
	private readonly _policyNegotiationEntityStorage: IEntityStorageConnector<PolicyNegotiation>;

	/**
	 * The time-to-live (TTL) for negotiation states in minutes.
	 * @internal
	 */
	private readonly _negotiationStateTtlMs: number;

	/**
	 * Timeout in milliseconds to wait when acquiring a mutex lock.
	 * @internal
	 */
	private readonly _mutexTimeoutMs?: number;

	/**
	 * Create a new instance of PolicyNegotiationAdminPointService (PNAP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyNegotiationAdminPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);
		this._policyNegotiationEntityStorage = EntityStorageConnectorFactory.get(
			options?.policyNegotiationEntityStorageType ?? "policy-negotiation"
		);
		this._negotiationStateTtlMs =
			(options?.config?.negotiationStateTtlMinutes ??
				PolicyNegotiationAdminPointService._DEFAULT_NEGOTIATION_STATE_TTL_DEFAULT_MINUTES) *
			60 *
			1000;
		this._mutexTimeoutMs = Coerce.integer(options?.config?.mutexTimeoutMs);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyNegotiationAdminPointService.CLASS_NAME;
	}

	/**
	 * Pre-registers a consumer-side negotiation entry.
	 * @param id The consumer-side negotiation identifier (DSP consumerPid).
	 * @returns The negotiation id (same as the caller-supplied id).
	 */
	public async create(id: string): Promise<string> {
		Guards.stringValue(PolicyNegotiationAdminPointService.CLASS_NAME, nameof(id), id);

		await Mutex.lock(id, { throwOnTimeout: true, timeoutMs: this._mutexTimeoutMs });
		try {
			const existing = await this._policyNegotiationEntityStorage.get(id);
			if (!Is.empty(existing)) {
				throw new AlreadyExistsError(
					PolicyNegotiationAdminPointService.CLASS_NAME,
					"negotiationAlreadyExists",
					id
				);
			}

			const contextIds = await ContextIdStore.getContextIds();
			ContextIdHelper.guard(contextIds, ContextIdKeys.Organization);
			const organizationIdentity = contextIds[ContextIdKeys.Organization];

			await this.set({
				// correlationId (the provider's pid) is unknown at pre-registration time;
				// offerFromProvider() fills it in when the ContractOfferMessage arrives (full cycle),
				// or agreementFromProvider() fills it in when the ContractAgreementMessage arrives
				// directly (direct-agreement fast path, which skips the offer step entirely).
				id,
				correlationId: "",
				dateCreated: new Date(Date.now()).toISOString(),
				state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
				organizationIdentity
			});

			await this._logging?.log({
				level: "info",
				ts: Date.now(),
				source: PolicyNegotiationAdminPointService.CLASS_NAME,
				message: "negotiationCreated",
				data: { id }
			});

			return id;
		} finally {
			Mutex.unlock(id);
		}
	}

	/**
	 * Retrieves a policy negotiation.
	 * @param id The ID of the policy to retrieve the negotiation for.
	 * @returns The policy negotiation.
	 */
	public async get(id: string): Promise<IPolicyNegotiation> {
		Guards.stringValue(PolicyNegotiationAdminPointService.CLASS_NAME, nameof(id), id);

		const entity = await this._policyNegotiationEntityStorage.get(id);
		if (Is.empty(entity)) {
			throw new NotFoundError(PolicyNegotiationAdminPointService.CLASS_NAME, "policyNotFound", id);
		}

		return this.entityToModel(entity);
	}

	/**
	 * Sets a policy negotiation.
	 * @param negotiation The updated policy negotiation.
	 * @returns A promise that resolves when the negotiation has been stored.
	 */
	public async set(negotiation: IPolicyNegotiation): Promise<void> {
		Guards.object<IPolicyNegotiation>(
			PolicyNegotiationAdminPointService.CLASS_NAME,
			nameof(negotiation),
			negotiation
		);
		const entity = this.modelToEntity(negotiation);

		// Every time the negotiation is updated, extend the expiry time
		// unless intervention is required then we don't want it to expire
		// and we want it to be handled manually
		if (entity.interventionRequired) {
			entity.expires = undefined;
		} else {
			entity.expires = Date.now() + this._negotiationStateTtlMs;
		}

		await this._policyNegotiationEntityStorage.set(entity);
	}

	/**
	 * Cancels an ongoing negotiation for a resource.
	 * Acquires a per-id mutex so it cannot interleave with a concurrent setIfExists() call
	 * in the Policy Negotiation Point service.
	 * @param policyId The ID of the policy to cancel.
	 * @returns A promise that resolves when the negotiation has been removed.
	 */
	public async remove(policyId: string): Promise<void> {
		Guards.stringValue(PolicyNegotiationAdminPointService.CLASS_NAME, nameof(policyId), policyId);
		await Mutex.lock(policyId, { throwOnTimeout: true, timeoutMs: this._mutexTimeoutMs });
		try {
			await this._policyNegotiationEntityStorage.remove(policyId);
		} finally {
			Mutex.unlock(policyId);
		}
	}

	/**
	 * Get a list of the negotiations.
	 * @param status The status of the negotiations to retrieve.
	 * @param cursor The cursor to use for pagination.
	 * @returns A list of negotiations and cursor if there are more entries.
	 */
	public async query(
		status?: DataspaceProtocolContractNegotiationStateType,
		cursor?: string
	): Promise<{
		items: IPolicyNegotiation[];
		cursor?: string;
	}> {
		let condition;

		if (Is.arrayOneOf(status, Object.values(DataspaceProtocolContractNegotiationStateType))) {
			condition = {
				conditions: [
					{
						property: "status",
						comparison: ComparisonOperator.Equals,
						value: status
					}
				]
			};
		}
		const result = await this._policyNegotiationEntityStorage.query(
			condition,
			[{ property: "dateCreated", sortDirection: SortDirection.Ascending }],
			undefined,
			cursor
		);

		return {
			items: (result.entities as PolicyNegotiation[]).map(entity => this.entityToModel(entity)),
			cursor: result.cursor
		};
	}

	/**
	 * Converts a PolicyNegotiation entity to a model.
	 * @param entity The PolicyNegotiation entity to convert.
	 * @returns The converted IPolicyNegotiation model.
	 * @internal
	 */
	private entityToModel(entity: PolicyNegotiation): IPolicyNegotiation {
		return {
			id: entity.id,
			correlationId: entity.correlationId,
			policyId: entity.policyId,
			dateCreated: entity.dateCreated,
			expires: entity.expires,
			state: entity.state,
			callbackAddress: entity.callbackAddress,
			publicOrigin: entity.publicOrigin,
			organizationIdentity: entity.organizationIdentity,
			offer: entity.offer,
			agreement: entity.agreement,
			trustVerificationInfo: entity.trustVerificationInfo,
			code: entity.code,
			reason: entity.reason,
			description: entity.description,
			handlerId: entity.handlerId,
			interventionRequired: entity.interventionRequired
		};
	}

	/**
	 * Converts a model to a PolicyNegotiation entity.
	 * @param model The IPolicyNegotiation model to convert.
	 * @returns The converted PolicyNegotiation entity.
	 * @internal
	 */
	private modelToEntity(model: IPolicyNegotiation): PolicyNegotiation {
		return {
			id: model.id,
			correlationId: model.correlationId,
			policyId: model.policyId,
			dateCreated: model.dateCreated,
			expires: model.expires,
			state: model.state,
			callbackAddress: model.callbackAddress,
			publicOrigin: model.publicOrigin,
			organizationIdentity: model.organizationIdentity,
			offer: model.offer,
			agreement: model.agreement,
			trustVerificationInfo: model.trustVerificationInfo,
			code: model.code,
			reason: model.reason,
			errorDetails: model.errorDetails,
			description: model.description,
			handlerId: model.handlerId,
			interventionRequired: model.interventionRequired
		};
	}
}
