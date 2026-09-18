// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Policy Administration Point Component.
 */
export interface IPolicyAdministrationPointServiceConstructorOptions {
	/**
	 * The logging component for logging administration actions.
	 */
	loggingComponentType?: string;

	/**
	 * The entity storage component for storing policies.
	 * @default odrl-policy
	 */
	odrlPolicyEntityStorageType?: string;

	/**
	 * The entity storage component for storing policy indexes.
	 * @default odrl-policy-index
	 */
	odrlPolicyIndexEntityStorageType?: string;
}
