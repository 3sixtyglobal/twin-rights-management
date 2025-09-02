// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards, Is, type IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyContext,
	type IPolicyInformationSource,
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
	public readonly CLASS_NAME: string = nameof<StaticPolicyInformationSource>();

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
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param context The context information to use in the decision making.
	 * @param data The data to process.
	 * @param policies The policies that apply to the data.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	public async retrieve<C extends IPolicyContext = IPolicyContext, D = unknown>(
		assetType: string,
		action: string,
		accessMode: PolicyInformationAccessMode,
		context: C | undefined,
		data: D | undefined,
		policies: IOdrlPolicy[]
	): Promise<IJsonLdNodeObject[] | undefined> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.arrayOneOf(
			this.CLASS_NAME,
			nameof(accessMode),
			accessMode,
			Object.values(PolicyInformationAccessMode)
		);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);

		const information: IJsonLdNodeObject[] = [];

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "staticRetrieving",
			data: {
				assetType,
				action,
				accessMode
			}
		});

		for (const info of this._information) {
			if (
				info.accessMode === accessMode ||
				accessMode === PolicyInformationAccessMode.Any ||
				info.accessMode === PolicyInformationAccessMode.Any
			) {
				let canAdd = true;
				if (Is.arrayValue(info.assetTypeActions)) {
					canAdd = info.assetTypeActions.some(
						assetTypeAction =>
							// The type assertions return boolean so don't want to use nullish coalescing
							// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
							(Is.empty(assetTypeAction.assetType) || assetTypeAction.assetType === assetType) &&
							// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
							(Is.empty(assetTypeAction.action) || assetTypeAction.action === action)
					);
				}
				if (canAdd) {
					information.push(...info.objects);
				}
			}
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "staticRetrieved",
			data: {
				assetType,
				action,
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
			this.CLASS_NAME,
			nameof(info.accessMode),
			info.accessMode,
			Object.values(PolicyInformationAccessMode)
		);
		Guards.arrayValue<IJsonLdNodeObject>(this.CLASS_NAME, nameof(info.objects), info.objects);
		this._information.push(info);
	}
}
