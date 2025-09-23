// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IIdentityAuthenticationActionRequest } from "@twin.org/identity-authentication";
import type { HeaderTypes, MimeTypes } from "@twin.org/web";
import type { IDataAccessRequestWithObject } from "../../dap/jsonLd/IDataAccessRequestWithObject";

/**
 * The request structure for creating an item with the DAP.
 */
export interface IDapCreateRequest {
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
		 * The type of the item being created.
		 */
		assetType: string;
	};

	/**
	 * The body parameters of the request.
	 */
	body: IDataAccessRequestWithObject;

	/**
	 * The action request used in the verifiable credential.
	 */
	authentication: IIdentityAuthenticationActionRequest;
}
