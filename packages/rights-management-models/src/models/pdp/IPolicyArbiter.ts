// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyDecision } from "./IPolicyDecision.js";

/**
 * Interface describing a Policy Arbiter.
 */
export interface IPolicyArbiter extends IComponent {
	/**
	 * Makes decisions regarding policy access to data.
	 * @param policy The policy to evaluate.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param data The data to make a decision on.
	 * @returns The decisions about access to the data.
	 */
	decide<D = unknown>(
		policy: IOdrlPolicy,
		information?: { [id: string]: IJsonLdNodeObject },
		data?: D
	): Promise<IPolicyDecision[]>;
}
