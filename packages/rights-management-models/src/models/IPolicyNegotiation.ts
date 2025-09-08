// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { PolicyNegotiationStatus } from "./policyNegotiationStatus";

/**
 * Interface describing a rights management policy negotiation.
 */
export interface IPolicyNegotiation {
	/**
	 * The unique identifier for the policy.
	 */
	id: string;

	/**
	 * The date and time when the negotiation was created.
	 */
	dateCreated: string;

	/**
	 * The asset type the negotiation is for.
	 */
	assetType: string;

	/**
	 * The action the negotiation is for.
	 */
	action: string;

	/**
	 * The resource id the negotiation is for.
	 */
	resourceId?: string;

	/**
	 * The identity of the node making the request.
	 */
	nodeIdentity: string;

	/**
	 * The requester information.
	 */
	information?: { [source: string]: IJsonLdNodeObject[] };

	/**
	 * The status of the negotiation.
	 */
	status: PolicyNegotiationStatus;

	/**
	 * A reason which might be provided if the negotiation status is not approved.
	 */
	reason?: string;

	/**
	 * The expiration time for the policy negotiation.
	 */
	expires?: number;
}
