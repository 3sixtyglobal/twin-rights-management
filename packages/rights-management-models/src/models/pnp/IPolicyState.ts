// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { PolicyNegotiationStatus } from "./policyNegotiationStatus";
import type { RightsManagementContexts } from "../rightsManagementContexts";
import type { RightsManagementTypes } from "../rightsManagementTypes";

/**
 * The state of the policy negotiation.
 */
export interface IPolicyState {
	/**
	 * The JSON-LD context.
	 */
	"@context": typeof RightsManagementContexts.ContextRoot;

	/**
	 * The type of the proof.
	 */
	type: typeof RightsManagementTypes.PolicyState;

	/**
	 * The id of the policy.
	 */
	id: string;

	/**
	 * The current status of the policy negotiation.
	 */
	status: PolicyNegotiationStatus;

	/**
	 * A reason which might be provided if the negotiation status is not approved.
	 */
	reason?: string;

	/**
	 * The expiration date of the policy created by the negotiation if it was approved, and it has an expiration date.
	 */
	expires?: string;
}
