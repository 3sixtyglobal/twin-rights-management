// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlOffer } from "@twin.org/standards-w3c-odrl";

/**
 * The response structure for getting an offer.
 */
export interface IPapGetOfferResponse {
	/**
	 * The body of the response.
	 */
	body: IOdrlOffer;
}
