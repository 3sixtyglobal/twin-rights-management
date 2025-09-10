// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyDecision } from "./IPolicyDecision";
import type { IPolicyLocator } from "./IPolicyLocator";
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
	 * @param locator The locator to find relevant policies.
	 * @param policies The policies that apply to the data.
	 * @param decisions The decisions made by the PDP.
	 * @param data The data to process.
	 * @returns A promise that resolves when the action is complete.
	 */
	execute<D = unknown>(
		stage: PolicyDecisionStage,
		locator: IPolicyLocator,
		policies?: IOdrlPolicy[],
		decisions?: IPolicyDecision[],
		data?: D
	): Promise<void>;
}
