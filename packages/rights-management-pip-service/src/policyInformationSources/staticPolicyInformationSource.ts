// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards, Is, type IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyInformationSource,
	type IPolicyLocator,
	LocatorHelper,
	PolicyInformationAccessMode
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IStaticPolicyInformationSource } from "../models/IStaticPolicyInformationSource";
import type { IStaticPolicyInformationSourceConstructorOptions } from "../models/IStaticPolicyInformationSourceConstructorOptions";

/**
 * Policy information source which retrieves static information.
 */
export class StaticPolicyInformationSource implements IPolicyInformationSource, IComponent {
	/**
	 * The class name of the Static Policy Information Source.
	 */
	public static readonly CLASS_NAME: string = nameof<StaticPolicyInformationSource>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The information sources.
	 * @internal
	 */
	private readonly _information: IStaticPolicyInformationSource[];

	/**
	 * Create a new instance of StaticPolicyInformationSource.
	 * @param options The options for the logging policy source.
	 */
	constructor(options?: IStaticPolicyInformationSourceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._information = options?.config?.information ?? [];
	}

	/**
	 * Retrieve information from the sources.
	 * @param locator The locator to find relevant policies.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param policies The policies that apply to the data.
	 * @param data The data to process.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	public async retrieve<D = unknown>(
		locator: IPolicyLocator,
		accessMode: PolicyInformationAccessMode,
		policies: IOdrlPolicy[],
		data?: D
	): Promise<IJsonLdNodeObject[] | undefined> {
		Guards.objectValue<IPolicyLocator>(
			StaticPolicyInformationSource.CLASS_NAME,
			nameof(locator),
			locator
		);
		Guards.arrayOneOf(
			StaticPolicyInformationSource.CLASS_NAME,
			nameof(accessMode),
			accessMode,
			Object.values(PolicyInformationAccessMode)
		);
		Guards.stringValue(
			StaticPolicyInformationSource.CLASS_NAME,
			nameof(locator.assignee),
			locator.assignee
		);

		const information: IJsonLdNodeObject[] = [];

		this._logging?.log({
			level: "info",
			source: StaticPolicyInformationSource.CLASS_NAME,
			ts: Date.now(),
			message: "staticRetrieving",
			data: {
				locator: LocatorHelper.toString(locator),
				accessMode
			}
		});

		for (const info of this._information) {
			if (
				info.accessMode === accessMode ||
				accessMode === PolicyInformationAccessMode.Any ||
				info.accessMode === PolicyInformationAccessMode.Any
			) {
				if (
					!Is.arrayValue(info.matchLocators) ||
					!Is.empty(LocatorHelper.findMatchingLocator(info.matchLocators, locator))
				) {
					information.push(...info.objects);
				}
			}
		}

		this._logging?.log({
			level: "info",
			source: StaticPolicyInformationSource.CLASS_NAME,
			ts: Date.now(),
			message: "staticRetrieved",
			data: {
				locator: LocatorHelper.toString(locator),
				accessMode,
				itemCount: information.length
			}
		});

		return information.length > 0 ? information : undefined;
	}

	/**
	 * Add static policy information.
	 * @param info The static policy information to add.
	 */
	public addInformation(info: IStaticPolicyInformationSource): void {
		Guards.arrayOneOf<string>(
			StaticPolicyInformationSource.CLASS_NAME,
			nameof(info.accessMode),
			info.accessMode,
			Object.values(PolicyInformationAccessMode)
		);
		Guards.arrayValue<IJsonLdNodeObject>(
			StaticPolicyInformationSource.CLASS_NAME,
			nameof(info.objects),
			info.objects
		);
		this._information.push(info);
	}
}
