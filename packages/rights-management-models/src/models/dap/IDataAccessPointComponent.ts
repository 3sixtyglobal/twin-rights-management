// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";

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
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The id of the item created, for some items this is supplied in the `item`.
	 */
	create(assetType: string, item: IJsonLdNodeObject, trustPayload: unknown): Promise<string>;

	/**
	 * Get an item.
	 * @param assetType The type of the item to retrieve.
	 * @param id The ID of the item to retrieve.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The item retrieved if the policies allow it.
	 */
	get(assetType: string, id: string, trustPayload: unknown): Promise<IJsonLdNodeObject>;

	/**
	 * Update an item.
	 * @param assetType The type of the item to update.
	 * @param item The item to update.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns Nothing.
	 */
	update(assetType: string, item: IJsonLdNodeObject, trustPayload: unknown): Promise<void>;

	/**
	 * Remove an item.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns Nothing.
	 */
	remove(assetType: string, id: string, trustPayload: unknown): Promise<void>;

	/**
	 * Query for items.
	 * @param assetType The type of the item to query.
	 * @param conditions The conditions to apply to the query.
	 * @param cursor The cursor for pagination.
	 * @param options Additional options which might be supported by the handler.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The items matching the query and cursor if there are more items.
	 */
	query(
		assetType: string,
		conditions: EntityCondition<IJsonLdNodeObject> | undefined,
		cursor: string | undefined,
		options: unknown | undefined,
		trustPayload: unknown
	): Promise<{
		items: IJsonLdNodeObject[];
		cursor?: string;
	}>;
}
