// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiation } from "../../pnp/IPolicyNegotiation.js";

/**
 * The body of a PNAP create request.
 * dateCreated, organizationIdentity and correlationId are server-managed and must not be supplied.
 * id must be the consumer's chosen consumerPid — it becomes the primary key used by offerFromProvider().
 *
 * Only id needs to be supplied for a correct pre-registration. All other optional fields are
 * unsupported at pre-registration time. In particular, supplying a state other than REQUESTED
 * will cause offerFromProvider() to reject the incoming ContractOfferMessage (it requires
 * state === REQUESTED at policyNegotiationPointService.ts).
 */
export type IPnapCreateBody = Omit<
	Partial<IPolicyNegotiation>,
	"dateCreated" | "organizationIdentity" | "correlationId"
> & {
	/**
	 * The consumer-side negotiation identifier (DSP consumerPid). Stored as the primary key.
	 */
	id: string;
};
