// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IIdentityAuthenticationActionRequest } from "@twin.org/identity-authentication";
import type { IIdsContractRequestMessage } from "@twin.org/standards-ids-contract-negotiation";
import type { HeaderTypes, MimeTypes } from "@twin.org/web";

/**
 * The request structure for requesting a contract negotiation.
 */
export interface IPnpNegotiateRequest {
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
	pathParams?: {
		/**
		 * The identifier of the contract negotiation to be retrieved, can be undefined.
		 */
		id?: string;
	};

	/**
	 * The body parameters of the request.
	 */
	body: IIdsContractRequestMessage;

	/**
	 * The action request used in the verifiable credential.
	 */
	authentication: IIdentityAuthenticationActionRequest;
}
