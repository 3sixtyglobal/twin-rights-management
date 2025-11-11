// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { HeaderTypes, MimeTypes } from "@twin.org/web";

/**
 * The response structure for getting an item with the DAP.
 */
export interface IDapGetResponse {
	/**
	 * The headers which can be used to determine the response data type.
	 */
	headers?: {
		[HeaderTypes.ContentType]: typeof MimeTypes.JsonLd | typeof MimeTypes.Json;
	};

	/**
	 * The body parameters of the request.
	 */
	body: IJsonLdNodeObject;
}
