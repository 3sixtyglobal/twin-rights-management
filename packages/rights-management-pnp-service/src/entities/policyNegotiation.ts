// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property } from "@twin.org/entity";
import type {
	IPolicyInformation,
	PolicyNegotiationStatus
} from "@twin.org/rights-management-models";

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
	@property({ type: "string", optional: true })
	public assetType?: string;

	/**
	 * The action the negotiation is for.
	 */
	@property({ type: "string", optional: true })
	public action?: string;

	/**
	 * The resource id the negotiation is for.
	 */
	@property({ type: "string", optional: true })
	public resourceId?: string;

	/**
	 * The identity of the node making the request.
	 */
	@property({ type: "string", optional: true })
	public assignee?: string;

	/**
	 * The requester information.
	 */
	@property({ type: "object", optional: true })
	public information?: IPolicyInformation;

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
