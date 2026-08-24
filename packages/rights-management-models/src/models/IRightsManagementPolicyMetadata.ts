// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * PAP-managed metadata attached to stored and returned ODRL policies.
 */
export interface IRightsManagementPolicyMetadata {
	/**
	 * schema.org dateCreated - ISO 8601 date-time set by PAP on create.
	 */
	dateCreated?: string;

	/**
	 * schema.org dateModified - ISO 8601 date-time set by PAP on create and update.
	 */
	dateModified?: string;
}
