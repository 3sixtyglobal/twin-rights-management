// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyExecutionPointServiceConfig } from "./IPolicyExecutionPointServiceConfig.js";

/**
 * Options for the Policy Execution Point Component.
 */
export interface IPolicyExecutionPointServiceConstructorOptions {
	/**
	 * The logging component for logging policy execution.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * Configuration options for the policy execution point service.
	 */
	config?: IPolicyExecutionPointServiceConfig;
}
