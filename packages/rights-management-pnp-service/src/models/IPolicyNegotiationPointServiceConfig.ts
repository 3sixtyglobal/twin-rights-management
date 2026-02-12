// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Policy Negotiation Point Component.
 */
export interface IPolicyNegotiationPointServiceConfig {
	/**
	 * The path to send in negotiation messages as the callback address.
	 * Will be combined with the public origin url from hosting component.
	 */
	callbackPath: string;

	/**
	 * Override the default trust generator.
	 */
	overrideTrustGeneratorType?: string;
}
