// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyDecision,
	type IPolicyExecutionAction,
	type IPolicyExecutionPointComponent,
	type IPolicyLocator,
	LocatorHelper,
	PolicyDecisionStage
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyExecutionPointServiceConstructorOptions } from "./models/IPolicyExecutionPointServiceConstructorOptions";

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
	private readonly _executionActions: {
		[stage in PolicyDecisionStage]: {
			actionId: string;
			action: IPolicyExecutionAction;
		}[];
	};

	/**
	 * Create a new instance of PolicyExecutionPointService (PXP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyExecutionPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);

		this._executionActions = {
			[PolicyDecisionStage.Before]: [],
			[PolicyDecisionStage.After]: []
		};

		if (Is.arrayValue(options?.config?.actions)) {
			for (const { actionId, action } of options.config.actions) {
				const supportedStages = action.supportedStages();
				if (supportedStages.includes(PolicyDecisionStage.Before)) {
					this._executionActions[PolicyDecisionStage.Before].push({
						actionId,
						action
					});
				}
				if (supportedStages.includes(PolicyDecisionStage.After)) {
					this._executionActions[PolicyDecisionStage.After].push({
						actionId,
						action
					});
				}
			}
		}
	}

	/**
	 * Execute actions based on the PDP's decisions.
	 * @param stage The stage at which the PXP is executed in the PDP.
	 * @param locator The locator to find relevant policies.
	 * @param policies The policies that apply to the data.
	 * @param decisions The decisions made by the PDP.
	 * @param data The data used in the decision by the PDP.
	 * @returns Nothing.
	 */
	public async executeActions<D = unknown>(
		stage: PolicyDecisionStage,
		locator: IPolicyLocator,
		policies?: IOdrlPolicy[],
		decisions?: IPolicyDecision[],
		data?: D
	): Promise<void> {
		Guards.arrayOneOf(this.CLASS_NAME, nameof(stage), stage, Object.values(PolicyDecisionStage));
		Guards.object<IPolicyLocator>(this.CLASS_NAME, nameof(locator), locator);

		const locatorDetails = LocatorHelper.toString(locator);

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "executingActions",
			data: {
				stage,
				locator: locatorDetails
			}
		});

		for (const { actionId, action: executionAction } of this._executionActions[stage]) {
			try {
				this._logging?.log({
					level: "info",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "executingAction",
					data: {
						stage,
						locator: locatorDetails
					}
				});
				await executionAction.execute(stage, locator, policies, decisions, data);
			} catch (error) {
				this._logging?.log({
					level: "error",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "actionExecutionFailed",
					data: {
						actionId,
						stage,
						locator: locatorDetails
					},
					error: BaseError.fromError(error)
				});
				throw new GeneralError(
					this.CLASS_NAME,
					"actionExecutionFailed",
					{
						actionId,
						stage,
						locator: locatorDetails
					},
					error
				);
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
	public async registerAction(
		actionId: string,
		stage: PolicyDecisionStage,
		action: IPolicyExecutionAction
	): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(actionId), actionId);
		Guards.arrayOneOf(this.CLASS_NAME, nameof(stage), stage, Object.values(PolicyDecisionStage));
		Guards.object<IPolicyExecutionAction>(this.CLASS_NAME, nameof(action), action);

		const currentIndex = this._executionActions[stage].findIndex(a => a.actionId === actionId);
		if (currentIndex !== -1) {
			this._executionActions[stage][currentIndex].action = action;
		} else {
			this._executionActions[stage].push({
				actionId,
				action
			});
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "registeredAction",
			data: {
				actionId,
				stage
			}
		});
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

		const currentIndex = this._executionActions[stage].findIndex(a => a.actionId === actionId);
		if (currentIndex !== -1) {
			this._executionActions[stage].splice(currentIndex, 1);
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "unregisteredAction",
			data: {
				actionId,
				stage
			}
		});
	}
}
