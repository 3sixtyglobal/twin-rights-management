// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	ICreatedResponse,
	IHttpRequestContext,
	INoContentResponse,
	IRestRoute,
	ITag
} from "@twin.org/api-models";
import { ComponentFactory, Guards } from "@twin.org/core";
import {
	IdentityAuthenticationContexts,
	IdentityAuthenticationTypes,
	type IIdentityAuthenticationActionRequest
} from "@twin.org/identity-authentication";
import { nameof } from "@twin.org/nameof";
import {
	RightsManagementContexts,
	RightsManagementTypes,
	type IDapCreateRequest,
	type IDapGetRequest,
	type IDapGetResponse,
	type IDapQueryRequest,
	type IDapQueryResponse,
	type IDapRemoveRequest,
	type IDapUpdateRequest,
	type IDataAccessPointComponent
} from "@twin.org/rights-management-models";
import { HeaderTypes, HttpStatusCode, MimeTypes } from "@twin.org/web";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "dataAccessPointRoutes";

/**
 * The tag to associate with the routes.
 */
export const dapTags: ITag[] = [
	{
		name: "Data Access Point",
		description: "Endpoints for providing access to the Rights Management Data Access Point"
	}
];

/**
 * The REST routes for the Data Access Point.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param componentName The name of the component to use in the routes stored in the ComponentFactory.
 * @returns The generated routes.
 */
export function generateRestRoutesDataAccessPoint(
	baseRouteName: string,
	componentName: string
): IRestRoute[] {
	const dapCreateRoute: IRestRoute<IDapCreateRequest, ICreatedResponse> = {
		operationId: "dapCreate",
		summary: "Create a new item",
		tag: dapTags[0].name,
		method: "POST",
		path: `${baseRouteName}/data/:assetType`,
		handler: async (httpRequestContext, request) =>
			dapCreate(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IDapCreateRequest>(),
			examples: [
				{
					id: "dapCreateRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							assetType: "contacts"
						},
						body: {
							"@context": RightsManagementContexts.ContextRoot,
							type: RightsManagementTypes.DataAccessRequestWithObject,
							assetType: "contacts",
							object: {
								"@context": "https://schema.org",
								type: "Person",
								name: "Jane Doe"
							}
						},
						authentication: {
							"@context": IdentityAuthenticationContexts.ContextRoot,
							type: IdentityAuthenticationTypes.ActionRequest,
							requester: "did:node-1",
							action: "create"
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
						id: "IDapCreateResponseExample",
						response: {
							statusCode: 201,
							headers: {
								location: "urn:contacts:abc123def456"
							}
						}
					}
				]
			}
		],
		skipAuth: true,
		processorFeatures: ["verifiableCredential"]
	};

	const dapGetRoute: IRestRoute<IDapGetRequest, IDapGetResponse> = {
		operationId: "dapGet",
		summary: "Get an existing item",
		tag: dapTags[0].name,
		method: "GET",
		path: `${baseRouteName}/data/:assetType/:id`,
		handler: async (httpRequestContext, request) =>
			dapGet(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IDapGetRequest>(),
			examples: [
				{
					id: "dapCreateRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							assetType: "contacts",
							id: "urn:contacts:abc123def456"
						},
						authentication: {
							"@context": IdentityAuthenticationContexts.ContextRoot,
							type: IdentityAuthenticationTypes.ActionRequest,
							requester: "did:node-1",
							action: "get"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IDapGetResponse>(),
				examples: [
					{
						id: "IDapGetResponseExample",
						response: {
							body: {
								"@context": "https://schema.org",
								type: "Person",
								name: "Jane Doe"
							}
						}
					}
				]
			}
		],
		skipAuth: true,
		processorFeatures: ["verifiableCredential"]
	};

	const dapUpdateRoute: IRestRoute<IDapUpdateRequest, INoContentResponse> = {
		operationId: "dapUpdate",
		summary: "Update an existing item",
		tag: dapTags[0].name,
		method: "PUT",
		path: `${baseRouteName}/data/:assetType/:id`,
		handler: async (httpRequestContext, request) =>
			dapUpdate(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IDapUpdateRequest>(),
			examples: [
				{
					id: "dapUpdateRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							assetType: "contacts",
							id: "urn:contacts:abc123def456"
						},
						body: {
							"@context": RightsManagementContexts.ContextRoot,
							type: RightsManagementTypes.DataAccessRequestWithObject,
							assetType: "contacts",
							object: {
								"@context": "https://schema.org",
								type: "Person",
								name: "Jane Doe"
							}
						},
						authentication: {
							"@context": IdentityAuthenticationContexts.ContextRoot,
							type: IdentityAuthenticationTypes.ActionRequest,
							requester: "did:node-1",
							action: "update"
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
		skipAuth: true,
		processorFeatures: ["verifiableCredential"]
	};

	const dapRemoveRoute: IRestRoute<IDapRemoveRequest, INoContentResponse> = {
		operationId: "dapRemove",
		summary: "Remove an existing item",
		tag: dapTags[0].name,
		method: "DELETE",
		path: `${baseRouteName}/data/:assetType/:id`,
		handler: async (httpRequestContext, request) =>
			dapRemove(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IDapRemoveRequest>(),
			examples: [
				{
					id: "dapRemoveRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							assetType: "contacts",
							id: "urn:contacts:abc123def456"
						},
						authentication: {
							"@context": IdentityAuthenticationContexts.ContextRoot,
							type: IdentityAuthenticationTypes.ActionRequest,
							requester: "did:node-1",
							action: "remove"
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
		skipAuth: true,
		processorFeatures: ["verifiableCredential"]
	};

	const dapQueryRoute: IRestRoute<IDapQueryRequest, IDapQueryResponse> = {
		operationId: "dapQuery",
		summary: "Query items",
		tag: dapTags[0].name,
		method: "POST",
		path: `${baseRouteName}/data/:assetType/query`,
		handler: async (httpRequestContext, request) =>
			dapQuery(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IDapQueryRequest>(),
			examples: [
				{
					id: "dapQueryRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							assetType: "contacts"
						},
						body: {
							"@context": RightsManagementContexts.ContextRoot,
							type: RightsManagementTypes.DataAccessQuery,
							assetType: "contacts"
						},
						authentication: {
							"@context": IdentityAuthenticationContexts.ContextRoot,
							type: IdentityAuthenticationTypes.ActionRequest,
							requester: "did:node-1",
							action: "query"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IDapQueryResponse>(),
				examples: [
					{
						id: "IDapQueryResponseExample",
						response: {
							body: {
								"@context": RightsManagementContexts.ContextRoot,
								type: RightsManagementTypes.DataAccessQueryResponse,
								items: [
									{
										"@context": "https://schema.org",
										type: "Person",
										name: "Jane Doe"
									}
								]
							}
						}
					}
				]
			}
		],
		skipAuth: true,
		processorFeatures: ["verifiableCredential"]
	};

	return [dapCreateRoute, dapGetRoute, dapUpdateRoute, dapRemoveRoute, dapQueryRoute];
}

/**
 * DAP: Create.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function dapCreate(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IDapCreateRequest
): Promise<ICreatedResponse> {
	Guards.object<IDapCreateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IDapCreateRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);
	Guards.object<IDapCreateRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.object<IDapCreateRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);

	const component = ComponentFactory.get<IDataAccessPointComponent>(componentName);
	const result = await component.create(
		request.pathParams.assetType,
		request.body.object,
		httpRequestContext.processorState
			.verifiableCredentialSubject as IIdentityAuthenticationActionRequest
	);

	return {
		statusCode: HttpStatusCode.created,
		headers: {
			[HeaderTypes.Location]: result
		}
	};
}

/**
 * DAP: Get.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function dapGet(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IDapGetRequest
): Promise<IDapGetResponse> {
	Guards.object<IDapGetRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IDapGetRequest["headers"]>(ROUTES_SOURCE, nameof(request.headers), request.headers);
	Guards.object<IDapGetRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);

	const mimeType = request.headers[HeaderTypes.Accept] === MimeTypes.JsonLd ? "jsonld" : "json";

	const component = ComponentFactory.get<IDataAccessPointComponent>(componentName);
	const result = await component.get(
		request.pathParams.assetType,
		request.pathParams.id,
		httpRequestContext.processorState
			.verifiableCredentialSubject as IIdentityAuthenticationActionRequest
	);

	return {
		headers: {
			[HeaderTypes.ContentType]: mimeType === "json" ? MimeTypes.Json : MimeTypes.JsonLd
		},
		body: result
	};
}

/**
 * DAP: Update.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function dapUpdate(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IDapUpdateRequest
): Promise<INoContentResponse> {
	Guards.object<IDapUpdateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IDapGetRequest["headers"]>(ROUTES_SOURCE, nameof(request.headers), request.headers);
	Guards.object<IDapUpdateRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.object<IDapUpdateRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);

	const component = ComponentFactory.get<IDataAccessPointComponent>(componentName);
	await component.update(
		request.pathParams.assetType,
		request.body.object,
		httpRequestContext.processorState
			.verifiableCredentialSubject as IIdentityAuthenticationActionRequest
	);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * DAP: Remove.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function dapRemove(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IDapRemoveRequest
): Promise<INoContentResponse> {
	Guards.object<IDapRemoveRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IDapRemoveRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);
	Guards.object<IDapRemoveRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);

	const component = ComponentFactory.get<IDataAccessPointComponent>(componentName);
	await component.remove(
		request.pathParams.assetType,
		request.pathParams.id,
		httpRequestContext.processorState
			.verifiableCredentialSubject as IIdentityAuthenticationActionRequest
	);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * DAP: Query.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function dapQuery(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IDapQueryRequest
): Promise<IDapQueryResponse> {
	Guards.object<IDapQueryRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IDapQueryRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);
	Guards.object<IDapQueryRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.object<IDapQueryRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);

	const mimeType = request.headers[HeaderTypes.Accept] === MimeTypes.JsonLd ? "jsonld" : "json";

	const component = ComponentFactory.get<IDataAccessPointComponent>(componentName);
	const result = await component.query(
		request.pathParams.assetType,
		request.body.conditions,
		request.body.cursor,
		request.body.options,
		httpRequestContext.processorState
			.verifiableCredentialSubject as IIdentityAuthenticationActionRequest
	);

	return {
		headers: {
			[HeaderTypes.ContentType]: mimeType === "json" ? MimeTypes.Json : MimeTypes.JsonLd
		},
		body: {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.DataAccessQueryResponse,
			...result
		}
	};
}
