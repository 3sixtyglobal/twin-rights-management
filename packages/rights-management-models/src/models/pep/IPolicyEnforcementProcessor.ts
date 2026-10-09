// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@3sixty/core";
import type { IDataspaceProtocolAgreement } from "@3sixty/standards-dataspace-protocol";
import type { OdrlActionType } from "@3sixty/standards-w3c-odrl";
import type { IPolicyDecision } from "../pdp/IPolicyDecision.js";

/**
 * Interface for policy enforcement processors.
 */
export interface IPolicyEnforcementProcessor extends IComponent {
	/**
	 * Process the response from the policy decision point.
	 * @param agreement The agreement to process.
	 * @param decisions The decisions made by the policy decision point.
	 * @param data The data to process.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The data after processing.
	 */
	process<D = unknown, R = D>(
		agreement: IDataspaceProtocolAgreement,
		decisions: IPolicyDecision[],
		data?: D,
		action?: OdrlActionType | string
	): Promise<R>;
}
