// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Named objects available to the rights management components during policy evaluation.
 * Values are accessed via JSONPath and may be any type - structured JSON-LD nodes,
 * plain objects, or scalar primitives.
 */
export interface IRightsManagementInformation {
	[id: string]: unknown;
}
