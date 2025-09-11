// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The stage at which a PXP is executed in the PDP.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyDecisionStage = {
	/**
	 * Before Decision.
	 */
	Before: "before",

	/**
	 * After Decision.
	 */
	After: "after"
} as const;

/**
 * The stage at which a PXP is executed in the PDP.
 */
export type PolicyDecisionStage = (typeof PolicyDecisionStage)[keyof typeof PolicyDecisionStage];
