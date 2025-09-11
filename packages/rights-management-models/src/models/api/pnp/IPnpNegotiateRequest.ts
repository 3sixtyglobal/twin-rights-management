// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { HeaderTypes, MimeTypes } from "@twin.org/web";
import type { IPolicyNegotiationRequest } from "../../pnp/IPolicyNegotiationRequest";

/**
 * The request structure for negotiating a policy.
 */
export interface IPnpNegotiateRequest {
	/**
	 * The headers which can be used to determine the response data type.
	 */
	headers?: {
		[HeaderTypes.Accept]: typeof MimeTypes.JsonLd | typeof MimeTypes.Json;
	};

	/**
	 * The body parameters of the request.
	 */
	body: IPolicyNegotiationRequest;
}
