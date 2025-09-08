// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyExecutionAction } from "./IPolicyExecutionAction";
import type { PolicyDecisionStage } from "./policyDecisionStage";

/**
 * Interface describing a Policy Execution Point (PXP) contract.
 * When a decision is made by the Policy Decision Point (PDP),
 * the Policy Execution Point (PXP) will execute any
 * registered actions based on the decision.
 */
export interface IPolicyExecutionPointComponent extends IComponent {
	/**
	 * Execute actions based on the PDP's decisions.
	 * @param stage The stage at which the PXP is executed in the PDP.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param nodeIdentity The identity of the node making the request.
	 * @param data The data used in the decision by the PDP.
	 * @param policies The policies that apply to the data.
	 * @returns Nothing.
	 */
	executeActions<D = unknown>(
		stage: PolicyDecisionStage,
		assetType: string,
		action: string,
		nodeIdentity: string,
		data: D | undefined,
		policies: IOdrlPolicy[]
	): Promise<void>;

	/**
	 * Register an action to be executed.
	 * @param actionId The id of the action to register.
	 * @param stage The stage at which the action should be executed.
	 * @param action The action to execute.
	 * @returns Nothing.
	 */
	registerAction(
		actionId: string,
		stage: PolicyDecisionStage,
		action: IPolicyExecutionAction
	): Promise<void>;

	/**
	 * Unregister an action from the execution point.
	 * @param actionId The id of the action to unregister.
	 * @param stage The stage at which the action was executed.
	 * @returns Nothing.
	 */
	unregisterAction(actionId: string, stage: PolicyDecisionStage): Promise<void>;
}
