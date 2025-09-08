// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { entity, property } from "@twin.org/entity";
import type { PolicyNegotiationStatus } from "@twin.org/rights-management-models";

/**
 * Class describing a rights management policy negotiation.
 */
@entity()
export class PolicyNegotiation {
	/**
	 * The unique identifier for the policy.
	 */
	@property({ type: "string", isPrimary: true })
	public id!: string;

	/**
	 * The date and time when the negotiation was created.
	 */
	@property({ type: "string", format: "date-time", isSecondary: true })
	public dateCreated!: string;

	/**
	 * The asset type the negotiation is for.
	 */
	@property({ type: "string" })
	public assetType!: string;

	/**
	 * The action the negotiation is for.
	 */
	@property({ type: "string" })
	public action!: string;

	/**
	 * The resource id the negotiation is for.
	 */
	@property({ type: "string", optional: true })
	public resourceId?: string;

	/**
	 * The identity of the node making the request.
	 */
	@property({ type: "string" })
	public nodeIdentity!: string;

	/**
	 * The requester information.
	 */
	@property({ type: "object", optional: true })
	public information?: { [source: string]: IJsonLdNodeObject[] };

	/**
	 * The status of the negotiation.
	 */
	@property({ type: "string" })
	public status!: PolicyNegotiationStatus;

	/**
	 * A reason which might be provided if the negotiation status is not approved.
	 */
	@property({ type: "string", optional: true })
	public reason?: string;

	/**
	 * The expiration time for the policy negotiation.
	 */
	@property({ type: "number", optional: true })
	public expires?: number;
}
