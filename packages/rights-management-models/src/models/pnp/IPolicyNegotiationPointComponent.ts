// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
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
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the negotiation or an error.
	 */
	getNegotiation(
		id: string,
		trustPayload: unknown
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
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the contract negotiation or an error.
	 */
	requestFromConsumer(
		message: IContractRequestMessage,
		trustPayload: unknown
	): Promise<IContractNegotiation | IContractNegotiationError>;

	/**
	 * An offer has been received by a consumer.
	 * @param message The offer being received by the consumer.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the contract negotiation or an error.
	 */
	offerFromProvider(
		message: IContractOfferMessage,
		trustPayload: unknown
	): Promise<IContractNegotiation | IContractNegotiationError>;

	/**
	 * An agreement has been received by a consumer.
	 * @param message The agreement message to send.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	agreementFromProvider(
		message: IContractAgreementMessage,
		trustPayload: unknown
	): Promise<IContractNegotiationError | undefined>;

	/**
	 * An agreement verification has been received by a provider.
	 * @param message The agreement verification message to send.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	agreementVerificationFromConsumer(
		message: IContractAgreementVerificationMessage,
		trustPayload: unknown
	): Promise<IContractNegotiationError | undefined>;

	/**
	 * An event has been received by the provider or consumer.
	 * @param message The event message to send.
	 * @param destination The destination is provider or consumer.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	event(
		message: IContractNegotiationEventMessage,
		destination: "provider" | "consumer",
		trustPayload: unknown
	): Promise<IContractNegotiationError | undefined>;

	/**
	 * A termination message has been received by the provider or consumer.
	 * @param message The termination message to send.
	 * @param destination The destination is provider or consumer.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	terminate(
		message: IContractNegotiationTerminationMessage,
		destination: "provider" | "consumer",
		trustPayload: unknown
	): Promise<IContractNegotiationError | undefined>;
}
