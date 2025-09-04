// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	HttpParameterHelper,
	type ICreatedResponse,
	type IHttpRequestContext,
	type INoContentResponse,
	type IRestRoute,
	type ITag
} from "@twin.org/api-models";
import { Coerce, ComponentFactory, Guards } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type {
	IPapCreateRequest,
	IPapQueryRequest,
	IPapQueryResponse,
	IPapRemoveRequest,
	IPapRetrieveRequest,
	IPapRetrieveResponse,
	IPapUpdateRequest,
	IPepInterceptRequest,
	IPepInterceptResponse,
	IPnapGetRequest,
	IPnapGetResponse,
	IPnapQueryRequest,
	IPnapQueryResponse,
	IPnapRemoveRequest,
	IPnapSetRequest,
	IPnpNegotiateRequest,
	IPnpNegotiateResponse,
	IPnpNegotiationCancelRequest,
	IPnpNegotiationStateRequest,
	IPnpNegotiationStateResponse,
	IRightsManagementComponent,
	PolicyNegotiationStatus
} from "@twin.org/rights-management-models";
import { OdrlContexts } from "@twin.org/standards-w3c-odrl";
import { HttpMethod, HttpStatusCode } from "@twin.org/web";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "rightsManagementRoutes";

/**
 * The tag to associate with the routes.
 */
export const tags: ITag[] = [
	{
		name: "Policy Administration Point",
		description: "Endpoints for managing ODRL policies in the Policy Administration Point"
	}
];

/**
 * The REST routes for the Rights Management.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param componentName The name of the component to use in the routes stored in the ComponentFactory.
 * @returns The generated routes.
 */
export function generateRestRoutesRightsManagement(
	baseRouteName: string,
	componentName: string
): IRestRoute[] {
	const papCreateRoute: IRestRoute<IPapCreateRequest, ICreatedResponse> = {
		operationId: "papCreate",
		summary: "Create a policy",
		tag: tags[0].name,
		method: "POST",
		path: `${baseRouteName}/pap/`,
		handler: async (httpRequestContext, request) =>
			papCreate(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapCreateRequest>(),
			examples: [
				{
					id: "papCreateRequestExample",
					request: {
						body: {
							"@context": OdrlContexts.ContextRoot,
							"@type": "Set",
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
		tag: tags[0].name,
		method: "PUT",
		path: `${baseRouteName}/pap/:id`,
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
							"@context": OdrlContexts.ContextRoot,
							"@type": "Set",
							uid: "urn:rights-management:abc123def456",
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

	const papRetrieveRoute: IRestRoute<IPapRetrieveRequest, IPapRetrieveResponse> = {
		operationId: "papRetrieve",
		summary: "Retrieve a policy",
		tag: tags[0].name,
		method: "GET",
		path: `${baseRouteName}/pap/:id`,
		handler: async (httpRequestContext, request) =>
			papRetrieve(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapRetrieveRequest>(),
			examples: [
				{
					id: "papRetrieveRequestExample",
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
				type: nameof<IPapRetrieveResponse>(),
				examples: [
					{
						id: "papRetrieveResponseExample",
						response: {
							body: {
								"@context": OdrlContexts.ContextRoot,
								"@type": "Set",
								uid: "urn:rights-management:abc123def456",
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

	const papRemoveRoute: IRestRoute<IPapRemoveRequest, INoContentResponse> = {
		operationId: "papRemove",
		summary: "Remove a policy",
		tag: tags[0].name,
		method: "DELETE",
		path: `${baseRouteName}/pap/:id`,
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
		tag: tags[0].name,
		method: "GET",
		path: `${baseRouteName}/pap/query`,
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
							body: {
								cursor: "next-page-cursor",
								policies: [
									{
										"@context": OdrlContexts.ContextRoot,
										"@type": "Set",
										uid: "urn:rights-management:abc123def456",
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
					}
				]
			}
		]
	};

	const pepInterceptRoute: IRestRoute<IPepInterceptRequest, IPepInterceptResponse> = {
		operationId: "pepIntercept",
		summary: "Intercept a request",
		tag: tags[0].name,
		method: "POST",
		path: `${baseRouteName}/pep/intercept`,
		handler: async (httpRequestContext, request) =>
			pepIntercept(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPepInterceptRequest>(),
			examples: [
				{
					id: "pepInterceptRequestExample",
					request: {
						body: {
							assetType: "document",
							action: "view",
							data: {
								id: "document-1",
								param1: 1,
								param2: 2
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPepInterceptResponse>(),
				examples: [
					{
						id: "pepInterceptResponseExample",
						response: {
							body: {
								id: "document-1",
								param1: 1
							}
						}
					}
				]
			}
		]
	};

	const papNegotiateRoute: IRestRoute<IPnpNegotiateRequest, IPnpNegotiateResponse> = {
		operationId: "pnpNegotiate",
		summary: "Negotiate a policy",
		tag: tags[0].name,
		method: "POST",
		path: `${baseRouteName}/pnp/negotiate`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiate(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpNegotiateRequest>(),
			examples: [
				{
					id: "pnpNegotiateRequestExample",
					request: {
						body: {
							assetType: "document",
							action: "view",
							context: {
								nodeIdentity: "urn:example:node:1"
							},
							proof: {
								created: "2024-08-22T11:56:56.272Z",
								type: "DataIntegrityProof",
								cryptosuite: "eddsa-jcs-2022",
								proofPurpose: "assertionMethod",
								proofValue:
									"z3Vcuh2BP9ShC4UEJ3yRZgcTJ6gmRtydDrh6AmY1zEciQqEWTvXfBZNxxjTzdJjT44cmn9VDWbBHqxFsX9fjsfXzK",
								verificationMethod:
									"did:entity-storage:0x6363636363636363636363636363636363636363636363636363636363636363#assertion"
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnpNegotiateResponse>(),
				examples: [
					{
						id: "IPnpNegotiateResponseExample",
						response: {
							body: {
								id: "policy-1",
								status: "approved"
							}
						}
					}
				]
			}
		],
		skipAuth: true
	};

	const papNegotiationStateRoute: IRestRoute<
		IPnpNegotiationStateRequest,
		IPnpNegotiationStateResponse
	> = {
		operationId: "pnpNegotiationState",
		summary: "Get the state of a policy",
		tag: tags[0].name,
		method: "POST",
		path: `${baseRouteName}/pnp/:policyId`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiationState(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpNegotiationStateRequest>(),
			examples: [
				{
					id: "pnpNegotiationStateRequestExample",
					request: {
						pathParams: {
							policyId: "policy-1"
						},
						body: {
							nodeIdentity: "urn:example:node:1",
							proof: {
								created: "2024-08-22T11:56:56.272Z",
								type: "DataIntegrityProof",
								cryptosuite: "eddsa-jcs-2022",
								proofPurpose: "assertionMethod",
								proofValue:
									"z3Vcuh2BP9ShC4UEJ3yRZgcTJ6gmRtydDrh6AmY1zEciQqEWTvXfBZNxxjTzdJjT44cmn9VDWbBHqxFsX9fjsfXzK",
								verificationMethod:
									"did:entity-storage:0x6363636363636363636363636363636363636363636363636363636363636363#assertion"
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnpNegotiationStateResponse>(),
				examples: [
					{
						id: "IPnpNegotiationStateResponseExample",
						response: {
							body: {
								id: "policy-1",
								status: "approved"
							}
						}
					}
				]
			}
		],
		skipAuth: true
	};

	const pnpNegotiationCancelRoute: IRestRoute<IPnpNegotiationCancelRequest, INoContentResponse> = {
		operationId: "pnpCancel",
		summary: "Cancel a policy negotiation",
		tag: tags[0].name,
		method: "DELETE",
		path: `${baseRouteName}/pnp/:policyId`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiationCancel(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpNegotiationCancelRequest>(),
			examples: [
				{
					id: "pnpNegotiationCancelRequestExample",
					request: {
						pathParams: {
							policyId: "policy-1"
						},
						body: {
							nodeIdentity: "urn:example:node:1",
							proof: {
								created: "2024-08-22T11:56:56.272Z",
								type: "DataIntegrityProof",
								cryptosuite: "eddsa-jcs-2022",
								proofPurpose: "assertionMethod",
								proofValue:
									"z3Vcuh2BP9ShC4UEJ3yRZgcTJ6gmRtydDrh6AmY1zEciQqEWTvXfBZNxxjTzdJjT44cmn9VDWbBHqxFsX9fjsfXzK",
								verificationMethod:
									"did:entity-storage:0x6363636363636363636363636363636363636363636363636363636363636363#assertion"
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<INoContentResponse>()
			}
		],
		skipAuth: true
	};

	const pnapGetRoute: IRestRoute<IPnapGetRequest, IPnapGetResponse> = {
		operationId: "pnapGet",
		summary: "Get a policy negotiation",
		tag: tags[0].name,
		method: HttpMethod.GET,
		path: `${baseRouteName}/pnap/:policyId`,
		handler: async (httpRequestContext, request) =>
			pnapGet(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnapGetRequest>(),
			examples: [
				{
					id: "pnapGetRequestExample",
					request: {
						pathParams: { policyId: "policy-1" }
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnapGetResponse>(),
				examples: [
					{
						id: "pnapGetResponseExample",
						response: {
							body: {
								id: "policy-1",
								status: "manual",
								dateCreated: "2025-09-03T00:00:00.000Z",
								assetType: "document",
								action: "view",
								context: {}
							}
						}
					}
				]
			}
		]
	};

	const pnapSetRoute: IRestRoute<IPnapSetRequest, INoContentResponse> = {
		operationId: "pnapSet",
		summary: "Set a policy negotiation",
		tag: tags[0].name,
		method: HttpMethod.PUT,
		path: `${baseRouteName}/pnap/:policyId`,
		handler: async (httpRequestContext, request) =>
			pnapSet(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnapSetRequest>(),
			examples: [
				{
					id: "pnapSetRequestExample",
					request: {
						pathParams: { policyId: "policy-1" },
						body: {
							id: "policy-1",
							status: "approved",
							dateCreated: "2025-09-03T00:00:00.000Z",
							assetType: "document",
							action: "view",
							context: {}
						}
					}
				}
			]
		},
		responseType: [{ type: nameof<INoContentResponse>() }]
	};

	const pnapRemoveRoute: IRestRoute<IPnapRemoveRequest, INoContentResponse> = {
		operationId: "pnapRemove",
		summary: "Remove a policy negotiation",
		tag: tags[0].name,
		method: HttpMethod.DELETE,
		path: `${baseRouteName}/pnap/:policyId`,
		handler: async (httpRequestContext, request) =>
			pnapRemove(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnapRemoveRequest>(),
			examples: [
				{
					id: "pnapRemoveRequestExample",
					request: {
						pathParams: { policyId: "policy-1" }
					}
				}
			]
		},
		responseType: [{ type: nameof<INoContentResponse>() }]
	};

	const pnapQueryRoute: IRestRoute<IPnapQueryRequest, IPnapQueryResponse> = {
		operationId: "pnapQuery",
		summary: "Query policy negotiations",
		tag: tags[0].name,
		method: HttpMethod.GET,
		path: `${baseRouteName}/pnap`,
		handler: async (httpRequestContext, request) =>
			pnapQuery(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnapQueryRequest>(),
			examples: [
				{
					id: "pnapQueryRequestExample",
					request: {
						query: { status: "manual", cursor: "next-cursor" }
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPnapQueryResponse>(),
				examples: [
					{
						id: "pnapQueryResponseExample",
						response: {
							body: {
								items: [
									{
										id: "policy-1",
										status: "manual",
										dateCreated: "2025-09-03T00:00:00.000Z",
										assetType: "document",
										action: "view",
										context: {}
									}
								],
								cursor: "next-cursor"
							}
						}
					}
				]
			}
		]
	};

	return [
		papCreateRoute,
		papUpdateRoute,
		papRetrieveRoute,
		papRemoveRoute,
		papQueryRoute,
		pepInterceptRoute,
		papNegotiateRoute,
		papNegotiationStateRoute,
		pnpNegotiationCancelRoute,
		pnapGetRoute,
		pnapSetRoute,
		pnapRemoveRoute,
		pnapQueryRoute
	];
}

/**
 * PAP: Create a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papCreate(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapCreateRequest
): Promise<ICreatedResponse> {
	Guards.object<IPapCreateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapCreateRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);

	const policy = request.body;
	const uid = await component.papCreate(policy);

	return {
		statusCode: HttpStatusCode.created,
		headers: {
			location: uid
		}
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

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	await component.papUpdate(request.body);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * PAP: Retrieve a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papRetrieve(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapRetrieveRequest
): Promise<IPapRetrieveResponse> {
	Guards.object<IPapRetrieveRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapRetrieveRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	const policy = await component.papRetrieve(request.pathParams.id);

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

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	await component.papRemove(request.pathParams.id);

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

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	const result = await component.papQuery(
		HttpParameterHelper.objectFromString(request.query?.conditions),
		request.query?.cursor,
		Coerce.integer(request.query?.pageSize)
	);

	return {
		body: {
			cursor: result.cursor,
			policies: result.policies
		}
	};
}

/**
 * PEP: Intercept.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pepIntercept(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPepInterceptRequest
): Promise<IPepInterceptResponse> {
	Guards.object<IPepInterceptRequest>(ROUTES_SOURCE, nameof(request), request);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	const result = await component.pepIntercept(
		request.body.assetType,
		request.body.action,
		{
			...(request.body.context ?? {}),
			userIdentity: httpRequestContext.userIdentity,
			nodeIdentity: httpRequestContext.nodeIdentity
		},
		request.body.data
	);

	return {
		body: result
	};
}

/**
 * PNP: Negotiate.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnpNegotiate(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnpNegotiateRequest
): Promise<IPnpNegotiateResponse> {
	Guards.object<IPnpNegotiateRequest>(ROUTES_SOURCE, nameof(request), request);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	const result = await component.pnpNegotiate(
		request.body.assetType,
		request.body.action,
		request.body.resourceId,
		request.body.context,
		request.body.requesterInformation,
		request.body.proof
	);

	return {
		body: result
	};
}

/**
 * PNP: Negotiation State.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnpNegotiationState(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnpNegotiationStateRequest
): Promise<IPnpNegotiationStateResponse> {
	Guards.object<IPnpNegotiationStateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPnpNegotiationStateRequest["body"]>(
		ROUTES_SOURCE,
		nameof(request.body),
		request.body
	);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	const result = await component.pnpNegotiationState(
		request.pathParams.policyId,
		request.body.nodeIdentity,
		request.body.proof
	);

	return {
		body: result
	};
}

/**
 * PNP: Negotiation Cancel.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnpNegotiationCancel(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnpNegotiationCancelRequest
): Promise<INoContentResponse> {
	Guards.object<IPnpNegotiationCancelRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPnpNegotiationCancelRequest["body"]>(
		ROUTES_SOURCE,
		nameof(request.body),
		request.body
	);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	await component.pnpNegotiationCancel(
		request.pathParams.policyId,
		request.body.nodeIdentity,
		request.body.proof
	);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * PNAP: Get a policy negotiation.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnapGet(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnapGetRequest
): Promise<IPnapGetResponse> {
	Guards.object<IPnapGetRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object(ROUTES_SOURCE, nameof(request.pathParams), request.pathParams);
	Guards.stringValue(
		ROUTES_SOURCE,
		nameof(request.pathParams.policyId),
		request.pathParams.policyId
	);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	const negotiation = await component.pnapGet(request.pathParams.policyId);

	return {
		body: negotiation
	};
}

/**
 * PNAP: Set a policy negotiation.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnapSet(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnapSetRequest
): Promise<INoContentResponse> {
	Guards.object<IPnapSetRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object(ROUTES_SOURCE, nameof(request.pathParams), request.pathParams);
	Guards.stringValue(
		ROUTES_SOURCE,
		nameof(request.pathParams.policyId),
		request.pathParams.policyId
	);
	Guards.object(ROUTES_SOURCE, nameof(request.body), request.body);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	await component.pnapSet(request.body);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * PNAP: Remove a policy negotiation.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnapRemove(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnapRemoveRequest
): Promise<INoContentResponse> {
	Guards.object<IPnapRemoveRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object(ROUTES_SOURCE, nameof(request.pathParams), request.pathParams);
	Guards.stringValue(
		ROUTES_SOURCE,
		nameof(request.pathParams.policyId),
		request.pathParams.policyId
	);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	await component.pnapRemove(request.pathParams.policyId);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * PNAP: Query policy negotiations.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function pnapQuery(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnapQueryRequest
): Promise<IPnapQueryResponse> {
	Guards.object<IPnapQueryRequest>(ROUTES_SOURCE, nameof(request), request);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	const result = await component.pnapQuery(
		request.query?.status as PolicyNegotiationStatus,
		request.query?.cursor
	);

	return {
		body: {
			items: result.items,
			cursor: result.cursor
		}
	};
}
