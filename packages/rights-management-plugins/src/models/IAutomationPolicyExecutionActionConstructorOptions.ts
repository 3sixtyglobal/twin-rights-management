// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAutomationPolicyExecutionActionConfig } from "./IAutomationPolicyExecutionActionConfig.js";

/**
 * Options for the Automation Policy Execution Action.
 */
export interface IAutomationPolicyExecutionActionConstructorOptions {
	/**
	 * The automation component for executing automation policies.
	 * @default automation
	 */
	automationComponentType?: string;

	/**
	 * The configuration for the automation policy execution.
	 */
	config?: IAutomationPolicyExecutionActionConfig;
}
