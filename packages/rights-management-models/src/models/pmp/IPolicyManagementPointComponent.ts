// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@3sixty/core";
import type { IRightsManagementPolicy } from "../IRightsManagementPolicy.js";
import type { IPolicyLocator } from "../pap/IPolicyLocator.js";

/**
 * Interface describing a Policy Management Point (PMP) contract.
 * Provide the policies to the Policy Decision Point (PDP) based on the data and identities.
 */
export interface IPolicyManagementPointComponent extends IComponent {
	/**
	 * Get the policies from a PAP based on the data and identities.
	 * @param locator Optional locator to filter by type, assigner, assignee, target, or action.
	 * @param cursor An optional cursor to continue a previous query.
	 * @returns Returns the policies which apply to the data and identities so that the PDP can make a decision.
	 */
	retrieve(
		locator?: IPolicyLocator,
		cursor?: string
	): Promise<{
		policies: IRightsManagementPolicy[];
		cursor?: string;
	}>;
}
