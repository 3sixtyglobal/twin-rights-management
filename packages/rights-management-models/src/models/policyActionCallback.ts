// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { PolicyDecisionStage } from "./policyDecisionStage";

/**
 * Callback function type for policy actions.
 * This function is called when a policy action is executed.
 * It receives the asset type, action, data, user identity,
 * node identity, and the policies that apply to the data.
 * The function should return a promise that resolves when the action is complete.
 * @param assetType The type of asset being processed.
 * @param action The action being performed on the asset.
 * @param data The data to process.
 * @param userIdentity The user identity to use in the decision making.
 * @param nodeIdentity The node identity to use in the decision making.
 * @param policies The policies that apply to the data.
 * @param stage The stage of the policy decision.
 * @returns A promise that resolves when the action is complete.
 */
export type PolicyActionCallback<T = unknown> = (
	assetType: string,
	action: string,
	data: T | undefined,
	userIdentity: string,
	nodeIdentity: string,
	policies: IOdrlPolicy[],
	stage: PolicyDecisionStage
) => Promise<void>;
