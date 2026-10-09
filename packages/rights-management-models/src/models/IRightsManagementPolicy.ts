// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolPolicy } from "@3sixty/standards-dataspace-protocol";
import type { IRightsManagementPolicyMetadata } from "./IRightsManagementPolicyMetadata.js";
import type { IRightsManagementPolicyTrust } from "./IRightsManagementPolicyTrust.js";

/**
 * Base type for any ODRL policy stored and managed by the TWIN rights-management PAP.
 */
export interface IRightsManagementPolicy
	extends IDataspaceProtocolPolicy, IRightsManagementPolicyMetadata, IRightsManagementPolicyTrust {}
