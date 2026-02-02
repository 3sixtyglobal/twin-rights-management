// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	IHostingComponent,
	IHttpRequestContext,
	INoContentResponse,
	IRestRoute,
	ITag
} from "@twin.org/api-models";
import { ComponentFactory, Guards, Is } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type {
	IPnapGetRequest,
	IPnapGetResponse,
	IPnapQueryRequest,
	IPnapQueryResponse,
	IPnapRemoveRequest,
	IPnapSetRequest,
	IPolicyNegotiationAdminPointComponent
} from "@twin.org/rights-management-models";
import { DataspaceProtocolContractNegotiationStateType } from "@twin.org/standards-dataspace-protocol";
import { HeaderHelper, HeaderTypes, HttpMethod, HttpStatusCode } from "@twin.org/web";

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
								state: DataspaceProtocolContractNegotiationStateType.REQUESTED
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
							state: DataspaceProtocolContractNegotiationStateType.REQUESTED
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
									state: DataspaceProtocolContractNegotiationStateType.REQUESTED
								}
							]
						}
					}
				]
			}
		]
	};

	return [pnapGetRoute, pnapSetRoute, pnapRemoveRoute, pnapQueryRoute];
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

	const hostingComponent = ComponentFactory.get<IHostingComponent>(
		httpRequestContext.hostingComponentType ?? "hosting"
	);

	const component = ComponentFactory.get<IPolicyNegotiationAdminPointComponent>(componentName);
	const result = await component.query(
		request.query?.state as DataspaceProtocolContractNegotiationStateType,
		request.query?.cursor
	);

	const headers: IPnapQueryResponse["headers"] = {};

	if (Is.stringValue(result.cursor)) {
		headers[HeaderTypes.Link] = HeaderHelper.createLinkHeader(
			await hostingComponent.buildPublicUrl(httpRequestContext.serverRequest.url),
			{ cursor: result.cursor },
			"next"
		);
	}

	return {
		headers,
		body: result.items
	};
}
