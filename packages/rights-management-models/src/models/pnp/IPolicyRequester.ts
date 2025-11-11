// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlAgreement, IOdrlOffer } from "@twin.org/standards-w3c-odrl";

/**
 * Interface describing a Policy Requester.
 */
export interface IPolicyRequester {
	/**
	 * A policy has been offered by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @param offer The offer sent by the provider.
	 * @returns True if the offer was accepted, false otherwise.
	 */
	offer(negotiationId: string, offer: IOdrlOffer): Promise<boolean>;

	/**
	 * A policy agreement has been sent by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @param agreement The agreement sent by the provider.
	 * @returns True if the agreement was accepted, false otherwise.
	 */
	agreement(negotiationId: string, agreement: IOdrlAgreement): Promise<boolean>;

	/**
	 * A policy finalisation has been sent by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @returns Nothing.
	 */
	finalised(negotiationId: string): Promise<void>;

	/**
	 * A policy termination has been sent by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @returns Nothing.
	 */
	terminated(negotiationId: string): Promise<void>;
}
