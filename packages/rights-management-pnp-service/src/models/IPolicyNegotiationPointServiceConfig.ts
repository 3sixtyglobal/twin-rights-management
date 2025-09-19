// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	IPolicyNegotiationPointComponent,
	IPolicyNegotiator,
	IPolicyRequester
} from "@twin.org/rights-management-models";
import type { IOdrlOffer } from "@twin.org/standards-w3c-odrl";

/**
 * Options for the Policy Negotiation Point Component.
 */
export interface IPolicyNegotiationPointServiceConfig {
	/**
	 * The url to send in negotiation messages as the callback address.
	 * This should be the externally reachable url of this PNP service.
	 */
	baseCallbackUrl: string;

	/**
	 * The id of the identity method to use when creating/verifying tokens.
	 * @default rights-management-assertion
	 */
	rightsManagementMethodId?: string;

	/**
	 * The time-to-live (TTL) for proof in seconds.
	 * @default 300 (5 minutes)
	 */
	proofTtlInSeconds?: number;

	/**
	 * A method for creating a new instance of the policy negotiation point component.
	 * To be used when sending request remotely to another node.
	 */
	negotiationComponentCreator: (url: string) => Promise<IPolicyNegotiationPointComponent>;

	/**
	 * Initial negotiators to register with the PNP.
	 */
	negotiators?: {
		negotiatorId: string;
		negotiator: IPolicyNegotiator;
	}[];

	/**
	 * Initial requesters to handle offers from the PNP.
	 */
	requesters?: {
		requesterId: string;
		requester: IPolicyRequester;
	}[];

	/**
	 * These offers can be registered to provide offers for negotiation.
	 */
	offers?: IOdrlOffer[];
}
