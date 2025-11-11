// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataAccessHandler } from "@twin.org/rights-management-models";

/**
 * Options for the Data Access Point Component.
 */
export interface IDataAccessPointServiceConfig {
	/**
	 * Initial handler to register with the DAP.
	 */
	handlers?: {
		handlerId: string;
		handler: IDataAccessHandler;
	}[];
}
