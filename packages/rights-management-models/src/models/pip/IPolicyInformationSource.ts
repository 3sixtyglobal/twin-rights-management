// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { PolicyInformationAccessMode } from "./policyInformationAccessMode.js";

/**
 * Interface for policy information sources.
 */
export interface IPolicyInformationSource extends IComponent {
	/**
	 * Retrieve information from the sources.
	 * @param policy The policy to retrieve information for if available.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param data The data to process.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	retrieve<D = unknown>(
		policy: IOdrlPolicy | undefined,
		accessMode: PolicyInformationAccessMode,
		data?: D
	): Promise<{ [id: string]: IJsonLdNodeObject } | undefined>;
}
