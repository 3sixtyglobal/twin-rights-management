// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyInformationSource } from "@twin.org/rights-management-models";

/**
 * Options for the Policy Information Point Component.
 */
export interface IPolicyInformationPointServiceConfig {
	/**
	 * Initial sources to register with the PIP.
	 */
	sources?: {
		sourceId: string;
		source: IPolicyInformationSource;
	}[];
}
