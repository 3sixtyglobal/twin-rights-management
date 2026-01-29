// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The request structure for getting an agreement.
 */
export interface IPapGetAgreementRequest {
	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The ID of the agreement to get.
		 */
		id: string;
	};
}
