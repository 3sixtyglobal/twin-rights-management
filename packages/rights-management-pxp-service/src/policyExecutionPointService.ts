// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, GeneralError, Guards } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyDecision,
	type IPolicyExecutionPointComponent,
	OdrlPolicyHelper,
	PolicyDecisionStage,
	PolicyExecutionActionFactory
} from "@twin.org/rights-management-models";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import type { OdrlActionType } from "@twin.org/standards-w3c-odrl";
import type { IPolicyExecutionPointServiceConstructorOptions } from "./models/IPolicyExecutionPointServiceConstructorOptions.js";

/**
 * Class implementation of Policy Execution Point Component.
 */
export class PolicyExecutionPointService implements IPolicyExecutionPointComponent {
	/**
	 * The class name of the Policy Execution Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<PolicyExecutionPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * Create a new instance of PolicyExecutionPointService (PXP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyExecutionPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyExecutionPointService.CLASS_NAME;
	}

	/**
	 * Execute actions based on the PDP's decisions.
	 * @param policy The policy that applied to the data.
	 * @param decisions The decisions made by the PDP.
	 * @param data The data used in the decision by the PDP.
	 * @param action The action used in the decision by the PDP.
	 * @param stage The stage at which the PXP is executed in the PDP.
	 * @returns Nothing.
	 */
	public async executeActions<D = unknown>(
		policy: IDataspaceProtocolPolicy,
		decisions: IPolicyDecision[],
		data: D | undefined,
		action: OdrlActionType | string | undefined,
		stage: PolicyDecisionStage
	): Promise<void> {
		Guards.object<IDataspaceProtocolPolicy>(
			PolicyExecutionPointService.CLASS_NAME,
			nameof(policy),
			policy
		);
		Guards.array<IPolicyDecision>(
			PolicyExecutionPointService.CLASS_NAME,
			nameof(decisions),
			decisions
		);
		Guards.arrayOneOf(
			PolicyExecutionPointService.CLASS_NAME,
			nameof(stage),
			stage,
			Object.values(PolicyDecisionStage)
		);

		await this._logging?.log({
			level: "info",
			source: PolicyExecutionPointService.CLASS_NAME,
			ts: Date.now(),
			message: "executingActions",
			data: {
				stage,
				policyId: OdrlPolicyHelper.getUid(policy) ?? ""
			}
		});

		const executionActionNames = PolicyExecutionActionFactory.names();
		const executionActions = executionActionNames
			.map(actionName => PolicyExecutionActionFactory.get(actionName))
			.filter(a => a.supportedStages().includes(stage));

		for (const executionAction of executionActions) {
			try {
				await this._logging?.log({
					level: "info",
					source: PolicyExecutionPointService.CLASS_NAME,
					ts: Date.now(),
					message: "executingAction",
					data: {
						stage,
						policyId: OdrlPolicyHelper.getUid(policy) ?? ""
					}
				});
				await executionAction.execute(policy, decisions, data, action, stage);
			} catch (error) {
				await this._logging?.log({
					level: "error",
					source: PolicyExecutionPointService.CLASS_NAME,
					ts: Date.now(),
					message: "actionExecutionFailed",
					data: {
						actionId: executionAction.className(),
						stage,
						policyId: OdrlPolicyHelper.getUid(policy) ?? ""
					},
					error: BaseError.fromError(error)
				});
				throw new GeneralError(
					PolicyExecutionPointService.CLASS_NAME,
					"actionExecutionFailed",
					{
						actionId: executionAction.className(),
						stage,
						policyId: OdrlPolicyHelper.getUid(policy) ?? ""
					},
					error
				);
			}
		}
	}
}
