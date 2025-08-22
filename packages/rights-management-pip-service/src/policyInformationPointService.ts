// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { IPolicyInformationPointComponent } from "@twin.org/rights-management-models";
import type { IPolicyInformationPointServiceOptions } from "./models/IPolicyInformationPointServiceOptions";

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
	 * Create a new instance of PolicyInformationPointService (PIP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyInformationPointServiceOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Retrieve additional information which is relevant in the PDP decision making.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param data The data to get any additional information for.
	 * @param userIdentity The user identity to get additional information for.
	 * @param nodeIdentity The node identity to get additional information for.
	 * @returns Returns additional information based on the data and identities.
	 */
	public async retrieve<T = unknown>(
		assetType: string,
		action: string,
		data: T | undefined,
		userIdentity: string,
		nodeIdentity: string
	): Promise<IJsonLdNodeObject[]> {
		return [];
	}
}
