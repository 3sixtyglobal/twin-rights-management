// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	PolicyInformationAccessMode,
	type IPolicyInformationSource
} from "@twin.org/rights-management-models";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import type { OdrlActionType } from "@twin.org/standards-w3c-odrl";
import type { IStaticPolicyInformationSource } from "../models/IStaticPolicyInformationSource.js";
import type { IStaticPolicyInformationSourceConstructorOptions } from "../models/IStaticPolicyInformationSourceConstructorOptions.js";

/**
 * Policy information source which retrieves static information.
 */
export class StaticPolicyInformationSource implements IPolicyInformationSource {
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
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return StaticPolicyInformationSource.CLASS_NAME;
	}

	/**
	 * Retrieve information from the sources.
	 * @param policy The policy to retrieve information for if available.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param data The data to process.
	 * @param action The action to get any additional information for.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	public async retrieve<D = unknown>(
		policy: IDataspaceProtocolPolicy | undefined,
		accessMode: PolicyInformationAccessMode,
		data?: D,
		action?: OdrlActionType | string
	): Promise<{ [id: string]: IJsonLdNodeObject } | undefined> {
		Guards.arrayOneOf(
			StaticPolicyInformationSource.CLASS_NAME,
			nameof(accessMode),
			accessMode,
			Object.values(PolicyInformationAccessMode)
		);

		let information: { [id: string]: IJsonLdNodeObject } = {};

		await this._logging?.log({
			level: "info",
			source: StaticPolicyInformationSource.CLASS_NAME,
			ts: Date.now(),
			message: "staticRetrieving",
			data: {
				policyId: OdrlPolicyHelper.getUid(policy) ?? "",
				accessMode
			}
		});

		for (const info of this._information) {
			if (
				info.accessMode === accessMode ||
				accessMode === PolicyInformationAccessMode.Any ||
				info.accessMode === PolicyInformationAccessMode.Any
			) {
				const matchLocators = info.matchLocators;
				if (
					!Is.arrayValue(matchLocators) ||
					matchLocators.some(locator => OdrlPolicyHelper.matchPolicy(policy, locator))
				) {
					information = {
						...information,
						...info.objects
					};
				}
			}
		}

		await this._logging?.log({
			level: "info",
			source: StaticPolicyInformationSource.CLASS_NAME,
			ts: Date.now(),
			message: "staticRetrieved",
			data: {
				policyId: OdrlPolicyHelper.getUid(policy) ?? "",
				accessMode,
				itemCount: Object.keys(information).length
			}
		});

		return Object.keys(information).length > 0 ? information : undefined;
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
		Guards.objectValue<{ [id: string]: IJsonLdNodeObject }>(
			StaticPolicyInformationSource.CLASS_NAME,
			nameof(info.objects),
			info.objects
		);
		this._information.push(info);
	}
}
