// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IPolicyArbiter } from "./IPolicyArbiter";
import type { IPolicyDecision } from "./IPolicyDecision";
import type { IPolicyLocator } from "./IPolicyLocator";

/**
 * Interface describing a Policy Decision Point (PDP) contract.
 * Decides if a party can be granted access to a resource, will retrieve policies
 * from the Policy Management Point (PMP) and any additional information from the
 * Policy Information Point (PIP). When a decision is made, the Policy Execution
 * Point (PEP) will execute any registered actions.
 */
export interface IPolicyDecisionPointComponent extends IComponent {
	/**
	 * Evaluate requests from a Policy Enforcement Point (PEP).
	 * Uses the Policy Management Point (PMP) to retrieve the policies and the
	 * Policy Information Point (PIP) to retrieve additional information.
	 * Executes any actions on the Policy Execution Point (PXP) before and after decision is made.
	 * @param locator The locator to find relevant policies.
	 * @param data The data to make a decision on.
	 * @returns Returns the policy decisions which apply to the data so that the PEP
	 * can manipulate the data accordingly.
	 */
	evaluate<D = unknown>(locator: IPolicyLocator, data?: D): Promise<IPolicyDecision[]>;

	/**
	 * Register an arbiter to use for making decisions.
	 * @param arbiterId The id of the arbiter to register.
	 * @param arbiter The arbiter to register.
	 * @returns Nothing.
	 */
	registerArbiter(arbiterId: string, arbiter: IPolicyArbiter): Promise<void>;

	/**
	 * Unregister an arbiter from making decisions.
	 * @param arbiterId The id of the arbiter to unregister.
	 * @returns Nothing.
	 */
	unregisterArbiter(arbiterId: string): Promise<void>;
}
