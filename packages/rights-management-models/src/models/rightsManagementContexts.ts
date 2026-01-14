// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The LD Contexts concerning Rights Management.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const RightsManagementContexts = {
	/**
	 * The Namespace.
	 */
	Namespace: "https://schema.twindev.org/rights-management"
} as const;

/**
 * The LD Contexts concerning Rights Management.
 */
export type RightsManagementContexts =
	(typeof RightsManagementContexts)[keyof typeof RightsManagementContexts];
