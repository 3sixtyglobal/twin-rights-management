// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyLocator } from "../IPolicyLocator.js";
import type { IPolicyInformationItems } from "./IPolicyInformationItems.js";
import type { PolicyInformationAccessMode } from "./policyInformationAccessMode.js";

/**
 * Interface for policy information sources.
 */
export interface IPolicyInformationSource extends IComponent {
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
