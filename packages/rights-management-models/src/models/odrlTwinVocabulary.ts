// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Canonical TWIN constraint vocabulary used in ODRL policies.
 * Policy authors should reference these constants rather than hand-copying the strings.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const OdrlTwinVocabulary = {
	/**
	 * The canonical TWIN JSONPath constraint source alias.
	 * Used as the `source` property of an AssetCollection or as a prefix in
	 * composed target identifiers (`twin:jsonPath:<dataSource>:<expression>`).
	 */
	JsonPath: "twin:jsonPath",

	/**
	 * Constraint / context property carrying the JSONPath expression to evaluate.
	 */
	JsonPathExpression: "twin:jsonPathExpression",

	/**
	 * Optional constraint / context property that selects the named data source.
	 * When absent, defaults to "data".
	 */
	JsonPathDataSource: "twin:jsonPathDataSource",

	/**
	 * Key used to look up the primary data payload inside the data-sources map
	 * passed to the policy arbiter.
	 */
	DataSourceKey: "data",

	/**
	 * Key used to look up the information payload inside the data-sources map
	 * passed to the policy arbiter.
	 */
	InformationSourceKey: "information"
} as const;

/**
 * The ODRL TWIN vocabulary values.
 */
export type OdrlTwinVocabulary = (typeof OdrlTwinVocabulary)[keyof typeof OdrlTwinVocabulary];
