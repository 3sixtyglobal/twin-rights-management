// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlSet } from "@twin.org/standards-w3c-odrl";

/**
 * The response structure for getting a set.
 */
export interface IPapGetSetResponse {
	/**
	 * The body of the response.
	 */
	body: IOdrlSet;
}
