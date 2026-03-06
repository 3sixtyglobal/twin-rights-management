// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type {
	IDataspaceProtocolAgreement,
	IDataspaceProtocolOffer
} from "@twin.org/standards-dataspace-protocol";
import type { IOdrlParty } from "@twin.org/standards-w3c-odrl";

/**
 * Interface describing a Policy Negotiator.
 */
export interface IPolicyNegotiator extends IComponent {
	/**
	 * Determines if the negotiator supports the given offer.
	 * @param offer The offer to check.
	 * @returns Sets the supports flag if it can be offered, and the interventionRequired flag if manual agreement is needed.
	 */
	supportsOffer(offer: IDataspaceProtocolOffer): boolean;

	/**
	 * Handle the offer.
	 * @param offer The offer to check.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @returns Sets the accepted flag if it can be offered, and the interventionRequired flag if manual agreement is needed.
	 */
	handleOffer(
		offer: IDataspaceProtocolOffer,
		information?: { [id: string]: IJsonLdNodeObject }
	): Promise<{
		accepted: boolean;
		interventionRequired: boolean;
	}>;

	/**
	 * Create an agreement based on the offer.
	 * @param offer The offer to create the agreement from.
	 * @param assignee The assignee of the agreement.
	 * @param information Information provided by the requester to aid in the creation of the agreement.
	 * @returns The agreement created from the offer or undefined if an agreement could not be created.
	 */
	createAgreement(
		offer: IDataspaceProtocolOffer,
		assignee: string | IOdrlParty,
		information?: { [id: string]: IJsonLdNodeObject }
	): Promise<IDataspaceProtocolAgreement | undefined>;
}
