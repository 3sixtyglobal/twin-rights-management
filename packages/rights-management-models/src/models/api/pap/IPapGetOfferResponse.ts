// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolOffer } from "@twin.org/standards-dataspace-protocol";

/**
 * The response structure for getting an offer.
 */
export interface IPapGetOfferResponse {
	/**
	 * The body of the response.
	 */
	body: IDataspaceProtocolOffer;
}
