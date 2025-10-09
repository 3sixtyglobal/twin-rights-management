// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import type { IBaseRestClientConfig } from "@twin.org/api-models";
import { Guards, Is, NotSupportedError, Url } from "@twin.org/core";
import type { IIdentityAuthenticationActionRequest } from "@twin.org/identity-authentication";
import { nameof } from "@twin.org/nameof";
import type {
	IPnpAgreementRequest,
	IPnpAgreementVerificationRequest,
	IPnpContractNegotiationResponse,
	IPnpContractResponse,
	IPnpEventRequest,
	IPnpNegotiateRequest,
	IPnpNegotiationGetRequest,
	IPnpOfferRequest,
	IPnpTerminateRequest,
	IPolicyNegotiationPointComponent,
	IPolicyNegotiator,
	IPolicyRequester
} from "@twin.org/rights-management-models";
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
import { HeaderTypes, MimeTypes } from "@twin.org/web";

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
	 * Create a new instance of PolicyNegotiationPointClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(
			nameof<PolicyNegotiationPointRestClient>(),
			{
				...config,
				authenticationGeneratorType: config.authenticationGeneratorType ?? "verifiable-credential"
			},
			"rights-management"
		);
	}

	/**
	 * Get the current state of the negotiation.
	 * @param id The id of the negotiation to retrieve.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The current state of the negotiation or an error.
	 */
	public async getNegotiation(
		id: string,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiation | IIdsContractNegotiationError> {
		Guards.stringValue(PolicyNegotiationPointRestClient.CLASS_NAME, nameof(id), id);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);

		const response = await this.fetch<IPnpNegotiationGetRequest, IPnpContractNegotiationResponse>(
			"/pnp/negotiations/:id",
			"GET",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				pathParams: {
					id
				},
				authentication: actionRequest
			}
		);

		return response.body;
	}

	/**
	 * Send a request to a provider - not supported in the REST client.
	 * @param url The url of the provider to send the request to.
	 * @param requesterId The id of the requester to use for the request, will use the registered requester to provide update.
	 * @param odrlOfferId The id of the offer to request.
	 * @returns The negotiation id.
	 */
	public async sendRequestToProvider(
		url: string,
		requesterId: string,
		odrlOfferId: string
	): Promise<string> {
		throw new NotSupportedError(PolicyNegotiationPointRestClient.CLASS_NAME, "notSupportedOnClient", {
			method: "sendRequestToProvider"
		});
	}

	/**
	 * Processes an incoming request on a provider from a consumer.
	 * @param message The negotiation request.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The current state of the contract negotiation or an error.
	 */
	public async requestFromConsumer(
		message: IIdsContractRequestMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiation | IIdsContractNegotiationError> {
		Guards.object<IIdsContractRequestMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);
		Guards.object<IOdrlOffer["offer"]>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.offer),
			message.offer
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.offer.uid),
			message.offer.uid
		);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);
		Url.guard(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.callbackAddress),
			message.callbackAddress
		);

		const response = await this.fetch<IPnpNegotiateRequest, IPnpContractNegotiationResponse>(
			Is.stringValue(message.providerPid)
				? "/pnp/negotiations/:id/request"
				: "/pnp/negotiations/request",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				pathParams: {
					id: message.providerPid
				},
				body: message,
				authentication: actionRequest
			}
		);

		return response.body;
	}

	/**
	 * An offer has been received by a consumer.
	 * @param message The offer being received by the consumer.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The current state of the contract negotiation or an error.
	 */
	public async offerFromProvider(
		message: IIdsContractOfferMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiation | IIdsContractNegotiationError> {
		Guards.object<IIdsContractOfferMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);
		Guards.stringValue(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);

		const response = await this.fetch<IPnpOfferRequest, IPnpContractNegotiationResponse>(
			Is.stringValue(message.consumerPid)
				? "/pnp/negotiations/:id/offers"
				: "/pnp/negotiations/offers",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				pathParams: {
					id: message.consumerPid
				},
				body: message,
				authentication: actionRequest
			}
		);

		return response.body;
	}

	/**
	 * An agreement has been received by a consumer.
	 * @param message The agreement message to send.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	public async agreementFromProvider(
		message: IIdsContractAgreementMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiationError | undefined> {
		Guards.object<IIdsContractAgreementMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
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
		Url.guard(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message.callbackAddress),
			message.callbackAddress
		);

		const response = await this.fetch<IPnpAgreementRequest, IPnpContractResponse>(
			"/pnp/negotiations/:id/agreement",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				pathParams: {
					id: message.consumerPid
				},
				body: message,
				authentication: actionRequest
			}
		);

		return response.body;
	}

	/**
	 * An agreement verification has been received by a provider.
	 * @param message The agreement verification message to send.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	public async agreementVerificationFromConsumer(
		message: IIdsContractAgreementVerificationMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiationError | undefined> {
		Guards.object<IIdsContractAgreementMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
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

		const response = await this.fetch<IPnpAgreementVerificationRequest, IPnpContractResponse>(
			"/pnp/negotiations/:id/agreement/verification",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				pathParams: {
					id: message.providerPid
				},
				body: message,
				authentication: actionRequest
			}
		);

		return response.body;
	}

	/**
	 * An event has been received by the provider or consumer.
	 * @param message The event message to send.
	 * @param destination The destination is provider or consumer.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	public async event(
		message: IIdsContractNegotiationEventMessage,
		destination: "provider" | "consumer",
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiationError | undefined> {
		Guards.object<IIdsContractNegotiationEventMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.arrayOneOf(PolicyNegotiationPointRestClient.CLASS_NAME, nameof(destination), destination, [
			"provider",
			"consumer"
		]);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
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

		const response = await this.fetch<IPnpEventRequest, IPnpContractResponse>(
			"/pnp/negotiations/:id/events",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				pathParams: {
					id: destination === "provider" ? message.providerPid : message.consumerPid
				},
				body: message,
				authentication: actionRequest
			}
		);

		return response.body;
	}

	/**
	 * A termination message has been received by the provider or consumer.
	 * @param message The termination message to send.
	 * @param destination The destination is provider or consumer.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	public async terminate(
		message: IIdsContractNegotiationTerminationMessage,
		destination: "provider" | "consumer",
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IIdsContractNegotiationError | undefined> {
		Guards.object<IIdsContractNegotiationTerminationMessage>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.arrayOneOf(PolicyNegotiationPointRestClient.CLASS_NAME, nameof(destination), destination, [
			"provider",
			"consumer"
		]);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
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

		const response = await this.fetch<IPnpTerminateRequest, IPnpContractResponse>(
			"/pnp/negotiations/:id/termination",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				pathParams: {
					id: destination === "provider" ? message.providerPid : message.consumerPid
				},
				body: message,
				authentication: actionRequest
			}
		);

		return response.body;
	}

	/**
	 * Register a negotiator to use for handling data - not supported in the REST client.
	 * @param negotiatorId The id of the negotiator to register.
	 * @param negotiator The negotiator to register.
	 * @returns Nothing.
	 */
	public async registerNegotiator(
		negotiatorId: string,
		negotiator: IPolicyNegotiator
	): Promise<void> {
		throw new NotSupportedError(PolicyNegotiationPointRestClient.CLASS_NAME, "notSupportedOnClient", {
			method: "registerNegotiator"
		});
	}

	/**
	 * Unregister a negotiator from the handling - not supported in the REST client.
	 * @param negotiatorId The id of the negotiator to unregister.
	 * @returns Nothing.
	 */
	public async unregisterNegotiator(negotiatorId: string): Promise<void> {
		throw new NotSupportedError(PolicyNegotiationPointRestClient.CLASS_NAME, "notSupportedOnClient", {
			method: "unregisterNegotiator"
		});
	}

	/**
	 * Register a requester to use for handle returning offers - not supported in the REST client.
	 * @param requesterId The id of the requester to register.
	 * @param requester The requester to register.
	 * @returns Nothing.
	 */
	public async registerRequester(requesterId: string, requester: IPolicyRequester): Promise<void> {
		throw new NotSupportedError(PolicyNegotiationPointRestClient.CLASS_NAME, "notSupportedOnClient", {
			method: "registerRequester"
		});
	}

	/**
	 * Unregister a requester from the handling - not supported in the REST client.
	 * @param requesterId The id of the requester to unregister.
	 * @returns Nothing.
	 */
	public async unregisterRequester(requesterId: string): Promise<void> {
		throw new NotSupportedError(PolicyNegotiationPointRestClient.CLASS_NAME, "notSupportedOnClient", {
			method: "unregisterRequester"
		});
	}

	/**
	 * Register an offer available for negotiation - not supported in the REST client.
	 * @param offer The offer to register.
	 * @returns Nothing.
	 */
	public async registerOffer(offer: IOdrlOffer): Promise<void> {
		throw new NotSupportedError(PolicyNegotiationPointRestClient.CLASS_NAME, "notSupportedOnClient", {
			method: "registerOffer"
		});
	}

	/**
	 * Unregister an offer - not supported in the REST client.
	 * @param offerId The id of the offer to unregister.
	 * @returns Nothing.
	 */
	public async unregisterOffer(offerId: string): Promise<void> {
		throw new NotSupportedError(PolicyNegotiationPointRestClient.CLASS_NAME, "notSupportedOnClient", {
			method: "unregisterOffer"
		});
	}
}
