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
import { DidContexts } from "@twin.org/standards-w3c-did";
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
						body: {
							"@context": [DidContexts.ContextVCv2, RightsManagementContexts.ContextRoot],
							type: RightsManagementTypes.PolicyNegotiationRequest,
							assetType: "document",
							action: "view",
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
							"@context": [DidContexts.ContextVCv2, RightsManagementContexts.ContextRoot],
							type: RightsManagementTypes.PolicyRequest,
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
						pathParams: {
							policyId: "policy-1"
						},
						body: {
							"@context": [DidContexts.ContextVCv2, RightsManagementContexts.ContextRoot],
							type: RightsManagementTypes.PolicyRequest,
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

	const mimeType = request.headers?.[HeaderTypes.Accept] === MimeTypes.JsonLd ? "jsonld" : "json";

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	const result = await component.negotiate(
		request.body.assetType,
		request.body.action,
		request.body.resourceId,
		request.body.nodeIdentity,
		request.body.information,
		request.body.proof
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
	Guards.object<IPnpNegotiationStateRequest["body"]>(
		ROUTES_SOURCE,
		nameof(request.body),
		request.body
	);

	const mimeType = request.headers?.[HeaderTypes.Accept] === MimeTypes.JsonLd ? "jsonld" : "json";

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	const result = await component.negotiationState(
		request.pathParams.policyId,
		request.body.nodeIdentity,
		request.body.proof
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
	Guards.object<IPnpNegotiationCancelRequest["body"]>(
		ROUTES_SOURCE,
		nameof(request.body),
		request.body
	);

	const component = ComponentFactory.get<IPolicyNegotiationPointComponent>(componentName);
	await component.negotiationCancel(
		request.pathParams.policyId,
		request.body.nodeIdentity,
		request.body.proof
	);

	return {
		statusCode: HttpStatusCode.noContent
	};
}
