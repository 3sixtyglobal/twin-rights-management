// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ContextIdHelper, ContextIdKeys, ContextIdStore } from "@twin.org/context";
import { ComponentFactory, Guards } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IDataAccessPointComponent,
	IDataAccessRequestPointComponent
} from "@twin.org/rights-management-models";
import type { ITrustComponent } from "@twin.org/trust-models";
import type { IDataAccessRequestPointServiceConstructorOptions } from "./models/IDataAccessRequestPointServiceConstructorOptions.js";

/**
 * Class implementation of Data Access Request Point Component.
 */
export class DataAccessRequestPointService implements IDataAccessRequestPointComponent {
	/**
	 * The class name of the Data Access Request Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<DataAccessRequestPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * A method for creating a new instance of the policy negotiation point component.
	 * @internal
	 */
	private readonly _dataAccessComponentCreator: (url: string) => Promise<IDataAccessPointComponent>;

	/**
	 * The trust component.
	 * @internal
	 */
	private readonly _trustComponent: ITrustComponent;

	/**
	 * Override the default trust generator.
	 * @internal
	 */
	private readonly _overrideTrustGeneratorType?: string;

	/**
	 * Create a new instance of DataAccessRequestPointService (DARP).
	 * @param options The options for the component.
	 */
	constructor(options: IDataAccessRequestPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._dataAccessComponentCreator = options.config.dataAccessComponentCreator;
		this._trustComponent = ComponentFactory.get<ITrustComponent>(
			options?.trustComponentType ?? "trust"
		);
		this._overrideTrustGeneratorType = options.config.overrideTrustGeneratorType;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return DataAccessRequestPointService.CLASS_NAME;
	}

	/**
	 * Create an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to create.
	 * @param item The item to create.
	 * @returns The id of the item created, for some items this is supplied in the `item`.
	 */
	public async create(url: string, assetType: string, item: IJsonLdNodeObject): Promise<string> {
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(url), url);
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(DataAccessRequestPointService.CLASS_NAME, nameof(item), item);

		const contextIds = await ContextIdStore.getContextIds();
		ContextIdHelper.guard(contextIds, ContextIdKeys.Organization);
		const organizationId = contextIds[ContextIdKeys.Organization];

		const trustPayload = await this._trustComponent.generate(
			organizationId,
			this._overrideTrustGeneratorType
		);

		const dataAccessClient = await this._dataAccessComponentCreator(url);
		return dataAccessClient.create(assetType, item, trustPayload);
	}

	/**
	 * Get an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to retrieve.
	 * @param id The ID of the item to retrieve.
	 * @returns The item retrieved if the policies allow it.
	 */
	public async get(url: string, assetType: string, id: string): Promise<IJsonLdNodeObject> {
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(url), url);
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(id), id);

		const contextIds = await ContextIdStore.getContextIds();
		ContextIdHelper.guard(contextIds, ContextIdKeys.Organization);
		const organizationId = contextIds[ContextIdKeys.Organization];

		const trustPayload = await this._trustComponent.generate(
			organizationId,
			this._overrideTrustGeneratorType
		);

		const dataAccessClient = await this._dataAccessComponentCreator(url);
		return dataAccessClient.get(assetType, id, trustPayload);
	}

	/**
	 * Update an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to update.
	 * @param item The item to update.
	 * @returns Nothing.
	 */
	public async update(url: string, assetType: string, item: IJsonLdNodeObject): Promise<void> {
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(url), url);
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(DataAccessRequestPointService.CLASS_NAME, nameof(item), item);

		const contextIds = await ContextIdStore.getContextIds();
		ContextIdHelper.guard(contextIds, ContextIdKeys.Organization);
		const organizationId = contextIds[ContextIdKeys.Organization];

		const trustPayload = await this._trustComponent.generate(
			organizationId,
			this._overrideTrustGeneratorType
		);

		const dataAccessClient = await this._dataAccessComponentCreator(url);
		return dataAccessClient.update(assetType, item, trustPayload);
	}

	/**
	 * Remove an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @returns Nothing.
	 */
	public async remove(url: string, assetType: string, id: string): Promise<void> {
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(url), url);
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(id), id);

		const contextIds = await ContextIdStore.getContextIds();
		ContextIdHelper.guard(contextIds, ContextIdKeys.Organization);
		const organizationId = contextIds[ContextIdKeys.Organization];

		const trustPayload = await this._trustComponent.generate(
			organizationId,
			this._overrideTrustGeneratorType
		);

		const dataAccessClient = await this._dataAccessComponentCreator(url);
		await dataAccessClient.remove(assetType, id, trustPayload);
	}

	/**
	 * Query for items.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to query.
	 * @param conditions The conditions to apply to the query.
	 * @param cursor The cursor for pagination.
	 * @param options Additional options which might be supported by the handler.
	 * @returns The items matching the query and cursor if there are more items.
	 */
	public async query(
		url: string,
		assetType: string,
		conditions: EntityCondition<IJsonLdNodeObject> | undefined,
		cursor: string | undefined,
		options: unknown | undefined
	): Promise<{
		items: IJsonLdNodeObject[];
		cursor?: string;
	}> {
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(url), url);
		Guards.stringValue(DataAccessRequestPointService.CLASS_NAME, nameof(assetType), assetType);

		const contextIds = await ContextIdStore.getContextIds();
		ContextIdHelper.guard(contextIds, ContextIdKeys.Organization);
		const organizationId = contextIds[ContextIdKeys.Organization];

		const trustPayload = await this._trustComponent.generate(
			organizationId,
			this._overrideTrustGeneratorType
		);

		const dataAccessClient = await this._dataAccessComponentCreator(url);
		return dataAccessClient.query(assetType, conditions, cursor, options, trustPayload);
	}
}
