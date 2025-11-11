// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ILoggingPolicyExecutionActionConfig } from "./ILoggingPolicyExecutionActionConfig.js";

/**
 * Options for the Logging Policy Execution Action.
 */
export interface ILoggingPolicyExecutionActionConstructorOptions {
	/**
	 * The logging component for logging policy execution.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The configuration for the logging policy execution.
	 */
	config?: ILoggingPolicyExecutionActionConfig;
}
