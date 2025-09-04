// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The request structure for removing a policy.
 */
export interface IPapRemoveRequest {
	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The ID of the policy to remove.
		 */
		id: string;
	};
}
