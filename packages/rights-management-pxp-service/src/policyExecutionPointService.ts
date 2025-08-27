// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, Guards } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyExecutionPointComponent,
	type PolicyActionCallback,
	PolicyDecisionStage
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyExecutionPointServiceOptions } from "./models/IPolicyExecutionPointServiceOptions";

/**
 * Class implementation of Policy Execution Point Component.
 */
export class PolicyExecutionPointService implements IPolicyExecutionPointComponent {
	/**
	 * The class name of the Policy Execution Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyExecutionPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * These actions can be registered to perform specific tasks before or after the policy execution.
	 * @internal
	 */
	private readonly _executeActions: {
		[stage in PolicyDecisionStage]: {
			actions: {
				actionId: string;
				callback: PolicyActionCallback<unknown>;
			}[];
		};
	};

	/**
	 * Create a new instance of PolicyExecutionPointService (PXP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyExecutionPointServiceOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);

		this._executeActions = {
			[PolicyDecisionStage.Before]: {
				actions: []
			},
			[PolicyDecisionStage.After]: {
				actions: []
			}
		};
	}

	/**
	 * Execute actions based on the PDP's decisions.
	 * @param stage The stage at which the PXP is executed in the PDP.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param data The data used in the decision by the PDP.
	 * @param userIdentity The user identity to use in the decision making.
	 * @param nodeIdentity The node identity to use in the decision making.
	 * @param policies The policies that apply to the data.
	 * @returns Nothing.
	 */
	public async executeActions<T = unknown>(
		stage: PolicyDecisionStage,
		assetType: string,
		action: string,
		data: T | undefined,
		userIdentity: string,
		nodeIdentity: string,
		policies: IOdrlPolicy[]
	): Promise<void> {
		Guards.arrayOneOf(this.CLASS_NAME, nameof(stage), stage, Object.values(PolicyDecisionStage));
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);

		const actions = this._executeActions[stage].actions;
		for (const { actionId, callback } of actions) {
			try {
				await callback(assetType, action, data, userIdentity, nodeIdentity, policies, stage);
			} catch (error) {
				this._logging?.log({
					level: "error",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "actionExecutionFailed",
					data: {
						actionId,
						stage,
						assetType,
						action
					},
					error: BaseError.fromError(error)
				});
			}
		}
	}

	/**
	 * Register an action to be executed.
	 * @param actionId The id of the action to register.
	 * @param stage The stage at which the action should be executed.
	 * @param action The action to execute.
	 * @returns Nothing.
	 */
	public async registerAction<T = unknown>(
		actionId: string,
		stage: PolicyDecisionStage,
		action: PolicyActionCallback<T>
	): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(actionId), actionId);
		Guards.arrayOneOf(this.CLASS_NAME, nameof(stage), stage, Object.values(PolicyDecisionStage));
		Guards.function(this.CLASS_NAME, nameof(action), action);

		const currentIndex = this._executeActions[stage].actions.findIndex(
			a => a.actionId === actionId
		);
		if (currentIndex !== -1) {
			this._executeActions[stage].actions[currentIndex].callback =
				action as PolicyActionCallback<unknown>;
		} else {
			this._executeActions[stage].actions.push({
				actionId,
				callback: action as PolicyActionCallback<unknown>
			});
		}
	}

	/**
	 * Unregister an action from the execution point.
	 * @param actionId The id of the action to unregister.
	 * @param stage The stage at which the action was executed.
	 * @returns Nothing.
	 */
	public async unregisterAction(actionId: string, stage: PolicyDecisionStage): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(actionId), actionId);
		Guards.arrayOneOf(this.CLASS_NAME, nameof(stage), stage, Object.values(PolicyDecisionStage));

		const currentIndex = this._executeActions[stage].actions.findIndex(
			a => a.actionId === actionId
		);
		if (currentIndex !== -1) {
			this._executeActions[stage].actions.splice(currentIndex, 1);
		}
	}
}
