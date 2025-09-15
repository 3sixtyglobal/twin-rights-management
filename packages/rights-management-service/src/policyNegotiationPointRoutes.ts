// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	IHttpRequestContext,
	INoContentResponse,
	IRestRoute,
	ITag
} from "@twin.org/api-models";
import { ComponentFactory, Guards } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import {
	RightsManagementContexts,
	RightsManagementTypes,
	type IPnpNegotiateRequest,
	type IPnpNegotiateResponse,
	type IPnpNegotiationCancelRequest,
	type IPnpNegotiationStateRequest,
	type IPnpNegotiationStateResponse,
	type IPolicyNegotiationPointComponent
} from "@twin.org/rights-management-models";
import { HeaderTypes, HttpStatusCode, MimeTypes } from "@twin.org/web";

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
	const pnpNegotiateRoute: IRestRoute<IPnpNegotiateRequest, IPnpNegotiateResponse> = {
		operationId: "pnpNegotiate",
		summary: "Negotiate a policy",
		tag: pnpTags[0].name,
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
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						body: {
							"@context": RightsManagementContexts.ContextRoot,
							type: RightsManagementTypes.PolicyNegotiationRequest,
							assetType: "document",
							action: "view",
							assignee: "urn:example:node:1"
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
								"@context": RightsManagementContexts.ContextRoot,
								type: RightsManagementTypes.PolicyState,
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
		tag: pnpTags[0].name,
		method: "GET",
		path: `${baseRouteName}/pnp/:policyId`,
		handler: async (httpRequestContext, request) =>
			pnpNegotiationState(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPnpNegotiationStateRequest>(),
			examples: [
				{
					id: "pnpNegotiationStateRequestExample",
					request: {
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							policyId: "policy-1"
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
								"@context": RightsManagementContexts.ContextRoot,
								type: RightsManagementTypes.PolicyState,
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
		tag: pnpTags[0].name,
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
						headers: {
							[HeaderTypes.Accept]: MimeTypes.JsonLd,
							[HeaderTypes.Authorization]: "z3Vcuh2BP9ShC.z3Vcuh2BP9ShC.z3Vcuh2BP9ShC"
						},
						pathParams: {
							policyId: "policy-1"
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
	return [pnpNegotiateRoute, papNegotiationStateRoute, pnpNegotiationCancelRoute];
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
	Guards.object<IPnpNegotiateRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);

	const mimeType = request.headers[HeaderTypes.Accept] === MimeTypes.JsonLd ? "jsonld" : "json";

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	const result = await component.negotiate(
		{
			assetType: request.body.assetType,
			action: request.body.action,
			resourceId: request.body.resourceId,
			assignee: request.body.assignee
		},
		request.body.information,
		request.headers[HeaderTypes.Authorization]
	);

	return {
		headers: {
			[HeaderTypes.ContentType]: mimeType === "json" ? MimeTypes.Json : MimeTypes.JsonLd
		},
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
	Guards.object<IPnpNegotiationStateRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);

	const mimeType = request.headers[HeaderTypes.Accept] === MimeTypes.JsonLd ? "jsonld" : "json";

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	const result = await component.negotiationState(
		request.pathParams.policyId,
		request.headers[HeaderTypes.Authorization]
	);

	return {
		headers: {
			[HeaderTypes.ContentType]: mimeType === "json" ? MimeTypes.Json : MimeTypes.JsonLd
		},
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
	Guards.object<IPnpNegotiationCancelRequest["headers"]>(
		ROUTES_SOURCE,
		nameof(request.headers),
		request.headers
	);

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	await component.negotiationCancel(
		request.pathParams.policyId,
		request.headers[HeaderTypes.Authorization]
	);

	return {
		statusCode: HttpStatusCode.noContent
	};
}
