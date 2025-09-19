// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property } from "@twin.org/entity";
import type { IPolicyInformation } from "@twin.org/rights-management-models";
import type { IdsContractNegotiationStateType } from "@twin.org/standards-ids-contract-negotiation";
import type { IOdrlAgreement, IOdrlOffer } from "@twin.org/standards-w3c-odrl";

/**
 * Class describing a rights management policy negotiation.
 */
@entity()
export class PolicyNegotiation {
	/**
	 * An id to help identify the negotiation on the provider's side.
	 */
	@property({ type: "string", isPrimary: true })
	public id!: string;

	/**
	 * This is used by the other side of the negotiation.
	 */
	@property({ type: "string", isSecondary: true })
	public correlationId!: string;

	/**
	 * The unique identifier for the policy.
	 */
	@property({ type: "string", isSecondary: true, optional: true })
	public policyId?: string;

	/**
	 * The date and time when the negotiation was created.
	 */
	@property({ type: "string", format: "date-time", isSecondary: true })
	public dateCreated!: string;

	/**
	 * The expiration time for the policy negotiation.
	 */
	@property({ type: "number", optional: true })
	public expires?: number;

	/**
	 * The status of the negotiation.
	 */
	@property({ type: "string" })
	public state!: IdsContractNegotiationStateType;

	/**
	 * The callback address to send updates to the requester.
	 */
	@property({ type: "string", optional: true })
	public callbackAddress?: string;

	/**
	 * The offer being requested.
	 */
	@property({ type: "object", optional: true })
	public offer?: IOdrlOffer;

	/**
	 * The agreement being established if the negotiation was successful.
	 */
	@property({ type: "object", optional: true })
	public agreement?: IOdrlAgreement;

	/**
	 * Additional information supplied by the consumer to help with negotiation.
	 */
	@property({ type: "object", optional: true })
	public information?: IPolicyInformation;

	/**
	 * A reason code for when the negotiation errors.
	 */
	@property({ type: "string", optional: true })
	public code?: string;

	/**
	 * A more detailed reason for the negotiation error reason.
	 */
	@property({ type: "object", optional: true })
	public reason?: {
		"@value": string;
		"@language"?: string;
	}[];

	/**
	 * A more detailed reason for the negotiation error description.
	 */
	@property({ type: "object", optional: true })
	public description?: {
		"@value": string;
		"@language"?: string;
	}[];

	/**
	 * The id of the handler, on provider side this is the negotiator, on consumer side this is the requester.
	 */
	@property({ type: "string", optional: true })
	public handlerId?: string;

	/**
	 * Is manual intervention required to complete the negotiation?
	 */
	@property({ type: "boolean", optional: true })
	public interventionRequired?: boolean;
}
