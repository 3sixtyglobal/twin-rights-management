// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiationPointComponent } from "@twin.org/rights-management-models";

/**
 * Options for the Policy Negotiation Request Point Component.
 */
export interface IPolicyNegotiationRequestPointServiceConfig {
	/**
	 * The time-to-live (TTL) for proof in seconds.
	 * @default 300 (5 minutes)
	 */
	proofTtlInSeconds?: number;

	/**
	 * The id of the identity method to use when signing/verifying proofs.
	 * @default rights-management-assertion
	 */
	rightsManagementMethodId?: string;

	/**
	 * A method for creating a new instance of the policy negotiation point component.
	 * To be used when sending request remotely to another node.
	 */
	negotiationComponentCreator: (url: string) => Promise<IPolicyNegotiationPointComponent>;
}
