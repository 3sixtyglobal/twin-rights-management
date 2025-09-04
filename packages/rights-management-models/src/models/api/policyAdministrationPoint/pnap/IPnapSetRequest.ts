// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiation } from "../../../IPolicyNegotiation";

/**
 * The request structure for setting a policy negotiation.
 */
export interface IPnapSetRequest {
	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The ID of the policy being requested.
		 */
		policyId: string;
	};

	/**
	 * The policy negotiation.
	 */
	body: IPolicyNegotiation;
}
