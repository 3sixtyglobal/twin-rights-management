// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyContext } from "./IPolicyContext";
import type { IPolicyState } from "./IPolicyState";

/**
 * Interface describing a Policy Negotiator.
 */
export interface IPolicyNegotiator {
	/**
	 * Determines if the negotiator can handle the specified asset type and action.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @returns True if the negotiator can handle the asset type and action, false otherwise.
	 */
	canNegotiate(assetType: string, action: string): boolean;

	/**
	 * Determines if a policy can be created for the requested resource.
	 * @param policyId The policy id to use if creating a new policy.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param resourceId The ID of the resource being requested, can be empty if asset type access requested.
	 * @param context The context from the requesting node.
	 * @param requesterInformation Information provided by the requester to determine if a policy can be created.
	 * @returns The state of the policy and the actual policy if it was approved.
	 */
	negotiate<C extends IPolicyContext = IPolicyContext>(
		policyId: string,
		assetType: string,
		action: string,
		resourceId: string | undefined,
		context: C,
		requesterInformation: { [source: string]: IJsonLdNodeObject[] } | undefined
	): Promise<{
		state: IPolicyState;
		policy?: IOdrlPolicy;
	}>;
}
