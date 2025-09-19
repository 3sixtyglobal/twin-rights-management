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
	IPapGetRequest,
	IPapGetResponse,
	IPapQueryRequest,
	IPapQueryResponse,
	IPapRemoveRequest,
	IPapUpdateRequest,
	IPolicyAdministrationPointComponent
} from "@twin.org/rights-management-models";
import { OdrlContexts } from "@twin.org/standards-w3c-odrl";
import { HttpStatusCode } from "@twin.org/web";

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
 * The REST routes for the Policy Administration Point.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param componentName The name of the component to use in the routes stored in the ComponentFactory.
 * @returns The generated routes.
 */
export function generateRestRoutesPolicyAdministrationPoint(
	baseRouteName: string,
	componentName: string
): IRestRoute[] {
	const papCreateRoute: IRestRoute<IPapCreateRequest, ICreatedResponse> = {
		operationId: "papCreate",
		summary: "Create a policy",
		tag: papTags[0].name,
		method: "POST",
		path: `${baseRouteName}/policy/admin`,
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

	return [papCreateRoute, papUpdateRoute, papGetRoute, papRemoveRoute, papQueryRoute];
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

	const component = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);

	const policy = request.body;
	const uid = await component.create(policy);

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
