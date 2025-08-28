// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, type IComponent, Is } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyExecutionAction,
	PolicyDecisionStage
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyExecutionPointServiceConstructorOptions } from "../models/IPolicyExecutionPointServiceConstructorOptions";

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
	 * Create a new instance of LoggingPolicyExecutionAction.
	 * @param options The options for the logging policy execution action.
	 */
	constructor(options?: IPolicyExecutionPointServiceConstructorOptions) {
		this._logging = ComponentFactory.get<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);

		this._stages = options?.config?.stages ?? [
			PolicyDecisionStage.Before,
			PolicyDecisionStage.After
		];
		this._includeData = options?.config?.includeData ?? false;
		this._includePolicies = options?.config?.includePolicies ?? false;
	}

	/**
	 * Execute function type for policy actions.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param data The data to process.
	 * @param userIdentity The user identity to use in the decision making.
	 * @param nodeIdentity The node identity to use in the decision making.
	 * @param policies The policies that apply to the data.
	 * @param stage The stage of the policy decision.
	 * @returns A promise that resolves when the action is complete.
	 */
	public async execute(
		assetType: string,
		action: string,
		data: unknown,
		userIdentity: string,
		nodeIdentity: string,
		policies: IOdrlPolicy[],
		stage: PolicyDecisionStage
	): Promise<void> {
		if (this._stages.includes(stage)) {
			// Even if we don't have the options to include data or include policies we
			// still create dummy entries, as the logging string still has them embedded
			let logData;
			if (!Is.empty(data)) {
				logData = this._includeData ? data : "{...}";
			}
			const logPolicies = this._includePolicies ? policies : "[...]";

			this._logging.log({
				level: "info",
				source: this.CLASS_NAME,
				ts: Date.now(),
				message: "policyActionExecuted",
				data: {
					assetType,
					action,
					data: logData,
					userIdentity,
					nodeIdentity,
					policies: logPolicies,
					stage
				}
			});
		}
	}
}
