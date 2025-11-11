// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { HeaderTypes, MimeTypes } from "@twin.org/web";
import type { IDataAccessRequestWithObject } from "../../dap/jsonLd/IDataAccessRequestWithObject.js";

/**
 * The request structure for updating an item with the DAP.
 */
export interface IDapUpdateRequest {
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
		 * The type of the item being updated.
		 */
		assetType: string;

		/**
		 * The id of the item being updated.
		 */
		id: string;
	};

	/**
	 * The body parameters of the updated.
	 */
	body: IDataAccessRequestWithObject;
}
