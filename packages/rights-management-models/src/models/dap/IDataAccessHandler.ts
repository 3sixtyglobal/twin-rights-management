// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";

/**
 * Interface describing a Data Access Handler.
 */
export interface IDataAccessHandler {
	/**
	 * The asset types supported by this handler.
	 * @returns The supported asset types.
	 */
	supportedAssetTypes(): string[];

	/**
	 * Create an item.
	 * @param assetType The type of the item to create.
	 * @param item The item to create.
	 * @returns The id of the item created, for some items this is supplied in the `item`.
	 */
	create(assetType: string, item: IJsonLdNodeObject): Promise<string>;

	/**
	 * Get an item.
	 * @param assetType The type of the item to retrieve.
	 * @param id The ID of the item to retrieve.
	 * @returns The item retrieved if the policies allow it.
	 */
	get(assetType: string, id: string): Promise<IJsonLdNodeObject>;

	/**
	 * Update an item.
	 * @param assetType The type of the item to update.
	 * @param item The item to update.
	 * @returns Nothing.
	 */
	update(assetType: string, item: IJsonLdNodeObject): Promise<void>;

	/**
	 * Remove an item.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @returns Nothing.
	 */
	remove(assetType: string, id: string): Promise<void>;

	/**
	 * Query for items.
	 * @param assetType The type of the item to query.
	 * @param conditions The conditions to apply to the query.
	 * @param cursor The cursor for pagination.
	 * @param options Additional options which might be supported by the handler.
	 * @returns The items matching the query and cursor if there are more items.
	 */
	query(
		assetType: string,
		conditions: EntityCondition<IJsonLdNodeObject> | undefined,
		cursor: string | undefined,
		options: unknown | undefined
	): Promise<{
		items: IJsonLdNodeObject[];
		cursor?: string;
	}>;
}
