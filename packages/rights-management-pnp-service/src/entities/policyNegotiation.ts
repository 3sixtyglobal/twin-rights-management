// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IError } from "@twin.org/core";
import { entity, property } from "@twin.org/entity";
import type {
	DataspaceProtocolContractNegotiationStateType,
	IDataspaceProtocolAgreement,
	IDataspaceProtocolOffer
} from "@twin.org/standards-dataspace-protocol";
import type { ITrustVerificationInfo } from "@twin.org/trust-models";

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
	public state!: DataspaceProtocolContractNegotiationStateType;

	/**
	 * The callback address to send updates to the requester.
	 */
	@property({ type: "string", optional: true })
	public callbackAddress?: string;

	/**
	 * The public origin of the server that initiated or received this negotiation.
	 * Used to construct callback URLs in subsequent async messages.
	 */
	@property({ type: "string", optional: true })
	public publicOrigin?: string;

	/**
	 * The tenant id this negotiation belongs to.
	 */
	@property({ type: "string", optional: true })
	public tenantId?: string;

	/**
	 * Node identity (DID) used to sign trust payloads.
	 */
	@property({ type: "string" })
	public nodeIdentity!: string;

	/**
	 * Organization identity.
	 */
	@property({ type: "string", optional: true })
	public organizationIdentity?: string;

	/**
	 * The offer being requested.
	 */
	@property({ type: "object", optional: true })
	public offer?: IDataspaceProtocolOffer;

	/**
	 * The agreement being established if the negotiation was successful.
	 */
	@property({ type: "object", optional: true })
	public agreement?: IDataspaceProtocolAgreement;

	/**
	 * The information from the trust provider.
	 */
	@property({ type: "object", optional: true })
	public trustVerificationInfo?: ITrustVerificationInfo;

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
	 * Any additional error details that don't fit in the reason or description fields.
	 */
	@property({ type: "object", optional: true })
	public errorDetails?: IError;

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
