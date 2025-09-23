// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Coerce, ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import type { IIdentityAuthenticationActionRequest } from "@twin.org/identity-authentication";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IDataAccessHandler,
	IDataAccessPointComponent,
	IPolicyEnforcementPointComponent
} from "@twin.org/rights-management-models";
import { ActionType } from "@twin.org/standards-w3c-odrl";
import type { IDataAccessPointServiceConstructorOptions } from "./models/IDataAccessPointServiceConstructorOptions";

/**
 * Class implementation of Data Access Point Component.
 */
export class DataAccessPointService implements IDataAccessPointComponent {
	/**
	 * The class name of the Data Access Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<DataAccessPointService>();

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
	 * These handlers can be registered to handle specific asset types.
	 * @internal
	 */
	private readonly _handlers: {
		handlerId: string;
		handler: IDataAccessHandler;
	}[];

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

		this._handlers = options?.config?.handlers ?? [];
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
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(this.CLASS_NAME, nameof(item), item);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			this.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);

		const handlerEntry = this._handlers.find(p =>
			p.handler.supportedAssetTypes().includes(assetType)
		);

		if (Is.empty(handlerEntry)) {
			throw new GeneralError(this.CLASS_NAME, "noHandlerForAssetType", { assetType });
		}

		if (actionRequest.action !== "create") {
			throw new GeneralError(this.CLASS_NAME, "incorrectActionType", {
				action: actionRequest.action,
				expecting: "create"
			});
		}

		const manipulatedItem =
			await this._policyEnforcementPointComponent.intercept<IJsonLdNodeObject>({
				assignee: actionRequest.requester,
				action: ActionType.Write,
				assetType
			});

		return handlerEntry.handler.create(assetType, manipulatedItem);
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
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(id), id);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			this.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);

		const handlerEntry = this._handlers.find(p =>
			p.handler.supportedAssetTypes().includes(assetType)
		);

		if (Is.empty(handlerEntry)) {
			throw new GeneralError(this.CLASS_NAME, "noHandlerForAssetType", { assetType });
		}

		if (actionRequest.action !== "get") {
			throw new GeneralError(this.CLASS_NAME, "incorrectActionType", {
				action: actionRequest.action,
				expecting: "get"
			});
		}

		const isAllowed = await this._policyEnforcementPointComponent.intercept({
			assignee: actionRequest.requester,
			action: ActionType.Use,
			assetType,
			resourceId: id
		});

		if (!(Coerce.boolean(isAllowed) ?? false)) {
			throw new GeneralError(this.CLASS_NAME, "notAuthorizedToGet", { assetType, id });
		}

		const item = await handlerEntry.handler.get(assetType, id);

		const manipulatedItem = await this._policyEnforcementPointComponent.intercept<
			IJsonLdNodeObject,
			IJsonLdNodeObject
		>(
			{
				assignee: actionRequest.requester,
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
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns Nothing.
	 */
	public async update(
		assetType: string,
		item: IJsonLdNodeObject,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(this.CLASS_NAME, nameof(item), item);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			this.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);
		Guards.stringValue(this.CLASS_NAME, nameof(item.id), item.id);

		const handlerEntry = this._handlers.find(p =>
			p.handler.supportedAssetTypes().includes(assetType)
		);

		if (Is.empty(handlerEntry)) {
			throw new GeneralError(this.CLASS_NAME, "noHandlerForAssetType", { assetType });
		}

		if (actionRequest.action !== "update") {
			throw new GeneralError(this.CLASS_NAME, "incorrectActionType", {
				action: actionRequest.action,
				expecting: "update"
			});
		}

		const manipulatedItem =
			await this._policyEnforcementPointComponent.intercept<IJsonLdNodeObject>({
				assignee: actionRequest.requester,
				action: ActionType.Modify,
				assetType,
				resourceId: item.id
			});

		return handlerEntry.handler.update(assetType, manipulatedItem);
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
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(id), id);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			this.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);

		const handlerEntry = this._handlers.find(p =>
			p.handler.supportedAssetTypes().includes(assetType)
		);

		if (Is.empty(handlerEntry)) {
			throw new GeneralError(this.CLASS_NAME, "noHandlerForAssetType", { assetType });
		}

		if (actionRequest.action !== "remove") {
			throw new GeneralError(this.CLASS_NAME, "incorrectActionType", {
				action: actionRequest.action,
				expecting: "remove"
			});
		}

		await this._policyEnforcementPointComponent.intercept({
			assignee: actionRequest.requester,
			action: ActionType.Delete,
			assetType,
			resourceId: id
		});

		return handlerEntry.handler.remove(assetType, id);
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
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			this.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);

		const handlerEntry = this._handlers.find(p =>
			p.handler.supportedAssetTypes().includes(assetType)
		);

		if (Is.empty(handlerEntry)) {
			throw new GeneralError(this.CLASS_NAME, "noHandlerForAssetType", { assetType });
		}

		if (actionRequest.action !== "query") {
			throw new GeneralError(this.CLASS_NAME, "incorrectActionType", {
				action: actionRequest.action,
				expecting: "query"
			});
		}

		const isAllowed = await this._policyEnforcementPointComponent.intercept({
			assignee: actionRequest.requester,
			action: ActionType.Use,
			assetType
		});

		if (!(Coerce.boolean(isAllowed) ?? false)) {
			throw new GeneralError(this.CLASS_NAME, "notAuthorizedToQuery", { assetType });
		}

		const result = await handlerEntry.handler.query(assetType, conditions, cursor, options);

		const manipulatedItems = result.items.map(item =>
			this._policyEnforcementPointComponent.intercept<IJsonLdNodeObject>({
				assignee: actionRequest.requester,
				action: ActionType.Read,
				assetType,
				resourceId: Coerce.string(item.id)
			})
		);

		return { items: await Promise.all(manipulatedItems), cursor: result.cursor };
	}

	/**
	 * Register a handler to use for handling data.
	 * @param handlerId The id of the handler to register.
	 * @param handler The handler to register.
	 * @returns Nothing.
	 */
	public async registerHandler(handlerId: string, handler: IDataAccessHandler): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(handlerId), handlerId);
		Guards.objectValue<IDataAccessHandler>(this.CLASS_NAME, nameof(handler), handler);

		const currentIndex = this._handlers.findIndex(p => p.handlerId === handlerId);
		if (currentIndex !== -1) {
			this._handlers[currentIndex].handler = handler;
		} else {
			this._handlers.push({ handlerId, handler });
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "registeredHandler",
			data: {
				handlerId
			}
		});
	}

	/**
	 * Unregister a handler from the handling.
	 * @param handlerId The id of the handler to unregister.
	 * @returns Nothing.
	 */
	public async unregisterHandler(handlerId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(handlerId), handlerId);

		const currentIndex = this._handlers.findIndex(p => p.handlerId === handlerId);
		if (currentIndex !== -1) {
			this._handlers.splice(currentIndex, 1);
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "unregisteredHandler",
			data: {
				handlerId
			}
		});
	}
}
