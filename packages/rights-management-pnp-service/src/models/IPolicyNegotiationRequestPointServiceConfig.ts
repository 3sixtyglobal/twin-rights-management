// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiationPointComponent } from "@twin.org/rights-management-models";

/**
 * Options for the Policy Negotiation RequestPoint Component.
 */
export interface IPolicyNegotiationRequestPointServiceConfig {
	/**
	 * The id of the identity method to use when signing/verifying negotiations.
	 * @default policy-negotiation-assertion
	 */
	negotiationMethodId?: string;

	/**
	 * A method for creating a new instance of the policy negotiation point component.
	 * To be used when sending request remotely to another node.
	 */
	negotiationComponentCreator: (url: string) => Promise<IPolicyNegotiationPointComponent>;
}
