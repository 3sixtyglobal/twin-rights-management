// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The status of the negotiation in the Policy Negotiation Point (PNP).
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyNegotiationStatus = {
	/**
	 * Manual - manual approval is required.
	 */
	Manual: "manual",

	/**
	 * Approved - the negotiation has been approved.
	 */
	Approved: "approved",

	/**
	 * Rejected - the negotiation has been rejected.
	 */
	Rejected: "rejected"
} as const;

/**
 * The status of the negotiation in the Policy Negotiation Point (PNP).
 */
export type PolicyNegotiationStatus =
	(typeof PolicyNegotiationStatus)[keyof typeof PolicyNegotiationStatus];
