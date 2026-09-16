// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	HttpContextIdKeys,
	HttpHeaderHelper,
	HttpParameterHelper,
	HttpUrlHelper,
	type ICreatedResponse,
	type IHttpRequestContext,
	type INoContentResponse,
	type IRestRoute,
	type ITag
} from "@twin.org/api-models";
import { ContextIdStore } from "@twin.org/context";
import { Coerce, ComponentFactory, Guards } from "@twin.org/core";
import type { SortDirection } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import {
	POLICY_METADATA_CONTEXT,
	type IPapCreateRequest,
	type IPapGetAgreementRequest,
	type IPapGetAgreementResponse,
	type IPapGetOfferRequest,
	type IPapGetOfferResponse,
	type IPapGetRequest,
	type IPapGetResponse,
	type IPapGetSetRequest,
	type IPapGetSetResponse,
	type IPapQueryRequest,
	type IPapQueryResponse,
	type IPapRemoveRequest,
	type IPapUpdateRequest,
	type IPolicyAdministrationPointComponent,
	type IRightsManagementPolicy
} from "@twin.org/rights-management-models";
import { OdrlContexts, OdrlPolicyType, type OdrlContextType } from "@twin.org/standards-w3c-odrl";
import { HttpStatusCode, type IHttpHeaders } from "@twin.org/web";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "policyAdministrationPointRoutes";

/**
 * The tag to associate with the routes.
 */
export const papTags: ITag[] = [
	{
		name: "Policy Administration Point",
		description: "Endpoints for managing ODRL policies in the Policy Administration Point"
	}
];

/**
 * Example JSON-LD context returned by PAP read endpoints for policies with metadata timestamps.
 * Uses `POLICY_METADATA_CONTEXT` from rights-management-models merged with ODRL context.
 */
const PAP_POLICY_RESPONSE_CONTEXT: OdrlContextType = [
	OdrlContexts.Context,
	POLICY_METADATA_CONTEXT
];

/**
 * The REST routes for the Policy Administration Point.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param componentName The name of the component to use in the routes stored in the ComponentFactory.
 * @returns The generated routes.
 */
export function generateRestRoutesPolicyAdministrationPoint(
	baseRouteName: string,
	componentName: string
): IRestRoute[] {
	const papPolicyExampleLifecycle = {
		dateCreated: "2025-09-03T00:00:00.000Z",
		dateModified: "2025-09-03T00:00:00.000Z"
	};

	const papCreateRoute: IRestRoute<IPapCreateRequest, ICreatedResponse> = {
		operationId: "papCreate",
		summary: "Create a policy",
		tag: papTags[0].name,
		method: "POST",
		path: `${baseRouteName}/policy/admin`,
		handler: async (httpRequestContext, request) =>
			papCreate(httpRequestContext, componentName, request, baseRouteName),
		requestType: {
			type: nameof<IPapCreateRequest>(),
			examples: [
				{
					id: "papCreateRequestExample",
					request: {
						body: {
							"@context": OdrlContexts.Context,
							"@type": OdrlPolicyType.Set,
							permission: [
								{
									target: "http://example.com/asset/1",
									action: "use"
								}
							]
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<ICreatedResponse>(),
				examples: [
					{
						id: "papCreateResponseExample",
						response: {
							statusCode: 201,
							headers: {
								location: "urn:rights-management:abc123def456"
							}
						}
					}
				]
			}
		]
	};

	const papUpdateRoute: IRestRoute<IPapUpdateRequest, INoContentResponse> = {
		operationId: "papUpdate",
		summary: "Update a policy",
		tag: papTags[0].name,
		method: "PUT",
		path: `${baseRouteName}/policy/admin/:id`,
		handler: async (httpRequestContext, request) =>
			papUpdate(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapUpdateRequest>(),
			examples: [
				{
					id: "papUpdateRequestExample",
					request: {
						pathParams: {
							id: "urn:rights-management:abc123def456"
						},
						body: {
							"@context": OdrlContexts.Context,
							"@type": OdrlPolicyType.Set,
							"@id": "urn:rights-management:abc123def456",
							permission: [
								{
									target: "http://example.com/asset/2",
									action: "read"
								}
							]
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<INoContentResponse>()
			}
		]
	};

	const papGetRoute: IRestRoute<IPapGetRequest, IPapGetResponse> = {
		operationId: "papGet",
		summary: "Get a policy",
		tag: papTags[0].name,
		method: "GET",
		path: `${baseRouteName}/policy/admin/:id`,
		handler: async (httpRequestContext, request) =>
			papGet(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapGetRequest>(),
			examples: [
				{
					id: "papGetRequestExample",
					request: {
						pathParams: {
							id: "urn:rights-management:abc123def456"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPapGetResponse>(),
				examples: [
					{
						id: "papGetResponseExample",
						response: {
							body: {
								"@context": PAP_POLICY_RESPONSE_CONTEXT,
								"@type": OdrlPolicyType.Set,
								"@id": "urn:rights-management:abc123def456",
								...papPolicyExampleLifecycle,
								permission: [
									{
										target: "http://example.com/asset/1",
										action: "use"
									}
								]
							}
						}
					}
				]
			}
		]
	};

	const papGetAgreementRoute: IRestRoute<IPapGetAgreementRequest, IPapGetAgreementResponse> = {
		operationId: "papGetAgreement",
		summary: "Get a policy agreement",
		tag: papTags[0].name,
		method: "GET",
		path: `${baseRouteName}/policy/admin/agreement/:id`,
		handler: async (httpRequestContext, request) =>
			papGetAgreement(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapGetAgreementRequest>(),
			examples: [
				{
					id: "papGetAgreementRequestExample",
					request: {
						pathParams: {
							id: "urn:rights-management:abc123def456"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPapGetAgreementResponse>(),
				examples: [
					{
						id: "papGetResponseExample",
						response: {
							body: {
								"@context": PAP_POLICY_RESPONSE_CONTEXT,
								"@type": OdrlPolicyType.Agreement,
								"@id": "urn:rights-management:abc123def456",
								...papPolicyExampleLifecycle,
								permission: [
									{
										target: "http://example.com/asset/1",
										action: "use"
									}
								],
								assignee: "did:example:receiver",
								assigner: "did:example:sender"
							}
						}
					}
				]
			}
		]
	};

	const papGetOfferRoute: IRestRoute<IPapGetOfferRequest, IPapGetOfferResponse> = {
		operationId: "papGetOffer",
		summary: "Get a policy offer",
		tag: papTags[0].name,
		method: "GET",
		path: `${baseRouteName}/policy/admin/offer/:id`,
		handler: async (httpRequestContext, request) =>
			papGetOffer(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapGetOfferRequest>(),
			examples: [
				{
					id: "papGetOfferRequestExample",
					request: {
						pathParams: {
							id: "urn:rights-management:abc123def456"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPapGetOfferResponse>(),
				examples: [
					{
						id: "papGetResponseExample",
						response: {
							body: {
								"@context": PAP_POLICY_RESPONSE_CONTEXT,
								"@type": OdrlPolicyType.Offer,
								"@id": "urn:rights-management:abc123def456",
								...papPolicyExampleLifecycle,
								permission: [
									{
										target: "http://example.com/asset/1",
										action: "use"
									}
								],
								assignee: "did:example:receiver",
								assigner: "did:example:sender"
							}
						}
					}
				]
			}
		]
	};

	const papGetSetRoute: IRestRoute<IPapGetSetRequest, IPapGetSetResponse> = {
		operationId: "papGetSet",
		summary: "Get a policy set",
		tag: papTags[0].name,
		method: "GET",
		path: `${baseRouteName}/policy/admin/set/:id`,
		handler: async (httpRequestContext, request) =>
			papGetSet(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapGetSetRequest>(),
			examples: [
				{
					id: "papGetSetRequestExample",
					request: {
						pathParams: {
							id: "urn:rights-management:abc123def456"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPapGetSetResponse>(),
				examples: [
					{
						id: "papGetResponseExample",
						response: {
							body: {
								"@context": PAP_POLICY_RESPONSE_CONTEXT,
								"@type": OdrlPolicyType.Set,
								"@id": "urn:rights-management:abc123def456",
								...papPolicyExampleLifecycle,
								permission: [
									{
										target: "http://example.com/asset/1",
										action: "use"
									}
								],
								assignee: "did:example:receiver",
								assigner: "did:example:sender"
							}
						}
					}
				]
			}
		]
	};

	const papRemoveRoute: IRestRoute<IPapRemoveRequest, INoContentResponse> = {
		operationId: "papRemove",
		summary: "Remove a policy",
		tag: papTags[0].name,
		method: "DELETE",
		path: `${baseRouteName}/policy/admin/:id`,
		handler: async (httpRequestContext, request) =>
			papRemove(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapRemoveRequest>(),
			examples: [
				{
					id: "papRemoveRequestExample",
					request: {
						pathParams: {
							id: "urn:rights-management:abc123def456"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<INoContentResponse>()
			}
		]
	};

	const papQueryRoute: IRestRoute<IPapQueryRequest, IPapQueryResponse> = {
		operationId: "papQuery",
		summary: "Query policies",
		tag: papTags[0].name,
		method: "GET",
		path: `${baseRouteName}/policy/admin`,
		handler: async (httpRequestContext, request) =>
			papQuery(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapQueryRequest>(),
			examples: [
				{
					id: "papQueryRequestExample",
					request: {
						query: {
							cursor: "optional-pagination-cursor"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPapQueryResponse>(),
				examples: [
					{
						id: "papQueryResponseExample",
						response: {
							body: [
								{
									"@context": PAP_POLICY_RESPONSE_CONTEXT,
									"@type": OdrlPolicyType.Set,
									"@id": "urn:rights-management:abc123def456",
									...papPolicyExampleLifecycle,
									permission: [
										{
											target: "http://example.com/asset/1",
											action: "use"
										}
									]
								}
							]
						}
					}
				]
			}
		]
	};

	return [
		papCreateRoute,
		papUpdateRoute,
		papGetRoute,
		papGetAgreementRoute,
		papGetOfferRoute,
		papGetSetRoute,
		papRemoveRoute,
		papQueryRoute
	];
}

/**
 * PAP: Create a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @param baseRouteName The base route name to use for generating the location header.
 * @returns The response object with additional http response properties.
 */
export async function papCreate(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapCreateRequest,
	baseRouteName: string
): Promise<ICreatedResponse> {
	Guards.object<IPapCreateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapCreateRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);

	const component = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);

	const policy = request.body;
	const uid = await component.create(policy);

	const contextIds = await ContextIdStore.getContextIds();
	const publicOrigin = contextIds?.[HttpContextIdKeys.PublicOrigin];

	const headers: IHttpHeaders = {};
	HttpHeaderHelper.buildId(
		headers,
		uid,
		HttpUrlHelper.combineOriginPath(publicOrigin, `${baseRouteName}/policy/admin/:id`)
	);

	return {
		statusCode: HttpStatusCode.created,
		headers
	};
}

/**
 * PAP: Update a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papUpdate(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapUpdateRequest
): Promise<INoContentResponse> {
	Guards.object(ROUTES_SOURCE, nameof(request), request);
	Guards.object(ROUTES_SOURCE, nameof(request.pathParams), request.pathParams);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);
	Guards.object(ROUTES_SOURCE, nameof(request.body), request.body);

	const component = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);
	await component.update(request.body);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * PAP: Get a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papGet(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapGetRequest
): Promise<IPapGetResponse> {
	Guards.object<IPapGetRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapGetRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);

	const component = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);
	const policy = await component.get(request.pathParams.id);

	return {
		body: policy
	};
}

/**
 * PAP: Get a agreement.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papGetAgreement(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapGetAgreementRequest
): Promise<IPapGetAgreementResponse> {
	Guards.object<IPapGetAgreementRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapGetAgreementRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);

	const component = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);
	const policy = await component.getAgreement(request.pathParams.id);

	return {
		body: policy
	};
}

/**
 * PAP: Get an offer.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papGetOffer(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapGetOfferRequest
): Promise<IPapGetOfferResponse> {
	Guards.object<IPapGetOfferRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapGetOfferRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);

	const component = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);
	const policy = await component.getOffer(request.pathParams.id);

	return {
		body: policy
	};
}

/**
 * PAP: Get a set.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papGetSet(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapGetSetRequest
): Promise<IPapGetSetResponse> {
	Guards.object<IPapGetSetRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapGetSetRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);

	const component = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);
	const policy = await component.getSet(request.pathParams.id);

	return {
		body: policy
	};
}

/**
 * PAP: Remove a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papRemove(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapRemoveRequest
): Promise<INoContentResponse> {
	Guards.object<IPapRemoveRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapRemoveRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);

	const component = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);
	await component.remove(request.pathParams.id);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * PAP: Query policies.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papQuery(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapQueryRequest
): Promise<IPapQueryResponse> {
	Guards.object<IPapQueryRequest>(ROUTES_SOURCE, nameof(request), request);

	const component = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);
	const result = await component.query(
		{
			type: request.query?.type as OdrlPolicyType,
			assigner: request.query?.assigner,
			assignee: request.query?.assignee,
			target: request.query?.target,
			action: request.query?.action
		},
		HttpParameterHelper.objectFromString(request.query?.conditions),
		request.query?.cursor,
		Coerce.integer(request.query?.limit),
		HttpParameterHelper.arrayFromString<keyof IRightsManagementPolicy>(request.query?.properties),
		request.query?.orderBy as keyof IRightsManagementPolicy,
		request.query?.orderByDirection as SortDirection
	);

	const headers: IPapQueryResponse["headers"] = {};

	const contextIds = await ContextIdStore.getContextIds();
	HttpHeaderHelper.buildCursor(
		headers,
		httpRequestContext.serverRequest.url,
		contextIds?.[HttpContextIdKeys.PublicOrigin],
		result.cursor
	);

	return {
		headers,
		body: result.policies
	};
}
