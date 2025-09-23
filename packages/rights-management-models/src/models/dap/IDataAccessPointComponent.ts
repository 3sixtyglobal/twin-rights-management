// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import type { IIdentityAuthenticationActionRequest } from "@twin.org/identity-authentication";
import type { IDataAccessHandler } from "./IDataAccessHandler";

/**
 * Interface describing a Data Access Point (DAP) contract.
 * When receiving a request from another component, the DAP will perform
 * CRUD operations with enforcement of relevant policies using PEP.
 * The registered data handlers support specific asset types.
 */
export interface IDataAccessPointComponent extends IComponent {
	/**
	 * Create an item.
	 * @param assetType The type of the item to create.
	 * @param item The item to create.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The id of the item created, for some items this is supplied in the `item`.
	 */
	create(
		assetType: string,
		item: IJsonLdNodeObject,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<string>;

	/**
	 * Get an item.
	 * @param assetType The type of the item to retrieve.
	 * @param id The ID of the item to retrieve.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The item retrieved if the policies allow it.
	 */
	get(
		assetType: string,
		id: string,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IJsonLdNodeObject>;

	/**
	 * Update an item.
	 * @param assetType The type of the item to update.
	 * @param item The item to update.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns Nothing.
	 */
	update(
		assetType: string,
		item: IJsonLdNodeObject,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<void>;

	/**
	 * Remove an item.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns Nothing.
	 */
	remove(
		assetType: string,
		id: string,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<void>;

	/**
	 * Query for items.
	 * @param assetType The type of the item to query.
	 * @param conditions The conditions to apply to the query.
	 * @param cursor The cursor for pagination.
	 * @param options Additional options which might be supported by the handler.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The items matching the query and cursor if there are more items.
	 */
	query(
		assetType: string,
		conditions: EntityCondition<IJsonLdNodeObject> | undefined,
		cursor: string | undefined,
		options: unknown | undefined,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<{
		items: IJsonLdNodeObject[];
		cursor?: string;
	}>;

	/**
	 * Register a handler to use for a specific asset type.
	 * @param handlerId The id of the handler to register.
	 * @param handler The handler to register.
	 * @returns Nothing.
	 */
	registerHandler(handlerId: string, handler: IDataAccessHandler): Promise<void>;

	/**
	 * Unregister a handler from the handling.
	 * @param handlerId The id of the handler to unregister.
	 * @returns Nothing.
	 */
	unregisterHandler(handlerId: string): Promise<void>;
}
