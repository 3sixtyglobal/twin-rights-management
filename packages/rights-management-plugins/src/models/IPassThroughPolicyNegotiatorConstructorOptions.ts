// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Pass Through Policy Negotiator.
 */
export interface IPassThroughPolicyNegotiatorConstructorOptions {
	/**
	 * The logging component for policy negotiator.
	 */
	loggingComponentType?: string;

	/**
	 * Signal directAgreement (skip OFFERED/ACCEPTED) on handleOffer(); default true. Set false to keep the full negotiation cycle, e.g. during a staged rollout where counterparties may not yet accept a direct REQUESTED -> AGREED transition.
	 */
	directAgreement?: boolean;
}
