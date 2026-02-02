// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { HeaderTypes } from "@twin.org/web";

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
	body: IOdrlPolicy[];
}
