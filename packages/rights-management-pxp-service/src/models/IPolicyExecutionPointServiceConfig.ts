// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyExecutionAction } from "@twin.org/rights-management-models";

/**
 * Options for the Policy Execution Point Component.
 */
export interface IPolicyExecutionPointServiceConfig {
	/**
	 * Initial execution actions to register with the PXP.
	 */
	actions?: {
		actionId: string;
		action: IPolicyExecutionAction;
	}[];
}
