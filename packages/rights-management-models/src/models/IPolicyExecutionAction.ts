// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { PolicyDecisionStage } from "./policyDecisionStage";

/**
 * Interface for policy execution actions.
 */
export interface IPolicyExecutionAction {
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
	execute(
		assetType: string,
		action: string,
		data: unknown,
		userIdentity: string,
		nodeIdentity: string,
		policies: IOdrlPolicy[],
		stage: PolicyDecisionStage
	): Promise<void>;
}
