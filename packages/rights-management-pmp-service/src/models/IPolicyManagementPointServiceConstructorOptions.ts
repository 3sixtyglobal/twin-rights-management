// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Policy Management Point Component.
 */
export interface IPolicyManagementPointServiceConstructorOptions {
	/**
	 * The logging component for logging policy management.
	 */
	loggingComponentType?: string;

	/**
	 * The type of the policy administration point component.
	 * @default policy-administration-point
	 */
	policyAdministrationPointComponentType?: string;
}
