// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import type {
	IBaseRestClientConfig,
	ICreatedResponse,
	INoContentResponse
} from "@twin.org/api-models";
import { ContextIdKeys } from "@twin.org/context";
import { Guards, NotSupportedError } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import type { IIdentityAuthenticationActionRequest } from "@twin.org/identity-authentication";
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
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The id of the item created, for some items this is supplied in the `item`.
	 */
	public async create(
		assetType: string,
		item: IJsonLdNodeObject,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<string> {
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(DataAccessPointRestClient.CLASS_NAME, nameof(item), item);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			DataAccessPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);

		const response = await this.fetch<IDapCreateRequest, ICreatedResponse>(
			"/data/:assetType",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				pathParams: {
					assetType
				},
				body: {
					"@context": RightsManagementContexts.ContextRoot,
					type: RightsManagementTypes.DataAccessRequestWithObject,
					object: item
				}
			},
			{
				authenticationGeneratorType: "verifiable-credential",
				authenticationData: {
					contextId: ContextIdKeys.Organization,
					subject: actionRequest
				}
			}
		);

		return response.headers[HeaderTypes.Location] ?? "";
	}

	/**
	 * Get an item.
	 * @param assetType The type of the item to retrieve.
	 * @param id The ID of the item to retrieve.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The item retrieved if the policies allow it.
	 */
	public async get(
		assetType: string,
		id: string,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IJsonLdNodeObject> {
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(id), id);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			DataAccessPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);

		const response = await this.fetch<IDapGetRequest, IDapGetResponse>(
			"/data/:assetType/:id",
			"GET",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				pathParams: {
					assetType,
					id
				}
			},
			{
				authenticationGeneratorType: "verifiable-credential",
				authenticationData: {
					contextId: ContextIdKeys.Organization,
					subject: actionRequest
				}
			}
		);

		return response.body;
	}

	/**
	 * Update an item.
	 * @param assetType The type of the item to update.
	 * @param item The item to update.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns Nothing.
	 */
	public async update(
		assetType: string,
		item: IJsonLdNodeObject,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<void> {
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(DataAccessPointRestClient.CLASS_NAME, nameof(item), item);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			DataAccessPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(item.id), item.id);

		await this.fetch<IDapUpdateRequest, INoContentResponse>(
			"/data/:assetType/:id",
			"PUT",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
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
			},
			{
				authenticationGeneratorType: "verifiable-credential",
				authenticationData: {
					contextId: ContextIdKeys.Organization,
					subject: actionRequest
				}
			}
		);
	}

	/**
	 * Remove an item.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns Nothing.
	 */
	public async remove(
		assetType: string,
		id: string,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<void> {
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(id), id);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			DataAccessPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);

		await this.fetch<IDapRemoveRequest, INoContentResponse>(
			"/data/:assetType/:id",
			"DELETE",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				pathParams: {
					assetType,
					id
				}
			},
			{
				authenticationGeneratorType: "verifiable-credential",
				authenticationData: {
					contextId: ContextIdKeys.Organization,
					subject: actionRequest
				}
			}
		);
	}

	/**
	 * Query for items.
	 * @param assetType The type of the item to query.
	 * @param conditions The conditions to apply to the query.
	 * @param cursor The cursor for pagination.
	 * @param options Additional options which might be supported by the handler.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The items matching the query and cursor if there are more items.
	 */
	public async query(
		assetType: string,
		conditions: EntityCondition<IJsonLdNodeObject> | undefined,
		cursor: string | undefined,
		options: unknown | undefined,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<{
		items: IJsonLdNodeObject[];
		cursor?: string;
	}> {
		Guards.stringValue(DataAccessPointRestClient.CLASS_NAME, nameof(assetType), assetType);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			DataAccessPointRestClient.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);

		const response = await this.fetch<IDapQueryRequest, IDapQueryResponse>(
			"/data/:assetType/query",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
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
			},
			{
				authenticationGeneratorType: "verifiable-credential",
				authenticationData: {
					contextId: ContextIdKeys.Organization,
					subject: actionRequest
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
		throw new NotSupportedError(DataAccessPointRestClient.CLASS_NAME, "notSupportedOnClient", {
			methodName: "registerHandler"
		});
	}

	/**
	 * Unregister a handler from the handling.
	 * @param handlerId The id of the handler to unregister.
	 * @returns Nothing.
	 */
	public async unregisterHandler(handlerId: string): Promise<void> {
		throw new NotSupportedError(DataAccessPointRestClient.CLASS_NAME, "notSupportedOnClient", {
			methodName: "unregisterHandler"
		});
	}
}
