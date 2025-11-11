// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import type { RightsManagementContexts } from "../../rightsManagementContexts.js";
import type { RightsManagementTypes } from "../../rightsManagementTypes.js";

/**
 * The JSON-LD definition for the data access request.
 */
export interface IDataAccessQuery {
	/**
	 * The JSON-LD context.
	 */
	"@context": typeof RightsManagementContexts.ContextRoot;

	/**
	 * The type of the request.
	 */
	type: typeof RightsManagementTypes.DataAccessQuery;

	/**
	 * The asset type being requested.
	 */
	assetType?: string;

	/**
	 * The conditions to filter the items.
	 */
	conditions?: EntityCondition<IJsonLdNodeObject>;

	/**
	 * The cursor for pagination, if any.
	 */
	cursor?: string;

	/**
	 * Additional options which might be supported by the handler.
	 */
	options?: unknown;
}
