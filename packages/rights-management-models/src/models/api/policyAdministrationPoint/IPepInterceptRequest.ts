// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The request structure for intercepting a request and enforcing a policy.
 */
export interface IPepInterceptRequest {
	/**
	 * The body parameters of the request.
	 */
	body: {
		/**
		 * The type of the asset to enforce the policy on.
		 */
		assetType: string;

		/**
		 * The action to perform on the asset.
		 */
		action: string;

		/**
		 * The context in which the action is being performed.
		 * userIdentity and nodeIdentity should not be passed as they will
		 * be populated by the authenticated context on the server side.
		 */
		context?: unknown;

		/**
		 * The data to include in the request.
		 */
		data?: unknown;
	};
}
