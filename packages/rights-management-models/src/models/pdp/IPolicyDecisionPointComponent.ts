// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@3sixty/core";
import type { IJsonLdNodeObject } from "@3sixty/data-json-ld";
import type { IDataspaceProtocolAgreement } from "@3sixty/standards-dataspace-protocol";
import type { OdrlActionType } from "@3sixty/standards-w3c-odrl";
import type { IPolicyDecision } from "./IPolicyDecision.js";

/**
 * Interface describing a Policy Decision Point (PDP) contract.
 * Decides if a party can be granted access to a resource, will retrieve policies
 * from the Policy Management Point (PMP) and any additional information from the
 * Policy Information Point (PIP). When a decision is made, the Policy Execution
 * Point (PEP) will execute any registered actions.
 */
export interface IPolicyDecisionPointComponent extends IComponent {
	/**
	 * Evaluate requests from a Policy Enforcement Point (PEP).
	 * Uses the Policy Management Point (PMP) to retrieve the policies and the
	 * Policy Information Point (PIP) to retrieve additional information.
	 * Executes any actions on the Policy Execution Point (PXP) before and after decision is made.
	 * @param agreement The agreement to evaluate.
	 * @param data The data to make a decision on.
	 * @param action Optional action to make a decision on, if not provided, the PDP will evaluate all actions in the agreement.
	 * @param trustData Trust verification data to merge with PIP-retrieved information before arbitration.
	 * @returns Returns the policy decisions which apply to the data so that the PEP
	 * can manipulate the data accordingly.
	 */
	evaluate<D = unknown>(
		agreement: IDataspaceProtocolAgreement,
		data?: D,
		action?: OdrlActionType | string,
		trustData?: { [key: string]: IJsonLdNodeObject }
	): Promise<IPolicyDecision[]>;
}
