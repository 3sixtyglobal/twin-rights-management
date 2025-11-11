// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyInformationPointServiceConfig } from "./IPolicyInformationPointServiceConfig.js";

/**
 * Options for the Policy Information Point Component.
 */
export interface IPolicyInformationPointServiceConstructorOptions {
	/**
	 * The logging component for logging policy information.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The configuration for the Policy Information Point Component.
	 */
	config?: IPolicyInformationPointServiceConfig;
}
