// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyArbiter } from "@twin.org/rights-management-models";

/**
 * Options for the Policy Decision Point Component.
 */
export interface IPolicyDecisionPointServiceConfig {
	/**
	 * Initial arbiters to register with the PDP.
	 */
	arbiters?: {
		arbiterId: string;
		arbiter: IPolicyArbiter;
	}[];
}
