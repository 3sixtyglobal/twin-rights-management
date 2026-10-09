// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IError } from "@3sixty/core";
import type {
	DataspaceProtocolContractNegotiationStateType,
	IDataspaceProtocolAgreement,
	IDataspaceProtocolOffer
} from "@3sixty/standards-dataspace-protocol";
import type { ITrustVerificationInfo } from "@3sixty/trust-models";

/**
 * Interface describing a rights management policy negotiation.
 */
export interface IPolicyNegotiation {
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
	state: DataspaceProtocolContractNegotiationStateType;

	/**
	 * The callback address to send updates to the requester.
	 */
	callbackAddress?: string;

	/**
	 * The public origin of the server that initiated or received this negotiation.
	 * Used to construct callback URLs in subsequent async messages.
	 */
	publicOrigin?: string;

	/**
	 * Organization identity.
	 */
	organizationIdentity: string;

	/**
	 * The offer being requested.
	 */
	offer?: IDataspaceProtocolOffer;

	/**
	 * The agreement being established if the negotiation was successful.
	 */
	agreement?: IDataspaceProtocolAgreement;

	/**
	 * The information from the trust provider.
	 */
	trustVerificationInfo?: ITrustVerificationInfo;

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
	 * Any additional error details that don't fit in the reason or description fields.
	 */
	errorDetails?: IError;

	/**
	 * The id of the handler, on provider side this is the negotiator, on consumer side this is the requester.
	 */
	handlerId?: string;

	/**
	 * Is manual intervention required to complete the negotiation?
	 */
	interventionRequired?: boolean;
}
