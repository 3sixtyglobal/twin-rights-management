// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IContractNegotiationTerminationMessage } from "@twin.org/standards-dataspace-protocol";
import type { HeaderTypes, MimeTypes } from "@twin.org/web";

/**
 * The request structure for requesting a contract negotiation termination.
 */
export interface IPnpTerminateRequest {
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
	body: IContractNegotiationTerminationMessage;
}
