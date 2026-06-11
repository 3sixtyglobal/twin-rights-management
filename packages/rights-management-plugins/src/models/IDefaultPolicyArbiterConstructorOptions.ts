// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IDefaultPolicyArbiterConfig } from "./IDefaultPolicyArbiterConfig.js";

/**
 * Options for the Default Policy Arbiter.
 */
export interface IDefaultPolicyArbiterConstructorOptions {
	/**
	 * The logging component for policy arbiter.
	 */
	loggingComponentType?: string;

	/**
	 * The policy administration point component for retrieving inherited policies.
	 * @default policy-administration-point
	 */
	policyAdministrationPointComponentType?: string;

	/**
	 * The configuration options for the default policy arbiter.
	 */
	config?: IDefaultPolicyArbiterConfig;
}
