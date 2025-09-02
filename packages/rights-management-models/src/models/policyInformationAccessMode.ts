// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The mode that be used to retrieve information from PIP sources.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyInformationAccessMode = {
	/**
	 * Public.
	 */
	Public: "public",

	/**
	 * Private.
	 */
	Private: "private",

	/**
	 * Any.
	 */
	Any: "any"
} as const;

/**
 * The mode that be used to retrieve information from PIP sources.
 */
export type PolicyInformationAccessMode =
	(typeof PolicyInformationAccessMode)[keyof typeof PolicyInformationAccessMode];
