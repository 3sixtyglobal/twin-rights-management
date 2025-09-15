// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { HeaderTypes, MimeTypes } from "@twin.org/web";
import type { IDataAccessQueryResponse } from "../../dap/jsonLd/IDataAccessQueryResponse";

/**
 * The response structure for querying item with the DAP.
 */
export interface IDapQueryResponse {
	/**
	 * The headers which can be used to determine the response data type.
	 */
	headers?: {
		[HeaderTypes.ContentType]: typeof MimeTypes.JsonLd | typeof MimeTypes.Json;
	};

	/**
	 * The body parameters of the request.
	 */
	body: IDataAccessQueryResponse;
}
