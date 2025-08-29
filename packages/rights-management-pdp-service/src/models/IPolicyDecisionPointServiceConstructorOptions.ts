// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Policy Decision Point Component.
 */
export interface IPolicyDecisionPointServiceConstructorOptions {
	/**
	 * The logging component for logging policy decisions.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The type of the policy information point component.
	 * @default policy-information-point
	 */
	policyInformationPointComponentType?: string;

	/**
	 * The type of the policy management point component.
	 * @default policy-management-point
	 */
	policyManagementPointComponentType?: string;

	/**
	 * The type of the policy execution point component.
	 * @default policy-execution-point
	 */
	policyExecutionPointComponentType?: string;
}
