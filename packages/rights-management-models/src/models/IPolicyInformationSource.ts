// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyInformationItems } from "./IPolicyInformationItems";
import type { IPolicyLocator } from "./IPolicyLocator";
import type { PolicyInformationAccessMode } from "./policyInformationAccessMode";

/**
 * Interface for policy information sources.
 */
export interface IPolicyInformationSource {
	/**
	 * Retrieve information from the sources.
	 * @param locator The locator to find relevant policies.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param policies The policies that apply to the data.
	 * @param data The data to process.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	retrieve<D = unknown>(
		locator: IPolicyLocator,
		accessMode: PolicyInformationAccessMode,
		policies?: IOdrlPolicy[],
		data?: D
	): Promise<IPolicyInformationItems | undefined>;
}
