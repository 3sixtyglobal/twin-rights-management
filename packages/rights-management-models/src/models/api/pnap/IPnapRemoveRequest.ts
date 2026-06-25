// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The request structure for removing a policy negotiation.
 */
export interface IPnapRemoveRequest {
	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The ID of the policy being removed.
		 */
		policyId: string;
	};
}
