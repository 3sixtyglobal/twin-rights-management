// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataAccessHandler } from "@twin.org/rights-management-models";

/**
 * Options for the Data Access Point Component.
 */
export interface IDataAccessPointServiceConfig {
	/**
	 * The time-to-live (TTL) for proof in seconds.
	 * @default 300 (5 minutes)
	 */
	proofTtlInSeconds?: number;

	/**
	 * Initial handler to register with the DAP.
	 */
	handlers?: {
		handlerId: string;
		handler: IDataAccessHandler;
	}[];
}
