// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { HeaderTypes } from "@3sixty/web";
import type { IRightsManagementPolicy } from "../../IRightsManagementPolicy.js";

/**
 * The response structure for querying policies.
 */
export interface IPapQueryResponse {
	/**
	 * The headers which can be used to determine the response data type.
	 */
	headers?: {
		[HeaderTypes.Link]?: string | string[];
	};

	/**
	 * The body of the response.
	 */
	body: IRightsManagementPolicy[];
}
