// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { HeaderTypes } from "@twin.org/web";
import type { IPolicyNegotiation } from "../../pnp/IPolicyNegotiation.js";

/**
 * The response structure for querying manual policy negotiations.
 */
export interface IPnapQueryResponse {
	/**
	 * The headers which can be used to determine the response data type.
	 */
	headers?: {
		[HeaderTypes.Link]?: string | string[];
	};

	/**
	 * The body of the response.
	 */
	body: IPolicyNegotiation[];
}
