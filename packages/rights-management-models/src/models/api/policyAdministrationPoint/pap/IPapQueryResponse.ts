// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * The response structure for querying policies.
 */
export interface IPapQueryResponse {
	/**
	 * The body of the response.
	 */
	body: {
		/**
		 * The cursor for the next page of results, if there are more results available.
		 */
		cursor?: string;

		/**
		 * The policies matching the query.
		 */
		policies: IOdrlPolicy[];
	};
}
