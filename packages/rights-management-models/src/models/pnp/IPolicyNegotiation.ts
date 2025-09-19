// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IdsContractNegotiationStateType } from "@twin.org/standards-ids-contract-negotiation";
import type { IOdrlAgreement, IOdrlOffer } from "@twin.org/standards-w3c-odrl";
import type { IPolicyLocator } from "../IPolicyLocator";
import type { IPolicyInformation } from "../pip/IPolicyInformation";

/**
 * Interface describing a rights management policy negotiation.
 */
export interface IPolicyNegotiation extends IPolicyLocator {
	/**
	 * The primary id used by the provider.
	 */
	id: string;

	/**
	 * This is used by the other side of the negotiation.
	 */
	correlationId: string;

	/**
	 * The unique identifier for the policy.
	 */
	policyId?: string;

	/**
	 * The date and time when the negotiation was created.
	 */
	dateCreated: string;

	/**
	 * The expiration time for the policy negotiation if it's a manual process.
	 */
	expires?: number;

	/**
	 * The status of the negotiation.
	 */
	state: IdsContractNegotiationStateType;

	/**
	 * The callback address to send updates to the requester.
	 */
	callbackAddress?: string;

	/**
	 * The offer being requested.
	 */
	offer?: IOdrlOffer;

	/**
	 * The agreement being established if the negotiation was successful.
	 */
	agreement?: IOdrlAgreement;

	/**
	 * Additional information supplied by the consumer to help with negotiation.
	 */
	information?: IPolicyInformation;

	/**
	 * A reason code for when the negotiation errors.
	 */
	code?: string;

	/**
	 * A more detailed reason for the negotiation error.
	 */
	reason?: {
		"@value": string;
		"@language"?: string;
	}[];

	/**
	 * A more detailed reason for the negotiation error.
	 */
	description?: {
		"@value": string;
		"@language"?: string;
	}[];

	/**
	 * The id of the handler, on provider side this is the negotiator, on consumer side this is the requester.
	 */
	handlerId?: string;

	/**
	 * Is manual intervention required to complete the negotiation?
	 */
	interventionRequired?: boolean;
}
