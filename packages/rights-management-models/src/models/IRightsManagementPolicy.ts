// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import type { OdrlPolicyType } from "@twin.org/standards-w3c-odrl";
import type { IRightsManagementPolicyMetadata } from "./IRightsManagementPolicyMetadata.js";

/**
 * Base type for any ODRL policy stored and managed by the TWIN rights-management PAP.
 */
export type IRightsManagementPolicy = Omit<IDataspaceProtocolPolicy, "@type"> &
	IRightsManagementPolicyMetadata & {
		"@type": OdrlPolicyType;
	};
