// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the Pass Through Policy Negotiator.
 */
export interface IPassThroughPolicyNegotiatorConfig {
	/**
	 * Signal directAgreement (skip OFFERED/ACCEPTED) on handleOffer(); default true. Set false to keep the full negotiation cycle, e.g. during a staged rollout where counterparties may not yet accept a direct REQUESTED -> AGREED transition.
	 */
	directAgreement?: boolean;
}
