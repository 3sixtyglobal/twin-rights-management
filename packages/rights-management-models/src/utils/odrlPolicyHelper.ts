// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is } from "@twin.org/core";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyLocator } from "../models/IPolicyLocator.js";

/**
 * Helper methods for Odrl Policies.
 */
export class OdrlPolicyHelper {
	/**
	 * Find the expiration date of the policy.
	 * @param policy The policy to check.
	 * @param assetType The type of the asset, if undefined will match any asset type.
	 * @param action The action to check, if undefined will match any action.
	 * @returns The expiration date of the policy, or undefined if not found.
	 */
	public static findExpirationDate(
		policy: IOdrlPolicy,
		assetType?: string,
		action?: string
	): string | undefined {
		if (Is.arrayValue(policy.permission)) {
			for (const permission of policy.permission) {
				const matchesPermission = OdrlPolicyHelper.matchTargetAndAction(
					permission.target,
					permission.action,
					{
						assetType,
						action
					}
				);
				if (matchesPermission && Is.arrayValue(permission.constraint)) {
					for (const constraint of permission.constraint) {
						if (
							constraint.leftOperand === "dateTime" &&
							constraint.operator === "lteq" &&
							Is.dateTimeString(constraint.rightOperand)
						) {
							return constraint.rightOperand as string;
						}
					}
				}
			}
		}
	}

	/**
	 * Match the target to the requested asset type.
	 * @param target The target to match.
	 * @param matchAssetType The asset type to match.
	 * @param matchResourceId The resource id to match.
	 * @returns True if the target is empty, the target matches the requested asset, false otherwise.
	 */
	public static matchAsset(
		target?: IOdrlPolicy["target"],
		matchAssetType?: string,
		matchResourceId?: string
	): boolean {
		if (Is.empty(target) || Is.empty(matchAssetType)) {
			return true;
		}

		if (Is.arrayValue(target)) {
			return target.some(t => OdrlPolicyHelper.matchAsset(t, matchAssetType));
		}

		if (Is.stringValue(target)) {
			return target === matchAssetType;
		}

		// TODO: This currently only handles the simple case of matching a single asset type.
		// we need further processing if the target is more complex.
		// we also need to support the resource id matching.
		return false;
	}

	/**
	 * Match the action to the asset type.
	 * @param action The action to match.
	 * @param matchAction The action to match.
	 * @returns True if the action is empty, the action matches the asset type, false otherwise.
	 */
	public static matchAction(action?: IOdrlPolicy["action"], matchAction?: string): boolean {
		if (Is.empty(action) || Is.empty(matchAction)) {
			return true;
		}

		if (Is.arrayValue(action)) {
			return action.some(a => OdrlPolicyHelper.matchAction(a, matchAction));
		}

		if (Is.stringValue(action)) {
			return action === matchAction;
		}

		// TODO: This currently only handles the simple case of matching a single action type.
		// we need further processing if the action is more complex.
		return false;
	}

	/**
	 * Match the assignee.
	 * @param assignee The assignee to match.
	 * @param matchAssignee The assignee to match.
	 * @returns True if the assignee is empty, the assignee matches the asset type, false otherwise.
	 */
	public static matchAssignee(assignee?: IOdrlPolicy["assignee"], matchAssignee?: string): boolean {
		if (Is.empty(assignee) || Is.empty(matchAssignee)) {
			return true;
		}

		if (Is.stringValue(assignee)) {
			return assignee === matchAssignee;
		}

		// TODO: This currently only handles the simple case of matching a single assignee.
		// we need further processing if the assignee is more complex.
		return false;
	}

	/**
	 * Match the target and action to the requested asset type and action.
	 * @param target The target to match.
	 * @param action The action to match.
	 * @param locator The locator to match resource id if provided.
	 * @returns True if the target and action match the requested asset type and action, false otherwise.
	 */
	public static matchTargetAndAction(
		target?: IOdrlPolicy["target"],
		action?: IOdrlPolicy["action"],
		locator?: Omit<IPolicyLocator, "assignee">
	): boolean {
		const assetTypeMatch = OdrlPolicyHelper.matchAsset(
			target,
			locator?.assetType,
			locator?.resourceId
		);
		const actionMatch = OdrlPolicyHelper.matchAction(action, locator?.action);
		return assetTypeMatch && actionMatch;
	}

	/**
	 * Match the complete locator.
	 * @param assignee The assignee to match.
	 * @param target The target to match.
	 * @param action The action to match.
	 * @param locator The locator to match resource id if provided.
	 * @returns True if the complete locator matches, false otherwise.
	 */
	public static matchLocator(
		assignee?: IOdrlPolicy["assignee"],
		target?: IOdrlPolicy["target"],
		action?: IOdrlPolicy["action"],
		locator?: IPolicyLocator
	): boolean {
		const assetTypeMatch = OdrlPolicyHelper.matchAsset(
			target,
			locator?.assetType,
			locator?.resourceId
		);
		const assigneeMatch = OdrlPolicyHelper.matchAssignee(assignee, locator?.assignee);
		const actionMatch = OdrlPolicyHelper.matchAction(action, locator?.action);
		return assetTypeMatch && assigneeMatch && actionMatch;
	}
}
