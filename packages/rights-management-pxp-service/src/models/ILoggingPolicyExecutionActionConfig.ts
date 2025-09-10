// Copyright 2024 IOTA Stiftung.
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
	 * Whether to include the policies in the log.
	 * @default false
	 */
	includePolicies?: boolean;

	/**
	 * Whether to include the decisions in the log.
	 * @default false
	 */
	includeDecisions?: boolean;
}
