// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiator } from "@twin.org/rights-management-models";

/**
 * Options for the Policy Negotiation Point Component.
 */
export interface IPolicyNegotiationPointServiceConfig {
	/**
	 * Initial negotiators to register with the PNP.
	 */
	negotiators?: {
		negotiatorId: string;
		negotiator: IPolicyNegotiator;
	}[];
}
