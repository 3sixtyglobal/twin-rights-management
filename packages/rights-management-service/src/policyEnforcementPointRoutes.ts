// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IHttpRequestContext, IRestRoute, ITag } from "@twin.org/api-models";
import { ComponentFactory, Guards } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type {
	IPepInterceptRequest,
	IPepInterceptResponse,
	IPolicyEnforcementPointComponent
} from "@twin.org/rights-management-models";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "policyEnforcementPointRoutes";

/**
 * The tag to associate with the routes.
 */
export const pepTags: ITag[] = [
	{
		name: "Policy Enforcement Point",
		description: "Endpoints for managing ODRL policies in the Policy Enforcement Point"
	}
];

/**
 * The REST routes for the Policy Enforcement Point.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param componentName The name of the component to use in the routes stored in the ComponentFactory.
 * @returns The generated routes.
 */
export function generateRestRoutesPolicyEnforcementPoint(
	baseRouteName: string,
	componentName: string
): IRestRoute[] {
	const pepInterceptRoute: IRestRoute<IPepInterceptRequest, IPepInterceptResponse> = {
		operationId: "pepIntercept",
		summary: "Intercept a request",
		tag: pepTags[0].name,
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
	return [pepInterceptRoute];
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

	const component = ComponentFactory.get<IPolicyEnforcementPointComponent>(componentName);
	const result = await component.intercept(
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
