// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import type {
	IBaseRestClientConfig,
	ICreatedResponse,
	INoContentResponse
} from "@twin.org/api-models";
import { Guards } from "@twin.org/core";
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
	type IDataAccessPointComponent
} from "@twin.org/rights-management-models";
import { HeaderHelper, HeaderTypes, MimeTypes } from "@twin.org/web";

/**
 * Client for performing Rights Management Data Access through to REST endpoints.
 */
export class DataAccessPointRestClient extends BaseRestClient implements IDataAccessPointComponent {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<DataAccessPointRestClient>();

	/**
	 * Create a new instance of DataAccessPointRestClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<DataAccessPointRestClient>(), config, "rights-management");
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return DataAccessPointRestClient.CLASS_NAME;
	}

	/**
	 * Create an item.
	 * @param assetType The type of the item to create.
	 * @param item The item to create.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The id of the item created, for some items this is supplied in the `item`.
	 */
	public async create(
		assetType: string,
		item: IJsonLdNodeObject,
		trustPayload: unknown
	): Promise<string> {
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(DataAccessPointRestClient.CLASS_NAME, nameof(item), item);
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(trustPayload), trustPayload);

		const response = await this.fetch<IDapCreateRequest, ICreatedResponse>(
			"/data/:assetType",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
				},
				pathParams: {
					assetType
				},
				body: {
					"@context": RightsManagementContexts.Context,
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
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The item retrieved if the policies allow it.
	 */
	public async get(
		assetType: string,
		id: string,
		trustPayload: unknown
	): Promise<IJsonLdNodeObject> {
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(id), id);
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(trustPayload), trustPayload);

		const response = await this.fetch<IDapGetRequest, IDapGetResponse>(
			"/data/:assetType/:id",
			"GET",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
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
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns Nothing.
	 */
	public async update(
		assetType: string,
		item: IJsonLdNodeObject,
		trustPayload: unknown
	): Promise<void> {
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(DataAccessPointRestClient.CLASS_NAME, nameof(item), item);
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(item.id), item.id);
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(trustPayload), trustPayload);

		await this.fetch<IDapUpdateRequest, INoContentResponse>("/data/:assetType/:id", "PUT", {
			headers: {
				[HeaderTypes.Accept]: MimeTypes.JsonLd,
				[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
			},
			pathParams: {
				assetType,
				id: item.id
			},
			body: {
				"@context": RightsManagementContexts.Context,
				type: RightsManagementTypes.DataAccessRequestWithObject,
				object: item
			}
		});
	}

	/**
	 * Remove an item.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns Nothing.
	 */
	public async remove(assetType: string, id: string, trustPayload: unknown): Promise<void> {
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(id), id);
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(trustPayload), trustPayload);

		await this.fetch<IDapRemoveRequest, INoContentResponse>("/data/:assetType/:id", "DELETE", {
			headers: {
				[HeaderTypes.Accept]: MimeTypes.JsonLd,
				[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
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
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The items matching the query and cursor if there are more items.
	 */
	public async query(
		assetType: string,
		conditions: EntityCondition<IJsonLdNodeObject> | undefined,
		cursor: string | undefined,
		options: unknown | undefined,
		trustPayload: unknown
	): Promise<{
		items: IJsonLdNodeObject[];
		cursor?: string;
	}> {
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(trustPayload), trustPayload);

		const response = await this.fetch<IDapQueryRequest, IDapQueryResponse>(
			"/data/:assetType/query",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: HeaderHelper.createBearer(trustPayload)
				},
				pathParams: {
					assetType
				},
				body: {
					"@context": RightsManagementContexts.Context,
					type: RightsManagementTypes.DataAccessQuery,
					conditions,
					cursor,
					options
				}
			}
		);

		return response.body;
	}
}
