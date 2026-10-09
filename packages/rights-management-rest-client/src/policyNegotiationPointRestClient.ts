// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@3sixty/api-core";
import type { IBaseRestClientConfig } from "@3sixty/api-models";
import { Guards, Is, NotSupportedError, Url } from "@3sixty/core";
import { nameof } from "@3sixty/nameof";
import {
	OdrlPolicyHelper,
	type IPnpAgreementRequest,
	type IPnpAgreementVerificationRequest,
	type IPnpContractNegotiationResponse,
	type IPnpContractResponse,
	type IPnpEventRequest,
	type IPnpNegotiateRequest,
	type IPnpNegotiationGetRequest,
	type IPnpOfferRequest,
	type IPnpTerminateRequest,
	type IPolicyNegotiationPointComponent
} from "@3sixty/rights-management-models";
import type {
	IDataspaceProtocolContractAgreementMessage,
	IDataspaceProtocolContractAgreementVerificationMessage,
	IDataspaceProtocolContractNegotiation,
	IDataspaceProtocolContractNegotiationError,
	IDataspaceProtocolContractNegotiationEventMessage,
	IDataspaceProtocolContractNegotiationTerminationMessage,
	IDataspaceProtocolContractOfferMessage,
	IDataspaceProtocolContractRequestMessage,
	IDataspaceProtocolOffer
} from "@3sixty/standards-dataspace-protocol";
import { HeaderHelper, HeaderTypes, HttpMethod, MimeTypes } from "@3sixty/web";

/**
 * Client for performing Rights Management Policy Negotiation through to REST endpoints.
 */
export class PolicyNegotiationPointRestClient
	extends BaseRestClient
	implements IPolicyNegotiationPointComponent
{
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<PolicyNegotiationPointRestClient>();

	/**
	 * Create a new instance of PolicyNegotiationPointRestClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<PolicyNegotiationPointRestClient>(), config, "rights-management");
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyNegotiationPointRestClient.CLASS_NAME;
	}

	/**
	 * Get the current state of the negotiation.
	 * @param id The id of the negotiation to retrieve.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the negotiation or an error.
	 */
	public async getNegotiation(
		id: string,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiation | IDataspaceProtocolContractNegotiationError> {
		Guards.stringValue(PolicyNegotiationPointRestClient.CLASS_NAME, nameof(id), id);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(trustPayload),
			trustPayload
		);

		const response = await this.fetch<IPnpNegotiationGetRequest, IPnpContractNegotiationResponse>(
			"/negotiations/:id",
			HttpMethod.GET,
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
				},
				pathParams: {
					id
				}
			}
		);

		return response.body;
	}

	/**
	 * Send a request to a provider - not supported in the REST client.
	 * @param url The url of the provider to send the request to.
	 * @param requesterType The type of the requester to use for the request, will use the registered requester to provide update.
	 * @param odrlOfferId The id of the offer to request.
	 * @returns The negotiation id.
	 */
	public async sendRequestToProvider(
		url: string,
		requesterType: string,
		odrlOfferId: string
	): Promise<string> {
		throw new NotSupportedError(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			"notSupportedOnClient",
			{
				methodName: "sendRequestToProvider"
			}
		);
	}

	/**
	 * Processes an incoming request on a provider from a consumer.
	 * @param message The negotiation request.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @param publicOrigin The public origin of the server (not used in REST client).
	 * @returns The current state of the contract negotiation or an error.
	 */
	public async requestFromConsumer(
		message: IDataspaceProtocolContractRequestMessage,
		trustPayload: unknown,
		publicOrigin?: string
	): Promise<IDataspaceProtocolContractNegotiation | IDataspaceProtocolContractNegotiationError> {
		if (Is.stringValue(publicOrigin)) {
			throw new NotSupportedError(
				PolicyNegotiationPointRestClient.CLASS_NAME,
				"publicOriginNotRequired"
			);
		}
		Guards.object<IDataspaceProtocolContractRequestMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);
		Guards.object<IDataspaceProtocolOffer>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.offer),
			message.offer
		);
		const offerId = OdrlPolicyHelper.getUid(message.offer);
		Guards.stringValue(PolicyNegotiationPointRestClient.CLASS_NAME, nameof(offerId), offerId);
		// callbackAddress is optional per the DSP spec - only validate when present.
		if (Is.stringValue(message.callbackAddress)) {
			Url.guard(
				PolicyNegotiationPointRestClient.CLASS_NAME,
				nameof(message.callbackAddress),
				message.callbackAddress
			);
		}
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(trustPayload),
			trustPayload
		);

		const response = await this.fetch<IPnpNegotiateRequest, IPnpContractNegotiationResponse>(
			Is.stringValue(message.providerPid) ? "/negotiations/:id/request" : "/negotiations/request",
			HttpMethod.POST,
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
				},
				pathParams: {
					id: message.providerPid
				},
				body: message
			}
		);

		return response.body;
	}

	/**
	 * An offer has been received by a consumer.
	 * @param message The offer being received by the consumer.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the contract negotiation or an error.
	 */
	public async offerFromProvider(
		message: IDataspaceProtocolContractOfferMessage,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiation | IDataspaceProtocolContractNegotiationError> {
		Guards.object<IDataspaceProtocolContractOfferMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(trustPayload),
			trustPayload
		);

		const response = await this.fetch<IPnpOfferRequest, IPnpContractNegotiationResponse>(
			Is.stringValue(message.consumerPid) ? "/negotiations/:id/offers" : "/negotiations/offers",
			HttpMethod.POST,
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
				},
				pathParams: {
					id: message.consumerPid
				},
				body: message
			}
		);

		return response.body;
	}

	/**
	 * An agreement has been received by a consumer.
	 * @param message The agreement message to send.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	public async agreementFromProvider(
		message: IDataspaceProtocolContractAgreementMessage,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined> {
		Guards.object<IDataspaceProtocolContractAgreementMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);
		// callbackAddress is optional per the DSP spec - only validate when present.
		if (Is.stringValue(message.callbackAddress)) {
			Url.guard(
				PolicyNegotiationPointRestClient.CLASS_NAME,
				nameof(message.callbackAddress),
				message.callbackAddress
			);
		}
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(trustPayload),
			trustPayload
		);
		const response = await this.fetch<IPnpAgreementRequest, IPnpContractResponse>(
			"/negotiations/:id/agreement",
			HttpMethod.POST,
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
				},
				pathParams: {
					id: message.consumerPid
				},
				body: message
			}
		);

		return response.body;
	}

	/**
	 * An agreement verification has been received by a provider.
	 * @param message The agreement verification message to send.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	public async agreementVerificationFromConsumer(
		message: IDataspaceProtocolContractAgreementVerificationMessage,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined> {
		Guards.object<IDataspaceProtocolContractAgreementVerificationMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(trustPayload),
			trustPayload
		);

		const response = await this.fetch<IPnpAgreementVerificationRequest, IPnpContractResponse>(
			"/negotiations/:id/agreement/verification",
			HttpMethod.POST,
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
				},
				pathParams: {
					id: message.providerPid
				},
				body: message
			}
		);

		return response.body;
	}

	/**
	 * An event has been received by the provider or consumer.
	 * @param message The event message to send.
	 * @param destination The destination is provider or consumer.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	public async event(
		message: IDataspaceProtocolContractNegotiationEventMessage,
		destination: "provider" | "consumer",
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined> {
		Guards.object<IDataspaceProtocolContractNegotiationEventMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.arrayOneOf(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(destination),
			destination,
			["provider", "consumer"]
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(trustPayload),
			trustPayload
		);

		const response = await this.fetch<IPnpEventRequest, IPnpContractResponse>(
			"/negotiations/:id/events",
			HttpMethod.POST,
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
				},
				pathParams: {
					id: destination === "provider" ? message.providerPid : message.consumerPid
				},
				body: message
			}
		);

		return response.body;
	}

	/**
	 * A termination message has been received by the provider or consumer.
	 * @param message The termination message to send.
	 * @param destination The destination is provider or consumer.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	public async terminate(
		message: IDataspaceProtocolContractNegotiationTerminationMessage,
		destination: "provider" | "consumer",
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined> {
		Guards.object<IDataspaceProtocolContractNegotiationTerminationMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.arrayOneOf(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(destination),
			destination,
			["provider", "consumer"]
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(trustPayload),
			trustPayload
		);

		const response = await this.fetch<IPnpTerminateRequest, IPnpContractResponse>(
			"/negotiations/:id/termination",
			HttpMethod.POST,
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
				},
				pathParams: {
					id: destination === "provider" ? message.providerPid : message.consumerPid
				},
				body: message
			}
		);

		return response.body;
	}

	/**
	 * Send a terminate message to a consumer at the given callback address.
	 * Not supported on the REST client; use the policy negotiation point service when stall cleanup needs to notify consumers.
	 * @param callbackAddress The consumer callback URL to send the termination to.
	 * @param providerPid The provider negotiation id.
	 * @param consumerPid The consumer negotiation id.
	 * @returns A promise that resolves when the terminate message has been sent.
	 */
	public async sendTerminateToConsumer(
		callbackAddress: string,
		providerPid: string,
		consumerPid: string
	): Promise<void> {
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(callbackAddress),
			callbackAddress
		);
		Url.guard(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(callbackAddress),
			callbackAddress
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(providerPid),
			providerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(consumerPid),
			consumerPid
		);
		throw new NotSupportedError(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			"notSupportedOnClient",
			{
				methodName: "sendTerminateToConsumer"
			}
		);
	}
}
