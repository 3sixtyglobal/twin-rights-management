// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyInformationPointComponent,
	OdrlPolicyHelper,
	PolicyInformationAccessMode,
	PolicyInformationSourceFactory
} from "@twin.org/rights-management-models";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import type { ActionType } from "@twin.org/standards-w3c-odrl";
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
	 * @param policy The policy to retrieve the information for if available.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param data The data to get any additional information for.
	 * @param action The action to get any additional information for.
	 * @returns Returns additional information based on the data and identities.
	 */
	public async retrieve<D = unknown>(
		policy: IDataspaceProtocolPolicy | undefined,
		accessMode: PolicyInformationAccessMode,
		data?: D,
		action?: ActionType | string
	): Promise<{ [id: string]: IJsonLdNodeObject }> {
		Guards.arrayOneOf(
			PolicyInformationPointService.CLASS_NAME,
			nameof(accessMode),
			accessMode,
			Object.values(PolicyInformationAccessMode)
		);

		let information: { [id: string]: IJsonLdNodeObject } = {};

		const sourceNames = PolicyInformationSourceFactory.names();
		const sources = sourceNames.map(sourceName => PolicyInformationSourceFactory.get(sourceName));

		await Promise.all(
			sources.map(async source => {
				try {
					const result = await source.retrieve(policy, accessMode, data, action);

					if (Is.objectValue(result)) {
						information = { ...information, ...result };
					}
				} catch (error) {
					await this._logging?.log({
						level: "error",
						source: PolicyInformationPointService.CLASS_NAME,
						ts: Date.now(),
						message: "sourceRetrieveFailed",
						data: {
							sourceId: source.className(),
							policyId: OdrlPolicyHelper.getUid(policy) ?? ""
						},
						error: BaseError.fromError(error)
					});
				}
			})
		);

		return information;
	}
}
