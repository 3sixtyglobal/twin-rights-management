// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The request structure for retrieving a policy.
 */
export interface IPapRetrieveRequest {
	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The ID of the policy to retrieve.
		 */
		id: string;
	};
}
