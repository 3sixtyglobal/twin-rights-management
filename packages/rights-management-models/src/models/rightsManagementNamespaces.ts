// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The namespaces for rights management.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const RightsManagementNamespaces = {
	/**
	 * Policy.
	 */
	Policy: "policy",

	/**
	 * Contract Negotiation.
	 */
	ContractNegotiation: "contract-negotiation"
} as const;

/**
 * The namespaces for rights management.
 */
export type RightsManagementNamespaces =
	(typeof RightsManagementNamespaces)[keyof typeof RightsManagementNamespaces];
