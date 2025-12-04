// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { IPolicyInformation, IPolicyNegotiator } from "@twin.org/rights-management-models";
import type { IOdrlAgreement, IOdrlOffer } from "@twin.org/standards-w3c-odrl";
import type { IExamplePolicyNegotiatorConstructorOptions } from "../models/IExamplePolicyNegotiatorConstructorOptions.js";

/**
 * Example Policy Negotiator.
 */
export class ExamplePolicyNegotiator implements IPolicyNegotiator {
	/**
	 * The class name of the Example Policy Negotiator.
	 */
	public static readonly CLASS_NAME: string = nameof<ExamplePolicyNegotiator>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging: ILoggingComponent;

	/**
	 * Create a new instance of ExamplePolicyNegotiator.
	 * @param options The options for the example policy negotiator.
	 */
	constructor(options?: IExamplePolicyNegotiatorConstructorOptions) {
		this._logging = ComponentFactory.get<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return ExamplePolicyNegotiator.CLASS_NAME;
	}

	/**
	 * Determines if the negotiator supports the given offer.
	 * @param offer The offer to check.
	 * @returns Sets the supports flag if it can be offered, and the interventionRequired flag if manual agreement is needed.
	 */
	public supportsOffer(offer: IOdrlOffer): boolean {
		return true;
	}

	/**
	 * Handle the offer.
	 * @param offer The offer to check.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @returns Sets the accepted flag if it can be offered, and the interventionRequired flag if manual agreement is needed.
	 */
	public async handleOffer(
		offer: IOdrlOffer,
		information?: IPolicyInformation
	): Promise<{
		accepted: boolean;
		interventionRequired: boolean;
	}> {
		return {
			accepted: true,
			interventionRequired: false
		};
	}

	/**
	 * Create an agreement based on the offer.
	 * @param offer The offer to create the agreement from.
	 * @param information Information provided by the requester to aid in the creation of the agreement.
	 * @returns The agreement created from the offer or undefined if an agreement could not be created.
	 */
	public async createAgreement(
		offer: IOdrlOffer,
		information?: IPolicyInformation
	): Promise<IOdrlAgreement | undefined> {
		return undefined;
	}
}
