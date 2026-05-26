// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ITenant, ITenantAdminComponent } from "@twin.org/api-models";
import type { ITaskSchedulerComponent } from "@twin.org/background-task-models";
import { ContextIdKeys, ContextIdStore } from "@twin.org/context";
import { BaseError, ComponentFactory, Guards, Is, NotFoundError } from "@twin.org/core";
import { ComparisonOperator, LogicalOperator, SortDirection } from "@twin.org/entity";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyNegotiation,
	IPolicyNegotiationAdminPointComponent,
	IPolicyNegotiationPointComponent
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
	 */
	private static readonly _DEFAULT_NEGOTIATION_STATE_TTL_DEFAULT_MINUTES = 1440; // One Day

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The task scheduler component.
	 * @internal
	 */
	private readonly _taskScheduler: ITaskSchedulerComponent;

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
	 * The keys to use from the context ids to create partitions.
	 * @internal
	 */
	private readonly _partitionContextIds?: string[];

	/**
	 * Optional PNP component type for sending terminate to consumer callbacks during expired cleanup.
	 * @internal
	 */
	private readonly _policyNegotiationPointComponentType?: string;

	/**
	 * The tenant admin component.
	 * @internal
	 */
	private readonly _tenantAdmin?: ITenantAdminComponent;

	/**
	 * Create a new instance of PolicyNegotiationPointService (PNP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyNegotiationAdminPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._taskScheduler = ComponentFactory.get<ITaskSchedulerComponent>(
			options?.taskSchedulerComponentType ?? "task-scheduler"
		);
		this._policyNegotiationEntityStorage = EntityStorageConnectorFactory.get(
			options?.policyNegotiationEntityStorageType ?? "policy-negotiation"
		);
		this._negotiationStateTtlMs =
			(options?.config?.negotiationStateTtlMinutes ??
				PolicyNegotiationAdminPointService._DEFAULT_NEGOTIATION_STATE_TTL_DEFAULT_MINUTES) *
			60 *
			1000;
		this._partitionContextIds = options?.partitionContextIds;
		this._policyNegotiationPointComponentType = options?.policyNegotiationPointComponentType;
		this._tenantAdmin = ComponentFactory.getIfExists<ITenantAdminComponent>(
			options?.tenantAdminType ?? "tenant-admin"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyNegotiationAdminPointService.CLASS_NAME;
	}

	/**
	 * The component needs to be started when the node is initialized.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns Nothing.
	 */
	public async start(nodeLoggingComponentType?: string): Promise<void> {
		await this._taskScheduler.addTask(
			"policy-negotiation",
			[
				{
					nextTriggerTime: Date.now(),
					intervalMinutes: 5
				}
			],
			async () => {
				// Clean up old negotiation states (expired); sends terminate to consumer when configured
				await this.cleanupOldStates();
			}
		);
	}

	/**
	 * The component needs to be stopped when the node is closed.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns Nothing.
	 */
	public async stop(nodeLoggingComponentType?: string): Promise<void> {
		await this._taskScheduler.removeTask("policy-negotiation");
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
	 * @returns Nothing.
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
	 * @param policyId The ID of the policy to cancel.
	 * @returns Nothing.
	 */
	public async remove(policyId: string): Promise<void> {
		Guards.stringValue(PolicyNegotiationAdminPointService.CLASS_NAME, nameof(policyId), policyId);
		await this._policyNegotiationEntityStorage.remove(policyId);
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
	 * Clean up old negotiation states.
	 * @internal
	 */
	private async cleanupOldStates(): Promise<void> {
		// Since we might have many expired negotiations, we need to page through them
		// and delete them in batches, but they might be partitioned by tenant
		// in the storage
		if (this._partitionContextIds?.includes(ContextIdKeys.Tenant)) {
			try {
				// The cleanup must be done by tenant as the data is partitioned
				let cursor;
				do {
					const result: { tenants: ITenant[]; cursor?: string } | undefined =
						await this._tenantAdmin?.query(undefined, cursor);
					cursor = result?.cursor;
					if (!Is.empty(result)) {
						for (const tenantId of result.tenants.map(t => t.id)) {
							const localContextIds = (await ContextIdStore.getContextIds()) ?? {};
							localContextIds[ContextIdKeys.Tenant] = tenantId;

							await ContextIdStore.run(localContextIds, async () => {
								await this.cleanupOldStatesPartition();
							});
						}
					}
				} while (Is.stringValue(cursor));
			} catch (error) {
				await this._logging?.log({
					level: "error",
					message: "cleanupFailed",
					ts: Date.now(),
					source: PolicyNegotiationAdminPointService.CLASS_NAME,
					error: BaseError.fromError(error)
				});
			}
		} else {
			await this.cleanupOldStatesPartition();
		}
	}

	/**
	 * Cleans up old negotiation states for a specific partition (tenant).
	 * Sends terminate to consumer callbacks when PNP component is configured, then removes.
	 * @internal
	 */
	private async cleanupOldStatesPartition(): Promise<void> {
		let cursor: string | undefined;
		const now = Date.now();

		const pnpComponent = ComponentFactory.getIfExists<IPolicyNegotiationPointComponent>(
			this._policyNegotiationPointComponentType
		);

		do {
			const result = await this._policyNegotiationEntityStorage.query({
				conditions: [
					{
						property: "expires",
						comparison: ComparisonOperator.LessThan,
						value: now
					},
					{
						property: "expires",
						comparison: ComparisonOperator.NotEquals,
						value: undefined
					}
				],
				logicalOperator: LogicalOperator.And
			});
			if (Is.arrayValue(result.entities)) {
				for (const item of result.entities as PolicyNegotiation[]) {
					if (Is.stringValue(item.id)) {
						if (!Is.empty(pnpComponent) && Is.stringValue(item.callbackAddress)) {
							try {
								await pnpComponent.sendTerminateToConsumer(
									item.callbackAddress,
									item.id,
									item.correlationId
								);
							} catch (error) {
								await this._logging?.log({
									level: "warn",
									source: PolicyNegotiationAdminPointService.CLASS_NAME,
									ts: Date.now(),
									message: "sendTerminateFailed",
									data: {
										id: item.id,
										correlationId: item.correlationId
									},
									error: BaseError.fromError(error)
								});
							}
						}
						await this._policyNegotiationEntityStorage.remove(item.id);
					}
				}
				cursor = result.cursor;
			} else {
				cursor = undefined;
			}
		} while (Is.stringValue(cursor));
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
			tenantId: entity.tenantId,
			nodeIdentity: entity.nodeIdentity,
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
			tenantId: model.tenantId,
			nodeIdentity: model.nodeIdentity,
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
