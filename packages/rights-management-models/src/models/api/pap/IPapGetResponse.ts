// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";

/**
 * The response structure for getting a policy.
 */
export interface IPapGetResponse {
	/**
	 * The body of the response.
	 */
	body: IDataspaceProtocolPolicy;
}
