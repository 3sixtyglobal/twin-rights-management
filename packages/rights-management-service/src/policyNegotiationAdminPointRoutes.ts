// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	HttpContextIdKeys,
	HttpHeaderHelper,
	HttpUrlHelper,
	type ICreatedResponse,
	type IHttpRequestContext,
	type INoContentResponse,
	type IRestRoute,
	type ITag
} from "@3sixty/api-models";
import { ContextIdStore } from "@3sixty/context";
import { ComponentFactory, Guards } from "@3sixty/core";
import { nameof } from "@3sixty/nameof";
import type {
	IPnapCreateRequest,
	IPnapGetRequest,
	IPnapGetResponse,
	IPnapQueryRequest,
	IPnapQueryResponse,
	IPnapRemoveRequest,
	IPnapSetRequest,
	IPolicyNegotiationAdminPointComponent
} from "@3sixty/rights-management-models";
import { DataspaceProtocolContractNegotiationStateType } from "@3sixty/standards-dataspace-protocol";
import { HeaderTypes, HttpMethod, HttpStatusCode, type IHttpHeaders } from "@3sixty/web";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "policyNegotiationAdminPointRoutes";

/**
 * The tag to associate with the routes.
 */
export const pnapTags: ITag[] = [
	{
		name: "Policy Negotiation Administration Point",
		description:
			"Endpoints for managing ODRL policies in the Policy Negotiation Administration Point"
	}
];

/**
 * The REST routes for the Policy Negotiation Administration Point.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param componentName The name of the component to use in the routes stored in the ComponentFactory.
 * @returns The generated routes.
 */
export function generateRestRoutesPolicyNegotiationAdminPoint(
	baseRouteName: string,
	componentName: string
): IRestRoute[] {
	const pnapCreateRoute: IRestRoute<IPnapCreateRequest, ICreatedResponse> = {
		operationId: "pnapCreate",
		summary: "Pre-register a consumer-side policy negotiation entry",
		tag: pnapTags[0].name,
		method: HttpMethod.POST,
		path: `${baseRouteName}/negotiations/admin`,
		handler: async (httpRequestContext, request) =>
			pnapCreate(httpRequestContext, componentName, request, baseRouteName),
		requestType: {
			type: nameof<IPnapCreateRequest>(),
			examples: [
				{
					id: "pnapCreateRequestExample",
					request: {
						body: {
							id: "urn:contract-negotiation:consumer-pid"
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
						id: "pnapCreateResponseExample",
						response: {
							statusCode: 201,
							headers: {
								[HeaderTypes.Location]:
									"urn:contract-negotiation:01970000-0000-7000-8000-000000000000"
							}
						}
					}
				]
			}
		]
	};

	const pnapGetRoute: IRestRoute<IPnapGetRequest, IPnapGetResponse> = {
		operationId: "pnapGet",
		summary: "Get a policy negotiation",
		tag: pnapTags[0].name,
		method: HttpMethod.GET,
		path: `${baseRouteName}/negotiations/admin/:policyId`,
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
								id: "pid",
								correlationId: "cid",
								dateCreated: "2025-09-03T00:00:00.000Z",
								state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
								organizationIdentity: "did:iota:123456789abcdefghi"
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
		tag: pnapTags[0].name,
		method: HttpMethod.PUT,
		path: `${baseRouteName}/negotiations/admin/:policyId`,
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
							id: "pid",
							correlationId: "cid",
							dateCreated: "2025-09-03T00:00:00.000Z",
							state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
							organizationIdentity: "did:iota:123456789abcdefghi"
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
		tag: pnapTags[0].name,
		method: HttpMethod.DELETE,
		path: `${baseRouteName}/negotiations/admin/:policyId`,
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
		tag: pnapTags[0].name,
		method: HttpMethod.GET,
		path: `${baseRouteName}/negotiations/admin`,
		handler: async (httpRequestContext, request) =>
			pnapQuery(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnapQueryRequest>(),
			examples: [
				{
					id: "pnapQueryRequestExample",
					request: {
						query: {
							state: DataspaceProtocolContractNegotiationStateType.ACCEPTED,
							cursor: "next-cursor"
						}
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
							body: [
								{
									id: "pid",
									correlationId: "cid",
									dateCreated: "2025-09-03T00:00:00.000Z",
									state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
									organizationIdentity: "did:iota:123456789abcdefghi"
								}
							]
						}
					}
				]
			}
		]
	};

	return [pnapCreateRoute, pnapGetRoute, pnapSetRoute, pnapRemoveRoute, pnapQueryRoute];
}

/**
 * PNAP: Pre-register a consumer-side policy negotiation entry.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @param baseRouteName The base route name to use for the Location header.
 * @returns The response object with additional http response properties.
 */
export async function pnapCreate(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPnapCreateRequest,
	baseRouteName: string
): Promise<ICreatedResponse> {
	Guards.object<IPnapCreateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPnapCreateRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);

	const component = ComponentFactory.get<IPolicyNegotiationAdminPointComponent>(componentName);
	const id = await component.create(request.body.id);

	const contextIds = await ContextIdStore.getContextIds();
	const publicOrigin = contextIds?.[HttpContextIdKeys.PublicOrigin];

	const headers: IHttpHeaders = {};
	HttpHeaderHelper.buildId(
		headers,
		id,
		HttpUrlHelper.combineOriginPath(publicOrigin, `${baseRouteName}/negotiations/admin/:id`)
	);

	return {
		statusCode: HttpStatusCode.created,
		headers
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

	const component = ComponentFactory.get<IPolicyNegotiationAdminPointComponent>(componentName);
	const negotiation = await component.get(request.pathParams.policyId);

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

	const component = ComponentFactory.get<IPolicyNegotiationAdminPointComponent>(componentName);
	await component.set(request.body);

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

	const component = ComponentFactory.get<IPolicyNegotiationAdminPointComponent>(componentName);
	await component.remove(request.pathParams.policyId);

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

	const component = ComponentFactory.get<IPolicyNegotiationAdminPointComponent>(componentName);
	const result = await component.query(request.query?.state, request.query?.cursor);

	const headers: IPnapQueryResponse["headers"] = {};

	const contextIds = await ContextIdStore.getContextIds();
	HttpHeaderHelper.buildCursor(
		headers,
		httpRequestContext.serverRequest.url,
		contextIds?.[HttpContextIdKeys.PublicOrigin],
		result.cursor
	);

	return {
		headers,
		body: result.items
	};
}
