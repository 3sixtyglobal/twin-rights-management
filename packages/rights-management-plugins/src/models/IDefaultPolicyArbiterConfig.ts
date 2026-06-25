// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the Default Policy Arbiter.
 */
export interface IDefaultPolicyArbiterConfig {
	/**
	 * The maximum depth to traverse when resolving inherited policies.
	 * @default 10
	 */
	maxInheritanceDepth?: number;
}
