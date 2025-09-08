// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { DidContexts, IProof } from "@twin.org/standards-w3c-did";
import type { RightsManagementContexts } from "./rightsManagementContexts";
import type { RightsManagementTypes } from "./rightsManagementTypes";

/**
 * The JSON-LD definition for the policy negotiation proof.
 */
export interface IPolicyNegotiationRequest {
	/**
	 * The JSON-LD context.
	 */
	"@context": [typeof RightsManagementContexts.ContextRoot, typeof DidContexts.ContextVCv2];

	/**
	 * The type of the proof.
	 */
	type: typeof RightsManagementTypes.PolicyNegotiationRequest;

	/**
	 * The asset type.
	 */
	assetType: string;

	/**
	 * The action type.
	 */
	action: string;

	/**
	 * The specific resource id or can be left undefined for a whole asset class.
	 */
	resourceId?: string;

	/**
	 * The id of the the node.
	 */
	nodeIdentity: string;

	/**
	 * Additional information provided by the requester to determine if a policy can be created.
	 */
	information?: { [source: string]: IJsonLdNodeObject[] };

	/**
	 * The proof object.
	 */
	proof: IProof;
}
