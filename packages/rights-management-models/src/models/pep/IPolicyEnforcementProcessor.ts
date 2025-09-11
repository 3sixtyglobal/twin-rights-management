// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyLocator } from "../IPolicyLocator";
import type { IPolicyDecision } from "../pdp/IPolicyDecision";

/**
 * Interface for policy enforcement processors.
 */
export interface IPolicyEnforcementProcessor {
	/**
	 * Process the response from the policy decision point.
	 * @param locator The locator to find relevant policies.
	 * @param decisions The decisions made by the policy decision point.
	 * @param data The data to process.
	 * @returns The data after processing.
	 */
	process<D = unknown, R = unknown>(
		locator: IPolicyLocator,
		decisions: IPolicyDecision[],
		data?: D
	): Promise<R | undefined>;
}
