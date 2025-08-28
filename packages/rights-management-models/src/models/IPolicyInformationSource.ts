// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * Interface for policy information sources.
 */
export interface IPolicyInformationSource {
	/**
	 * Retrieve information from the sources.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param data The data to process.
	 * @param userIdentity The user identity to use in the decision making.
	 * @param nodeIdentity The node identity to use in the decision making.
	 * @param policies The policies that apply to the data.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	retrieve(
		assetType: string,
		action: string,
		data: unknown,
		userIdentity: string,
		nodeIdentity: string,
		policies: IOdrlPolicy[]
	): Promise<IJsonLdNodeObject[] | undefined>;
}
