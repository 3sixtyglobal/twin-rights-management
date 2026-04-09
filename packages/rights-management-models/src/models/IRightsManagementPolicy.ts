// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import type { RightsManagementPolicyType } from "./types/rightsManagementPolicyType.js";

/**
 * Base type for any ODRL policy stored and managed by the TWIN rights-management PAP.
 *
 * Defined as an intersection type (rather than `extends IDataspaceProtocolPolicy`)
 * because `IDataspaceProtocolPolicy["@type"]` is constrained to `OdrlPolicyType`
 * (the closed W3C ODRL enum). TWIN adds `"EcosystemPolicy"` as a platform extension
 * via `RightsManagementPolicyType`, which is a superset of `OdrlPolicyType`.
 *
 * All standard DSP policy types (`IDataspaceProtocolAgreement`, `IDataspaceProtocolOffer`,
 * `IDataspaceProtocolSet`) remain structurally assignable to this type because their
 * `"@type"` literals are all members of `RightsManagementPolicyType`.
 *
 * Use this type wherever the PAP needs to accept or return any policy regardless of
 * its specific subtype. Use the narrower `IRightsManagementEcosystemPolicy`,
 * `IDataspaceProtocolAgreement`, etc. when the specific subtype is known.
 */
export type IRightsManagementPolicy = Omit<IDataspaceProtocolPolicy, "@type"> & {
	/**
	 * The type of the policy. Includes all standard ODRL types plus TWIN extensions.
	 */
	"@type": RightsManagementPolicyType;
};
