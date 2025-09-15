// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { HeaderTypes, MimeTypes } from "@twin.org/web";

/**
 * The request structure for getting an item with the DAP.
 */
export interface IDapGetRequest {
	/**
	 * The headers which can be used to determine the response data type.
	 */
	headers: {
		[HeaderTypes.Accept]?: typeof MimeTypes.JsonLd | typeof MimeTypes.Json;
		[HeaderTypes.Authorization]: string;
	};

	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The type of the item being requested.
		 */
		assetType: string;

		/**
		 * The id of the item being requested.
		 */
		id: string;
	};
}
