// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IIdentityAuthenticationActionRequest } from "@twin.org/identity-authentication";
import type {
	IContractAgreementMessage,
	IContractAgreementVerificationMessage,
	IContractNegotiation,
	IContractNegotiationError,
	IContractNegotiationEventMessage,
	IContractNegotiationTerminationMessage,
	IContractOfferMessage,
	IContractRequestMessage
} from "@twin.org/standards-dataspace-protocol";
import type { IOdrlOffer } from "@twin.org/standards-w3c-odrl";
import type { IPolicyNegotiator } from "./IPolicyNegotiator.js";
import type { IPolicyRequester } from "./IPolicyRequester.js";

/**
 * Interface describing a Policy Negotiation Point (PNP) contract.
 * When receiving a request from another component, the PNP will negotiate the terms
 * of the request and determine the appropriate policies to create.
 * https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiation-protocol
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
	): Promise<IContractNegotiation | IContractNegotiationError>;

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
		message: IContractRequestMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiation | IContractNegotiationError>;

	/**
	 * An offer has been received by a consumer.
	 * @param message The offer being received by the consumer.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The current state of the contract negotiation or an error.
	 */
	offerFromProvider(
		message: IContractOfferMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiation | IContractNegotiationError>;

	/**
	 * An agreement has been received by a consumer.
	 * @param message The agreement message to send.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	agreementFromProvider(
		message: IContractAgreementMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiationError | undefined>;

	/**
	 * An agreement verification has been received by a provider.
	 * @param message The agreement verification message to send.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	agreementVerificationFromConsumer(
		message: IContractAgreementVerificationMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiationError | undefined>;

	/**
	 * An event has been received by the provider or consumer.
	 * @param message The event message to send.
	 * @param destination The destination is provider or consumer.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	event(
		message: IContractNegotiationEventMessage,
		destination: "provider" | "consumer",
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiationError | undefined>;

	/**
	 * A termination message has been received by the provider or consumer.
	 * @param message The termination message to send.
	 * @param destination The destination is provider or consumer.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	terminate(
		message: IContractNegotiationTerminationMessage,
		destination: "provider" | "consumer",
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiationError | undefined>;

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
