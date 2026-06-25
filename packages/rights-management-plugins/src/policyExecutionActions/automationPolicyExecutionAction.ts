// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAutomationComponent } from "@twin.org/automation-models";
import { ComponentFactory, Guards, Is } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyDecision,
	type IPolicyExecutionAction,
	type IRightsManagementPolicy,
	PolicyDecisionStage
} from "@twin.org/rights-management-models";
import { OdrlActionType } from "@twin.org/standards-w3c-odrl";
import type { IAutomationPolicyExecutionActionConstructorOptions } from "../models/IAutomationPolicyExecutionActionConstructorOptions.js";

/**
 * Automation Policy Execution Action to execute automation policies.
 */
export class AutomationPolicyExecutionAction implements IPolicyExecutionAction {
	/**
	 * The class name of the Automation Policy Execution Action.
	 */
	public static readonly CLASS_NAME: string = nameof<AutomationPolicyExecutionAction>();

	/**
	 * The before automation trigger name.
	 */
	public static readonly BEFORE_TRIGGER_NAME: string = "rights-management:pxp:before";

	/**
	 * The after automation trigger name.
	 */
	public static readonly AFTER_TRIGGER_NAME: string = "rights-management:pxp:after";

	/**
	 * The automation component.
	 * @internal
	 */
	private readonly _automation: IAutomationComponent;

	/**
	 * The policy decision stages to trigger the automation actions, if undefined defaults to "inform".
	 * @internal
	 */
	private readonly _triggerActions: string[];

	/**
	 * Create a new instance of AutomationPolicyExecutionAction.
	 * @param options The options for the automation policy execution action.
	 */
	constructor(options?: IAutomationPolicyExecutionActionConstructorOptions) {
		this._automation = ComponentFactory.get<IAutomationComponent>(
			options?.automationComponentType ?? "automation"
		);
		this._triggerActions = Is.arrayValue(options?.config?.triggerActions)
			? options?.config?.triggerActions
			: [OdrlActionType.Inform];
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return AutomationPolicyExecutionAction.CLASS_NAME;
	}

	/**
	 * Which stages should the action be executed at.
	 * @returns List of stages.
	 */
	public supportedStages(): PolicyDecisionStage[] {
		return [PolicyDecisionStage.Before, PolicyDecisionStage.After];
	}

	/**
	 * Execute function type for policy actions.
	 * @param policy The policy that applied to the data.
	 * @param decisions The decisions made by the PDP.
	 * @param data The data to process.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @param stage The stage of the policy decision.
	 * @returns A promise that resolves when the action is complete.
	 */
	public async execute<D = unknown>(
		policy: IRightsManagementPolicy,
		decisions: IPolicyDecision[],
		data: D | undefined,
		action: OdrlActionType | string | undefined,
		stage: PolicyDecisionStage
	): Promise<void> {
		Guards.arrayOneOf(
			AutomationPolicyExecutionAction.CLASS_NAME,
			nameof(stage),
			stage,
			Object.values(PolicyDecisionStage)
		);

		if (Is.stringValue(action) && this._triggerActions.includes(action)) {
			await this._automation.trigger(
				stage === PolicyDecisionStage.Before
					? AutomationPolicyExecutionAction.BEFORE_TRIGGER_NAME
					: AutomationPolicyExecutionAction.AFTER_TRIGGER_NAME,
				{
					policy,
					decisions,
					data,
					action
				}
			);
		}
	}
}
