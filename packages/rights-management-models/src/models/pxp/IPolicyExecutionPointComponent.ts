// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@3sixty/core";
import type { OdrlActionType } from "@3sixty/standards-w3c-odrl";
import type { IRightsManagementPolicy } from "../IRightsManagementPolicy.js";
import type { IPolicyDecision } from "../pdp/IPolicyDecision.js";
import type { PolicyDecisionStage } from "../pdp/policyDecisionStage.js";

/**
 * Interface describing a Policy Execution Point (PXP) contract.
 * When a decision is made by the Policy Decision Point (PDP),
 * the Policy Execution Point (PXP) will execute any
 * registered actions based on the decision.
 */
export interface IPolicyExecutionPointComponent extends IComponent {
	/**
	 * Execute actions based on the PDP's decisions.
	 * @param policy The policy that applied to the data.
	 * @param decisions The decisions made by the PDP.
	 * @param data The data used in the decision by the PDP.
	 * @param action The action that was evaluated.
	 * @param stage The stage at which the PXP is executed in the PDP.
	 * @returns A promise that resolves when all registered actions have been executed.
	 */
	executeActions<D = unknown>(
		policy: IRightsManagementPolicy,
		decisions: IPolicyDecision[],
		data: D | undefined,
		action: OdrlActionType | string | undefined,
		stage: PolicyDecisionStage
	): Promise<void>;
}
