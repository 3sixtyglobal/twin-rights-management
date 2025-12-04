// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Coerce, ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	DataAccessHandlerFactory,
	type IDataAccessPointComponent,
	type IPolicyEnforcementPointComponent
} from "@twin.org/rights-management-models";
import { ActionType } from "@twin.org/standards-w3c-odrl";
import { type ITrustComponent, TrustHelper } from "@twin.org/trust-models";
import type { IDataAccessPointServiceConstructorOptions } from "./models/IDataAccessPointServiceConstructorOptions.js";

/**
 * Class implementation of Data Access Point Component.
 */
export class DataAccessPointService implements IDataAccessPointComponent {
	/**
	 * The class name of the Data Access Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<DataAccessPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The policy enforcement point component.
	 * @internal
	 */
	private readonly _policyEnforcementPointComponent: IPolicyEnforcementPointComponent;

	/**
	 * The trust component.
	 * @internal
	 */
	private readonly _trustComponent: ITrustComponent;

	/**
	 * Create a new instance of DataAccessPointService (DAP).
	 * @param options The options for the component.
	 */
	constructor(options?: IDataAccessPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._policyEnforcementPointComponent = ComponentFactory.get<IPolicyEnforcementPointComponent>(
			options?.policyEnforcementPointComponentType ?? "policy-enforcement-point"
		);
		this._trustComponent = ComponentFactory.get<ITrustComponent>(
			options?.trustComponentType ?? "trust"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return DataAccessPointService.CLASS_NAME;
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
		Guards.stringValue(DataAccessPointService.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(DataAccessPointService.CLASS_NAME, nameof(item), item);

		const handlerNames = DataAccessHandlerFactory.names();
		const handlers = handlerNames.map(name => DataAccessHandlerFactory.get(name));
		const handler = handlers.find(p => p.supportedAssetTypes().includes(assetType));

		if (Is.empty(handler)) {
			throw new GeneralError(DataAccessPointService.CLASS_NAME, "noHandlerForAssetType", {
				assetType
			});
		}

		const trustInfo = await TrustHelper.verifyTrust(this._trustComponent, trustPayload, "create");

		const manipulatedItem =
			await this._policyEnforcementPointComponent.intercept<IJsonLdNodeObject>({
				assignee: trustInfo.identity,
				action: ActionType.Write,
				assetType
			});

		return handler.create(assetType, manipulatedItem);
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
		Guards.stringValue(DataAccessPointService.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(DataAccessPointService.CLASS_NAME, nameof(id), id);

		const handlerNames = DataAccessHandlerFactory.names();
		const handlers = handlerNames.map(name => DataAccessHandlerFactory.get(name));
		const handler = handlers.find(p => p.supportedAssetTypes().includes(assetType));

		if (Is.empty(handler)) {
			throw new GeneralError(DataAccessPointService.CLASS_NAME, "noHandlerForAssetType", {
				assetType
			});
		}

		const trustInfo = await TrustHelper.verifyTrust(this._trustComponent, trustPayload, "get");

		const isAllowed = await this._policyEnforcementPointComponent.intercept({
			assignee: trustInfo.identity,
			action: ActionType.Use,
			assetType,
			resourceId: id
		});

		if (!(Coerce.boolean(isAllowed) ?? false)) {
			throw new GeneralError(DataAccessPointService.CLASS_NAME, "notAuthorizedToGet", {
				assetType,
				id
			});
		}

		const item = await handler.get(assetType, id);

		const manipulatedItem = await this._policyEnforcementPointComponent.intercept<
			IJsonLdNodeObject,
			IJsonLdNodeObject
		>(
			{
				assignee: trustInfo.identity,
				action: ActionType.Read,
				assetType,
				resourceId: id
			},
			item
		);

		return manipulatedItem;
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
		Guards.stringValue(DataAccessPointService.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(DataAccessPointService.CLASS_NAME, nameof(item), item);
		Guards.stringValue(DataAccessPointService.CLASS_NAME, nameof(item.id), item.id);

		const handlerNames = DataAccessHandlerFactory.names();
		const handlers = handlerNames.map(name => DataAccessHandlerFactory.get(name));
		const handler = handlers.find(p => p.supportedAssetTypes().includes(assetType));

		if (Is.empty(handler)) {
			throw new GeneralError(DataAccessPointService.CLASS_NAME, "noHandlerForAssetType", {
				assetType
			});
		}

		const trustInfo = await TrustHelper.verifyTrust(this._trustComponent, trustPayload, "update");

		const manipulatedItem =
			await this._policyEnforcementPointComponent.intercept<IJsonLdNodeObject>({
				assignee: trustInfo.identity,
				action: ActionType.Modify,
				assetType,
				resourceId: item.id
			});

		return handler.update(assetType, manipulatedItem);
	}

	/**
	 * Remove an item.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns Nothing.
	 */
	public async remove(assetType: string, id: string, trustPayload: unknown): Promise<void> {
		Guards.stringValue(DataAccessPointService.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(DataAccessPointService.CLASS_NAME, nameof(id), id);

		const handlerNames = DataAccessHandlerFactory.names();
		const handlers = handlerNames.map(name => DataAccessHandlerFactory.get(name));
		const handler = handlers.find(p => p.supportedAssetTypes().includes(assetType));

		if (Is.empty(handler)) {
			throw new GeneralError(DataAccessPointService.CLASS_NAME, "noHandlerForAssetType", {
				assetType
			});
		}

		const trustInfo = await TrustHelper.verifyTrust(this._trustComponent, trustPayload, "remove");

		await this._policyEnforcementPointComponent.intercept({
			assignee: trustInfo.identity,
			action: ActionType.Delete,
			assetType,
			resourceId: id
		});

		return handler.remove(assetType, id);
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
		Guards.stringValue(DataAccessPointService.CLASS_NAME, nameof(assetType), assetType);

		const handlerNames = DataAccessHandlerFactory.names();
		const handlers = handlerNames.map(name => DataAccessHandlerFactory.get(name));
		const handler = handlers.find(p => p.supportedAssetTypes().includes(assetType));

		if (Is.empty(handler)) {
			throw new GeneralError(DataAccessPointService.CLASS_NAME, "noHandlerForAssetType", {
				assetType
			});
		}

		const trustInfo = await TrustHelper.verifyTrust(this._trustComponent, trustPayload, "query");

		const isAllowed = await this._policyEnforcementPointComponent.intercept({
			assignee: trustInfo.identity,
			action: ActionType.Use,
			assetType
		});

		if (!(Coerce.boolean(isAllowed) ?? false)) {
			throw new GeneralError(DataAccessPointService.CLASS_NAME, "notAuthorizedToQuery", {
				assetType
			});
		}

		const result = await handler.query(assetType, conditions, cursor, options);

		const manipulatedItems = result.items.map(async item =>
			this._policyEnforcementPointComponent.intercept<IJsonLdNodeObject>({
				assignee: trustInfo.identity,
				action: ActionType.Read,
				assetType,
				resourceId: Coerce.string(item.id)
			})
		);

		return { items: await Promise.all(manipulatedItems), cursor: result.cursor };
	}
}
