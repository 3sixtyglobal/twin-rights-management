// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards, ObjectHelper, Urn } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	RightsManagementNamespaces,
	type IPolicyNegotiator
} from "@twin.org/rights-management-models";
import type {
	IDataspaceProtocolAgreement,
	IDataspaceProtocolOffer,
	IDataspaceProtocolPolicy
} from "@twin.org/standards-dataspace-protocol";
import { OdrlPolicyType, type IOdrlParty } from "@twin.org/standards-w3c-odrl";
import type { IPassThroughPolicyNegotiatorConstructorOptions } from "../models/IPassThroughPolicyNegotiatorConstructorOptions.js";

/**
 * Pass Through Policy Negotiator.
 */
export class PassThroughPolicyNegotiator implements IPolicyNegotiator {
	/**
	 * The class name of the Pass Through Policy Negotiator.
	 */
	public static readonly CLASS_NAME: string = nameof<PassThroughPolicyNegotiator>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * Create a new instance of PassThroughPolicyNegotiator.
	 * @param options The options for the pass through policy negotiator.
	 */
	constructor(options?: IPassThroughPolicyNegotiatorConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PassThroughPolicyNegotiator.CLASS_NAME;
	}

	/**
	 * Determines if the negotiator supports the given offer.
	 * @param offer The offer to check.
	 * @returns True if the negotiator supports the given offer.
	 */
	public supportsOffer(offer: IDataspaceProtocolOffer): boolean {
		return true;
	}

	/**
	 * Handle the offer.
	 * @param offer The offer to check.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @returns Sets the accepted flag if it can be offered, and the interventionRequired flag if manual agreement is needed.
	 */
	public async handleOffer(
		offer: IDataspaceProtocolOffer,
		information?: { [id: string]: IJsonLdNodeObject }
	): Promise<{
		accepted: boolean;
		interventionRequired: boolean;
	}> {
		Guards.object<IDataspaceProtocolOffer>(
			PassThroughPolicyNegotiator.CLASS_NAME,
			nameof(offer),
			offer
		);

		await this._logging?.log({
			level: "info",
			source: PassThroughPolicyNegotiator.CLASS_NAME,
			ts: Date.now(),
			message: "handlingOffer",
			data: {
				offerId: OdrlPolicyHelper.getUid(offer) ?? ""
			}
		});

		return {
			accepted: true,
			interventionRequired: false
		};
	}

	/**
	 * Create an agreement based on the offer.
	 * @param offer The offer to create the agreement from.
	 * @param assignee The assignee of the agreement.
	 * @param information Information provided by the requester to aid in the creation of the agreement.
	 * @returns The agreement created from the offer or undefined if an agreement could not be created.
	 */
	public async createAgreement(
		offer: IDataspaceProtocolOffer,
		assignee: string | IOdrlParty,
		information?: { [id: string]: IJsonLdNodeObject }
	): Promise<IDataspaceProtocolAgreement | undefined> {
		Guards.object<IDataspaceProtocolOffer>(
			PassThroughPolicyNegotiator.CLASS_NAME,
			nameof(offer),
			offer
		);

		await this._logging?.log({
			level: "info",
			source: PassThroughPolicyNegotiator.CLASS_NAME,
			ts: Date.now(),
			message: "createAgreement",
			data: {
				offerId: OdrlPolicyHelper.getUid(offer) ?? ""
			}
		});

		const agreement = ObjectHelper.clone<IDataspaceProtocolPolicy>(offer);

		agreement["@type"] = OdrlPolicyType.Agreement;
		agreement["@id"] = Urn.generateRandom(RightsManagementNamespaces.Policy).toString(false);
		agreement.assignee = assignee;

		return agreement as IDataspaceProtocolAgreement;
	}
}
