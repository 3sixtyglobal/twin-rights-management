// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiationRequestPointServiceConfig } from "./IPolicyNegotiationRequestPointServiceConfig";

/**
 * Options for the Policy Negotiation Request Point Component.
 */
export interface IPolicyNegotiationRequestPointServiceConstructorOptions {
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
	 * The type of the policy information point component.
	 * @default policy-information-point
	 */
	policyInformationPointComponentType?: string;

	/**
	 * Configuration options for the policy negotiation request point service.
	 */
	config: IPolicyNegotiationRequestPointServiceConfig;
}
