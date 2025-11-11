// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyEnforcementProcessor } from "@twin.org/rights-management-models";

/**
 * Options for the Policy Enforcement Point Component.
 */
export interface IPolicyEnforcementPointServiceConfig {
	/**
	 * Initial processors to register with the PEP.
	 */
	processors?: {
		processorId: string;
		processor: IPolicyEnforcementProcessor;
	}[];
}
