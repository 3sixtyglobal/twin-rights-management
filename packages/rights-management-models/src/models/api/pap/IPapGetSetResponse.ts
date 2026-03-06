// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolSet } from "@twin.org/standards-dataspace-protocol";

/**
 * The response structure for getting a set.
 */
export interface IPapGetSetResponse {
	/**
	 * The body of the response.
	 */
	body: IDataspaceProtocolSet;
}
