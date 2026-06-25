// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { PolicyDecisionStage } from "@twin.org/rights-management-models";

/**
 * Options for the Logging Policy Execution Action Component.
 */
export interface ILoggingPolicyExecutionActionConfig {
	/**
	 * The policy decision stages to log, if undefined defaults to all.
	 */
	stages?: PolicyDecisionStage[];

	/**
	 * Whether to include the data in the log.
	 * @default false
	 */
	includeData?: boolean;

	/**
	 * Whether to include the policy in the log.
	 * @default false
	 */
	includePolicy?: boolean;

	/**
	 * Whether to include the decisions in the log.
	 * @default false
	 */
	includeDecisions?: boolean;
}
