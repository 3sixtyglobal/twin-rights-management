// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyDecision } from "../pdp/IPolicyDecision.js";

/**
 * Interface for policy enforcement processors.
 */
export interface IPolicyEnforcementProcessor extends IComponent {
	/**
	 * Process the response from the policy decision point.
	 * @param policy The policy to process.
	 * @param decisions The decisions made by the policy decision point.
	 * @param data The data to process.
	 * @returns The data after processing.
	 */
	process<D = unknown, R = D>(
		policy: IOdrlPolicy,
		decisions: IPolicyDecision[],
		data?: D
	): Promise<R>;
}
