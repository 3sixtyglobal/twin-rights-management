// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyInformation } from "./IPolicyInformation.js";
import type { IPolicyInformationSource } from "./IPolicyInformationSource.js";
import type { IPolicyLocator } from "../IPolicyLocator.js";
import type { PolicyInformationAccessMode } from "./policyInformationAccessMode.js";

/**
 * Interface describing a Policy Information Point (PEP) contract.
 * Provides additional information to the Policy Decision Point (PDP) when
 * it is making decisions.
 */
export interface IPolicyInformationPointComponent extends IComponent {
	/**
	 * Retrieve additional information which is relevant in the PDP decision making.
	 * @param locator The locator to find relevant policies.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param policies The policies that apply to the data.
	 * @param data The data to get any additional information for.
	 * @returns Returns additional information based on the data and identities.
	 */
	retrieve<D = unknown>(
		locator: IPolicyLocator,
		accessMode: PolicyInformationAccessMode,
		policies?: IOdrlPolicy[],
		data?: D
	): Promise<IPolicyInformation>;

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
