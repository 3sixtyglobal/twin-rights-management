// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyLocator } from "../IPolicyLocator";
import type { IPolicyState } from "./jsonLd/IPolicyState";
import type { IPolicyInformation } from "../pip/IPolicyInformation";

/**
 * Interface describing a Policy Negotiator.
 */
export interface IPolicyNegotiator {
	/**
	 * The policies supported by this negotiator.
	 * @returns The supported policies, if empty can be used for all.
	 */
	supportedPolicies(): IPolicyLocator[];

	/**
	 * Determines if a policy can be created for the requested resource.
	 * @param policyId The policy id to use if creating a new policy.
	 * @param locator The locator to find relevant policies.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @returns The state of the policy and the actual policy if it was approved.
	 */
	negotiate(
		policyId: string,
		locator: IPolicyLocator,
		information?: IPolicyInformation
	): Promise<{
		state: IPolicyState;
		policy?: IOdrlPolicy;
	}>;
}
