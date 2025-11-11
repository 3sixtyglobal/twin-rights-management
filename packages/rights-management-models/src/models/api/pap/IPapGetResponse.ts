// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * The response structure for getting a policy.
 */
export interface IPapGetResponse {
	/**
	 * The body of the response.
	 */
	body: IOdrlPolicy;
}
