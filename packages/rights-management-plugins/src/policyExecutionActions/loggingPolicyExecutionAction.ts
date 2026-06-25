// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards, Is } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyDecision,
	type IPolicyExecutionAction,
	type IRightsManagementPolicy,
	OdrlPolicyHelper,
	PolicyDecisionStage
} from "@twin.org/rights-management-models";
import type { OdrlActionType } from "@twin.org/standards-w3c-odrl";
import type { ILoggingPolicyExecutionActionConstructorOptions } from "../models/ILoggingPolicyExecutionActionConstructorOptions.js";

/**
 * Logging Policy Execution Action to send decisions to logging.
 */
export class LoggingPolicyExecutionAction implements IPolicyExecutionAction {
	/**
	 * The class name of the Logging Policy Execution Action.
	 */
	public static readonly CLASS_NAME: string = nameof<LoggingPolicyExecutionAction>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The policy decision stages to log, if undefined defaults to all.
	 * @internal
	 */
	private readonly _stages: PolicyDecisionStage[];

	/**
	 * Whether to include the data in the log.
	 * @internal
	 */
	private readonly _includeData: boolean;

	/**
	 * Whether to include the policy in the log.
	 * @internal
	 */
	private readonly _includePolicy: boolean;

	/**
	 * Whether to include the decisions in the log.
	 * @internal
	 */
	private readonly _includeDecisions: boolean;

	/**
	 * Create a new instance of LoggingPolicyExecutionAction.
	 * @param options The options for the logging policy execution action.
	 */
	constructor(options?: ILoggingPolicyExecutionActionConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);

		this._stages = options?.config?.stages ?? [
			PolicyDecisionStage.Before,
			PolicyDecisionStage.After
		];
		this._includeData = options?.config?.includeData ?? false;
		this._includePolicy = options?.config?.includePolicy ?? false;
		this._includeDecisions = options?.config?.includeDecisions ?? false;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return LoggingPolicyExecutionAction.CLASS_NAME;
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
			LoggingPolicyExecutionAction.CLASS_NAME,
			nameof(stage),
			stage,
			Object.values(PolicyDecisionStage)
		);

		if (this._stages.includes(stage)) {
			// Even if we don't have the options to include data or include policy we
			// still create dummy entries, as the logging string still has them embedded
			let logData;
			if (!Is.empty(data)) {
				logData = this._includeData ? data : "{...}";
			}
			const logPolicy = this._includePolicy ? policy : "{}";
			const logDecisions = this._includeDecisions ? decisions : "[...]";

			if (stage === PolicyDecisionStage.Before) {
				await this._logging?.log({
					level: "info",
					source: LoggingPolicyExecutionAction.CLASS_NAME,
					ts: Date.now(),
					message: "policyActionExecutedBefore",
					data: {
						policyId: OdrlPolicyHelper.getUid(policy) ?? "",
						data: logData,
						policy: logPolicy,
						decisions: logDecisions,
						action,
						stage
					}
				});
			} else {
				await this._logging?.log({
					level: "info",
					source: LoggingPolicyExecutionAction.CLASS_NAME,
					ts: Date.now(),
					message: "policyActionExecutedAfter",
					data: {
						policyId: OdrlPolicyHelper.getUid(policy) ?? "",
						data: logData,
						policy: logPolicy,
						decisions: logDecisions,
						action,
						stage
					}
				});
			}
		}
	}
}
