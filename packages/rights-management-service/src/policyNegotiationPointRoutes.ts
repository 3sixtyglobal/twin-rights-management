// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	IHostingComponent,
	IHttpRequestContext,
	IRestRoute,
	ITag
} from "@twin.org/api-models";
import { ComponentFactory, Guards, Is } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
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
} from "@twin.org/rights-management-models";
import {
	DataspaceProtocolContexts,
	DataspaceProtocolContractNegotiationEventType,
	DataspaceProtocolContractNegotiationStateType,
	DataspaceProtocolContractNegotiationTypes,
	type IDataspaceProtocolContractNegotiation,
	type IDataspaceProtocolContractNegotiationError
} from "@twin.org/standards-dataspace-protocol";
import { OdrlTypes } from "@twin.org/standards-w3c-odrl";
import { HeaderHelper, HeaderTypes, HttpStatusCode, MimeTypes } from "@twin.org/web";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "policyNegotiationPointRoutes";

/**
 * The tag to associate with the routes.
 */
export const pnpTags: ITag[] = [
	{
		name: "Policy Negotiation Point",
		description: "Endpoints for managing ODRL policies in the Policy Negotiation Point"
	}
];

/**
 * The REST routes for the Policy Negotiation Point.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param componentName The name of the component to use in the routes stored in the ComponentFactory.
 * @returns The generated routes.
 */
export function generateRestRoutesPolicyNegotiationPoint(
	baseRouteName: string,
	componentName: string
): IRestRoute[] {
	// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiations-get-provider
	const pnpGetNegotiationRoute: IRestRoute<
		IPnpNegotiationGetRequest,
		IPnpContractNegotiationResponse
	> = {
		operationId: "pnpGetNegotiation",
		summary: "Get a negotiation",
		tag: pnpTags[0].name,
		method: "GET",
		path: `${baseRouteName}/negotiations/:id`,
		handler: async (httpRequestContext, request) =>
			pnpGetNegotiation(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpNegotiationGetRequest>(),
			examples: [
				{
					id: "pnpGetNegotiationRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							id: "urn:contract-negotiation:00aa11bb.......ffff"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnpContractNegotiationResponse>(),
				examples: [
					{
						id: "pnpGetNegotiationResponseExample",
						response: {
							body: {
								"@context": [DataspaceProtocolContexts.Context],
								"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiation,
								providerPid: "urn:contract-negotiation:002aa11bb.......ffff",
								consumerPid: "urn:contract-negotiation:22aa11bb.......ffff",
								state: DataspaceProtocolContractNegotiationStateType.REQUESTED
							}
						}
					}
				]
			}
		],
		skipAuth: true
	};

	// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiations-providerpid-request-post
	const pnpNegotiationRequestRoute: IRestRoute<
		IPnpNegotiateRequest,
		IPnpContractNegotiationResponse | IPnpContractResponse
	> = {
		operationId: "pnpNegotiationRequest",
		summary: "Negotiate a policy",
		tag: pnpTags[0].name,
		method: "POST",
		path: `${baseRouteName}/negotiations/request`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiationRequest(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpNegotiateRequest>(),
			examples: [
				{
					id: "pnpNegotiationRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						body: {
							"@context": [DataspaceProtocolContexts.Context],
							"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
							consumerPid: "urn:contract-negotiation:22aa11bb.......ffff",
							offer: {
								"@type": OdrlTypes.Offer,
								"@id": "urn:offer-1",
								assigner: "urn:provider:node:1"
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnpContractNegotiationResponse>(),
				examples: [
					{
						id: "IPnpNegotiationRequestResponseExample",
						response: {
							body: {
								"@context": [DataspaceProtocolContexts.Context],
								"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiation,
								providerPid: "urn:contract-negotiation:00aa11bb.......ffff",
								consumerPid: "urn:contract-negotiation:22aa11bb.......ffff",
								state: DataspaceProtocolContractNegotiationStateType.REQUESTED
							}
						}
					}
				]
			}
		],
		skipAuth: true
	};

	// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiations-providerpid-request-post
	const pnpNegotiationProviderRequestRoute: IRestRoute<
		IPnpNegotiateRequest,
		IPnpContractNegotiationResponse | IPnpContractResponse
	> = {
		operationId: "pnpNegotiationProviderRequest",
		summary: "Negotiate a policy with an existing provider id",
		tag: pnpTags[0].name,
		method: "POST",
		path: `${baseRouteName}/negotiations/:id/request`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiationRequest(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpNegotiateRequest>(),
			examples: [
				{
					id: "pnpNegotiationProviderRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							id: "urn:contract-negotiation:00aa11bb.......ffff"
						},
						body: {
							"@context": [DataspaceProtocolContexts.Context],
							"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
							consumerPid: "urn:contract-negotiation:22aa11bb.......ffff",
							offer: {
								"@type": OdrlTypes.Offer,
								"@id": "urn:offer-1",
								assigner: "urn:provider:node:1"
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnpContractResponse>(),
				examples: [
					{
						id: "IPnpNegotiationProviderRequestResponseExample",
						response: {
							body: undefined
						}
					}
				]
			}
		],
		skipAuth: true
	};

	// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiations-providerpid-events-post
	const pnpNegotiationEventsRoute: IRestRoute<IPnpEventRequest, IPnpContractResponse> = {
		operationId: "pnpNegotiationEvents",
		summary: "Update the state of the negotiation",
		tag: pnpTags[0].name,
		method: "POST",
		path: `${baseRouteName}/negotiations/:id/events`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiationProviderEvents(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpEventRequest>(),
			examples: [
				{
					id: "pnpNegotiationEventsRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							id: "urn:contract-negotiation:00aa11bb.......ffff"
						},
						body: {
							"@context": [DataspaceProtocolContexts.Context],
							"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
							providerPid: "urn:contract-negotiation:00aa11bb.......ffff",
							consumerPid: "urn:contract-negotiation:22aa11bb.......ffff",
							event: DataspaceProtocolContractNegotiationEventType.ACCEPTED
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnpContractResponse>(),
				examples: [
					{
						id: "IPnpNegotiationRequestResponseExample",
						response: {
							body: undefined
						}
					}
				]
			}
		],
		skipAuth: true
	};

	// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiations-providerpid-agreement-verification-post
	const pnpNegotiationAgreementVerificationRoute: IRestRoute<
		IPnpAgreementVerificationRequest,
		IPnpContractResponse
	> = {
		operationId: "pnpNegotiationAgreementVerification",
		summary: "Set the agreement to verified",
		tag: pnpTags[0].name,
		method: "POST",
		path: `${baseRouteName}/negotiations/:id/agreement/verification`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiationAgreementVerification(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpAgreementVerificationRequest>(),
			examples: [
				{
					id: "pnpNegotiationAgreementVerificationRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							id: "urn:contract-negotiation:00aa11bb.......ffff"
						},
						body: {
							"@context": [DataspaceProtocolContexts.Context],
							"@type":
								DataspaceProtocolContractNegotiationTypes.ContractAgreementVerificationMessage,
							providerPid: "urn:contract-negotiation:00aa11bb.......ffff",
							consumerPid: "urn:contract-negotiation:22aa11bb.......ffff"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnpContractResponse>(),
				examples: [
					{
						id: "IPnpNegotiationAgreementVerificationResponseExample",
						response: {
							body: undefined
						}
					}
				]
			}
		],
		skipAuth: true
	};

	// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiations-providerpid-termination-post
	const pnpNegotiationTerminationRoute: IRestRoute<IPnpTerminateRequest, IPnpContractResponse> = {
		operationId: "pnpNegotiationTermination",
		summary: "Set the agreement to terminated",
		tag: pnpTags[0].name,
		method: "POST",
		path: `${baseRouteName}/negotiations/:id/termination`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiationTermination(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpTerminateRequest>(),
			examples: [
				{
					id: "pnpNegotiationTerminationRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							id: "urn:contract-negotiation:00aa11bb.......ffff"
						},
						body: {
							"@context": [DataspaceProtocolContexts.Context],
							"@type":
								DataspaceProtocolContractNegotiationTypes.ContractNegotiationTerminationMessage,
							providerPid: "urn:contract-negotiation:00aa11bb.......ffff",
							consumerPid: "urn:contract-negotiation:22aa11bb.......ffff"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnpContractResponse>(),
				examples: [
					{
						id: "pnpNegotiationTerminationResponseExample",
						response: {
							body: undefined
						}
					}
				]
			}
		],
		skipAuth: true
	};

	// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiations-offers-post
	const pnpNegotiationOfferRoute: IRestRoute<
		IPnpOfferRequest,
		IPnpContractNegotiationResponse | IPnpContractResponse
	> = {
		operationId: "pnpNegotiationOffer",
		summary: "Send the offer to the consumer",
		tag: pnpTags[0].name,
		method: "POST",
		path: `${baseRouteName}/negotiations/offers`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiationOffer(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpOfferRequest>(),
			examples: [
				{
					id: "pnpNegotiationOfferRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						body: {
							"@context": [DataspaceProtocolContexts.Context],
							"@type": DataspaceProtocolContractNegotiationTypes.ContractOfferMessage,
							providerPid: "urn:contract-negotiation:00aa11bb.......ffff",
							consumerPid: "urn:contract-negotiation:22aa11bb.......ffff",
							offer: {
								"@type": OdrlTypes.Offer,
								"@id": "urn:offer-1",
								assigner: "urn:provider:node:1"
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnpContractResponse>(),
				examples: [
					{
						id: "pnpNegotiationOfferResponseExample",
						response: {
							body: {
								"@context": [DataspaceProtocolContexts.Context],
								"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationError,
								providerPid: "urn:contract-negotiation:00aa11bb.......ffff",
								consumerPid: "urn:contract-negotiation:22aa11bb.......ffff"
							}
						}
					}
				]
			}
		],
		skipAuth: true
	};

	// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiations-consumerpid-offers-post
	const pnpNegotiationConsumerOfferRoute: IRestRoute<
		IPnpOfferRequest,
		IPnpContractNegotiationResponse | IPnpContractResponse
	> = {
		operationId: "pnpNegotiationConsumerOffer",
		summary: "Send the offer to the consumer with existing id",
		tag: pnpTags[0].name,
		method: "POST",
		path: `${baseRouteName}/negotiations/:id/offers`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiationOffer(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpOfferRequest>(),
			examples: [
				{
					id: "pnpNegotiationConsumerOfferRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							id: "urn:contract-negotiation:22aa11bb.......ffff"
						},
						body: {
							"@context": [DataspaceProtocolContexts.Context],
							"@type": DataspaceProtocolContractNegotiationTypes.ContractOfferMessage,
							providerPid: "urn:contract-negotiation:00aa11bb.......ffff",
							consumerPid: "urn:contract-negotiation:22aa11bb.......ffff",
							offer: {
								"@type": OdrlTypes.Offer,
								"@id": "urn:offer-1",
								assigner: "urn:provider:node:1"
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnpContractResponse>(),
				examples: [
					{
						id: "pnpNegotiationConsumerOfferResponseExample",
						response: {
							body: {
								"@context": [DataspaceProtocolContexts.Context],
								"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationError,
								providerPid: "urn:contract-negotiation:00aa11bb.......ffff",
								consumerPid: "urn:contract-negotiation:22aa11bb.......ffff"
							}
						}
					}
				]
			}
		],
		skipAuth: true
	};

	// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiations-consumerpid-agreement-post
	const pnpNegotiationAgreementRoute: IRestRoute<IPnpAgreementRequest, IPnpContractResponse> = {
		operationId: "pnpNegotiationAgreement",
		summary: "Send the agreement to the consumer",
		tag: pnpTags[0].name,
		method: "POST",
		path: `${baseRouteName}/negotiations/:id/agreement`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiationAgreement(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpAgreementRequest>(),
			examples: [
				{
					id: "pnpNegotiationAgreementRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							id: "urn:contract-negotiation:22aa11bb.......ffff"
						},
						body: {
							"@context": [DataspaceProtocolContexts.Context],
							"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
							providerPid: "urn:contract-negotiation:00aa11bb.......ffff",
							consumerPid: "urn:contract-negotiation:22aa11bb.......ffff",
							agreement: {
								"@type": OdrlTypes.Agreement,
								"@id": "urn:offer-1",
								assigner: "urn:provider:node:1",
								assignee: "urn:consumer:node:1"
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnpContractResponse>(),
				examples: [
					{
						id: "pnpNegotiationAgreementResponseExample",
						response: {
							body: undefined
						}
					}
				]
			}
		],
		skipAuth: true
	};

	// The consumer event and terminate routes are exactly the same as the pnpNegotiationEventsRoute and pnpNegotiationTerminationRoute
	// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiations-consumerpid-events-post
	// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiations-consumerpid-termination-post

	return [
		pnpGetNegotiationRoute,
		pnpNegotiationRequestRoute,
		pnpNegotiationProviderRequestRoute,
		pnpNegotiationEventsRoute,
		pnpNegotiationAgreementVerificationRoute,
		pnpNegotiationTerminationRoute,
		pnpNegotiationOfferRoute,
		pnpNegotiationConsumerOfferRoute,
		pnpNegotiationAgreementRoute
	];
}

/**
 * Map the IDS result to an HTTP status code.
 * @param result The result to map.
 * @returns The mapped status code or undefined if no mapping was found or not an error.
 */
function mapError(
	result:
		| IDataspaceProtocolContractNegotiation
		| IDataspaceProtocolContractNegotiationError
		| undefined
): HttpStatusCode | undefined {
	if (
		OdrlPolicyHelper.getType(result) ===
			DataspaceProtocolContractNegotiationTypes.ContractNegotiationError &&
		Is.object<IDataspaceProtocolContractNegotiationError>(result)
	) {
		if (Is.stringValue(result.code) && /notfound/i.test(result.code)) {
			return HttpStatusCode.notFound;
		}
		return HttpStatusCode.badRequest;
	}

	return undefined;
}

/**
 * PNP: Get negotiation.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnpGetNegotiation(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnpNegotiationGetRequest
): Promise<IPnpContractNegotiationResponse> {
	Guards.object<IPnpNegotiationGetRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPnpNegotiationGetRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);
	Guards.object<IPnpNegotiationGetRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	const result = await component.getNegotiation(
		request.pathParams.id,
		HeaderHelper.extractBearer(request.headers?.[HeaderTypes.Authorization])
	);

	return {
		statusCode: mapError(result),
		headers: {
			[HeaderTypes.ContentType]:
				request.headers?.[HeaderTypes.Accept] === MimeTypes.JsonLd
					? MimeTypes.JsonLd
					: MimeTypes.Json
		},
		body: result
	};
}

/**
 * PNP: Request a negotiation.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnpNegotiationRequest(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnpNegotiateRequest
): Promise<IPnpContractNegotiationResponse | IPnpContractResponse> {
	Guards.object<IPnpNegotiateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPnpNegotiateRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);
	Guards.object<IPnpNegotiateRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);

	const hostingComponent = ComponentFactory.get<IHostingComponent>(
		httpRequestContext.hostingComponentType ?? "hosting"
	);

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	const result = await component.requestFromConsumer(
		request.body,
		HeaderHelper.extractBearer(request.headers?.[HeaderTypes.Authorization]),
		await hostingComponent.getPublicOrigin(httpRequestContext.serverRequest.url)
	);

	const isUpdate = Is.stringValue(request.pathParams?.id);

	return {
		statusCode: mapError(result) ?? (isUpdate ? undefined : HttpStatusCode.created),
		headers: {
			[HeaderTypes.ContentType]:
				request.headers?.[HeaderTypes.Accept] === MimeTypes.JsonLd
					? MimeTypes.JsonLd
					: MimeTypes.Json
		},
		body: result
	};
}

/**
 * PNP: Update state of negotiation.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnpNegotiationProviderEvents(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnpEventRequest
): Promise<IPnpContractResponse> {
	Guards.object<IPnpEventRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPnpEventRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);
	Guards.object<IPnpEventRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.object<IPnpEventRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	const result = await component.event(
		request.body,
		request.pathParams.id === request.body.providerPid ? "provider" : "consumer",
		HeaderHelper.extractBearer(request.headers?.[HeaderTypes.Authorization])
	);

	return {
		statusCode: mapError(result),
		headers: {
			[HeaderTypes.ContentType]:
				request.headers?.[HeaderTypes.Accept] === MimeTypes.JsonLd
					? MimeTypes.JsonLd
					: MimeTypes.Json
		},
		body: result
	};
}

/**
 * PNP: Set the agreement to verified.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnpNegotiationAgreementVerification(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnpAgreementVerificationRequest
): Promise<IPnpContractResponse> {
	Guards.object<IPnpAgreementVerificationRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPnpAgreementVerificationRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);
	Guards.object<IPnpAgreementVerificationRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.object<IPnpAgreementVerificationRequest["body"]>(
		ROUTES_SOURCE,
		nameof(request.body),
		request.body
	);

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	const result = await component.agreementVerificationFromConsumer(
		request.body,
		HeaderHelper.extractBearer(request.headers?.[HeaderTypes.Authorization])
	);

	return {
		statusCode: mapError(result),
		headers: {
			[HeaderTypes.ContentType]:
				request.headers?.[HeaderTypes.Accept] === MimeTypes.JsonLd
					? MimeTypes.JsonLd
					: MimeTypes.Json
		},
		body: result
	};
}

/**
 * PNP: Terminate the provider negotiation.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnpNegotiationTermination(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnpTerminateRequest
): Promise<IPnpContractResponse> {
	Guards.object<IPnpTerminateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPnpTerminateRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);
	Guards.object<IPnpTerminateRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.object<IPnpTerminateRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	const result = await component.terminate(
		request.body,
		request.pathParams.id === request.body.providerPid ? "provider" : "consumer",
		HeaderHelper.extractBearer(request.headers?.[HeaderTypes.Authorization])
	);

	return {
		statusCode: mapError(result),
		headers: {
			[HeaderTypes.ContentType]:
				request.headers?.[HeaderTypes.Accept] === MimeTypes.JsonLd
					? MimeTypes.JsonLd
					: MimeTypes.Json
		},
		body: result
	};
}

/**
 * PNP: Send the offer to the consumer.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnpNegotiationOffer(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnpOfferRequest
): Promise<IPnpContractNegotiationResponse | IPnpContractResponse> {
	Guards.object<IPnpOfferRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPnpOfferRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);
	Guards.object<IPnpOfferRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	const result = await component.offerFromProvider(
		request.body,
		HeaderHelper.extractBearer(request.headers?.[HeaderTypes.Authorization])
	);

	const isUpdate = Is.stringValue(request.pathParams?.id);

	return {
		statusCode: mapError(result) ?? (isUpdate ? undefined : HttpStatusCode.created),
		headers: {
			[HeaderTypes.ContentType]:
				request.headers?.[HeaderTypes.Accept] === MimeTypes.JsonLd
					? MimeTypes.JsonLd
					: MimeTypes.Json
		},
		body: result
	};
}

/**
 * PNP: Send the agreement to the consumer.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnpNegotiationAgreement(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnpAgreementRequest
): Promise<IPnpContractResponse> {
	Guards.object<IPnpAgreementRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPnpAgreementRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);
	Guards.object<IPnpAgreementRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);
	Guards.object<IPnpAgreementRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	const result = await component.agreementFromProvider(
		request.body,
		HeaderHelper.extractBearer(request.headers?.[HeaderTypes.Authorization])
	);

	return {
		statusCode: mapError(result),
		headers: {
			[HeaderTypes.ContentType]:
				request.headers?.[HeaderTypes.Accept] === MimeTypes.JsonLd
					? MimeTypes.JsonLd
					: MimeTypes.Json
		},
		body: result
	};
}
