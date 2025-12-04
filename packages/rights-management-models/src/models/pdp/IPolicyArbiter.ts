// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyLocator } from "../IPolicyLocator.js";
import type { IPolicyDecision } from "./IPolicyDecision.js";
import type { IPolicyInformation } from "../pip/IPolicyInformation.js";

/**
 * Interface describing a Policy Arbiter.
 */
export interface IPolicyArbiter extends IComponent {
	/**
	 * The policies supported by this arbiter.
	 * @returns The supported policies, if empty can be used for all.
	 */
	supportedPolicies(): IPolicyLocator[];

	/**
	 * Makes decisions regarding policy access to data.
	 * @param locator The locator to find relevant policies.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param policies The policies that apply to the data.
	 * @param data The data to make a decision on.
	 * @returns The decisions about access to the data.
	 */
	decide<D = unknown>(
		locator: IPolicyLocator,
		information?: IPolicyInformation,
		policies?: IOdrlPolicy[],
		data?: D
	): Promise<IPolicyDecision[]>;
}
