// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataAccessPointServiceConfig } from "./IDataAccessPointServiceConfig";

/**
 * Options for the Data Access Point Service.
 */
export interface IDataAccessPointServiceConstructorOptions {
	/**
	 * The logging component for logging data access operations.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The type of the policy enforcement point component.
	 * @default policy-enforcement-point
	 */
	policyEnforcementPointComponentType?: string;

	/**
	 * Configuration options for the data access point service.
	 */
	config?: IDataAccessPointServiceConfig;
}
