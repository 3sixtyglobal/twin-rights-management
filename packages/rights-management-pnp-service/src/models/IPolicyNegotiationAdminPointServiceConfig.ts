// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Policy Negotiation Admin Point Component.
 */
export interface IPolicyNegotiationAdminPointServiceConfig {
	/**
	 * How long should the states live in the store after a negotiation.
	 * @default 1440
	 */
	negotiationStateTtlMinutes?: number;

	/**
	 * Timeout in milliseconds to wait when acquiring a mutex lock.
	 */
	mutexTimeoutMs?: number;
}
