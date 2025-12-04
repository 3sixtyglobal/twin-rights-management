// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { IPolicyRequester } from "@twin.org/rights-management-models";
import type { IOdrlAgreement, IOdrlOffer } from "@twin.org/standards-w3c-odrl";
import type { IExamplePolicyRequesterConstructorOptions } from "../models/IExamplePolicyRequesterConstructorOptions.js";

/**
 * Example Policy Requester.
 */
export class ExamplePolicyRequester implements IPolicyRequester {
	/**
	 * The class name of the Example Policy Requester.
	 */
	public static readonly CLASS_NAME: string = nameof<ExamplePolicyRequester>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging: ILoggingComponent;

	/**
	 * Create a new instance of ExamplePolicyRequester.
	 * @param options The options for the example policy Requester.
	 */
	constructor(options?: IExamplePolicyRequesterConstructorOptions) {
		this._logging = ComponentFactory.get<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return ExamplePolicyRequester.CLASS_NAME;
	}

	/**
	 * The unique id of the requester.
	 * @returns The requester id.
	 */
	public requesterId(): string {
		return "";
	}

	/**
	 * A policy has been offered by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @param offer The offer sent by the provider.
	 * @returns True if the offer was accepted, false otherwise.
	 */
	public async offer(negotiationId: string, offer: IOdrlOffer): Promise<boolean> {
		return true;
	}

	/**
	 * A policy agreement has been sent by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @param agreement The agreement sent by the provider.
	 * @returns True if the agreement was accepted, false otherwise.
	 */
	public async agreement(negotiationId: string, agreement: IOdrlAgreement): Promise<boolean> {
		return true;
	}

	/**
	 * A policy finalisation has been sent by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @returns Nothing.
	 */
	public async finalised(negotiationId: string): Promise<void> {}

	/**
	 * A policy termination has been sent by a provider, let the requester know about it.
	 * @param negotiationId The id of the negotiation.
	 * @returns Nothing.
	 */
	public async terminated(negotiationId: string): Promise<void> {}
}
