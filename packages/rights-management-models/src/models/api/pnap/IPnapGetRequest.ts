// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The request structure for a policy negotiation.
 */
export interface IPnapGetRequest {
	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The ID of the policy being requested.
		 */
		policyId: string;
	};
}
