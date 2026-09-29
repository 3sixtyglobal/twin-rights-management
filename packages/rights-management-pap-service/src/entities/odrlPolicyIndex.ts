// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property, SortDirection } from "@twin.org/entity";

/**
 * Class describing an ODRL policy index entry used for query filtering. One entry is stored for
 * each combination of assigner, assignee, target and action a policy carries, so a locator which
 * filters on several of those fields is answered by a single lookup on the composite index instead
 * of one lookup per field.
 *
 * The composite index is built on fixed length hashes of the values rather than the values
 * themselves, so its key stays within the size limit some databases place on an index key however
 * long the values are.
 */
@entity()
export class OdrlPolicyIndex {
	/**
	 * The id of the index entry.
	 */
	@property({ type: "string", isPrimary: true, maxLength: 255 })
	public id!: string;

	/**
	 * The id of the policy this index entry refers to. It is the last key of the composite index so
	 * the entries of one policy are read contiguously, which means only the last policy of a page
	 * can carry over into the next one.
	 */
	@property({
		type: "string",
		maxLength: 255,
		isSecondary: true,
		sortDirection: SortDirection.Ascending,
		indexGroup: [{ name: "locator", direction: SortDirection.Ascending, index: 5 }]
	})
	public policyId!: string;

	/**
	 * An assigner party id of the policy, case folded so lookups do not depend on the column
	 * collation. Absent when the policy has no assigner.
	 */
	@property({ type: "string", maxLength: 128, optional: true })
	public assigner?: string;

	/**
	 * The hash of the assigner, used for lookups. Absent when the policy has no assigner.
	 */
	@property({
		type: "string",
		maxLength: 27,
		isSecondary: true,
		optional: true,
		indexGroup: [{ name: "locator", direction: SortDirection.Ascending, index: 0 }]
	})
	public assignerHash?: string;

	/**
	 * An assignee party id of the policy, case folded so lookups do not depend on the column
	 * collation. Absent when the policy has no assignee.
	 */
	@property({ type: "string", maxLength: 128, optional: true })
	public assignee?: string;

	/**
	 * The hash of the assignee, used for lookups. Absent when the policy has no assignee.
	 */
	@property({
		type: "string",
		maxLength: 27,
		isSecondary: true,
		optional: true,
		indexGroup: [{ name: "locator", direction: SortDirection.Ascending, index: 1 }]
	})
	public assigneeHash?: string;

	/**
	 * A target asset id of the policy, case folded so lookups do not depend on the column
	 * collation. Absent when the policy has no target.
	 */
	@property({ type: "string", maxLength: 255, optional: true })
	public target?: string;

	/**
	 * The hash of the target, used for lookups. Absent when the policy has no target.
	 */
	@property({
		type: "string",
		maxLength: 27,
		isSecondary: true,
		optional: true,
		indexGroup: [{ name: "locator", direction: SortDirection.Ascending, index: 2 }]
	})
	public targetHash?: string;

	/**
	 * An action identifier of the policy, case folded so lookups do not depend on the column
	 * collation. Absent when the policy has no action.
	 */
	@property({ type: "string", maxLength: 64, optional: true })
	public action?: string;

	/**
	 * The hash of the action, used for lookups. Absent when the policy has no action.
	 */
	@property({
		type: "string",
		maxLength: 27,
		isSecondary: true,
		optional: true,
		indexGroup: [{ name: "locator", direction: SortDirection.Ascending, index: 3 }]
	})
	public actionHash?: string;

	/**
	 * The date/time of when the policy was created, copied so the index can order and page its own
	 * matches without reading the policies.
	 */
	@property({
		type: "string",
		format: "date-time",
		sortDirection: SortDirection.Descending,
		indexGroup: [{ name: "locator", direction: SortDirection.Descending, index: 4 }]
	})
	public dateCreated!: string;
}
