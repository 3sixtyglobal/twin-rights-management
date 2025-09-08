// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyInformationSource } from "./IPolicyInformationSource";
import type { PolicyInformationAccessMode } from "./policyInformationAccessMode";

/**
 * Interface describing a Policy Information Point (PEP) contract.
 * Provides additional information to the Policy Decision Point (PDP) when
 * it is making decisions.
 */
export interface IPolicyInformationPointComponent extends IComponent {
	/**
	 * Retrieve additional information which is relevant in the PDP decision making.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param nodeIdentity The identity of the node making the request.
	 * @param data The data to get any additional information for.
	 * @param policies The policies that apply to the data.
	 * @returns Returns additional information based on the data and identities.
	 */
	retrieve<D = unknown>(
		assetType: string,
		action: string,
		accessMode: PolicyInformationAccessMode,
		nodeIdentity: string,
		data: D | undefined,
		policies: IOdrlPolicy[]
	): Promise<{ [source: string]: IJsonLdNodeObject[] }>;

	/**
	 * Register a source to use for retrieval.
	 * @param sourceId The id of the source to register.
	 * @param source The source to register.
	 * @returns Nothing.
	 */
	registerSource(sourceId: string, source: IPolicyInformationSource): Promise<void>;

	/**
	 * Unregister a source from the retrieval.
	 * @param sourceId The id of the source to unregister.
	 * @returns Nothing.
	 */
	unregisterSource(sourceId: string): Promise<void>;
}
