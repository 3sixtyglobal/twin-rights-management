// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { RightsManagementContexts } from "../../rightsManagementContexts.js";
import type { RightsManagementTypes } from "../../rightsManagementTypes.js";

/**
 * The JSON-LD definition for the data access request with object.
 */
export interface IDataAccessRequestWithObject {
	/**
	 * The JSON-LD context.
	 */
	"@context": typeof RightsManagementContexts.ContextRoot;

	/**
	 * The type of the request.
	 */
	type: typeof RightsManagementTypes.DataAccessRequestWithObject;

	/**
	 * The asset type being requested.
	 */
	assetType?: string;

	/**
	 * The object being sent with the request.
	 */
	object: IJsonLdNodeObject;
}
