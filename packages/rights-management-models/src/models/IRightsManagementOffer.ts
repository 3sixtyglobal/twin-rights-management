// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolOffer } from "@3sixty/standards-dataspace-protocol";
import type { IRightsManagementPolicyMetadata } from "./IRightsManagementPolicyMetadata.js";
import type { IRightsManagementPolicyTrust } from "./IRightsManagementPolicyTrust.js";

/**
 * Offer policy returned by PAP, including optional PAP-managed lifecycle metadata.
 */
export interface IRightsManagementOffer
	extends IDataspaceProtocolOffer, IRightsManagementPolicyMetadata, IRightsManagementPolicyTrust {}
