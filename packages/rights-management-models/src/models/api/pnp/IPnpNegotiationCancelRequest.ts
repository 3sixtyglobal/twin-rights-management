// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IProof } from "@twin.org/standards-w3c-did";

/**
 * The request structure for cancelling a policy negotiation.
 */
export interface IPnpNegotiationCancelRequest {
	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The ID of the policy being cancelled.
		 */
		policyId: string;
	};

	/**
	 * The body of the request.
	 */
	body: {
		/**
		 * The node sending the request.
		 */
		nodeIdentity: string;

		/**
		 * The proof provided by the requester to support the policy cancellation.
		 */
		proof: IProof;
	};
}
