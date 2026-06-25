// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRightsManagementOffer } from "../../IRightsManagementOffer.js";

/**
 * The response structure for getting an offer.
 */
export interface IPapGetOfferResponse {
	/**
	 * The body of the response.
	 */
	body: IRightsManagementOffer;
}
