// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyEnforcementPointServiceConfig } from "./IPolicyEnforcementPointServiceConfig";

/**
 * Options for the Policy Enforcement Point Component.
 */
export interface IPolicyEnforcementPointServiceConstructorOptions {
	/**
	 * The logging component for logging policy enforcement.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The type of the policy decision point component.
	 * @default policy-decision-point
	 */
	policyDecisionPointComponentType?: string;

	/**
	 * The configuration for the Policy Enforcement Point Service.
	 */
	config?: IPolicyEnforcementPointServiceConfig;
}
