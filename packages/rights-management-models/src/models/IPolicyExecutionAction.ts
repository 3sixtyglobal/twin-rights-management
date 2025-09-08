// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { PolicyDecisionStage } from "./policyDecisionStage";

/**
 * Interface for policy execution actions.
 */
export interface IPolicyExecutionAction {
	/**
	 * Which stages should the action be executed at.
	 * @returns List of stages.
	 */
	supportedStages(): PolicyDecisionStage[];

	/**
	 * Execute function type for policy actions.
	 * @param stage The stage of the policy decision.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param nodeIdentity The identity of the node making the request.
	 * @param data The data to process.
	 * @param policies The policies that apply to the data.
	 * @returns A promise that resolves when the action is complete.
	 */
	execute<D = unknown>(
		stage: PolicyDecisionStage,
		assetType: string,
		action: string,
		nodeIdentity: string,
		data: D | undefined,
		policies: IOdrlPolicy[]
	): Promise<void>;
}
