// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolAgreement } from "@twin.org/standards-dataspace-protocol";
import type { IRightsManagementPolicyMetadata } from "./IRightsManagementPolicyMetadata.js";

/**
 * Agreement policy returned by PAP, including optional PAP-managed lifecycle metadata.
 */
export type IRightsManagementAgreement = IDataspaceProtocolAgreement &
	IRightsManagementPolicyMetadata;
