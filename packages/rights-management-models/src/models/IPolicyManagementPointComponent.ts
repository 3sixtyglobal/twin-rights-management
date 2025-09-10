// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyLocator } from "./IPolicyLocator";

/**
 * Interface describing a Policy Management Point (PMP) contract.
 * Provide the policies to the Policy Decision Point (PDP) based on the data and identities.
 */
export interface IPolicyManagementPointComponent extends IComponent {
	/**
	 * Get the policies from a PAP based on the data and identities.
	 * @param locator The locator to find relevant policies.
	 * @param data The data to retrieve the policies for.
	 * @param cursor An optional cursor to continue a previous query.
	 * @returns Returns the policies which apply to the data and identities so that the PDP can make a decision.
	 */
	retrieve<D = unknown>(
		locator: IPolicyLocator,
		data?: D,
		cursor?: string
	): Promise<{
		policies: IOdrlPolicy[];
		cursor?: string;
	}>;
}
