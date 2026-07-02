// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the Default Policy Enforcement Processor.
 */
export interface IDefaultPolicyEnforcementProcessorConfig {
	/**
	 * Top-level keys that are treated as document-structural fields and are
	 * passed through unconditionally, regardless of policy decisions.
	 * Defaults to the standard JSON-LD envelope keys: @context, @type, @id, type, id.
	 */
	structuralKeys?: string[];
}
