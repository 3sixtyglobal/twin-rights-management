// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRightsManagementEcosystemPolicy } from "../../IRightsManagementEcosystemPolicy.js";

/**
 * The response structure for getting an ecosystem policy.
 */
export interface IPapGetEcosystemPolicyResponse {
	/**
	 * The body of the response.
	 */
	body: IRightsManagementEcosystemPolicy;
}
