// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ArrayHelper, GeneralError, Guards, Is } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type {
	ActionType,
	IOdrlAction,
	IOdrlAsset,
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
	public static extractAssigneeIdentity(policy: IOdrlPolicy): string {
		if (Is.empty(policy.assignee)) {
			throw new GeneralError(OdrlPolicyHelper.CLASS_NAME, "policyMissingAssignee", {
				policyType: policy.type,
				policyId: policy.uid
			});
		}

		// Handle both string and IOdrlParty formats
		const assignee = Is.string(policy.assignee) ? policy.assignee : policy.assignee.uid;

		Guards.stringValue(OdrlPolicyHelper.CLASS_NAME, nameof(assignee), assignee);

		return assignee;
	}

	/**
	 * Extract assigner identity from policy.
	 * @param policy The policy to extract the assigner from.
	 * @returns Assigner id.
	 * @throws GeneralError if assigner is missing or invalid.
	 */
	public static extractAssignerIdentity(policy: IOdrlPolicy): string {
		if (Is.empty(policy.assigner)) {
			throw new GeneralError(OdrlPolicyHelper.CLASS_NAME, "policyMissingAssigner", {
				policyType: policy.type,
				policyId: policy.uid
			});
		}

		// Handle both string and IOdrlParty formats
		const assigner = Is.string(policy.assigner) ? policy.assigner : policy.assigner.uid;

		Guards.stringValue(OdrlPolicyHelper.CLASS_NAME, nameof(assigner), assigner);

		return assigner;
	}

	/**
	 * Get assignee identity from policy.
	 * @param policy The policy to extract the assignee from.
	 * @returns Assignee id.
	 * @throws GeneralError if assignee is missing or invalid.
	 */
	public static getAssigneeIdentity(policy: IOdrlPolicy): string | undefined {
		return Is.string(policy.assignee) ? policy.assignee : policy.assignee?.uid;
	}

	/**
	 * Get assigner identity from policy.
	 * @param policy The policy to extract the assigner from.
	 * @returns Assigner id.
	 * @throws GeneralError if assigner is missing or invalid.
	 */
	public static getAssignerIdentity(policy: IOdrlPolicy): string | undefined {
		return Is.string(policy.assigner) ? policy.assigner : policy.assigner?.uid;
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
			const assignee = OdrlPolicyHelper.getAssigneeIdentity(policy);
			if (assignee !== options.assignee) {
				return false;
			}
		}

		if (Is.stringValue(options.assigner)) {
			const assigner = OdrlPolicyHelper.getAssignerIdentity(policy);
			if (assigner !== options.assigner) {
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
