// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiationPointServiceConfig } from "./IPolicyNegotiationPointServiceConfig.js";

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
	 * The type of the trust component.
	 * @default trust
	 */
	trustComponentType?: string;

	/**
	 * The type of the negotiation component which can be constructed with a url.
	 * To be used when sending request remotely to another node.
	 * @default policy-negotiation-point-remote
	 */
	policyNegotiationPointRemoteComponentType?: string;

	/**
	 * Configuration options for the policy negotiation point service.
	 */
	config: IPolicyNegotiationPointServiceConfig;
}
