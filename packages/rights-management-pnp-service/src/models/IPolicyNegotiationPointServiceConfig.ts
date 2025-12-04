// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiationPointComponent } from "@twin.org/rights-management-models";

/**
 * Options for the Policy Negotiation Point Component.
 */
export interface IPolicyNegotiationPointServiceConfig {
	/**
	 * The url to send in negotiation messages as the callback address.
	 * This should be the externally reachable url of this PNP service.
	 */
	baseCallbackUrl: string;

	/**
	 * A method for creating a new instance of the policy negotiation point component.
	 * To be used when sending request remotely to another node.
	 */
	negotiationComponentCreator: (url: string) => Promise<IPolicyNegotiationPointComponent>;

	/**
	 * Override the default trust generator.
	 */
	overrideTrustGeneratorType?: string;
}
