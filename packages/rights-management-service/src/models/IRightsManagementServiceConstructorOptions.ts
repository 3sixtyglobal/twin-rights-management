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

	/**
	 * The type of the Policy Negotiation Point (PNP) component.
	 * @default policy-negotiation-point
	 */
	policyNegotiationPointComponentType?: string;

	/**
	 * The type of the Policy Negotiation Admin Point (PNAP) component.
	 * @default policy-negotiation-admin-point
	 */
	policyNegotiationAdminPointComponentType?: string;
}
