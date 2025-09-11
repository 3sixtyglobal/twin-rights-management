// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { DidContexts, IProof } from "@twin.org/standards-w3c-did";
import type { IPolicyLocator } from "../IPolicyLocator";
import type { IPolicyInformation } from "../pip/IPolicyInformation";
import type { RightsManagementContexts } from "../rightsManagementContexts";
import type { RightsManagementTypes } from "../rightsManagementTypes";

/**
 * The JSON-LD definition for the policy negotiation proof.
 */
export interface IPolicyNegotiationRequest extends IPolicyLocator {
	/**
	 * The JSON-LD context.
	 */
	"@context": [typeof DidContexts.ContextVCv2, typeof RightsManagementContexts.ContextRoot];

	/**
	 * The type of the proof.
	 */
	type: typeof RightsManagementTypes.PolicyNegotiationRequest;

	/**
	 * Additional information provided by the requester to determine if a policy can be created.
	 */
	information?: IPolicyInformation;

	/**
	 * The proof object.
	 */
	proof: IProof;
}
