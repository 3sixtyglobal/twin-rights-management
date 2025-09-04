// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyState } from "../../../IPolicyState";

/**
 * The response structure for negotiation state request.
 */
export interface IPnpNegotiationStateResponse {
	/**
	 * The state of the policy.
	 */
	body: IPolicyState;
}
