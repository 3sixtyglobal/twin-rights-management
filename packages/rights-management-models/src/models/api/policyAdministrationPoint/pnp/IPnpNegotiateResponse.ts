// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyState } from "../../../IPolicyState";

/**
 * The response structure for negotiating a policy.
 */
export interface IPnpNegotiateResponse {
	/**
	 * The state of the policy.
	 */
	body: IPolicyState;
}
