// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Policy Negotiation Point Component.
 */
export interface IPolicyNegotiationPointServiceConfig {
	/**
	 * The id of the identity method to use when signing/verifying negotiations.
	 * @default policy-negotiation-assertion
	 */
	negotiationMethodId?: string;
}
