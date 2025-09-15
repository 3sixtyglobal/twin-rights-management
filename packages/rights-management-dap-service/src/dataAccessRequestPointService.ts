// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Coerce, ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import {
	DocumentHelper,
	IdentityConnectorFactory,
	type IIdentityConnector
} from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	RightsManagementContexts,
	RightsManagementTokenHelper,
	RightsManagementTypes,
	type IDataAccessPointComponent,
	type IDataAccessPointRequestComponent,
	type IDataAccessQuery,
	type IDataAccessRequest,
	type IDataAccessRequestWithObject
} from "@twin.org/rights-management-models";
import type { IDataAccessRequestPointServiceConstructorOptions } from "./models/IDataAccessRequestPointServiceConstructorOptions";

/**
 * Class implementation of Data Access Request Point Component.
 */
export class DataAccessRequestPointService implements IDataAccessPointRequestComponent {
	/**
	 * The class name of the Data Access Request Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<DataAccessRequestPointService>();

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
	 * The id of the identity method to use when signing/verifying proofs.
	 * @internal
	 */
	private readonly _rightsManagementMethodId: string;

	/**
	 * A method for creating a new instance of the policy negotiation point component.
	 * @internal
	 */
	private readonly _dataAccessComponentCreator: (url: string) => Promise<IDataAccessPointComponent>;

	/**
	 * The node identity.
	 * @internal
	 */
	private _nodeIdentity?: string;

	/**
	 * The time-to-live (TTL) for proof in seconds.
	 * @internal
	 */
	private readonly _proofTtlInSeconds: number;

	/**
	 * Create a new instance of DataAccessRequestPointService (DARP).
	 * @param options The options for the component.
	 */
	constructor(options: IDataAccessRequestPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._identityConnector = IdentityConnectorFactory.get(
			options?.identityConnectorType ?? "identity"
		);
		this._rightsManagementMethodId =
			options?.config.rightsManagementMethodId ?? "rights-management-assertion";
		this._dataAccessComponentCreator = options.config.dataAccessComponentCreator;
		this._proofTtlInSeconds = options?.config?.proofTtlInSeconds ?? 300; // Default to 5 minutes
	}

	/**
	 * The component needs to be started when the node is initialized.
	 * @param nodeIdentity The identity of the node starting the component.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns Nothing.
	 */
	public async start(
		nodeIdentity: string,
		nodeLoggingComponentType: string | undefined
	): Promise<void> {
		this._nodeIdentity = nodeIdentity;
	}

	/**
	 * Create an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to create.
	 * @param item The item to create.
	 * @returns The id of the item created, for some items this is supplied in the `item`.
	 */
	public async create(url: string, assetType: string, item: IJsonLdNodeObject): Promise<string> {
		Guards.stringValue(this.CLASS_NAME, nameof(url), url);
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(this.CLASS_NAME, nameof(item), item);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const dataAccessRequestWithObject: IDataAccessRequestWithObject = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.DataAccessRequestWithObject,
			assetType,
			object: item
		};

		const proofToken = await RightsManagementTokenHelper.createToken(
			this._identityConnector,
			DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
			dataAccessRequestWithObject,
			this._proofTtlInSeconds
		);

		const dataAccessClient = await this._dataAccessComponentCreator(url);
		return dataAccessClient.create(assetType, item, proofToken);
	}

	/**
	 * Get an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to retrieve.
	 * @param id The ID of the item to retrieve.
	 * @returns The item retrieved if the policies allow it.
	 */
	public async get(url: string, assetType: string, id: string): Promise<IJsonLdNodeObject> {
		Guards.stringValue(this.CLASS_NAME, nameof(url), url);
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(id), id);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const dataAccessRequest: IDataAccessRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.DataAccessRequest,
			assetType,
			id
		};

		const proofToken = await RightsManagementTokenHelper.createToken(
			this._identityConnector,
			DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
			dataAccessRequest,
			this._proofTtlInSeconds
		);

		const dataAccessClient = await this._dataAccessComponentCreator(url);
		return dataAccessClient.get(assetType, id, proofToken);
	}

	/**
	 * Update an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to update.
	 * @param item The item to update.
	 * @returns Nothing.
	 */
	public async update(url: string, assetType: string, item: IJsonLdNodeObject): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(url), url);
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.object<IJsonLdNodeObject>(this.CLASS_NAME, nameof(item), item);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const dataAccessRequest: IDataAccessRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.DataAccessRequest,
			assetType,
			id: Coerce.string(item.id) ?? ""
		};

		const proofToken = await RightsManagementTokenHelper.createToken(
			this._identityConnector,
			DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
			dataAccessRequest,
			this._proofTtlInSeconds
		);

		const dataAccessClient = await this._dataAccessComponentCreator(url);
		return dataAccessClient.update(assetType, item, proofToken);
	}

	/**
	 * Remove an item.
	 * @param url The URL of the data access point.
	 * @param assetType The type of the item to remove.
	 * @param id The id of the item to remove.
	 * @returns Nothing.
	 */
	public async remove(url: string, assetType: string, id: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(url), url);
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(id), id);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const dataAccessRequest: IDataAccessRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.DataAccessRequest,
			assetType,
			id
		};

		const proofToken = await RightsManagementTokenHelper.createToken(
			this._identityConnector,
			DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
			dataAccessRequest,
			this._proofTtlInSeconds
		);

		const dataAccessClient = await this._dataAccessComponentCreator(url);
		await dataAccessClient.remove(assetType, id, proofToken);
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
		Guards.stringValue(this.CLASS_NAME, nameof(url), url);
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const dataAccessQuery: IDataAccessQuery = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.DataAccessQuery,
			assetType
		};

		const proofToken = await RightsManagementTokenHelper.createToken(
			this._identityConnector,
			DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
			dataAccessQuery,
			this._proofTtlInSeconds
		);

		const dataAccessClient = await this._dataAccessComponentCreator(url);
		return dataAccessClient.query(assetType, conditions, cursor, options, proofToken);
	}
}
