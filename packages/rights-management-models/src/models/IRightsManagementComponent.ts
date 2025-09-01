// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyContext } from "./IPolicyContext";

/**
 * Interface describing a unified Rights Management Component.
 * This serves as a single point of entry for all rights management operations.
 */
export interface IRightsManagementComponent extends IComponent {
	/**
	 * Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	papCreate(policy: Omit<IOdrlPolicy, "uid">): Promise<string>;

	/**
	 * PAP: Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns Nothing.
	 */
	papUpdate(policy: IOdrlPolicy): Promise<void>;

	/**
	 * PAP: Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @returns The policy.
	 */
	papRetrieve(policyId: string): Promise<IOdrlPolicy>;

	/**
	 * PAP: Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns Nothing.
	 */
	papRemove(policyId: string): Promise<void>;

	/**
	 * PAP: Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param pageSize The number of results to return per page.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	papQuery(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		pageSize?: number
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}>;

	/**
	 * PEP: Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param context The context information to use in the decision making.
	 * @param data The data to process.
	 * @returns The manipulated data with any policies applied.
	 */
	pepIntercept<C extends IPolicyContext = IPolicyContext, D = unknown>(
		assetType: string,
		action: string,
		context: C | undefined,
		data: D | undefined
	): Promise<Partial<D> | undefined>;
}
