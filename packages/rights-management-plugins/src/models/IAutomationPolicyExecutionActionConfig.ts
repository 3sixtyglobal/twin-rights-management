// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Automation Policy Execution Action Component.
 */
export interface IAutomationPolicyExecutionActionConfig {
	/**
	 * The policy decision stages to trigger the automation actions, if undefined defaults to "inform".
	 */
	triggerActions?: string[];
}
