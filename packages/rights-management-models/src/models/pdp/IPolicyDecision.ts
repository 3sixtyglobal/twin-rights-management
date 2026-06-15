// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { PolicyDecision } from "./policyDecision.js";

/**
 * The information regarding a policy decision.
 */
export interface IPolicyDecision {
	/**
	 * The target object for the decision, using JSON-path syntax.
	 */
	target: string;

	/**
	 * The outcome of the policy decision.
	 */
	decision: PolicyDecision;

	/**
	 * The value to replace with, if decision is Replace.
	 */
	replaceValue?: unknown;
}
