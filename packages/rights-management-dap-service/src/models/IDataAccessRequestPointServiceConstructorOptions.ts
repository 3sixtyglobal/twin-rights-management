// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataAccessRequestPointServiceConfig } from "./IDataAccessRequestPointServiceConfig.js";

/**
 * Options for the Data Access Request Point Component.
 */
export interface IDataAccessRequestPointServiceConstructorOptions {
	/**
	 * The logging component for logging policy negotiation.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * Configuration options for the data access request point service.
	 */
	config: IDataAccessRequestPointServiceConfig;
}
