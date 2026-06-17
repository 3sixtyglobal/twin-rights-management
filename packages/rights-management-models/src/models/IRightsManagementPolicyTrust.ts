// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";

/**
 * PAP-managed trust data attached to stored and returned ODRL policies.
 */
export interface IRightsManagementPolicyTrust {
	/**
	 * Trust verification data captured at the beginning of the negotiation.
	 */
	trustData?: { [key: string]: IJsonLdNodeObject };
}
