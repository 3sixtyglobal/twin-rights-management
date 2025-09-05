// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyContext,
	IPolicyInformationPointComponent,
	IPolicyInformationSource,
	PolicyInformationAccessMode
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyInformationPointServiceConstructorOptions } from "./models/IPolicyInformationPointServiceConstructorOptions";

/**
 * Class implementation of Policy Information Point Component.
 */
export class PolicyInformationPointService implements IPolicyInformationPointComponent {
	/**
	 * The class name of the Policy Information Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyInformationPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * These sources can be registered to retrieve data based on the input.
	 * @internal
	 */
	private readonly _sources: {
		sourceId: string;
		source: IPolicyInformationSource;
	}[];

	/**
	 * Create a new instance of PolicyInformationPointService (PIP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyInformationPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._sources = options?.config?.sources ?? [];
	}

	/**
	 * Retrieve additional information which is relevant in the PDP decision making.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param context The context information to use in the decision making.
	 * @param data The data to get any additional information for.
	 * @param policies The policies that apply to the data.
	 * @returns Returns additional information based on the data and identities.
	 */
	public async retrieve<C extends IPolicyContext = IPolicyContext, D = unknown>(
		assetType: string,
		action: string,
		accessMode: PolicyInformationAccessMode,
		context: C | undefined,
		data: D | undefined,
		policies: IOdrlPolicy[]
	): Promise<{ [source: string]: IJsonLdNodeObject[] }> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);

		const information: { [source: string]: IJsonLdNodeObject[] } = {};

		await Promise.all(
			this._sources.map(async ({ sourceId, source }) => {
				try {
					const result = await source.retrieve(
						assetType,
						action,
						accessMode,
						context,
						data,
						policies
					);

					if (Is.arrayValue(result)) {
						information[sourceId] = result;
					}
				} catch (error) {
					this._logging?.log({
						level: "error",
						source: this.CLASS_NAME,
						ts: Date.now(),
						message: "sourceRetrieveFailed",
						data: {
							sourceId,
							assetType,
							action
						},
						error: BaseError.fromError(error)
					});
				}
			})
		);

		return information;
	}

	/**
	 * Register a source to use for retrieval.
	 * @param sourceId The id of the source to register.
	 * @param source The source to register.
	 * @returns Nothing.
	 */
	public async registerSource(sourceId: string, source: IPolicyInformationSource): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(sourceId), sourceId);
		Guards.objectValue<IPolicyInformationSource>(this.CLASS_NAME, nameof(source), source);

		const currentIndex = this._sources.findIndex(s => s.sourceId === sourceId);
		if (currentIndex !== -1) {
			this._sources[currentIndex].source = source;
		} else {
			this._sources.push({ sourceId, source });
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "registeredSource",
			data: {
				sourceId
			}
		});
	}

	/**
	 * Unregister a source from the retrieval.
	 * @param sourceId The id of the source to unregister.
	 * @returns Nothing.
	 */
	public async unregisterSource(sourceId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(sourceId), sourceId);

		const currentIndex = this._sources.findIndex(s => s.sourceId === sourceId);
		if (currentIndex !== -1) {
			this._sources.splice(currentIndex, 1);
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "unregisteredSource",
			data: {
				sourceId
			}
		});
	}
}
