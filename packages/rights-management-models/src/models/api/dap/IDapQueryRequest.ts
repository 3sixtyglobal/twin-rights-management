// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { HeaderTypes, MimeTypes } from "@twin.org/web";
import type { IDataAccessQuery } from "../../dap/jsonLd/IDataAccessQuery.js";

/**
 * The request structure for querying items with the DAP.
 */
export interface IDapQueryRequest {
	/**
	 * The headers which can be used to determine the response data type.
	 */
	headers: {
		[HeaderTypes.Accept]?: typeof MimeTypes.JsonLd | typeof MimeTypes.Json;
		[HeaderTypes.Authorization]?: string;
	};

	/**
	 * The path parameters of the request.
	 */
	pathParams: {
		/**
		 * The type of the item being requested.
		 */
		assetType: string;
	};

	/**
	 * The body parameters of the request.
	 */
	body: IDataAccessQuery;
}
