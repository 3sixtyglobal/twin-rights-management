// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IOdrlAgreement, IOdrlOffer } from "@twin.org/standards-w3c-odrl";
import type { IPolicyInformation } from "../pip/IPolicyInformation.js";

/**
 * Interface describing a Policy Negotiator.
 */
export interface IPolicyNegotiator extends IComponent {
	/**
	 * Determines if the negotiator supports the given offer.
	 * @param offer The offer to check.
	 * @returns Sets the supports flag if it can be offered, and the interventionRequired flag if manual agreement is needed.
	 */
	supportsOffer(offer: IOdrlOffer): boolean;

	/**
	 * Handle the offer.
	 * @param offer The offer to check.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @returns Sets the accepted flag if it can be offered, and the interventionRequired flag if manual agreement is needed.
	 */
	handleOffer(
		offer: IOdrlOffer,
		information?: IPolicyInformation
	): Promise<{
		accepted: boolean;
		interventionRequired: boolean;
	}>;

	/**
	 * Create an agreement based on the offer.
	 * @param offer The offer to create the agreement from.
	 * @param information Information provided by the requester to aid in the creation of the agreement.
	 * @returns The agreement created from the offer or undefined if an agreement could not be created.
	 */
	createAgreement(
		offer: IOdrlOffer,
		information?: IPolicyInformation
	): Promise<IOdrlAgreement | undefined>;
}
