// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is } from "@twin.org/core";
import type { IPolicyLocator } from "../models/IPolicyLocator";

/**
 * Helper methods for Locator.
 */
export class LocatorHelper {
	/**
	 * Converts to a readable string.
	 * @param locator The policy locator.
	 * @returns The details of the locator as a string.
	 */
	public static toString(locator: IPolicyLocator): string {
		const parts = [];

		if (Is.stringValue(locator.assignee)) {
			parts.push(`Assignee: ${locator.assignee}`);
		}
		if (Is.stringValue(locator.action)) {
			parts.push(`Action: ${locator.action}`);
		}
		if (Is.stringValue(locator.assetType)) {
			parts.push(`Asset Type: ${locator.assetType}`);
		}
		if (Is.stringValue(locator.resourceId)) {
			parts.push(`Resource ID: ${locator.resourceId}`);
		}

		return parts.join(", ");
	}

	/**
	 * Compares locators to see if they match.
	 * @param locator1 The first policy locator.
	 * @param locator2 The second policy locator.
	 * @returns True if the locators match, false otherwise.
	 */
	public static matches(locator1: IPolicyLocator, locator2: IPolicyLocator): boolean {
		return (
			// The type assertions return boolean so don't want to use nullish coalescing
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			(Is.empty(locator1.assetType) || locator1.assetType === locator2.assetType) &&
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			(Is.empty(locator1.action) || locator1.action === locator2.action) &&
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			(Is.empty(locator1.assignee) || locator1.assignee === locator2.assignee) &&
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			(Is.empty(locator1.resourceId) || locator1.resourceId === locator2.resourceId)
		);
	}

	/**
	 * Finds a matching locator from a list of locators.
	 * @param locators The list of policy locators.
	 * @param targetLocator The target policy locator to find.
	 * @returns The matching locator if found, undefined otherwise.
	 */
	public static findMatchingLocator(
		locators: IPolicyLocator[] | undefined,
		targetLocator: IPolicyLocator
	): IPolicyLocator | undefined {
		if (!Is.arrayValue(locators)) {
			return undefined;
		}
		return locators.find(locator => LocatorHelper.matches(locator, targetLocator));
	}
}
