// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { PolicyDecision } from "./policyDecision";

/**
 * The information regarding a policy decision.
 */
export interface IPolicyDecision {
	/**
	 * The target object for the decision.
	 */
	target: string;

	/**
	 * The type of the proof.
	 */
	decision: PolicyDecision;
}
