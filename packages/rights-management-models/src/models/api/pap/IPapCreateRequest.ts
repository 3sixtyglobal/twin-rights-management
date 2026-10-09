// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { JsonLdObjectWithOptionalAtId } from "@3sixty/data-json-ld";
import type { IRightsManagementPolicy } from "../../IRightsManagementPolicy.js";

/**
 * The request structure for creating a policy.
 */
export interface IPapCreateRequest {
	/**
	 * The body of the request - the policy to create (id will be auto-generated if not provided).
	 */
	body: JsonLdObjectWithOptionalAtId<IRightsManagementPolicy>;
}
