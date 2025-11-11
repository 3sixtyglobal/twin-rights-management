// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The type of decision from a Policy Decision Point (PDP).
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyDecision = {
	/**
	 * Granted.
	 */
	Granted: "Granted",

	/**
	 * Denied.
	 */
	Denied: "Denied"
} as const;

/**
 * The type of decision from a Policy Decision Point (PDP).
 */
export type PolicyDecision = (typeof PolicyDecision)[keyof typeof PolicyDecision];
