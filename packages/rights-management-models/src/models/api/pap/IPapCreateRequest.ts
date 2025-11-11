// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * The request structure for creating a policy.
 */
export interface IPapCreateRequest {
	/**
	 * The body of the request - the policy to create (uid will be auto-generated).
	 */
	body: Omit<IOdrlPolicy, "uid"> & { uid?: string };
}
