// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@3sixty/core";
import type { IDataspaceProtocolAgreement } from "@3sixty/standards-dataspace-protocol";
import type { OdrlActionType } from "@3sixty/standards-w3c-odrl";
import type { IRightsManagementInformation } from "../IRightsManagementInformation.js";
import type { IPolicyDecision } from "./IPolicyDecision.js";

/**
 * Interface describing a Policy Arbiter.
 */
export interface IPolicyArbiter extends IComponent {
	/**
	 * Makes decisions regarding policy access to data.
	 * @param agreement The agreement to evaluate.
	 * @param information Named objects available to the arbiter during evaluation. Values are accessed
	 * via JSONPath and may be any type - structured JSON-LD nodes, plain objects, or scalar primitives.
	 * @param data The data to make a decision on.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The decisions about access to the data.
	 */
	decide<D = unknown>(
		agreement: IDataspaceProtocolAgreement,
		information?: IRightsManagementInformation,
		data?: D,
		action?: OdrlActionType | string
	): Promise<IPolicyDecision[]>;
}
