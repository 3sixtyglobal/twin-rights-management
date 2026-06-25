// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The type of decision from a Policy Decision Point (PDP).
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyDecision = {
	/**
	 * Granted - the property in the original data can be accessed.
	 */
	Granted: "Granted",

	/**
	 * Denied - the property in the original data can not be accessed.
	 */
	Denied: "Denied",

	/**
	 * Replace - the property should be replaced with a new value.
	 */
	Replace: "Replace"
} as const;

/**
 * The type of decision from a Policy Decision Point (PDP).
 */
export type PolicyDecision = (typeof PolicyDecision)[keyof typeof PolicyDecision];
