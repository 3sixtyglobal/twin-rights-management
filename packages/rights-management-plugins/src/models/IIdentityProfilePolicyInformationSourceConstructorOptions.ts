// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Identity Profile Policy Information Source Component.
 */
export interface IIdentityProfilePolicyInformationSourceConstructorOptions {
	/**
	 * The logging component for logging policy source.
	 */
	loggingComponentType?: string;

	/**
	 * The component for retrieving identity profiles.
	 * @default identity-profile
	 */
	identityProfileComponentType?: string;
}
