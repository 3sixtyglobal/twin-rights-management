// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@3sixty/core";
import type { JsonLdObjectWithOptionalContext } from "@3sixty/data-json-ld";
import type {
	IDataspaceProtocolAgreement,
	IDataspaceProtocolOffer
} from "@3sixty/standards-dataspace-protocol";

/**
 * Interface describing a Policy Requester.
 */
export interface IPolicyRequester extends IComponent {
	/**
	 * A policy has been offered by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @param offer The offer sent by the provider.
	 * @returns True if the offer was accepted, false otherwise.
	 */
	offer(
		negotiationId: string,
		offer: JsonLdObjectWithOptionalContext<IDataspaceProtocolOffer>
	): Promise<boolean>;

	/**
	 * A policy agreement has been sent by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @param agreement The agreement sent by the provider.
	 * @returns True if the agreement was accepted, false otherwise.
	 */
	agreement(
		negotiationId: string,
		agreement: JsonLdObjectWithOptionalContext<IDataspaceProtocolAgreement>
	): Promise<boolean>;

	/**
	 * A policy finalisation has been sent by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @returns A promise that resolves when the finalisation has been processed.
	 */
	finalised(negotiationId: string): Promise<void>;

	/**
	 * A policy termination has been sent by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @returns A promise that resolves when the termination has been processed.
	 */
	terminated(negotiationId: string): Promise<void>;
}
