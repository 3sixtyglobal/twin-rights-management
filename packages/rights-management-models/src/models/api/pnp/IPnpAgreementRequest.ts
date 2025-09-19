// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IIdsContractAgreementMessage } from "@twin.org/standards-ids-contract-negotiation";
import type { HeaderTypes, MimeTypes } from "@twin.org/web";

/**
 * The request structure for sending a contract negotiation agreement.
 */
export interface IPnpAgreementRequest {
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
		 * The identifier of the negotiation to target.
		 */
		id: string;
	};

	/**
	 * The body parameters of the request.
	 */
	body: IIdsContractAgreementMessage;
}
