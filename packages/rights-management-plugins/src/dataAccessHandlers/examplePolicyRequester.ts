// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { IDataAccessHandler } from "@twin.org/rights-management-models";
import type { IExampleDataAccessHandlerConstructorOptions } from "../models/IExampleDataAccessHandlerConstructorOptions.js";

/**
 * Example Data Access Handler.
 */
export class ExampleDataAccessHandler implements IDataAccessHandler {
	/**
	 * The class name of the Example Data Access Handler.
	 */
	public static readonly CLASS_NAME: string = nameof<ExampleDataAccessHandler>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging: ILoggingComponent;

	/**
	 * Create a new instance of ExampleDataAccessHandler.
	 * @param options The options for the example policy Requester.
	 */
	constructor(options?: IExampleDataAccessHandlerConstructorOptions) {
		this._logging = ComponentFactory.get<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return ExampleDataAccessHandler.CLASS_NAME;
	}

	/**
	 * The asset types supported by this handler.
	 * @returns The supported asset types.
	 */
	public supportedAssetTypes(): string[] {
		return [];
	}

	/**
	 * Create an item.
	 * @param assetType The type of the item to create.
	 * @param item The item to create.
	 * @returns The id of the item created, for some items this is supplied in the `item`.
	 */
	public async create(assetType: string, item: IJsonLdNodeObject): Promise<string> {
		return "";
	}

	/**
	 * Get an item.
	 * @param assetType The type of the item to retrieve.
	 * @param id The ID of the item to retrieve.
	 * @returns The item retrieved if the policies allow it.
	 */
	public async get(assetType: string, id: string): Promise<IJsonLdNodeObject> {
		return {};
	}

	/**
	 * Update an item.
	 * @param assetType The type of the item to update.
	 * @param item The item to update.
	 * @returns Nothing.
	 */
	public async update(assetType: string, item: IJsonLdNodeObject): Promise<void> {}

	/**
	 * Remove an item.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @returns Nothing.
	 */
	public async remove(assetType: string, id: string): Promise<void> {}

	/**
	 * Query for items.
	 * @param assetType The type of the item to query.
	 * @param conditions The conditions to apply to the query.
	 * @param cursor The cursor for pagination.
	 * @param options Additional options which might be supported by the handler.
	 * @returns The items matching the query and cursor if there are more items.
	 */
	public async query(
		assetType: string,
		conditions: EntityCondition<IJsonLdNodeObject> | undefined,
		cursor: string | undefined,
		options: unknown | undefined
	): Promise<{
		items: IJsonLdNodeObject[];
		cursor?: string;
	}> {
		return { items: [] };
	}
}
