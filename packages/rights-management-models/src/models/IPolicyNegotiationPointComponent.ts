// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IProof } from "@twin.org/standards-w3c-did";
import type { IPolicyNegotiator } from "./IPolicyNegotiator";
import type { IPolicyState } from "./IPolicyState";

/**
 * Interface describing a Policy Negotiation Point (PNP) contract.
 * When receiving a request from another component, the PNP will negotiate the terms
 * of the request and determine the appropriate policies to create.
 */
export interface IPolicyNegotiationPointComponent extends IComponent {
	/**
	 * Processes an incoming negotiation request for the resource.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param resourceId The ID of the resource being requested, can be empty if asset type access requested.
	 * @param nodeIdentity The identity of the node requesting the negotiation.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param proof The proof provided by the requester to support the policy creation.
	 * @returns The state of the policy.
	 */
	negotiate(
		assetType: string,
		action: string,
		resourceId: string | undefined,
		nodeIdentity: string,
		information: { [source: string]: IJsonLdNodeObject[] } | undefined,
		proof: IProof
	): Promise<IPolicyState>;

	/**
	 * Retrieves the current state of a policy.
	 * @param policyId The ID of the policy to retrieve the state for.
	 * @param nodeIdentity The identity of the node requesting the state retrieval.
	 * @param proof The proof provided by the requester to support the state retrieval.
	 * @returns The current state of the policy.
	 */
	negotiationState(policyId: string, nodeIdentity: string, proof: IProof): Promise<IPolicyState>;

	/**
	 * Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @param nodeIdentity The identity of the node requesting the cancellation.
	 * @param proof The proof provided by the requester to support the cancellation.
	 * @returns Nothing.
	 */
	negotiationCancel(policyId: string, nodeIdentity: string, proof: IProof): Promise<void>;

	/**
	 * Register a negotiator to use for handling data.
	 * @param negotiatorId The id of the negotiator to register.
	 * @param negotiator The negotiator to register.
	 * @returns Nothing.
	 */
	registerNegotiator(negotiatorId: string, negotiator: IPolicyNegotiator): Promise<void>;

	/**
	 * Unregister a negotiator from the handling.
	 * @param negotiatorId The id of the negotiator to unregister.
	 * @returns Nothing.
	 */
	unregisterNegotiator(negotiatorId: string): Promise<void>;
}
