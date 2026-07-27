// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDefaultPolicyEnforcementProcessorConfig } from "./IDefaultPolicyEnforcementProcessorConfig.js";

/**
 * Options for the Default Policy Enforcement Processor.
 */
export interface IDefaultPolicyEnforcementProcessorConstructorOptions {
	/**
	 * The logging component for policy enforcement processor.
	 */
	loggingComponentType?: string;

	/**
	 * The configuration options for the default policy enforcement processor.
	 */
	config?: IDefaultPolicyEnforcementProcessorConfig;
}
