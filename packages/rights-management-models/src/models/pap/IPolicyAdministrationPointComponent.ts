// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { JsonLdObjectWithOptionalAtId } from "@twin.org/data-json-ld";
import type { EntityCondition, SortDirection } from "@twin.org/entity";
import type { IRightsManagementAgreement } from "../IRightsManagementAgreement.js";
import type { IRightsManagementOffer } from "../IRightsManagementOffer.js";
import type { IRightsManagementPolicy } from "../IRightsManagementPolicy.js";
import type { IRightsManagementSet } from "../IRightsManagementSet.js";
import type { IPolicyLocator } from "./IPolicyLocator.js";

/**
 * Interface describing a Policy Administration Point (PAP) component that manages ODRL policies.
 */
export interface IPolicyAdministrationPointComponent extends IComponent {
	/**
	 * Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	create(policy: JsonLdObjectWithOptionalAtId<IRightsManagementPolicy>): Promise<string>;

	/**
	 * Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns A promise that resolves when the policy has been updated.
	 */
	update(policy: IRightsManagementPolicy): Promise<void>;

	/**
	 * Get a policy.
	 * @param policyId The id of the policy to get.
	 * @returns The policy.
	 */
	get(policyId: string): Promise<IRightsManagementPolicy>;

	/**
	 * Get an agreement.
	 * @param agreementId The id of the agreement to get.
	 * @returns The agreement.
	 */
	getAgreement(agreementId: string): Promise<IRightsManagementAgreement>;

	/**
	 * Get a set.
	 * @param setId The id of the set to get.
	 * @returns The set.
	 */
	getSet(setId: string): Promise<IRightsManagementSet>;

	/**
	 * Get an offer.
	 * @param offerId The id of the offer to get.
	 * @returns The offer.
	 */
	getOffer(offerId: string): Promise<IRightsManagementOffer>;

	/**
	 * Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns A promise that resolves when the policy has been removed.
	 */
	remove(policyId: string): Promise<void>;

	/**
	 * Query the policies using the specified conditions.
	 * @param locator Optional locator to filter by type, assigner, assignee, target, or action.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param limit The number of results to return per page.
	 * @param properties Optional list of policy property names to include in the response, the policy "@id" is always included.
	 * @param orderBy The policy property to order the results by.
	 * @param orderByDirection The direction for the order, defaults to descending.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	query(
		locator?: IPolicyLocator,
		conditions?: EntityCondition<IRightsManagementPolicy>,
		cursor?: string,
		limit?: number,
		properties?: (keyof IRightsManagementPolicy)[],
		orderBy?: keyof IRightsManagementPolicy,
		orderByDirection?: SortDirection
	): Promise<{
		/**
		 * The cursor for the next page of results.
		 */
		cursor?: string;

		/**
		 * The policies that match the query.
		 */
		policies: IRightsManagementPolicy[];
	}>;
}
