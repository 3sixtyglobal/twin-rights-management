// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { OdrlActionType } from "@twin.org/standards-w3c-odrl";
import type { IRightsManagementPolicy } from "../IRightsManagementPolicy.js";
import type { PolicyInformationAccessMode } from "./policyInformationAccessMode.js";

/**
 * Interface describing a Policy Information Point (PIP) contract.
 * Provides additional information to the Policy Decision Point (PDP) when
 * it is making decisions.
 */
export interface IPolicyInformationPointComponent extends IComponent {
	/**
	 * Retrieve additional information which is relevant in the PDP decision making.
	 * @param policy The policy to retrieve the information for if available.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param data The data to get any additional information for.
	 * @param action Optional action to make a decision on, if not provided, the PIP will evaluate all actions in the policy.
	 * @returns Returns additional information based on the data and identities.
	 */
	retrieve<D = unknown>(
		policy: IRightsManagementPolicy | undefined,
		accessMode: PolicyInformationAccessMode,
		data?: D,
		action?: OdrlActionType | string
	): Promise<{ [id: string]: IJsonLdNodeObject }>;
}
