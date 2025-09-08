// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { PolicyInformationAccessMode } from "./policyInformationAccessMode";

/**
 * Interface for policy information sources.
 */
export interface IPolicyInformationSource {
	/**
	 * Retrieve information from the sources.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param nodeIdentity The identity of the node making the request.
	 * @param data The data to process.
	 * @param policies The policies that apply to the data.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	retrieve<D = unknown>(
		assetType: string,
		action: string,
		accessMode: PolicyInformationAccessMode,
		nodeIdentity: string,
		data: D | undefined,
		policies: IOdrlPolicy[]
	): Promise<IJsonLdNodeObject[] | undefined>;
}
