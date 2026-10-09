// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolContractNegotiationError } from "@3sixty/standards-dataspace-protocol";
import type { HeaderTypes, HttpStatusCode, MimeTypes } from "@3sixty/web";

/**
 * The response structure for negotiating a policy.
 */
export interface IPnpContractResponse {
	/**
	 * The headers which can be used to determine the response data type.
	 */
	headers?: {
		[HeaderTypes.ContentType]: typeof MimeTypes.JsonLd | typeof MimeTypes.Json;
	};

	/**
	 * Response status code.
	 */
	statusCode?: HttpStatusCode;

	/**
	 * The error if there was one.
	 */
	body?: IDataspaceProtocolContractNegotiationError;
}
