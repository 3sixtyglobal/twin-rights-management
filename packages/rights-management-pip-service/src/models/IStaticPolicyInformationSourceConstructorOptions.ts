// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IStaticPolicyInformationSourceConfig } from "./IStaticPolicyInformationSourceConfig.js";

/**
 * Options for the Static Policy Information Source Component.
 */
export interface IStaticPolicyInformationSourceConstructorOptions {
	/**
	 * The logging component for logging policy source.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The configuration.
	 */
	config?: IStaticPolicyInformationSourceConfig;
}
