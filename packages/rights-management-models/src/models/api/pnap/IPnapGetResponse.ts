// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiation } from "../../pnp/IPolicyNegotiation.js";

/**
 * The response structure for policy negotiation request.
 */
export interface IPnapGetResponse {
	/**
	 * The policy negotiation.
	 */
	body: IPolicyNegotiation;
}
