// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { DataspaceProtocolContractNegotiationStateType } from "@3sixty/standards-dataspace-protocol";

/**
 * The request structure for querying manual policy negotiations.
 */
export interface IPnapQueryRequest {
	/**
	 * The query parameters of the request.
	 */
	query?: {
		/**
		 * The state of the policy negotiations.
		 */
		state?: DataspaceProtocolContractNegotiationStateType;

		/**
		 * The cursor for pagination.
		 */
		cursor?: string;
	};
}
