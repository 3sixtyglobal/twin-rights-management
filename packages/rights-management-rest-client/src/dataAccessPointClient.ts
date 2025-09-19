// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import type {
	IBaseRestClientConfig,
	ICreatedResponse,
	INoContentResponse
} from "@twin.org/api-models";
import { Guards, NotImplementedError } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import {
	RightsManagementContexts,
	RightsManagementTypes,
	type IDapCreateRequest,
	type IDapGetRequest,
	type IDapGetResponse,
	type IDapQueryRequest,
	type IDapQueryResponse,
	type IDapRemoveRequest,
	type IDapUpdateRequest,
	type IDataAccessHandler,
	type IDataAccessPointComponent
} from "@twin.org/rights-management-models";
import { HeaderTypes, MimeTypes } from "@twin.org/web";

/**
 * Client for performing Rights Management Data Access through to REST endpoints.
 */
export class DataAccessPointClient extends BaseRestClient implements IDataAccessPointComponent {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<DataAccessPointClient>();

	/**
	 * Create a new instance of DataAccessPointClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<DataAccessPointClient>(), config, "rights-management");
	}

	/**
	 * Create an item.
	 * @param assetType The type of the item to create.
	 * @param item The item to create.
	 * @param proofToken The proof provided by the requester to support the creation.
	 * @returns The id of the item created, for some items this is supplied in the `item`.
	 */
	public async create(
		assetType: string,
		item: IJsonLdNodeObject,
		proofToken: string
	): Promise<string> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(this.CLASS_NAME, nameof(item), item);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);

		const response = await this.fetch<IDapCreateRequest, ICreatedResponse>(
			"/data/:assetType",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: proofToken
				},
				pathParams: {
					assetType
				},
				body: {
					"@context": RightsManagementContexts.ContextRoot,
					type: RightsManagementTypes.DataAccessRequestWithObject,
					object: item
				}
			}
		);

		return response.headers[HeaderTypes.Location] ?? "";
	}

	/**
	 * Get an item.
	 * @param assetType The type of the item to retrieve.
	 * @param id The ID of the item to retrieve.
	 * @param proofToken The proof provided by the requester to support the lookup.
	 * @returns The item retrieved if the policies allow it.
	 */
	public async get(assetType: string, id: string, proofToken: string): Promise<IJsonLdNodeObject> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(id), id);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);

		const response = await this.fetch<IDapGetRequest, IDapGetResponse>(
			"/data/:assetType/:id",
			"GET",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: proofToken
				},
				pathParams: {
					assetType,
					id
				}
			}
		);

		return response.body;
	}

	/**
	 * Update an item.
	 * @param assetType The type of the item to update.
	 * @param item The item to update.
	 * @param proofToken The proof provided by the requester to support the update.
	 * @returns Nothing.
	 */
	public async update(
		assetType: string,
		item: IJsonLdNodeObject,
		proofToken: string
	): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(this.CLASS_NAME, nameof(item), item);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);
		Guards.stringValue(this.CLASS_NAME, nameof(item.id), item.id);

		await this.fetch<IDapUpdateRequest, INoContentResponse>("/data/:assetType/:id", "PUT", {
			headers: {
				[HeaderTypes.Accept]: MimeTypes.JsonLd,
				[HeaderTypes.Authorization]: proofToken
			},
			pathParams: {
				assetType,
				id: item.id
			},
			body: {
				"@context": RightsManagementContexts.ContextRoot,
				type: RightsManagementTypes.DataAccessRequestWithObject,
				object: item
			}
		});
	}

	/**
	 * Remove an item.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @param proofToken The proof provided by the requester to support the removal.
	 * @returns Nothing.
	 */
	public async remove(assetType: string, id: string, proofToken: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(id), id);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);

		await this.fetch<IDapRemoveRequest, INoContentResponse>("/data/:assetType/:id", "DELETE", {
			headers: {
				[HeaderTypes.Accept]: MimeTypes.JsonLd,
				[HeaderTypes.Authorization]: proofToken
			},
			pathParams: {
				assetType,
				id
			}
		});
	}

	/**
	 * Query for items.
	 * @param assetType The type of the item to query.
	 * @param conditions The conditions to apply to the query.
	 * @param cursor The cursor for pagination.
	 * @param options Additional options which might be supported by the handler.
	 * @param proofToken The proof provided by the requester to support the query.
	 * @returns The items matching the query and cursor if there are more items.
	 */
	public async query(
		assetType: string,
		conditions: EntityCondition<IJsonLdNodeObject> | undefined,
		cursor: string | undefined,
		options: unknown | undefined,
		proofToken: string
	): Promise<{
		items: IJsonLdNodeObject[];
		cursor?: string;
	}> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);

		const response = await this.fetch<IDapQueryRequest, IDapQueryResponse>(
			"/data/:assetType/query",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: proofToken
				},
				pathParams: {
					assetType
				},
				body: {
					"@context": RightsManagementContexts.ContextRoot,
					type: RightsManagementTypes.DataAccessQuery,
					conditions,
					cursor,
					options
				}
			}
		);

		return response.body;
	}

	/**
	 * Register a handler to use for a specific asset type.
	 * @param handlerId The id of the handler to register.
	 * @param handler The handler to register.
	 * @returns Nothing.
	 */
	public async registerHandler(handlerId: string, handler: IDataAccessHandler): Promise<void> {
		throw new NotImplementedError(this.CLASS_NAME, "registerHandler");
	}

	/**
	 * Unregister a handler from the handling.
	 * @param handlerId The id of the handler to unregister.
	 * @returns Nothing.
	 */
	public async unregisterHandler(handlerId: string): Promise<void> {
		throw new NotImplementedError(this.CLASS_NAME, "unregisterHandler");
	}
}
