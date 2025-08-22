// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The constructor options for the RightsManagementService.
 */
export interface IRightsManagementServiceConstructorOptions {
	/**
	 * The type of the Policy Administration Point (PAP) component.
	 * @default policy-administration-point
	 */
	policyAdministrationPointComponentType?: string;

	/**
	 * The type of the Policy Enforcement Point (PEP) component.
	 * @default policy-enforcement-point
	 */
	policyEnforcementPointComponentType?: string;
}
