// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type {
	IDataspaceProtocolContractAgreementMessage,
	IDataspaceProtocolContractAgreementVerificationMessage,
	IDataspaceProtocolContractNegotiation,
	IDataspaceProtocolContractNegotiationError,
	IDataspaceProtocolContractNegotiationEventMessage,
	IDataspaceProtocolContractNegotiationTerminationMessage,
	IDataspaceProtocolContractOfferMessage,
	IDataspaceProtocolContractRequestMessage
} from "@twin.org/standards-dataspace-protocol";

/**
 * Interface describing a Policy Negotiation Point (PNP) contract.
 * When receiving a request from another component, the PNP will negotiate the terms
 * of the request and determine the appropriate policies to create.
 * @see https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiation-protocol
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
	): Promise<IDataspaceProtocolContractNegotiation | IDataspaceProtocolContractNegotiationError>;

	/**
	 * Send a request to a provider.
	 * @param url The url of the provider to send the request to.
	 * @param requesterType The type of the requester to use for the request, will use the registered requester to provide update.
	 * @param odrlOfferId The id of the offer to request.
	 * @param publicOrigin The public origin url of this PNP service.
	 * @returns The negotiation id.
	 */
	sendRequestToProvider(
		url: string,
		requesterType: string,
		odrlOfferId: string,
		publicOrigin: string
	): Promise<string>;

	/**
	 * Processes an incoming request on a provider from a consumer.
	 * @param message The negotiation request.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the contract negotiation or an error.
	 */
	requestFromConsumer(
		message: IDataspaceProtocolContractRequestMessage,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiation | IDataspaceProtocolContractNegotiationError>;

	/**
	 * An offer has been received by a consumer.
	 * @param message The offer being received by the consumer.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the contract negotiation or an error.
	 */
	offerFromProvider(
		message: IDataspaceProtocolContractOfferMessage,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiation | IDataspaceProtocolContractNegotiationError>;

	/**
	 * An agreement has been received by a consumer.
	 * @param message The agreement message to send.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	agreementFromProvider(
		message: IDataspaceProtocolContractAgreementMessage,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined>;

	/**
	 * An agreement verification has been received by a provider.
	 * @param message The agreement verification message to send.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	agreementVerificationFromConsumer(
		message: IDataspaceProtocolContractAgreementVerificationMessage,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined>;

	/**
	 * An event has been received by the provider or consumer.
	 * @param message The event message to send.
	 * @param destination The destination is provider or consumer.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	event(
		message: IDataspaceProtocolContractNegotiationEventMessage,
		destination: "provider" | "consumer",
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined>;

	/**
	 * A termination message has been received by the provider or consumer.
	 * @param message The termination message to send.
	 * @param destination The destination is provider or consumer.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	terminate(
		message: IDataspaceProtocolContractNegotiationTerminationMessage,
		destination: "provider" | "consumer",
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined>;

	/**
	 * Send a terminate message to a consumer at the given callback address.
	 * Used by stall cleanup to notify consumers that their negotiation has been terminated.
	 * @param callbackAddress The consumer callback URL to send the termination to.
	 * @param providerPid The provider negotiation id.
	 * @param consumerPid The consumer negotiation id.
	 * @returns Resolves when the terminate message has been sent.
	 */
	sendTerminateToConsumer(
		callbackAddress: string,
		providerPid: string,
		consumerPid: string
	): Promise<void>;
}
