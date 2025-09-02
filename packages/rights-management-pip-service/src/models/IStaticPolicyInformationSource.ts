// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { PolicyInformationAccessMode } from "@twin.org/rights-management-models";

/**
 * Configuration for the Static Policy Information Source Component.
 */
export interface IStaticPolicyInformationSource {
	/**
	 * Is the information public, if so it will be shared with negotiation requests.
	 */
	accessMode: PolicyInformationAccessMode;

	/**
	 * Information is only provided for the specified asset types/action combination.
	 * If undefined is provided matches all asset types/actions.
	 * If assetType is undefined matches all asset types.
	 * If action is undefined matches all actions.
	 */
	assetTypeActions?: { assetType?: string; action?: string }[];

	/**
	 * The objects containing the information.
	 */
	objects: IJsonLdNodeObject[];
}
