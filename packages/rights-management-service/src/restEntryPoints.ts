// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRestRouteEntryPoint } from "@twin.org/api-models";
import {
	generateRestRoutesPolicyAdministrationPoint,
	papTags
} from "./policyAdministrationPointRoutes.js";
import {
	generateRestRoutesPolicyNegotiationAdminPoint,
	pnapTags
} from "./policyNegotiationAdminPointRoutes.js";
import {
	generateRestRoutesPolicyNegotiationPoint,
	pnpTags
} from "./policyNegotiationPointRoutes.js";

/**
 * Entry points for the REST API.
 */
export const restEntryPoints: IRestRouteEntryPoint[] = [
	{
		name: "policy-administration-point",
		defaultBaseRoute: "rights-management",
		tags: papTags,
		generateRoutes: generateRestRoutesPolicyAdministrationPoint
	},
	{
		name: "policy-negotiation-point",
		defaultBaseRoute: "rights-management",
		tags: pnpTags,
		generateRoutes: generateRestRoutesPolicyNegotiationPoint
	},
	{
		name: "policy-negotiation-admin-point",
		defaultBaseRoute: "rights-management",
		tags: pnapTags,
		generateRoutes: generateRestRoutesPolicyNegotiationAdminPoint
	}
];
