// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { RightsManagementContexts } from "../../rightsManagementContexts";
import type { RightsManagementTypes } from "../../rightsManagementTypes";

/**
 * The JSON-LD definition for the data access request.
 */
export interface IDataAccessRequest {
	/**
	 * The JSON-LD context.
	 */
	"@context": typeof RightsManagementContexts.ContextRoot;

	/**
	 * The type of the request.
	 */
	type: typeof RightsManagementTypes.DataAccessRequest;

	/**
	 * The asset type being requested.
	 */
	assetType?: string;

	/**
	 * The identifier of the object being requested.
	 */
	id: string;
}
