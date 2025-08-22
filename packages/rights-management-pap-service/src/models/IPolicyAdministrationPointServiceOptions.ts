// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Policy Administration Point Component.
 */
export interface IPolicyAdministrationPointServiceOptions {
	/**
	 * The logging component for logging administration actions.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The entity storage component for storing policies.
	 * @default odrl-policy
	 */
	odrlPolicyEntityStorageType?: string;
}
