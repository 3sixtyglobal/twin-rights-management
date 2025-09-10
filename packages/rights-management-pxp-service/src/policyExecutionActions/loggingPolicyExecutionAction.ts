// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards, type IComponent, Is } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyDecision,
	type IPolicyExecutionAction,
	type IPolicyLocator,
	LocatorHelper,
	PolicyDecisionStage
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { ILoggingPolicyExecutionActionConstructorOptions } from "../models/ILoggingPolicyExecutionActionConstructorOptions";

/**
 * Logging Policy Execution Action to send decisions to logging.
 */
export class LoggingPolicyExecutionAction implements IPolicyExecutionAction, IComponent {
	/**
	 * The class name of the Policy Execution Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<LoggingPolicyExecutionAction>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging: ILoggingComponent;

	/**
	 * The policy decision stages to log, if undefined defaults to all.
	 * @internal
	 */
	private readonly _stages: PolicyDecisionStage[];

	/**
	 * Whether to include the data in the log.
	 */
	private readonly _includeData: boolean;

	/**
	 * Whether to include the policies in the log.
	 */
	private readonly _includePolicies: boolean;

	/**
	 * Whether to include the decisions in the log.
	 */
	private readonly _includeDecisions: boolean;

	/**
	 * Create a new instance of LoggingPolicyExecutionAction.
	 * @param options The options for the logging policy execution action.
	 */
	constructor(options?: ILoggingPolicyExecutionActionConstructorOptions) {
		this._logging = ComponentFactory.get<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);

		this._stages = options?.config?.stages ?? [
			PolicyDecisionStage.Before,
			PolicyDecisionStage.After
		];
		this._includeData = options?.config?.includeData ?? false;
		this._includePolicies = options?.config?.includePolicies ?? false;
		this._includeDecisions = options?.config?.includeDecisions ?? false;
	}

	/**
	 * Which stages should the action be executed at.
	 * @returns List of stages.
	 */
	public supportedStages(): PolicyDecisionStage[] {
		return this._stages;
	}

	/**
	 * Execute function type for policy actions.
	 * @param stage The stage of the policy decision.
	 * @param locator The locator to find relevant policies.
	 * @param policies The policies that apply to the data.
	 * @param decisions The decisions made by the PDP.
	 * @param data The data to process.
	 * @returns A promise that resolves when the action is complete.
	 */
	public async execute<D = unknown>(
		stage: PolicyDecisionStage,
		locator: IPolicyLocator,
		policies?: IOdrlPolicy[],
		decisions?: IPolicyDecision[],
		data?: D
	): Promise<void> {
		Guards.arrayOneOf(this.CLASS_NAME, nameof(stage), stage, Object.values(PolicyDecisionStage));
		Guards.object<IPolicyLocator>(this.CLASS_NAME, nameof(locator), locator);

		if (this._stages.includes(stage)) {
			// Even if we don't have the options to include data or include policies we
			// still create dummy entries, as the logging string still has them embedded
			let logData;
			if (!Is.empty(data)) {
				logData = this._includeData ? data : "{...}";
			}
			const logPolicies = this._includePolicies ? policies : "[...]";
			const logDecisions = this._includeDecisions ? decisions : "[...]";

			this._logging.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: `policyActionExecuted${stage === PolicyDecisionStage.Before ? "Before" : "After"}`,
				data: {
					locator: LocatorHelper.toString(locator),
					data: logData,
					policies: logPolicies,
					decisions: logDecisions,
					stage
				}
			});
		}
	}
}
