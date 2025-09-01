// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Context information to be used when making a policy decision.
 */
export interface IPolicyContext {
	/**
	 * The user identity to use in the decision making.
	 */
	userIdentity?: string;

	/**
	 * The node identity to use in the decision making.
	 */
	nodeIdentity?: string;
}
