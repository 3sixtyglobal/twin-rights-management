// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { RightsManagementContexts } from "../../rightsManagementContexts";
import type { RightsManagementTypes } from "../../rightsManagementTypes";

/**
 * The JSON-LD definition for a proof request.
 */
export interface IPolicyRequest {
	/**
	 * The JSON-LD context.
	 */
	"@context": typeof RightsManagementContexts.ContextRoot;

	/**
	 * The type of the proof.
	 */
	type: typeof RightsManagementTypes.PolicyRequest;

	/**
	 * The id of the policy.
	 */
	id: string;
}
