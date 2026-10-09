// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { OdrlPolicyType } from "@3sixty/standards-w3c-odrl";

/**
 * Interface describing criteria for locating policies.
 */
export interface IPolicyLocator {
	/**
	 * The type of policy to filter by.
	 */
	type?: OdrlPolicyType;

	/**
	 * The assigner to filter by.
	 */
	assigner?: string;

	/**
	 * The assignee to filter by.
	 */
	assignee?: string;

	/**
	 * The target to filter by.
	 */
	target?: string;

	/**
	 * The action to filter by.
	 */
	action?: string;
}
