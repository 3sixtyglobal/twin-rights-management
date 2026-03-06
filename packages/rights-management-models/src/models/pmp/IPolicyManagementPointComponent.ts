// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";

/**
 * Interface describing a Policy Management Point (PMP) contract.
 * Provide the policies to the Policy Decision Point (PDP) based on the data and identities.
 */
export interface IPolicyManagementPointComponent extends IComponent {
	/**
	 * Get the policies from a PAP based on the data and identities.
	 * @param options Optional options to filter by assigner or assignee.
	 * @param options.assigner The assigner to filter by.
	 * @param options.assignee The assignee to filter by.
	 * @param options.target The target to filter by.
	 * @param options.action The action to filter by.
	 * @param cursor An optional cursor to continue a previous query.
	 * @returns Returns the policies which apply to the data and identities so that the PDP can make a decision.
	 */
	retrieve(
		options?: {
			assigner?: string;
			assignee?: string;
			target?: string;
			action?: string;
		},
		cursor?: string
	): Promise<{
		policies: IDataspaceProtocolPolicy[];
		cursor?: string;
	}>;
}
