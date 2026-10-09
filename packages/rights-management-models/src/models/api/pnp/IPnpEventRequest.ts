// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolContractNegotiationEventMessage } from "@3sixty/standards-dataspace-protocol";
import type { HeaderTypes, MimeTypes } from "@3sixty/web";

/**
 * The request structure for requesting a contract negotiation event.
 */
export interface IPnpEventRequest {
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
		 * The identifier of the negotiation to target.
		 */
		id: string;
	};

	/**
	 * The body parameters of the request.
	 */
	body: IDataspaceProtocolContractNegotiationEventMessage;
}
