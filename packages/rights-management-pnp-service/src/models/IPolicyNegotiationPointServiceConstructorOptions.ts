// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiationPointServiceConfig } from "./IPolicyNegotiationPointServiceConfig";

/**
 * Options for the Policy Negotiation Point Component.
 */
export interface IPolicyNegotiationPointServiceConstructorOptions {
	/**
	 * The logging component for logging policy negotiation.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The identity connector component for managing identities.
	 * @default identity
	 */
	identityConnectorType?: string;

	/**
	 * The type of the policy negotiation administration point component.
	 * @default policy-negotiation-admin-point
	 */
	policyNegotiationAdministrationPointComponentType?: string;

	/**
	 * The type of the policy administration point component.
	 * @default policy-administration-point
	 */
	policyAdministrationPointComponentType?: string;

	/**
	 * The type of the policy information point component.
	 * @default policy-information-point
	 */
	policyInformationPointComponentType?: string;

	/**
	 * Configuration options for the policy negotiation point service.
	 */
	config?: IPolicyNegotiationPointServiceConfig;
}
