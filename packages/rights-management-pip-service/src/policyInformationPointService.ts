// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, Guards, Is } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyInformation,
	type IPolicyInformationPointComponent,
	type IPolicyLocator,
	LocatorHelper,
	PolicyInformationAccessMode,
	PolicyInformationSourceFactory
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyInformationPointServiceConstructorOptions } from "./models/IPolicyInformationPointServiceConstructorOptions.js";

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
	 * Create a new instance of PolicyInformationPointService (PIP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyInformationPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyInformationPointService.CLASS_NAME;
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

		const sourceNames = PolicyInformationSourceFactory.names();
		const sources = sourceNames.map(sourceName => PolicyInformationSourceFactory.get(sourceName));

		await Promise.all(
			sources.map(async source => {
				try {
					const result = await source.retrieve(locator, accessMode, policies, data);

					if (Is.arrayValue(result)) {
						information[source.className()] = result;
					}
				} catch (error) {
					await this._logging?.log({
						level: "error",
						source: PolicyInformationPointService.CLASS_NAME,
						ts: Date.now(),
						message: "sourceRetrieveFailed",
						data: {
							sourceId: source.className(),
							locator: LocatorHelper.toString(locator)
						},
						error: BaseError.fromError(error)
					});
				}
			})
		);

		return information;
	}
}
