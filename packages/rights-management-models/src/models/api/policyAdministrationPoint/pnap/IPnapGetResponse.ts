// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiation } from "../../../IPolicyNegotiation";

/**
 * The response structure for policy negotiation request.
 */
export interface IPnapGetResponse {
	/**
	 * The policy negotiation.
	 */
	body: IPolicyNegotiation;
}
