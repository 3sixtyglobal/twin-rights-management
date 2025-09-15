// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IPolicyLocator } from "../IPolicyLocator";
import type { IPolicyNegotiator } from "./IPolicyNegotiator";
import type { IPolicyState } from "./jsonLd/IPolicyState";
import type { IPolicyInformation } from "../pip/IPolicyInformation";

/**
 * Interface describing a Policy Negotiation Point (PNP) contract.
 * When receiving a request from another component, the PNP will negotiate the terms
 * of the request and determine the appropriate policies to create.
 */
export interface IPolicyNegotiationPointComponent extends IComponent {
	/**
	 * Processes an incoming negotiation request for the resource.
	 * @param locator The locator to find relevant policies.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param proofToken The proof provided by the requester to support the policy creation.
	 * @returns The state of the policy.
	 */
	negotiate(
		locator: IPolicyLocator,
		information: IPolicyInformation | undefined,
		proofToken: string
	): Promise<IPolicyState>;

	/**
	 * Retrieves the current state of a policy.
	 * @param policyId The ID of the policy to retrieve the state for.
	 * @param proofToken The proof provided by the requester to support the state retrieval.
	 * @returns The current state of the policy.
	 */
	negotiationState(policyId: string, proofToken: string): Promise<IPolicyState>;

	/**
	 * Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @param proofToken The proof provided by the requester to support the cancellation.
	 * @returns Nothing.
	 */
	negotiationCancel(policyId: string, proofToken: string): Promise<void>;

	/**
	 * Register a negotiator to use for handling data.
	 * @param negotiatorId The id of the negotiator to register.
	 * @param negotiator The negotiator to register.
	 * @returns Nothing.
	 */
	registerNegotiator(negotiatorId: string, negotiator: IPolicyNegotiator): Promise<void>;

	/**
	 * Unregister a negotiator from the handling.
	 * @param negotiatorId The id of the negotiator to unregister.
	 * @returns Nothing.
	 */
	unregisterNegotiator(negotiatorId: string): Promise<void>;
}
