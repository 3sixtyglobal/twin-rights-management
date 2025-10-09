// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The request structure for querying policies.
 */
export interface IPapQueryRequest {
	/**
	 * The query parameters of the request.
	 */
	query?: {
		/**
		 * The condition for the query.
		 */
		conditions?: string;

		/**
		 * Limit the number of entities to return.
		 */
		limit?: string;

		/**
		 * The cursor to get next chunk of data, returned in previous response.
		 */
		cursor?: string;
	};
}
