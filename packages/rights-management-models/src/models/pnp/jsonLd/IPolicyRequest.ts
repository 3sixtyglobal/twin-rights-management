// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyInformation } from "../../pip/IPolicyInformation";
import type { RightsManagementContexts } from "../../rightsManagementContexts";
import type { RightsManagementTypes } from "../../rightsManagementTypes";

/**
 * The JSON-LD definition for a policy request.
 */
export interface IPolicyRequest {
	/**
	 * The JSON-LD context.
	 */
	"@context": typeof RightsManagementContexts.ContextRoot;

	/**
	 * The type of the request.
	 */
	type: typeof RightsManagementTypes.PolicyRequest;

	/**
	 * The provider id.
	 */
	providerPid?: string;

	/**
	 * The consumer id.
	 */
	consumerPid?: string;

	/**
	 * Additional information that can be used in the request.
	 */
	information?: IPolicyInformation;
}
