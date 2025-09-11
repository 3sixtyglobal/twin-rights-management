// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IPolicyLocator } from "../IPolicyLocator";
import type { IPolicyState } from "./IPolicyState";

/**
 * Interface describing a Policy Negotiation Request Point (PNRP) contract.
 * Can be used to create the requests to send to other nodes.
 */
export interface IPolicyNegotiationRequestPointComponent extends IComponent {
	/**
	 * Send a negotiation request to an external node.
	 * @param url The URL of the negotiation target.
	 * @param locator The locator to find relevant policies.
	 * @returns The state of the policy.
	 */
	negotiate(url: string, locator: Omit<IPolicyLocator, "assignee">): Promise<IPolicyState>;

	/**
	 * Retrieves the current state of a policy from an external node.
	 * @param url The URL of the negotiation target.
	 * @param policyId The ID of the policy to retrieve the state for.
	 * @returns The current state of the policy.
	 */
	negotiationState(url: string, policyId: string): Promise<IPolicyState>;

	/**
	 * Cancels an ongoing negotiation for a resource from an external node.
	 * @param url The URL of the negotiation target.
	 * @param policyId The ID of the policy to cancel.
	 * @returns Nothing.
	 */
	negotiationCancel(url: string, policyId: string): Promise<void>;
}
