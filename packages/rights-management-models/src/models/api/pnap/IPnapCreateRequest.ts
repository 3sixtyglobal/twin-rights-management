// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The request structure for creating a policy negotiation entry.
 */
export interface IPnapCreateRequest {
	/**
	 * The partial negotiation to pre-register.
	 */
	body: {
		/**
		 * The consumer-side negotiation identifier (DSP consumerPid).
		 */
		id: string;
	};
}
