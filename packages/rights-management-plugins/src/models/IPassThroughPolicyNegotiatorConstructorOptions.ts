// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPassThroughPolicyNegotiatorConfig } from "./IPassThroughPolicyNegotiatorConfig.js";

/**
 * Options for the Pass Through Policy Negotiator.
 */
export interface IPassThroughPolicyNegotiatorConstructorOptions {
	/**
	 * The logging component for policy negotiator.
	 */
	loggingComponentType?: string;

	/**
	 * The configuration options for the pass through policy negotiator.
	 */
	config?: IPassThroughPolicyNegotiatorConfig;
}
