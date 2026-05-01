// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Policy Negotiation Point Component.
 */
export interface IPolicyNegotiationPointServiceConfig {
	/**
	 * The path to send in negotiation messages as the callback address.
	 * Combined with the public origin url at runtime to form the full callback URL.
	 */
	callbackPath?: string;

	/**
	 * Override the default trust generator.
	 */
	overrideTrustGeneratorType?: string;

	/**
	 * Whether to include error details in the responses from the admin point.
	 * @default false
	 */
	includeErrorDetails?: boolean;
}
