// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * The response structure for retrieving a policy.
 */
export interface IPapRetrieveResponse {
	/**
	 * The body of the response.
	 */
	body: IOdrlPolicy;
}
