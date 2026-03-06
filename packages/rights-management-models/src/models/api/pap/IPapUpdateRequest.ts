// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";

/**
 * The request structure for updating a policy.
 */
export interface IPapUpdateRequest {
	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The ID of the policy to update.
		 */
		id: string;
	};

	/**
	 * The body of the request.
	 */
	body: IDataspaceProtocolPolicy;
}
