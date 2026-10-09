// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Converter, Is, JsonHelper, ObjectHelper } from "@3sixty/core";
import { Blake2b } from "@3sixty/crypto";
import type { OdrlPolicyIndex } from "../entities/odrlPolicyIndex.js";

/**
 * Helper methods for building ODRL policy index entries.
 */
export class OdrlPolicyIndexHelper {
	/**
	 * Create the index entry for one combination of assigner, assignee, target and action. The
	 * values are case folded and hashed, and the id is derived from the policy id and values so the
	 * same combination always produces the same id.
	 * @param policyId The id of the policy the entry refers to.
	 * @param dateCreated The creation date of the policy.
	 * @param assigner The assigner party id.
	 * @param assignee The assignee party id.
	 * @param target The target asset id.
	 * @param action The action identifier.
	 * @returns The index entry.
	 */
	public static createIndexEntry(
		policyId: string,
		dateCreated: string,
		assigner?: string,
		assignee?: string,
		target?: string,
		action?: string
	): OdrlPolicyIndex {
		const foldedAssigner = OdrlPolicyIndexHelper.foldValue(assigner);
		const foldedAssignee = OdrlPolicyIndexHelper.foldValue(assignee);
		const foldedTarget = OdrlPolicyIndexHelper.foldValue(target);
		const foldedAction = OdrlPolicyIndexHelper.foldValue(action);

		// The id only covers the identifying fields, so it stays stable when the creation date is
		// backfilled or changes.
		const identity = {
			policyId,
			assigner: foldedAssigner,
			assignee: foldedAssignee,
			target: foldedTarget,
			action: foldedAction
		};

		return {
			id: Converter.bytesToHex(
				Blake2b.sum256(ObjectHelper.toBytes(JsonHelper.canonicalize(identity)))
			),
			...identity,
			assignerHash: OdrlPolicyIndexHelper.hashValue(foldedAssigner),
			assigneeHash: OdrlPolicyIndexHelper.hashValue(foldedAssignee),
			targetHash: OdrlPolicyIndexHelper.hashValue(foldedTarget),
			actionHash: OdrlPolicyIndexHelper.hashValue(foldedAction),
			dateCreated
		};
	}

	/**
	 * Hash an index value so the composite index key has a fixed size whatever the value length.
	 * The value is case folded first so lookups are case insensitive.
	 * @param value The value to hash.
	 * @returns The base64 url encoded Blake2b-160 hash, or undefined when there is no value.
	 */
	public static hashValue(value?: string): string | undefined {
		const folded = OdrlPolicyIndexHelper.foldValue(value);
		return Is.stringValue(folded)
			? Converter.bytesToBase64Url(Blake2b.sum160(Converter.utf8ToBytes(folded)))
			: undefined;
	}

	/**
	 * Case fold an index value.
	 * @param value The value to fold.
	 * @returns The lower cased value, or undefined when there is no value.
	 * @internal
	 */
	private static foldValue(value?: string): string | undefined {
		return Is.stringValue(value) ? value.toLowerCase() : undefined;
	}
}
