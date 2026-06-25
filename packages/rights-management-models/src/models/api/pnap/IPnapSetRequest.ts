// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiation } from "../../pnp/IPolicyNegotiation.js";

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
