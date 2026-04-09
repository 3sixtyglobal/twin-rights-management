// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The request structure for getting an ecosystem policy.
 */
export interface IPapGetEcosystemPolicyRequest {
	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The ID of the ecosystem policy to get.
		 */
		id: string;
	};
}
