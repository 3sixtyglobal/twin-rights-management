// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import type {
	IOdrlAgreement,
	IOdrlOffer,
	IOdrlPolicy,
	IOdrlSet
} from "@twin.org/standards-w3c-odrl";

/**
 * Interface describing a Policy Administration Point (PAP) component that manages ODRL policies.
 */
export interface IPolicyAdministrationPointComponent extends IComponent {
	/**
	 * Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	create(policy: Omit<IOdrlPolicy, "uid"> & { uid?: string }): Promise<string>;

	/**
	 * Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns Nothing.
	 */
	update(policy: IOdrlPolicy): Promise<void>;

	/**
	 * Get a policy.
	 * @param policyId The id of the policy to get.
	 * @returns The policy.
	 */
	get(policyId: string): Promise<IOdrlPolicy>;

	/**
	 * Get an agreement.
	 * @param agreementId The id of the agreement to get.
	 * @returns The agreement.
	 */
	getAgreement(agreementId: string): Promise<IOdrlAgreement>;

	/**
	 * Get a set.
	 * @param setId The id of the set to get.
	 * @returns The set.
	 */
	getSet(setId: string): Promise<IOdrlSet>;

	/**
	 * Get an offer.
	 * @param offerId The id of the offer to get.
	 * @returns The offer.
	 */
	getOffer(offerId: string): Promise<IOdrlOffer>;

	/**
	 * Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns Nothing.
	 */
	remove(policyId: string): Promise<void>;

	/**
	 * Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param limit The number of results to return per page.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	query(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		limit?: number
	): Promise<{
		/**
		 * The cursor for the next page of results.
		 */
		cursor?: string;

		/**
		 * The policies that match the query.
		 */
		policies: IOdrlPolicy[];
	}>;
}
