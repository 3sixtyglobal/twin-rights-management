// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * An interface for locating policies.
 */
export interface IPolicyLocator {
	/**
	 * The assignee for the locator.
	 */
	assignee?: string;

	/**
	 * The action for the locator.
	 */
	action?: string;

	/**
	 * The asset type for the locator.
	 */
	assetType?: string;

	/**
	 * A resource identifier for the locator.
	 */
	resourceId?: string;
}
