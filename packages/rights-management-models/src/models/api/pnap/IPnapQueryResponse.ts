// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiation } from "../../pnp/IPolicyNegotiation.js";

/**
 * The response structure for querying manual policy negotiations.
 */
export interface IPnapQueryResponse {
	/**
	 * The body of the response.
	 */
	body: {
		/**
		 * The list of policy negotiations.
		 */
		items: IPolicyNegotiation[];

		/**
		 * The cursor for pagination.
		 */
		cursor?: string;
	};
}
