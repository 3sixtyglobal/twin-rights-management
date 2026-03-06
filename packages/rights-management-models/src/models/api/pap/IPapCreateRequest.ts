// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { JsonLdObjectWithOptionalAtId } from "@twin.org/data-json-ld";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";

/**
 * The request structure for creating a policy.
 */
export interface IPapCreateRequest {
	/**
	 * The body of the request - the policy to create (id will be auto-generated if not provided).
	 */
	body: JsonLdObjectWithOptionalAtId<IDataspaceProtocolPolicy>;
}
