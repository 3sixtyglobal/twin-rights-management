// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { HeaderTypes, MimeTypes } from "@twin.org/web";
import type { IPolicyRequest } from "../../pnp/IPolicyRequest";

/**
 * The request structure for negotiating a policy.
 */
export interface IPnpNegotiationStateRequest {
	/**
	 * The headers which can be used to determine the response data type.
	 */
	headers?: {
		[HeaderTypes.Accept]: typeof MimeTypes.JsonLd | typeof MimeTypes.Json;
	};

	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The ID of the policy being requested.
		 */
		policyId: string;
	};

	/**
	 * The body of the request.
	 */
	body: Omit<IPolicyRequest, "id">;
}
