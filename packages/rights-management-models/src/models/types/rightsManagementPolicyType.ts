// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { OdrlPolicyType } from "@twin.org/standards-w3c-odrl";

/**
 * TWIN rights-management policy types.
 * Extends the W3C ODRL policy types with TWIN-specific types that are not part
 * of the ODRL specification but are used by the TWIN platform.
 *
 * The object-spread pattern `{ ...OdrlPolicyType, ... } as const` is used so that
 * this constant and its companion type union act as a single source of truth for all
 * valid `@type` strings the PAP accepts, without forking or re-exporting the
 * platform-level `OdrlPolicyType` enum from the standards package.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const RightsManagementPolicyType = {
	...OdrlPolicyType,

	/**
	 * EcosystemPolicy type.
	 * A TWIN platform-level governance policy that carries obligations for data events.
	 * Not a bilateral contract — does not participate in DSP negotiation.
	 */
	EcosystemPolicy: "EcosystemPolicy"
} as const;

/**
 * TWIN rights-management policy types.
 */
export type RightsManagementPolicyType =
	(typeof RightsManagementPolicyType)[keyof typeof RightsManagementPolicyType];
