// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Policy Enforcement Point Component.
 */
export interface IPolicyEnforcementPointServiceConstructorOptions {
	/**
	 * The logging component for logging policy enforcement.
	 */
	loggingComponentType?: string;

	/**
	 * The type of the policy decision point component.
	 * @default policy-decision-point
	 */
	policyDecisionPointComponentType?: string;

	/**
	 * The type of the policy administration point component.
	 * @default policy-administration-point
	 */
	policyAdministrationPointComponentType?: string;

	/**
	 * The type of the policy management point component.
	 * @default policy-management-point
	 */
	policyManagementPointComponentType?: string;
}
