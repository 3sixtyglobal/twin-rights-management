// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { IPolicyRequester } from "@twin.org/rights-management-models";
import type { IOdrlAgreement, IOdrlOffer } from "@twin.org/standards-w3c-odrl";
import type { IPassThroughPolicyRequesterConstructorOptions } from "../models/IPassThroughPolicyRequesterConstructorOptions.js";

/**
 * Pass Through Policy Requester.
 */
export class PassThroughPolicyRequester implements IPolicyRequester {
	/**
	 * The class name of the Pass Through Policy Requester.
	 */
	public static readonly CLASS_NAME: string = nameof<PassThroughPolicyRequester>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging: ILoggingComponent;

	/**
	 * Create a new instance of PassThroughPolicyRequester.
	 * @param options The options for the pass through policy Requester.
	 */
	constructor(options?: IPassThroughPolicyRequesterConstructorOptions) {
		this._logging = ComponentFactory.get<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PassThroughPolicyRequester.CLASS_NAME;
	}

	/**
	 * A policy has been offered by a provider, let the request handler know about it.
	 * @param negotiationId The id of the negotiation.
	 * @param offer The offer sent by the provider.
	 * @returns True if the offer was accepted, false otherwise.
	 */
	public async offer(negotiationId: string, offer: IOdrlOffer): Promise<boolean> {
		await this._logging.log({
			level: "info",
			source: PassThroughPolicyRequester.CLASS_NAME,
			ts: Date.now(),
			message: "offer",
			data: {
				negotiationId,
				offerId: offer.uid
			}
		});

		return true;
	}

	/**
	 * A policy agreement has been sent by a provider, let the request handler know about it.
	 * @param negotiationId The id of the negotiation.
	 * @param agreement The agreement sent by the provider.
	 * @returns True if the agreement was accepted, false otherwise.
	 */
	public async agreement(negotiationId: string, agreement: IOdrlAgreement): Promise<boolean> {
		await this._logging.log({
			level: "info",
			source: PassThroughPolicyRequester.CLASS_NAME,
			ts: Date.now(),
			message: "agreement",
			data: {
				negotiationId,
				agreementId: agreement.uid
			}
		});

		return true;
	}

	/**
	 * A policy finalisation has been sent by a provider, let the request handler know about it.
	 * @param negotiationId The id of the negotiation.
	 * @returns Nothing.
	 */
	public async finalised(negotiationId: string): Promise<void> {
		await this._logging.log({
			level: "info",
			source: PassThroughPolicyRequester.CLASS_NAME,
			ts: Date.now(),
			message: "finalised",
			data: {
				negotiationId
			}
		});
	}

	/**
	 * A policy termination has been sent by a provider, let the request handler know about it.
	 * @param negotiationId The id of the negotiation.
	 * @returns Nothing.
	 */
	public async terminated(negotiationId: string): Promise<void> {
		await this._logging.log({
			level: "info",
			source: PassThroughPolicyRequester.CLASS_NAME,
			ts: Date.now(),
			message: "terminated",
			data: {
				negotiationId
			}
		});
	}
}
