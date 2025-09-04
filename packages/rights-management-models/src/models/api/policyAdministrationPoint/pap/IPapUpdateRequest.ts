// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * The request structure for updating a policy.
 */
export interface IPapUpdateRequest {
	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The ID of the policy to update.
		 */
		id: string;
	};

	/**
	 * The body of the request - the policy to update (must include uid).
	 */
	body: IOdrlPolicy;
}
