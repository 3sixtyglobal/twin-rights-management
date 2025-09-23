// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IIdentityAuthenticationActionRequest } from "@twin.org/identity-authentication";
import type {
	IIdsContractAgreementMessage,
	IIdsContractAgreementVerificationMessage,
	IIdsContractNegotiation,
	IIdsContractNegotiationError,
	IIdsContractNegotiationEventMessage,
	IIdsContractNegotiationTerminationMessage,
	IIdsContractOfferMessage,
	IIdsContractRequestMessage
} from "@twin.org/standards-ids-contract-negotiation";
import type { IOdrlOffer } from "@twin.org/standards-w3c-odrl";
import type { IPolicyNegotiator } from "./IPolicyNegotiator";
import type { IPolicyRequester } from "./IPolicyRequester";

/**
 * Interface describing a Policy Negotiation Point (PNP) contract.
 * When receiving a request from another component, the PNP will negotiate the terms
 * of the request and determine the appropriate policies to create.
 * https://docs.internationaldataspaces.org/ids-knowledgebase/dataspace-protocol/contract-negotiation/contract.negotiation.protocol
 */
export interface IPolicyNegotiationPointComponent extends IComponent {
	/**
	 * Get the current state of the negotiation.
	 * @param id The id of the negotiation to retrieve.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The current state of the negotiation or an error.
	 */
	getNegotiation(
		id: string,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiation | IIdsContractNegotiationError>;

	/**
	 * Send a request to a provider.
	 * @param url The url of the provider to send the request to.
	 * @param requesterId The id of the requester to use for the request, will use the registered requester to provide update.
	 * @param odrlOfferId The id of the offer to request.
	 * @returns The negotiation id.
	 */
	sendRequestToProvider(url: string, requesterId: string, odrlOfferId: string): Promise<string>;

	/**
	 * Processes an incoming request on a provider from a consumer.
	 * @param message The negotiation request.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The current state of the contract negotiation or an error.
	 */
	requestFromConsumer(
		message: IIdsContractRequestMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiation | IIdsContractNegotiationError>;

	/**
	 * An offer has been received by a consumer.
	 * @param message The offer being received by the consumer.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The current state of the contract negotiation or an error.
	 */
	offerFromProvider(
		message: IIdsContractOfferMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiation | IIdsContractNegotiationError>;

	/**
	 * An agreement has been received by a consumer.
	 * @param message The agreement message to send.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	agreementFromProvider(
		message: IIdsContractAgreementMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiationError | undefined>;

	/**
	 * An agreement verification has been received by a provider.
	 * @param message The agreement verification message to send.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	agreementVerificationFromConsumer(
		message: IIdsContractAgreementVerificationMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiationError | undefined>;

	/**
	 * An event has been received by the provider or consumer.
	 * @param message The event message to send.
	 * @param destination The destination is provider or consumer.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	event(
		message: IIdsContractNegotiationEventMessage,
		destination: "provider" | "consumer",
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiationError | undefined>;

	/**
	 * A termination message has been received by the provider or consumer.
	 * @param message The termination message to send.
	 * @param destination The destination is provider or consumer.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	terminate(
		message: IIdsContractNegotiationTerminationMessage,
		destination: "provider" | "consumer",
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiationError | undefined>;

	/**
	 * Register a negotiator to use for handling data.
	 * @param negotiatorId The id of the negotiator to register.
	 * @param negotiator The negotiator to register.
	 * @returns Nothing.
	 */
	registerNegotiator(negotiatorId: string, negotiator: IPolicyNegotiator): Promise<void>;

	/**
	 * Unregister a negotiator from the handling.
	 * @param negotiatorId The id of the negotiator to unregister.
	 * @returns Nothing.
	 */
	unregisterNegotiator(negotiatorId: string): Promise<void>;

	/**
	 * Register a requester to use for handle returning offers.
	 * @param requesterId The id of the requester to register.
	 * @param requester The requester to register.
	 * @returns Nothing.
	 */
	registerRequester(requesterId: string, requester: IPolicyRequester): Promise<void>;

	/**
	 * Unregister a requester from the handling.
	 * @param requesterId The id of the requester to unregister.
	 * @returns Nothing.
	 */
	unregisterRequester(requesterId: string): Promise<void>;

	/**
	 * Register an offer available for negotiation.
	 * @param offer The offer to register.
	 * @returns Nothing.
	 */
	registerOffer(offer: IOdrlOffer): Promise<void>;

	/**
	 * Unregister an offer.
	 * @param offerId The id of the offer to unregister.
	 * @returns Nothing.
	 */
	unregisterOffer(offerId: string): Promise<void>;
}
