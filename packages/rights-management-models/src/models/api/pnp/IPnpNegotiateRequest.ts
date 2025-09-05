// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IProof } from "@twin.org/standards-w3c-did";
import type { IPolicyContext } from "../../IPolicyContext";

/**
 * The request structure for negotiating a policy.
 */
export interface IPnpNegotiateRequest {
	/**
	 * The body parameters of the request.
	 */
	body: {
		/**
		 * The type of the asset being requested.
		 */
		assetType: string;

		/**
		 * The action being performed on the asset.
		 */
		action: string;

		/**
		 * The id of the item being requested.
		 */
		resourceId?: string;

		/**
		 * The context from the node making the request.
		 */
		context: IPolicyContext;

		/**
		 * Additional information provided by the requester to determine if a policy can be created.
		 */
		requesterInformation?: { [source: string]: IJsonLdNodeObject[] };

		/**
		 * The proof provided by the requester to support the policy creation.
		 */
		proof: IProof;
	};
}
