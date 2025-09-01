// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyContext } from "./IPolicyContext";
import type { PolicyDecisionStage } from "./policyDecisionStage";

/**
 * Interface for policy execution actions.
 */
export interface IPolicyExecutionAction {
	/**
	 * Execute function type for policy actions.
	 * @param stage The stage of the policy decision.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param context The context information to use in the decision making.
	 * @param data The data to process.
	 * @param policies The policies that apply to the data.
	 * @returns A promise that resolves when the action is complete.
	 */
	execute<C extends IPolicyContext = IPolicyContext, D = unknown>(
		stage: PolicyDecisionStage,
		assetType: string,
		action: string,
		context: C | undefined,
		data: D | undefined,
		policies: IOdrlPolicy[]
	): Promise<void>;
}
