// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ITaskSchedulerComponent } from "@twin.org/background-task-models";
import { ComponentFactory, Guards, Is, NotFoundError } from "@twin.org/core";
import { ComparisonOperator, SortDirection } from "@twin.org/entity";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	PolicyNegotiationStatus,
	type IPolicyNegotiation,
	type IPolicyNegotiationAdminPointComponent
} from "@twin.org/rights-management-models";
import type { PolicyNegotiation } from "./entities/policyNegotiation";
import type { IPolicyNegotiationAdminPointServiceConstructorOptions } from "./models/IPolicyNegotiationAdminPointServiceConstructorOptions";

/**
 * Class implementation of Policy Negotiation Admin Point Component.
 */
export class PolicyNegotiationAdminPointService implements IPolicyNegotiationAdminPointComponent {
	/**
	 * The default time-to-live (TTL) for negotiation states in minutes.
	 * @default 1440
	 */
	private static readonly _DEFAULT_NEGOTIATION_STATE_TTL_DEFAULT_MINUTES = 1440;

	/**
	 * The class name of the Policy Negotiation Admin Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyNegotiationAdminPointService>();

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
	}

	/**
	 * The component needs to be started when the node is initialized.
	 * @param nodeIdentity The identity of the node starting the component.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns Nothing.
	 */
	public async start(
		nodeIdentity: string,
		nodeLoggingComponentType: string | undefined
	): Promise<void> {
		await this._taskScheduler.addTask(
			"policy-negotiation",
			[
				{
					nextTriggerTime: Date.now(),
					intervalMinutes: 5
				}
			],
			async () => {
				// Clean up old negotiation states
				await this.cleanupOldStates();
			}
		);
	}

	/**
	 * The component needs to be stopped when the node is closed.
	 * @param nodeIdentity The identity of the node stopping the component.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns Nothing.
	 */
	public async stop(
		nodeIdentity: string,
		nodeLoggingComponentType: string | undefined
	): Promise<void> {
		await this._taskScheduler.removeTask("policy-negotiation");
	}

	/**
	 * Retrieves a policy negotiation.
	 * @param policyId The ID of the policy to retrieve the negotiation for.
	 * @returns The policy negotiation.
	 */
	public async get(policyId: string): Promise<IPolicyNegotiation> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		const entity = await this._policyNegotiationEntityStorage.get(policyId);
		if (Is.empty(entity)) {
			throw new NotFoundError(this.CLASS_NAME, "policyNotFound", policyId);
		}
		return this.entityToModel(entity);
	}

	/**
	 * Sets a policy negotiation.
	 * @param negotiation The updated policy negotiation.
	 * @returns Nothing.
	 */
	public async set(negotiation: IPolicyNegotiation): Promise<void> {
		Guards.object<IPolicyNegotiation>(this.CLASS_NAME, nameof(negotiation), negotiation);
		const entity = this.modelToEntity(negotiation);

		// If this is a rejected negotiation, set the expiration
		if (Is.empty(entity.expires) && entity.status === PolicyNegotiationStatus.Rejected) {
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
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		await this._policyNegotiationEntityStorage.remove(policyId);
	}

	/**
	 * Get a list of the negotiations.
	 * @param status The status of the negotiations to retrieve.
	 * @param cursor The cursor to use for pagination.
	 * @returns A list of negotiations and cursor if there are more entries.
	 */
	public async query(
		status?: PolicyNegotiationStatus,
		cursor?: string
	): Promise<{
		items: IPolicyNegotiation[];
		cursor?: string;
	}> {
		let condition;

		if (Is.arrayOneOf(status, Object.values(PolicyNegotiationStatus))) {
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
		let cursor: string | undefined;

		const now = Date.now();

		do {
			const result = await this._policyNegotiationEntityStorage.query({
				conditions: [
					{
						property: "expires",
						comparison: ComparisonOperator.LessThan,
						value: now
					},
					// States for cleanup
					// approved are not added to the storage
					// manual still need processing
					// in progress still need processing
					// rejected can be cleaned up
					{
						property: "status",
						comparison: ComparisonOperator.Equals,
						value: PolicyNegotiationStatus.Rejected
					}
				]
			});
			if (Is.arrayValue(result.entities)) {
				for (const item of result.entities) {
					if (Is.stringValue(item.id)) {
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
			dateCreated: entity.dateCreated,
			assetType: entity.assetType,
			action: entity.action,
			resourceId: entity.resourceId,
			nodeIdentity: entity.nodeIdentity,
			information: entity.information,
			status: entity.status,
			reason: entity.reason,
			expires: entity.expires
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
			dateCreated: model.dateCreated,
			assetType: model.assetType,
			action: model.action,
			resourceId: model.resourceId,
			nodeIdentity: model.nodeIdentity,
			information: model.information,
			status: model.status,
			reason: model.reason,
			expires: model.expires
		};
	}
}
