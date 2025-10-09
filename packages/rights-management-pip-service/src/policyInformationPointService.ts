// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, Guards, Is } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyInformation,
	type IPolicyInformationPointComponent,
	type IPolicyInformationSource,
	type IPolicyLocator,
	LocatorHelper,
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
	public static readonly CLASS_NAME: string = nameof<PolicyInformationPointService>();

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
	 * @param locator The locator to find relevant policies.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param policies The policies that apply to the data.
	 * @param data The data to get any additional information for.
	 * @returns Returns additional information based on the data and identities.
	 */
	public async retrieve<D = unknown>(
		locator: IPolicyLocator,
		accessMode: PolicyInformationAccessMode,
		policies?: IOdrlPolicy[],
		data?: D
	): Promise<IPolicyInformation> {
		Guards.object<IPolicyLocator>(
			PolicyInformationPointService.CLASS_NAME,
			nameof(locator),
			locator
		);
		Guards.arrayOneOf(
			PolicyInformationPointService.CLASS_NAME,
			nameof(accessMode),
			accessMode,
			Object.values(PolicyInformationAccessMode)
		);

		const information: IPolicyInformation = {};

		await Promise.all(
			this._sources.map(async ({ sourceId, source }) => {
				try {
					const result = await source.retrieve(locator, accessMode, policies, data);

					if (Is.arrayValue(result)) {
						information[sourceId] = result;
					}
				} catch (error) {
					this._logging?.log({
						level: "error",
						source: PolicyInformationPointService.CLASS_NAME,
						ts: Date.now(),
						message: "sourceRetrieveFailed",
						data: {
							sourceId,
							locator: LocatorHelper.toString(locator)
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
		Guards.stringValue(PolicyInformationPointService.CLASS_NAME, nameof(sourceId), sourceId);
		Guards.objectValue<IPolicyInformationSource>(
			PolicyInformationPointService.CLASS_NAME,
			nameof(source),
			source
		);

		const currentIndex = this._sources.findIndex(s => s.sourceId === sourceId);
		if (currentIndex !== -1) {
			this._sources[currentIndex].source = source;
		} else {
			this._sources.push({ sourceId, source });
		}

		this._logging?.log({
			level: "info",
			source: PolicyInformationPointService.CLASS_NAME,
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
		Guards.stringValue(PolicyInformationPointService.CLASS_NAME, nameof(sourceId), sourceId);

		const currentIndex = this._sources.findIndex(s => s.sourceId === sourceId);
		if (currentIndex !== -1) {
			this._sources.splice(currentIndex, 1);
		}

		this._logging?.log({
			level: "info",
			source: PolicyInformationPointService.CLASS_NAME,
			ts: Date.now(),
			message: "unregisteredSource",
			data: {
				sourceId
			}
		});
	}
}
