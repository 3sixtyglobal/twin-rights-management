// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataAccessPointComponent } from "@twin.org/rights-management-models";

/**
 * Options for the Data Access Request Point Component.
 */
export interface IDataAccessRequestPointServiceConfig {
	/**
	 * A method for creating a new instance of the data access point component.
	 * To be used when sending request remotely to another node.
	 */
	dataAccessComponentCreator: (url: string) => Promise<IDataAccessPointComponent>;

	/**
	 * Override the default trust generator.
	 */
	overrideTrustGeneratorType?: string;
}
