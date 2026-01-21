// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The LD Contexts concerning Rights Management.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const RightsManagementContexts = {
	/**
	 * The canonical RDF namespace URI.
	 */
	Namespace: "https://schema.twindev.org/rights-management/",

	/**
	 * The value to use in @context.
	 */
	Context: "https://schema.twindev.org/rights-management/",

	/**
	 * The JSON-LD Context URL.
	 */
	JsonLdContext: "https://schema.twindev.org/rights-management/types.jsonld"
} as const;

/**
 * The LD Contexts concerning Rights Management.
 */
export type RightsManagementContexts =
	(typeof RightsManagementContexts)[keyof typeof RightsManagementContexts];
