// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IPolicyNegotiation } from "./IPolicyNegotiation";
import type { PolicyNegotiationStatus } from "./policyNegotiationStatus";

/**
 * Interface describing a Policy Negotiation Admin Point (PNAP) contract.
 * Components performs administration tasks on the policy negotiations.
 */
export interface IPolicyNegotiationAdminPointComponent extends IComponent {
	/**
	 * Retrieves a policy negotiation.
	 * @param policyId The ID of the policy to retrieve the negotiation for.
	 * @returns The policy negotiation.
	 */
	get(policyId: string): Promise<IPolicyNegotiation>;

	/**
	 * Sets a policy negotiation.
	 * @param negotiation The updated policy negotiation.
	 * @returns Nothing.
	 */
	set(negotiation: IPolicyNegotiation): Promise<void>;

	/**
	 * Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @returns Nothing.
	 */
	remove(policyId: string): Promise<void>;

	/**
	 * Get a list of the negotiations.
	 * @param status The state of the negotiations to retrieve.
	 * @param cursor The cursor to use for pagination.
	 * @returns A list of negotiations and cursor if there are more entries.
	 */
	query(
		status?: PolicyNegotiationStatus,
		cursor?: string
	): Promise<{ items: IPolicyNegotiation[]; cursor?: string }>;
}
