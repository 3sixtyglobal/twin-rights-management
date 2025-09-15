// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { HeaderTypes, MimeTypes } from "@twin.org/web";
import type { IPolicyState } from "../../pnp/jsonLd/IPolicyState";

/**
 * The response structure for negotiation state request.
 */
export interface IPnpNegotiationStateResponse {
	/**
	 * The headers which can be used to determine the response data type.
	 */
	headers?: {
		[HeaderTypes.ContentType]: typeof MimeTypes.JsonLd | typeof MimeTypes.Json;
	};

	/**
	 * The state of the policy.
	 */
	body: IPolicyState;
}
