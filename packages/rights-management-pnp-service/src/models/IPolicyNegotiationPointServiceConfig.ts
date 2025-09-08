// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiator } from "@twin.org/rights-management-models";

/**
 * Options for the Policy Negotiation Point Component.
 */
export interface IPolicyNegotiationPointServiceConfig {
	/**
	 * The time-to-live (TTL) for proof in seconds.
	 * @default 300 (5 minutes)
	 */
	proofTtlInSeconds?: number;

	/**
	 * Initial negotiators to register with the PNP.
	 */
	negotiators?: {
		negotiatorId: string;
		negotiator: IPolicyNegotiator;
	}[];
}
