// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type {
	IPolicyLocator,
	PolicyInformationAccessMode
} from "@twin.org/rights-management-models";

/**
 * Configuration for the Static Policy Information Source Component.
 */
export interface IStaticPolicyInformationSource {
	/**
	 * Is the information public, if so it will be shared with negotiation requests.
	 */
	accessMode: PolicyInformationAccessMode;

	/**
	 * Information is only provided for the specified locator combination.
	 * If undefined is provided matches all resources.
	 */
	matchLocators?: IPolicyLocator[];

	/**
	 * The objects containing the information.
	 */
	objects: IJsonLdNodeObject[];
}
