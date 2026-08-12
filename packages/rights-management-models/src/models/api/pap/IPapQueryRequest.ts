// Copyright 2025 IOTA Stiftung.
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
		 * The type of policy to filter by.
		 */
		type?: string;

		/**
		 * The assigner to filter by.
		 */
		assigner?: string;

		/**
		 * The assignee to filter by.
		 */
		assignee?: string;

		/**
		 * The action to filter by.
		 */
		action?: string;

		/**
		 * The target to filter by.
		 */
		target?: string;

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

		/**
		 * Comma-separated list of policy property names to include in the response.
		 */
		properties?: string;
	};
}
