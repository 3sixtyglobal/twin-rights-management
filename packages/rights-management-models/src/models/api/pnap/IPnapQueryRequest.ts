// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The request structure for querying manual policy negotiations.
 */
export interface IPnapQueryRequest {
	/**
	 * The query parameters of the request.
	 */
	query?: {
		/**
		 * The status of the policy negotiations.
		 */
		status?: string;

		/**
		 * The cursor for pagination.
		 */
		cursor?: string;
	};
}
