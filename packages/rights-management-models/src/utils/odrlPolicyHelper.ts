// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ObjectOrArray } from "@twin.org/core";
import { ArrayHelper, GeneralError, Guards, Is } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type {
	ActionType,
	IOdrlAction,
	IOdrlAsset,
	IOdrlParty,
	IOdrlPartyCollection,
	IOdrlPolicy
} from "@twin.org/standards-w3c-odrl";

/**
 * Helper methods for Odrl Policies.
 */
export class OdrlPolicyHelper {
	/**
	 * The class name of the Policy Administration Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<OdrlPolicyHelper>();

	/**
	 * Extract assignee identity from policy.
	 * @param policy The policy to extract the assignee from.
	 * @returns Assignee id.
	 * @throws GeneralError if assignee is missing or invalid.
	 */
	public static extractAssigneeIdentity(policy: IOdrlPolicy): ObjectOrArray<string> {
		if (Is.empty(policy.assignee)) {
			throw new GeneralError(OdrlPolicyHelper.CLASS_NAME, "policyMissingAssignee", {
				policyType: policy.type,
				policyId: policy.uid
			});
		}

		const assignees = ArrayHelper.fromObjectOrArray(policy.assignee);
		const assigneeIds: string[] = [];
		for (const assignee of assignees) {
			const assigneeId = Is.string(assignee) ? assignee : assignee.uid;
			Guards.stringValue(OdrlPolicyHelper.CLASS_NAME, nameof(assigneeId), assigneeId);
			assigneeIds.push(assigneeId);
		}

		return assigneeIds.length <= 1 ? assigneeIds[0] : assigneeIds;
	}

	/**
	 * Extract assigner identity from policy.
	 * @param policy The policy to extract the assigner from.
	 * @returns Assigner id.
	 * @throws GeneralError if assigner is missing or invalid.
	 */
	public static extractAssignerIdentity(policy: IOdrlPolicy): ObjectOrArray<string> {
		if (Is.empty(policy.assigner)) {
			throw new GeneralError(OdrlPolicyHelper.CLASS_NAME, "policyMissingAssigner", {
				policyType: policy.type,
				policyId: policy.uid
			});
		}

		const assigners = ArrayHelper.fromObjectOrArray(policy.assigner);
		const assignerIds: string[] = [];

		for (const assigner of assigners) {
			const assignerId = Is.string(assigner) ? assigner : assigner.uid;
			Guards.stringValue(OdrlPolicyHelper.CLASS_NAME, nameof(assignerId), assignerId);
			assignerIds.push(assignerId);
		}

		return assignerIds.length <= 1 ? assignerIds[0] : assignerIds;
	}

	/**
	 * Normalize party value(s) into identifier strings when possible.
	 * Handles single parties or arrays of parties by returning all discovered identifiers.
	 * @param party The party to normalize.
	 * @returns The party identifiers, or undefined when not available.
	 */
	public static getPartyIds(
		party?:
			| string
			| IOdrlParty
			| IOdrlPartyCollection
			| (string | IOdrlParty | IOdrlPartyCollection)[]
	): string[] {
		const ids: string[] = [];

		if (Is.empty(party)) {
			return ids;
		}

		if (Is.stringValue(party)) {
			ids.push(party);
			return ids;
		}

		if (Is.arrayValue(party)) {
			for (const item of party) {
				const childIds = OdrlPolicyHelper.getPartyIds(item);
				if (!Is.empty(childIds)) {
					for (const childId of childIds) {
						if (!ids.includes(childId)) {
							ids.push(childId);
						}
					}
				}
			}
			return ids;
		}

		if (Is.object<IOdrlParty>(party)) {
			if (Is.stringValue(party.uid) && !ids.includes(party.uid)) {
				ids.push(party.uid);
			} else if (Is.stringValue(party["@id"]) && !ids.includes(party["@id"])) {
				ids.push(party["@id"]);
			}
		}

		return ids;
	}

	/**
	 * Get targets from policy.
	 * @param policy The policy to extract the targets from.
	 * @returns Targets.
	 */
	public static getTargets(policy: IOdrlPolicy): string[] {
		const targetIds: string[] = [];
		const policyTargets = ArrayHelper.fromObjectOrArray<IOdrlAsset | string>(policy.target ?? []);
		for (const target of policyTargets) {
			if (Is.object<IOdrlAsset>(target)) {
				if (Is.stringValue(target.uid)) {
					targetIds.push(target.uid);
				}
			} else if (Is.stringValue(target)) {
				targetIds.push(target);
			}
		}
		return Array.from(new Set(targetIds));
	}

	/**
	 * Get actions from policy.
	 * @param policy The policy to extract the actions from.
	 * @returns Actions.
	 */
	public static getActions(policy: IOdrlPolicy): string[] {
		const actions: string[] = [];
		const policyActions = ArrayHelper.fromObjectOrArray<ActionType | string | IOdrlAction>(
			policy.action ?? []
		);
		for (const action of policyActions) {
			if (Is.object<IOdrlAction>(action)) {
				if (Is.stringValue(action.uid)) {
					actions.push(action.uid);
				}
			} else if (Is.stringValue(action)) {
				actions.push(action);
			}
		}
		return Array.from(new Set(actions));
	}

	/**
	 * Does the policy match.
	 * @param policy The policy to try and match.
	 * @param options The matching options.
	 * @param options.assignee The assignee to match.
	 * @param options.assigner The assigner to match.
	 * @param options.target The target to match.
	 * @returns True if the policy matches.
	 * @param options.action The action to match.
	 */
	public static matchPolicy(
		policy: IOdrlPolicy | undefined,
		options: {
			assignee?: string;
			assigner?: string;
			target?: string;
			action?: string;
		}
	): boolean {
		if (Is.empty(policy)) {
			return false;
		}

		if (Is.stringValue(options.assignee)) {
			const assigneeIds = OdrlPolicyHelper.getPartyIds(policy.assignee);
			if (!assigneeIds.includes(options.assignee)) {
				return false;
			}
		}

		if (Is.stringValue(options.assigner)) {
			const assignerIds = OdrlPolicyHelper.getPartyIds(policy.assigner);
			if (!assignerIds.includes(options.assigner)) {
				return false;
			}
		}

		if (Is.stringValue(options.target)) {
			const targets = OdrlPolicyHelper.getTargets(policy);
			if (!targets.includes(options.target)) {
				return false;
			}
		}

		if (Is.stringValue(options.action)) {
			const actions = OdrlPolicyHelper.getActions(policy);
			if (!actions.includes(options.action)) {
				return false;
			}
		}

		return true;
	}
}
