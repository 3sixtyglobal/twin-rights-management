// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ObjectOrArray } from "@3sixty/core";
import { ArrayHelper, GeneralError, Guards, Is, ObjectHelper } from "@3sixty/core";
import { nameof } from "@3sixty/nameof";
import type { IDataspaceProtocolPolicy } from "@3sixty/standards-dataspace-protocol";
import type {
	IOdrlAction,
	IOdrlAsset,
	IOdrlAssetCollection,
	IOdrlDuty,
	IOdrlParty,
	IOdrlPartyCollection,
	IOdrlPermission,
	IOdrlProhibition,
	IOdrlRule,
	OdrlActionType
} from "@3sixty/standards-w3c-odrl";
import type { IRightsManagementPolicy } from "../models/IRightsManagementPolicy.js";

/**
 * Helper methods for Odrl Policies.
 */
export class OdrlPolicyHelper {
	/**
	 * The class name of the Policy Administration Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<OdrlPolicyHelper>();

	/**
	 * Get the UID of an ODRL policy or related object if available.
	 * @param object The ODRL policy or related object to get the UID from.
	 * @returns The UID of the object if available, otherwise undefined.
	 */
	public static getUid(object: object | undefined): string | undefined {
		return ObjectHelper.extractProperty<string>(object, ["@id", "id", "uid"], false);
	}

	/**
	 * Get the type of an ODRL policy or related object if available.
	 * @param object The ODRL policy or related object to get the type from.
	 * @returns The type of the object if available, otherwise undefined.
	 */
	public static getType(object: object | undefined): string | undefined {
		return ObjectHelper.extractProperty<string>(object, ["@type", "type"], false);
	}

	/**
	 * Extract assignee identity from policy.
	 * @param policy The policy to extract the assignee from.
	 * @returns Assignee id.
	 * @throws GeneralError if assignee is missing or invalid.
	 */
	public static extractAssigneeIdentity(policy: IDataspaceProtocolPolicy): ObjectOrArray<string> {
		if (Is.empty(policy.assignee)) {
			throw new GeneralError(OdrlPolicyHelper.CLASS_NAME, "policyMissingAssignee", {
				policyType: OdrlPolicyHelper.getType(policy) ?? "",
				policyId: OdrlPolicyHelper.getUid(policy) ?? ""
			});
		}

		const assignees = ArrayHelper.fromObjectOrArray(policy.assignee);
		const assigneeIds: string[] = [];
		for (const assignee of assignees) {
			const assigneeId = Is.string(assignee) ? assignee : OdrlPolicyHelper.getUid(assignee);
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
	public static extractAssignerIdentity(policy: IDataspaceProtocolPolicy): ObjectOrArray<string> {
		if (Is.empty(policy.assigner)) {
			throw new GeneralError(OdrlPolicyHelper.CLASS_NAME, "policyMissingAssigner", {
				policyType: OdrlPolicyHelper.getType(policy) ?? "",
				policyId: OdrlPolicyHelper.getUid(policy) ?? ""
			});
		}

		const assigners = ArrayHelper.fromObjectOrArray(policy.assigner);
		const assignerIds: string[] = [];

		for (const assigner of assigners) {
			const assignerId = Is.string(assigner) ? assigner : OdrlPolicyHelper.getUid(assigner);
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
			string | IOdrlParty | IOdrlPartyCollection | (string | IOdrlParty | IOdrlPartyCollection)[]
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
			const uid = OdrlPolicyHelper.getUid(party);
			if (Is.stringValue(uid) && !ids.includes(uid)) {
				ids.push(uid);
			}
		}

		return ids;
	}

	/**
	 * Get the dataset targets from policy.
	 * @param policy The policy to extract the dataset targets from.
	 * @returns Top-level targets (deduped).
	 */
	public static getDatasetTargets(policy: IRightsManagementPolicy): string[] {
		const targetIds: string[] = [];

		const policyTargets = ArrayHelper.fromObjectOrArray<IOdrlAsset | IOdrlAssetCollection | string>(
			policy.target ?? []
		);
		for (const target of policyTargets) {
			OdrlPolicyHelper.collectTarget(target, targetIds);
		}

		return Array.from(new Set(targetIds));
	}

	/**
	 * Get targets from policy.
	 * Walks both the policy-level target field and the target field on every
	 * permission, prohibition, and obligation rule so that policies that store
	 * their target exclusively on a rule are correctly indexed for query().
	 * @param policy The policy to extract the targets from.
	 * @returns Targets.
	 */
	public static getTargets(policy: IRightsManagementPolicy): string[] {
		const targetIds: string[] = OdrlPolicyHelper.getDatasetTargets(policy);

		const rules = OdrlPolicyHelper.collectRules(policy);
		for (const rule of rules) {
			const ruleTargets = ArrayHelper.fromObjectOrArray<IOdrlAsset | IOdrlAssetCollection | string>(
				rule.target ?? []
			);
			for (const target of ruleTargets) {
				OdrlPolicyHelper.collectTarget(target, targetIds);
			}
		}

		return Array.from(new Set(targetIds));
	}

	/**
	 * Get actions from policy.
	 * Walks both the policy-level action field and the action field on every
	 * permission, prohibition, and obligation rule so that policies that store
	 * their action exclusively on a rule are correctly indexed for query().
	 * @param policy The policy to extract the actions from.
	 * @returns Actions.
	 */
	public static getActions(policy: IRightsManagementPolicy): string[] {
		const actions: string[] = [];

		const policyActions = ArrayHelper.fromObjectOrArray<OdrlActionType | string | IOdrlAction>(
			policy.action ?? []
		);
		for (const action of policyActions) {
			OdrlPolicyHelper.collectAction(action, actions);
		}

		const rules = OdrlPolicyHelper.collectRules(policy);
		for (const rule of rules) {
			const ruleActions = ArrayHelper.fromObjectOrArray<OdrlActionType | string | IOdrlAction>(
				rule.action ?? []
			);
			for (const action of ruleActions) {
				OdrlPolicyHelper.collectAction(action, actions);
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
	 * @param options.action The action to match.
	 * @returns True if the policy matches.
	 */
	public static matchPolicy(
		policy: IRightsManagementPolicy | undefined,
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

	/**
	 * Collect all rule objects (permission, prohibition, obligation) from a policy.
	 * @param policy The policy to collect rules from.
	 * @returns Flattened array of all rules.
	 * @internal
	 */
	private static collectRules(policy: IRightsManagementPolicy): IOdrlRule[] {
		const rules: IOdrlRule[] = [];
		rules.push(
			...ArrayHelper.fromObjectOrArray<IOdrlPermission>(policy.permission ?? []),
			...ArrayHelper.fromObjectOrArray<IOdrlProhibition>(policy.prohibition ?? []),
			...ArrayHelper.fromObjectOrArray<IOdrlDuty>(policy.obligation ?? [])
		);
		return rules;
	}

	/**
	 * Extract a target string from a target value and push it to the accumulator.
	 * @param target The target value to extract from.
	 * @param accumulator The array to push the target string into.
	 * @internal
	 */
	private static collectTarget(
		target: IOdrlAsset | IOdrlAssetCollection | string,
		accumulator: string[]
	): void {
		if (Is.object<IOdrlAsset>(target)) {
			const uid = OdrlPolicyHelper.getUid(target);
			if (Is.stringValue(uid)) {
				accumulator.push(uid);
			}
		} else if (Is.stringValue(target)) {
			accumulator.push(target);
		}
	}

	/**
	 * Extract an action string from an action value and push it to the accumulator.
	 * @param action The action value to extract from.
	 * @param accumulator The array to push the action string into.
	 * @internal
	 */
	private static collectAction(
		action: OdrlActionType | string | IOdrlAction,
		accumulator: string[]
	): void {
		if (Is.object<IOdrlAction>(action)) {
			const uid = OdrlPolicyHelper.getUid(action);
			if (Is.stringValue(uid)) {
				accumulator.push(uid);
			}
		} else if (Is.stringValue(action)) {
			accumulator.push(action);
		}
	}
}
