// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";

/**
 * Interface describing a Data Access Request Point (DARP) contract.
 * The DARP component sends requests to the DAP for data access operations,
 * it will create proofs for the requests.
 */
export interface IDataAccessRequestPointComponent extends IComponent {
	/**
	 * Create an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to create.
	 * @param item The item to create.
	 * @returns The id of the item created, for some items this is supplied in the `item`.
	 */
	create(url: string, assetType: string, item: IJsonLdNodeObject): Promise<string>;

	/**
	 * Get an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to retrieve.
	 * @param id The ID of the item to retrieve.
	 * @returns The item retrieved if the policies allow it.
	 */
	get(url: string, assetType: string, id: string): Promise<IJsonLdNodeObject>;

	/**
	 * Update an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to update.
	 * @param item The item to update.
	 * @returns Nothing.
	 */
	update(url: string, assetType: string, item: IJsonLdNodeObject): Promise<void>;

	/**
	 * Remove an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @returns Nothing.
	 */
	remove(url: string, assetType: string, id: string): Promise<void>;

	/**
	 * Query for items.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to query.
	 * @param conditions The conditions to apply to the query.
	 * @param cursor The cursor for pagination.
	 * @param options Additional options which might be supported by the handler.
	 * @returns The items matching the query and cursor if there are more items.
	 */
	query(
		url: string,
		assetType: string,
		conditions: EntityCondition<IJsonLdNodeObject> | undefined,
		cursor: string | undefined,
		options: unknown | undefined
	): Promise<{
		items: IJsonLdNodeObject[];
		cursor?: string;
	}>;
}
