// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IdsContractNegotiationStateType } from "@twin.org/standards-ids-contract-negotiation";

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
		state?: IdsContractNegotiationStateType;

		/**
		 * The cursor for pagination.
		 */
		cursor?: string;
	};
}
