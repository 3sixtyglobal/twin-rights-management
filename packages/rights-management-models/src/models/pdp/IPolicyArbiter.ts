// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IDataspaceProtocolAgreement } from "@twin.org/standards-dataspace-protocol";
import type { ActionType } from "@twin.org/standards-w3c-odrl";
import type { IPolicyDecision } from "./IPolicyDecision.js";

/**
 * Interface describing a Policy Arbiter.
 */
export interface IPolicyArbiter extends IComponent {
	/**
	 * Makes decisions regarding policy access to data.
	 * @param agreement The agreement to evaluate.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param data The data to make a decision on.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The decisions about access to the data.
	 */
	decide<D = unknown>(
		agreement: IDataspaceProtocolAgreement,
		information?: { [id: string]: IJsonLdNodeObject },
		data?: D,
		action?: ActionType | string
	): Promise<IPolicyDecision[]>;
}
