// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Well-known ODRL profile URIs used by the TWIN platform.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const OdrlProfiles = {
	/**
	 * The TWIN platform ODRL profile URI.
	 * Policies carrying this profile may use TWIN-specific vocabulary extensions
	 * (e.g. canonical twin:jsonPath + twin:jsonPathExpression operands).
	 * https://schema.3sixty.global/odrl/v1/
	 */
	Twin: "https://schema.3sixty.global/odrl/v1/profile",

	/**
	 * The TWIN platform ODRL vocabulary context URL.
	 * Used as the second entry in the `@context` array when policy extensions are used.
	 */
	TwinVocabContext: "https://schema.3sixty.global/odrl/v1/"
} as const;

/**
 * The ODRL profiles.
 */
export type OdrlProfiles = (typeof OdrlProfiles)[keyof typeof OdrlProfiles];
