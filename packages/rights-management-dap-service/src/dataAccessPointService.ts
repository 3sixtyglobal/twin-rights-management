// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Coerce, ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import { IdentityConnectorFactory, type IIdentityConnector } from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	RightsManagementContexts,
	RightsManagementTokenHelper,
	RightsManagementTypes,
	type IDataAccessHandler,
	type IDataAccessPointComponent,
	type IDataAccessQuery,
	type IDataAccessRequest,
	type IDataAccessRequestWithObject,
	type IPolicyEnforcementPointComponent
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
	 * The identity connector to use for signing/verifying negotiation requests.
	 * @internal
	 */
	private readonly _identityConnector: IIdentityConnector;

	/**
	 * The policy enforcement point component.
	 * @internal
	 */
	private readonly _policyEnforcementPointComponent: IPolicyEnforcementPointComponent;

	/**
	 * The time-to-live (TTL) for proof in seconds.
	 * @internal
	 */
	private readonly _proofTtlInSeconds: number;

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
		this._identityConnector = IdentityConnectorFactory.get(
			options?.identityConnectorType ?? "identity"
		);
		this._policyEnforcementPointComponent = ComponentFactory.get<IPolicyEnforcementPointComponent>(
			options?.policyEnforcementPointComponentType ?? "policy-enforcement-point"
		);

		this._proofTtlInSeconds = options?.config?.proofTtlInSeconds ?? 300; // Default to 5 minutes
		this._handlers = options?.config?.handlers ?? [];
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

		const handlerEntry = this._handlers.find(p =>
			p.handler.supportedAssetTypes().includes(assetType)
		);

		if (Is.empty(handlerEntry)) {
			throw new GeneralError(this.CLASS_NAME, "noHandlerForAssetType", { assetType });
		}

		const dataAccessRequestWithObject: IDataAccessRequestWithObject = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.DataAccessRequestWithObject,
			assetType,
			object: item
		};

		const verifiableCredential = await RightsManagementTokenHelper.verifyToken(
			this._identityConnector,
			dataAccessRequestWithObject,
			proofToken,
			this._proofTtlInSeconds
		);

		await this._policyEnforcementPointComponent.intercept({
			assignee: verifiableCredential.issuer,
			action: ActionType.Use,
			assetType
		});

		const manipulatedItem =
			await this._policyEnforcementPointComponent.intercept<IJsonLdNodeObject>({
				assignee: verifiableCredential.issuer,
				action: ActionType.Write,
				assetType
			});

		return handlerEntry.handler.create(assetType, manipulatedItem);
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

		const handlerEntry = this._handlers.find(p =>
			p.handler.supportedAssetTypes().includes(assetType)
		);

		if (Is.empty(handlerEntry)) {
			throw new GeneralError(this.CLASS_NAME, "noHandlerForAssetType", { assetType });
		}

		const dataAccessRequest: IDataAccessRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.DataAccessRequest,
			assetType,
			id
		};

		const verifiableCredential = await RightsManagementTokenHelper.verifyToken(
			this._identityConnector,
			dataAccessRequest,
			proofToken,
			this._proofTtlInSeconds
		);

		await this._policyEnforcementPointComponent.intercept({
			assignee: verifiableCredential.issuer,
			action: ActionType.Use,
			assetType,
			resourceId: id
		});

		const item = await handlerEntry.handler.get(assetType, id);

		const manipulatedItem = await this._policyEnforcementPointComponent.intercept<
			IJsonLdNodeObject,
			IJsonLdNodeObject
		>(
			{
				assignee: verifiableCredential.issuer,
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

		const handlerEntry = this._handlers.find(p =>
			p.handler.supportedAssetTypes().includes(assetType)
		);

		if (Is.empty(handlerEntry)) {
			throw new GeneralError(this.CLASS_NAME, "noHandlerForAssetType", { assetType });
		}

		const dataAccessRequest: IDataAccessRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.DataAccessRequest,
			assetType,
			id: Coerce.string(item.id) ?? ""
		};

		const verifiableCredential = await RightsManagementTokenHelper.verifyToken(
			this._identityConnector,
			dataAccessRequest,
			proofToken,
			this._proofTtlInSeconds
		);

		await this._policyEnforcementPointComponent.intercept({
			assignee: verifiableCredential.issuer,
			action: ActionType.Use,
			assetType,
			resourceId: dataAccessRequest.id
		});

		const manipulatedItem =
			await this._policyEnforcementPointComponent.intercept<IJsonLdNodeObject>({
				assignee: verifiableCredential.issuer,
				action: ActionType.Modify,
				assetType,
				resourceId: dataAccessRequest.id
			});

		return handlerEntry.handler.update(assetType, manipulatedItem);
	}

	/**
	 * Remove an item.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @param proofToken The proof provided by the requester to support the update.
	 * @returns Nothing.
	 */
	public async remove(assetType: string, id: string, proofToken: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(id), id);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);

		const handlerEntry = this._handlers.find(p =>
			p.handler.supportedAssetTypes().includes(assetType)
		);

		if (Is.empty(handlerEntry)) {
			throw new GeneralError(this.CLASS_NAME, "noHandlerForAssetType", { assetType });
		}

		const dataAccessRequest: IDataAccessRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.DataAccessRequest,
			assetType,
			id
		};

		const verifiableCredential = await RightsManagementTokenHelper.verifyToken(
			this._identityConnector,
			dataAccessRequest,
			proofToken,
			this._proofTtlInSeconds
		);

		await this._policyEnforcementPointComponent.intercept({
			assignee: verifiableCredential.issuer,
			action: ActionType.Use,
			assetType,
			resourceId: dataAccessRequest.id
		});

		await this._policyEnforcementPointComponent.intercept({
			assignee: verifiableCredential.issuer,
			action: ActionType.Delete,
			assetType,
			resourceId: dataAccessRequest.id
		});

		return handlerEntry.handler.remove(assetType, id);
	}

	/**
	 * Query for items.
	 * @param assetType The type of the item to query.
	 * @param conditions The conditions to apply to the query.
	 * @param cursor The cursor for pagination.
	 * @param options Additional options which might be supported by the handler.
	 * @param proofToken The proof provided by the requester to support the update.
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

		const handlerEntry = this._handlers.find(p =>
			p.handler.supportedAssetTypes().includes(assetType)
		);

		if (Is.empty(handlerEntry)) {
			throw new GeneralError(this.CLASS_NAME, "noHandlerForAssetType", { assetType });
		}

		const dataAccessQuery: IDataAccessQuery = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.DataAccessQuery,
			assetType
		};

		const verifiableCredential = await RightsManagementTokenHelper.verifyToken(
			this._identityConnector,
			dataAccessQuery,
			proofToken,
			this._proofTtlInSeconds
		);

		await this._policyEnforcementPointComponent.intercept({
			assignee: verifiableCredential.issuer,
			action: ActionType.Use,
			assetType
		});

		const result = await handlerEntry.handler.query(assetType, conditions, cursor, options);

		const manipulatedItems = result.items.map(item =>
			this._policyEnforcementPointComponent.intercept<IJsonLdNodeObject>({
				assignee: verifiableCredential.issuer,
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
