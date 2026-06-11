// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Identity Policy Information Source Component.
 */
export interface IIdentityPolicyInformationSourceConstructorOptions {
	/**
	 * The logging component for logging policy source.
	 */
	loggingComponentType?: string;

	/**
	 * The component for resolving identities.
	 * @default identity-resolver
	 */
	identityResolverComponentType?: string;
}
