// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { OdrlActionType } from "@twin.org/standards-w3c-odrl";
import type { IRightsManagementPolicy } from "../IRightsManagementPolicy.js";
import type { IPolicyDecision } from "../pdp/IPolicyDecision.js";
import type { PolicyDecisionStage } from "../pdp/policyDecisionStage.js";

/**
 * Interface for policy execution actions.
 */
export interface IPolicyExecutionAction extends IComponent {
	/**
	 * Which stages should the action be executed at.
	 * @returns List of stages.
	 */
	supportedStages(): PolicyDecisionStage[];

	/**
	 * Execute function type for policy actions.
	 * @param policy The policy that applied to the data.
	 * @param decisions The decisions made by the PDP.
	 * @param data The data to process.
	 * @param action The action that was evaluated.
	 * @param stage The stage of the policy decision.
	 * @returns A promise that resolves when the action is complete.
	 */
	execute<D = unknown>(
		policy: IRightsManagementPolicy,
		decisions: IPolicyDecision[],
		data: D | undefined,
		action: OdrlActionType | string | undefined,
		stage: PolicyDecisionStage
	): Promise<void>;
}
