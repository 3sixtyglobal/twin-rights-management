// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	BaseError,
	ComponentFactory,
	ErrorHelper,
	GeneralError,
	Guards,
	Is,
	NotFoundError,
	Url,
	Urn
} from "@twin.org/core";
import {
	DocumentHelper,
	IdentityConnectorFactory,
	type IIdentityConnector
} from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyAdministrationPointComponent,
	type IPolicyInformation,
	type IPolicyInformationPointComponent,
	type IPolicyNegotiation,
	type IPolicyNegotiationAdminPointComponent,
	type IPolicyNegotiationPointComponent,
	type IPolicyNegotiator,
	type IPolicyRequest,
	type IPolicyRequester,
	PolicyInformationAccessMode,
	RightsManagementContexts,
	RightsManagementNamespaces,
	RightsManagementTokenHelper,
	RightsManagementTypes
} from "@twin.org/rights-management-models";
import {
	IdsContractNegotiationContexts,
	IdsContractNegotiationEventType,
	IdsContractNegotiationStateType,
	IdsContractNegotiationTypes,
	type IIdsContractAgreementVerificationMessage,
	type IIdsContractAgreementMessage,
	type IIdsContractNegotiation,
	type IIdsContractNegotiationError,
	type IIdsContractNegotiationEventMessage,
	type IIdsContractNegotiationTerminationMessage,
	type IIdsContractOfferMessage,
	type IIdsContractRequestMessage
} from "@twin.org/standards-ids-contract-negotiation";
import { OdrlContexts, OdrlTypes, type IOdrlOffer } from "@twin.org/standards-w3c-odrl";
import type { IPolicyNegotiationPointServiceConfig } from "./models/IPolicyNegotiationPointServiceConfig";
import type { IPolicyNegotiationPointServiceConstructorOptions } from "./models/IPolicyNegotiationPointServiceConstructorOptions";

/**
 * Class implementation of Policy Negotiation Point Component.
 */
export class PolicyNegotiationPointService implements IPolicyNegotiationPointComponent {
	/**
	 * The class name of the Policy Negotiation Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyNegotiationPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The identity connector to use for signing/verifying negotiation requests.
	 * @internal
	 */
	private readonly _identityConnector: IIdentityConnector;

	/**
	 * The entity storage component for storing policy state.
	 * @internal
	 */
	private readonly _policyNegotiationAdminPointComponent: IPolicyNegotiationAdminPointComponent;

	/**
	 * The policy administration point component.
	 * @internal
	 */
	private readonly _policyAdministrationPointComponent: IPolicyAdministrationPointComponent;

	/**
	 * The policy information point component.
	 * @internal
	 */
	private readonly _policyInformationPointComponent: IPolicyInformationPointComponent;

	/**
	 * The url to send in negotiation messages as the callback address.
	 * This should be the externally reachable url of this PNP service.
	 * @internal
	 */
	private readonly _baseCallbackUrl: string;

	/**
	 * The id of the identity method to use when signing/verifying proofs.
	 * @internal
	 */
	private readonly _rightsManagementMethodId: string;

	/**
	 * The time-to-live (TTL) for proof in seconds.
	 * @internal
	 */
	private readonly _proofTtlInSeconds: number;

	/**
	 * A method for creating a new instance of the policy negotiation point component.
	 * @internal
	 */
	private readonly _negotiationComponentCreator: (
		url: string
	) => Promise<IPolicyNegotiationPointComponent>;

	/**
	 * These negotiators can be registered to handle negotiations for specific asset types and actions.
	 * @internal
	 */
	private readonly _negotiators: {
		negotiatorId: string;
		negotiator: IPolicyNegotiator;
	}[];

	/**
	 * These requesters can be registered to handle offers.
	 * @internal
	 */
	private readonly _requesters: {
		requesterId: string;
		requester: IPolicyRequester;
	}[];

	/**
	 * These offers can be registered to provide offers for negotiation.
	 * @internal
	 */
	private readonly _offers: IOdrlOffer[];

	/**
	 * The node identity.
	 * @internal
	 */
	private _nodeIdentity?: string;

	/**
	 * Create a new instance of PolicyNegotiationPointService (PNP).
	 * @param options The options for the component.
	 */
	constructor(options: IPolicyNegotiationPointServiceConstructorOptions) {
		Guards.object<IPolicyNegotiationPointServiceConstructorOptions>(
			this.CLASS_NAME,
			nameof(options),
			options
		);
		Guards.object<IPolicyNegotiationPointServiceConfig>(
			this.CLASS_NAME,
			nameof(options.config),
			options.config
		);
		Guards.stringValue(
			this.CLASS_NAME,
			nameof(options.config.baseCallbackUrl),
			options.config.baseCallbackUrl
		);
		Guards.function(
			this.CLASS_NAME,
			nameof(options.config.negotiationComponentCreator),
			options.config.negotiationComponentCreator
		);

		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options.loggingComponentType ?? "logging"
		);
		this._identityConnector = IdentityConnectorFactory.get(
			options.identityConnectorType ?? "identity"
		);
		this._policyNegotiationAdminPointComponent =
			ComponentFactory.get<IPolicyNegotiationAdminPointComponent>(
				options.policyNegotiationAdministrationPointComponentType ??
					"policy-negotiation-admin-point"
			);
		this._policyAdministrationPointComponent =
			ComponentFactory.get<IPolicyAdministrationPointComponent>(
				options.policyAdministrationPointComponentType ?? "policy-administration-point"
			);
		this._policyInformationPointComponent = ComponentFactory.get<IPolicyInformationPointComponent>(
			options?.policyInformationPointComponentType ?? "policy-information-point"
		);
		this._baseCallbackUrl = options.config.baseCallbackUrl;
		this._rightsManagementMethodId =
			options.config.rightsManagementMethodId ?? "rights-management-assertion";
		this._proofTtlInSeconds = options.config.proofTtlInSeconds ?? 300; // Default to 5 minutes
		this._negotiationComponentCreator = options.config.negotiationComponentCreator;
		this._negotiators = options.config.negotiators ?? [];
		this._requesters = options.config.requesters ?? [];
		this._offers = options.config.offers ?? [];
	}

	/**
	 * The component needs to be started when the node is initialized.
	 * @param nodeIdentity The identity of the node starting the component.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns Nothing.
	 */
	public async start(
		nodeIdentity: string,
		nodeLoggingComponentType: string | undefined
	): Promise<void> {
		this._nodeIdentity = nodeIdentity;
	}

	/**
	 * Get the current state of the negotiation.
	 * @param id The id of the negotiation to retrieve.
	 * @param proofToken The proof provided by the requester to support the get.
	 * @returns The current state of the negotiation or an error.
	 */
	public async getNegotiation(
		id: string,
		proofToken: string
	): Promise<IIdsContractNegotiation | IIdsContractNegotiationError> {
		Guards.stringValue(this.CLASS_NAME, nameof(id), id);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);

		try {
			await RightsManagementTokenHelper.verifyToken(
				this._identityConnector,
				{
					providerPid: id
				},
				proofToken,
				this._proofTtlInSeconds
			);

			const negotiation = await this._policyNegotiationAdminPointComponent.get(id);
			if (Is.empty(negotiation)) {
				throw new NotFoundError(this.CLASS_NAME, "negotiationNotFound", id);
			}

			return this.constructNegotiationMessage(
				negotiation.id,
				negotiation.correlationId,
				negotiation.state
			);
		} catch (error) {
			return this.setErrorState(id, "", undefined, BaseError.fromError(error));
		}
	}

	/**
	 * Send a request to a provider.
	 * @param url The url of the provider to send the request to.
	 * @param requesterId The id of the requester to use for the request, will use the registered requester to provide update.
	 * @param odrlOfferId The id of the offer to request.
	 * @returns The negotiation id.
	 */
	public async sendRequestToProvider(
		url: string,
		requesterId: string,
		odrlOfferId: string
	): Promise<string> {
		Url.guard(this.CLASS_NAME, nameof(url), url);
		Guards.stringValue(this.CLASS_NAME, nameof(requesterId), requesterId);
		Guards.stringValue(this.CLASS_NAME, nameof(odrlOfferId), odrlOfferId);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const policyRequester = this._requesters.find(r => r.requesterId === requesterId)?.requester;
		if (Is.empty(policyRequester)) {
			throw new GeneralError(this.CLASS_NAME, "noRequesterFound", {
				requesterId
			});
		}

		const consumerPid = Urn.generateRandom(RightsManagementNamespaces.ContractNegotiation).toString(
			false
		);

		const policyInformation = await this._policyInformationPointComponent.retrieve(
			{},
			PolicyInformationAccessMode.Public
		);

		const policyRequest: IPolicyRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.PolicyRequest,
			consumerPid,
			information: policyInformation
		};

		const proofToken = await RightsManagementTokenHelper.createToken(
			this._identityConnector,
			DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
			policyRequest,
			this._proofTtlInSeconds
		);

		const negotiationComponent = await this._negotiationComponentCreator(url);

		const requestMessage: IIdsContractRequestMessage = {
			"@context": IdsContractNegotiationContexts.ContextRoot,
			"@type": IdsContractNegotiationTypes.ContractRequestMessage,
			consumerPid,
			offer: {
				"@context": OdrlContexts.ContextRoot,
				"@type": OdrlTypes.Offer,
				uid: odrlOfferId,
				assigner: this._nodeIdentity
			},
			callbackAddress: this._baseCallbackUrl
		};
		const response = await negotiationComponent.requestFromConsumer(requestMessage, proofToken);

		if (
			response["@type"] === IdsContractNegotiationTypes.ContractNegotiationError &&
			Is.object<IIdsContractNegotiationError>(response)
		) {
			throw new GeneralError(this.CLASS_NAME, response.code ?? "negotiationFailed", {
				offerId: odrlOfferId
			});
		}

		const policyNegotiation: IPolicyNegotiation = {
			id: consumerPid,
			correlationId: response.providerPid,
			state: IdsContractNegotiationStateType.REQUESTED,
			dateCreated: new Date(Date.now()).toISOString(),
			handlerId: requesterId,
			information: policyInformation
		};

		await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

		return consumerPid;
	}

	/**
	 * Processes an incoming request on a provider from a consumer.
	 * https://docs.internationaldataspaces.org/ids-knowledgebase/dataspace-protocol/contract-negotiation/contract.negotiation.protocol#id-2.1-contract-request-message.
	 * @param message The negotiation request.
	 * @param proofToken The proof provided by the requester to support the policy creation.
	 * @returns The current state of the contract negotiation or an error.
	 */
	public async requestFromConsumer(
		message: IIdsContractRequestMessage,
		proofToken: string
	): Promise<IIdsContractNegotiation | IIdsContractNegotiationError> {
		Guards.object<IIdsContractRequestMessage>(this.CLASS_NAME, nameof(message), message);
		Guards.stringValue(this.CLASS_NAME, nameof(message.consumerPid), message.consumerPid);
		Guards.object<IOdrlOffer["offer"]>(this.CLASS_NAME, nameof(message.offer), message.offer);
		Guards.stringValue(this.CLASS_NAME, nameof(message.offer.uid), message.offer.uid);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);
		Url.guard(this.CLASS_NAME, nameof(message.callbackAddress), message.callbackAddress);

		// Use the provided provider pid or generate a new one
		const providerPid =
			message.providerPid ??
			Urn.generateRandom(RightsManagementNamespaces.ContractNegotiation).toString(false);

		let policyNegotiation: IPolicyNegotiation | undefined;

		try {
			// Verify the request from the consumer
			const verifiableCredential = await RightsManagementTokenHelper.verifyToken(
				this._identityConnector,
				{
					consumerPid: message.consumerPid
				},
				proofToken,
				this._proofTtlInSeconds
			);

			// On an initial request a consumer can send additional information to support the negotiation
			// this could include information such as the geography of the consumer
			let policyInformation: IPolicyInformation | undefined;
			if (Is.object<IPolicyRequest>(verifiableCredential.credentialSubject)) {
				policyInformation = verifiableCredential.credentialSubject.information;
			}

			// Now lookup the offer being requested
			const providerOffer = this._offers.find(o => o.uid === message.offer.uid);
			if (Is.empty(providerOffer)) {
				// No offer, so error
				const err = await this.setErrorState(
					providerPid,
					message.consumerPid,
					undefined,
					new GeneralError(this.CLASS_NAME, "noOfferFound", {
						offerId: message.offer.uid
					})
				);
				return err;
			}

			// See if we have a negotiator that supports the offer
			const foundNegotiator = this._negotiators.find(n =>
				n.negotiator.supportsOffer(providerOffer)
			);
			if (Is.empty(foundNegotiator)) {
				// No negotiator, so error
				const err = await this.setErrorState(
					providerPid,
					message.consumerPid,
					undefined,
					new GeneralError(this.CLASS_NAME, "noNegotiatorFound", {
						offerId: message.offer.uid
					})
				);
				return err;
			}

			// Construct a new negotiation or update an existing one
			if (Is.stringValue(message.providerPid)) {
				try {
					policyNegotiation = await this._policyNegotiationAdminPointComponent.get(
						message.providerPid
					);
				} catch (error) {
					if (BaseError.someErrorName(error, NotFoundError.CLASS_NAME)) {
						const err = await this.setErrorState(
							message.providerPid,
							message.consumerPid,
							undefined,
							new NotFoundError(this.CLASS_NAME, "negotiationNotFound", message.providerPid)
						);
						return err;
					}
					throw error;
				}

				// The negotiation must be in the REQUESTED state to update it
				if (policyNegotiation.state !== IdsContractNegotiationStateType.REQUESTED) {
					const err = await this.setErrorState(
						message.providerPid,
						policyNegotiation.correlationId,
						undefined,
						new GeneralError(this.CLASS_NAME, "invalidState", {
							state: policyNegotiation.state
						})
					);
					return err;
				}

				policyNegotiation.offer = providerOffer;
				policyNegotiation.information = policyInformation;
				policyNegotiation.handlerId = foundNegotiator.negotiatorId;
			} else {
				policyNegotiation = {
					id: providerPid,
					correlationId: message.consumerPid,
					dateCreated: new Date(Date.now()).toISOString(),
					offer: providerOffer,
					state: IdsContractNegotiationStateType.REQUESTED,
					callbackAddress: message.callbackAddress,
					information: policyInformation,
					handlerId: foundNegotiator.negotiatorId
				};
			}

			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			const negotiateResult = await foundNegotiator.negotiator.handleOffer(
				providerOffer,
				policyInformation
			);

			// If the negotiator sets the accepted flag, but doesn't require intervention
			// we send the offer to the consumer, otherwise we wait for manual handling
			// which will then restart the workflow by either sending the offer
			// or terminating it
			if (negotiateResult.accepted) {
				if (!negotiateResult.interventionRequired) {
					const callbackAddress = message.callbackAddress;
					const pol = policyNegotiation;

					// Send the offer on the next cycle so we don't delay the current response
					setTimeout(async () => {
						await this.sendOfferToConsumer(callbackAddress, pol);
					}, 100);
				}

				// Return the current state of the negotiation
				return this.constructNegotiationMessage(
					providerPid,
					message.consumerPid,
					policyNegotiation.state
				);
			}

			// The negotiator didn't accept the offer, so we error
			const err = await this.setErrorState(
				providerPid,
				message.consumerPid,
				policyNegotiation,
				new GeneralError(this.CLASS_NAME, "negotiationFailed", {
					offerId: providerOffer.uid
				})
			);
			return err;
		} catch (error) {
			return this.setErrorState(
				providerPid,
				message.consumerPid,
				policyNegotiation,
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * An offer has been received by a consumer.
	 * @param message The offer being received by the consumer.
	 * @param proofToken The proof provided by the requester to support the offer.
	 * @returns The current state of the contract negotiation or an error.
	 */
	public async offerFromProvider(
		message: IIdsContractOfferMessage,
		proofToken: string
	): Promise<IIdsContractNegotiation | IIdsContractNegotiationError> {
		Guards.object<IIdsContractOfferMessage>(this.CLASS_NAME, nameof(message), message);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);
		Guards.stringValue(this.CLASS_NAME, nameof(message.providerPid), message.providerPid);

		let consumerPid;
		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			// If the consumer id is set then we load an existing negotiation
			// if it is not set then we need to create a new negotiation
			if (Is.stringValue(message.consumerPid)) {
				consumerPid = message.consumerPid;
				try {
					policyNegotiation = await this._policyNegotiationAdminPointComponent.get(consumerPid);
				} catch (error) {
					if (BaseError.someErrorName(error, NotFoundError.CLASS_NAME)) {
						const err = await this.setErrorState(
							message.providerPid,
							message.consumerPid,
							undefined,
							new NotFoundError(this.CLASS_NAME, "negotiationNotFound", consumerPid)
						);
						return err;
					}
					throw error;
				}

				// The negotiation must be in the REQUESTED state to accept an offer
				if (policyNegotiation.state !== IdsContractNegotiationStateType.REQUESTED) {
					const err = await this.setErrorState(
						message.providerPid,
						message.consumerPid,
						undefined,
						new GeneralError(this.CLASS_NAME, "invalidState", {
							state: policyNegotiation.state
						})
					);
					return err;
				}
			} else {
				// The consumer pid was not set so create a new one
				consumerPid = Urn.generateRandom(RightsManagementNamespaces.ContractNegotiation).toString();
				policyNegotiation = {
					id: consumerPid,
					correlationId: message.providerPid,
					dateCreated: new Date(Date.now()).toISOString(),
					state: IdsContractNegotiationStateType.OFFERED
				};
			}

			// If we have an associated requester id then notify
			const requesterId = policyNegotiation.handlerId;
			if (Is.stringValue(requesterId)) {
				// Try and find the original requester of the negotiation
				const found = this._requesters.find(r => r.requesterId === requesterId);

				// We can't find the requester, so error
				if (Is.empty(found)) {
					const err = await this.setErrorState(
						message.providerPid,
						consumerPid,
						policyNegotiation,
						new NotFoundError(this.CLASS_NAME, "requesterNotFound", requesterId)
					);
					return err;
				}

				// Tell the requester about the offer
				const accepted = await found.requester.offer(requesterId, message.offer);

				if (!accepted) {
					const err = await this.setErrorState(
						message.providerPid,
						consumerPid,
						policyNegotiation,
						new GeneralError(this.CLASS_NAME, "offerNotAccepted", { offerId: message.offer.uid })
					);
					return err;
				}
			}

			// The offer was accepted by the consumer, so update the state
			policyNegotiation.state = IdsContractNegotiationStateType.ACCEPTED;
			policyNegotiation.offer = message.offer;

			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			// Send the accepted event to the provider on the next cycle so we don't delay the current response
			const callbackAddress = message.callbackAddress;
			const pol = policyNegotiation;
			if (Is.stringValue(callbackAddress)) {
				setTimeout(async () => {
					await this.sendEvent(
						callbackAddress,
						pol,
						IdsContractNegotiationEventType.ACCEPTED,
						"provider"
					);
				}, 100);
			}

			return this.constructNegotiationMessage(
				policyNegotiation.correlationId,
				policyNegotiation.id,
				policyNegotiation.state
			);
		} catch (error) {
			return this.setErrorState(
				message.providerPid,
				consumerPid ?? "",
				policyNegotiation,
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * An agreement has been received by a consumer.
	 * @param message The agreement message to send.
	 * @param proofToken The proof provided by the requester to support the agreement.
	 * @returns The error if there is one.
	 */
	public async agreementFromProvider(
		message: IIdsContractAgreementMessage,
		proofToken: string
	): Promise<IIdsContractNegotiationError | undefined> {
		Guards.object<IIdsContractAgreementMessage>(this.CLASS_NAME, nameof(message), message);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);
		Guards.stringValue(this.CLASS_NAME, nameof(message.providerPid), message.providerPid);
		Guards.stringValue(this.CLASS_NAME, nameof(message.consumerPid), message.consumerPid);
		Url.guard(this.CLASS_NAME, nameof(message.callbackAddress), message.callbackAddress);

		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			// Load the negotiation if there is one
			try {
				policyNegotiation = await this._policyNegotiationAdminPointComponent.get(
					message.consumerPid
				);
			} catch (error) {
				if (BaseError.someErrorName(error, NotFoundError.CLASS_NAME)) {
					const err = await this.setErrorState(
						message.providerPid,
						message.consumerPid,
						undefined,
						new NotFoundError(this.CLASS_NAME, "negotiationNotFound", message.consumerPid)
					);
					return err;
				}
				throw error;
			}

			// The negotiation must be in the ACCEPTED state to accept an agreement
			if (policyNegotiation.state !== IdsContractNegotiationStateType.ACCEPTED) {
				const err = await this.setErrorState(
					message.providerPid,
					message.consumerPid,
					undefined,
					new GeneralError(this.CLASS_NAME, "invalidState", {
						state: policyNegotiation.state
					})
				);
				return err;
			}

			// If we have an associated requester then notify it
			const requesterId = policyNegotiation.handlerId;
			if (Is.stringValue(requesterId)) {
				// Try and find the original requester of the negotiation
				const found = this._requesters.find(r => r.requesterId === requesterId);

				// We can't find the requester, so error
				if (Is.empty(found)) {
					const err = await this.setErrorState(
						message.providerPid,
						message.consumerPid,
						policyNegotiation,
						new NotFoundError(this.CLASS_NAME, "requesterNotFound", requesterId)
					);
					return err;
				}

				// Tell the requester about the offer
				const accepted = await found.requester.agreement(requesterId, message.agreement);

				if (!accepted) {
					const err = await this.setErrorState(
						message.providerPid,
						message.consumerPid,
						policyNegotiation,
						new GeneralError(this.CLASS_NAME, "agreementNotAccepted", {
							agreementId: message.agreement.uid
						})
					);
					return err;
				}
			}

			// The agreement was accepted by the consumer, so update the state
			// and store the agreement
			policyNegotiation.state = IdsContractNegotiationStateType.AGREED;
			policyNegotiation.agreement = message.agreement;

			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			// Send the agreement verification to the provider on the next cycle so we don't delay the current response
			const callbackAddress = message.callbackAddress;
			const pol = policyNegotiation;
			setTimeout(async () => {
				await this.sendAgreementVerificationToProvider(callbackAddress, pol);
			}, 100);
		} catch (error) {
			return this.setErrorState(
				message.providerPid,
				message.consumerPid,
				policyNegotiation,
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * An agreement verification has been received by a provider.
	 * @param message The agreement message to send.
	 * @param proofToken The proof provided by the requester to support the agreement verification.
	 * @returns The error if there is one.
	 */
	public async agreementVerificationFromConsumer(
		message: IIdsContractAgreementVerificationMessage,
		proofToken: string
	): Promise<IIdsContractNegotiationError | undefined> {
		Guards.object<IIdsContractAgreementMessage>(this.CLASS_NAME, nameof(message), message);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);
		Guards.stringValue(this.CLASS_NAME, nameof(message.providerPid), message.providerPid);
		Guards.stringValue(this.CLASS_NAME, nameof(message.consumerPid), message.consumerPid);

		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			// Load the negotiation if there is one
			try {
				policyNegotiation = await this._policyNegotiationAdminPointComponent.get(
					message.providerPid
				);
			} catch (error) {
				if (BaseError.someErrorName(error, NotFoundError.CLASS_NAME)) {
					const err = await this.setErrorState(
						message.providerPid,
						message.consumerPid,
						undefined,
						new NotFoundError(this.CLASS_NAME, "negotiationNotFound", message.providerPid)
					);
					return err;
				}
				throw error;
			}

			// The negotiation must be in the AGREED state to accept an agreement
			if (policyNegotiation.state !== IdsContractNegotiationStateType.AGREED) {
				const err = await this.setErrorState(
					message.providerPid,
					message.consumerPid,
					undefined,
					new GeneralError(this.CLASS_NAME, "invalidState", {
						state: policyNegotiation.state
					})
				);
				return err;
			}

			if (Is.empty(policyNegotiation.agreement)) {
				const err = await this.setErrorState(
					message.providerPid,
					message.consumerPid,
					policyNegotiation,
					new GeneralError(this.CLASS_NAME, "agreementMissing")
				);
				return err;
			}

			// The agreement was verified by the consumer, so update the state
			policyNegotiation.state = IdsContractNegotiationStateType.FINALIZED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			// Now that the agreement is finalised create the policy in the PAP
			await this._policyAdministrationPointComponent.create(policyNegotiation.agreement);

			// Send the finalisation on the next cycle so we don't delay the current response
			// Verification message doesn't have a callback address, so use the one
			// stored in the negotiation
			const callbackAddress = policyNegotiation?.callbackAddress;
			const pol = policyNegotiation;
			if (Is.stringValue(callbackAddress)) {
				setTimeout(async () => {
					await this.sendEvent(
						callbackAddress,
						pol,
						IdsContractNegotiationEventType.FINALIZED,
						"consumer"
					);
				}, 100);
			}
		} catch (error) {
			return this.setErrorState(
				message.providerPid,
				message.consumerPid,
				policyNegotiation,
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * An event has been received by the provider or consumer.
	 * @param message The event message to send.
	 * @param destination The destination is provider or consumer.
	 * @param proofToken The proof provided by the requester to support the event.
	 * @returns The error if there is one.
	 */
	public async event(
		message: IIdsContractNegotiationEventMessage,
		destination: "provider" | "consumer",
		proofToken: string
	): Promise<IIdsContractNegotiationError | undefined> {
		Guards.object<IIdsContractNegotiationEventMessage>(this.CLASS_NAME, nameof(message), message);
		Guards.arrayOneOf(this.CLASS_NAME, nameof(destination), destination, ["provider", "consumer"]);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);
		Guards.stringValue(this.CLASS_NAME, nameof(message.providerPid), message.providerPid);
		Guards.stringValue(this.CLASS_NAME, nameof(message.consumerPid), message.consumerPid);

		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			// Load the negotiation if there is one, use either the provider or consumer pid based on destination
			const policyId = destination === "provider" ? message.providerPid : message.consumerPid;
			try {
				policyNegotiation = await this._policyNegotiationAdminPointComponent.get(policyId);
			} catch (error) {
				if (BaseError.someErrorName(error, NotFoundError.CLASS_NAME)) {
					const err = await this.setErrorState(
						message.providerPid,
						message.consumerPid,
						undefined,
						new NotFoundError(this.CLASS_NAME, "negotiationNotFound", policyId)
					);
					return err;
				}
				throw error;
			}

			// https://docs.internationaldataspaces.org/ids-knowledgebase/dataspace-protocol/contract-negotiation/contract.negotiation.protocol#id-1.2-state-machine
			// We can only transition from OFFERED to ACCEPTED or VERIFIED to FINALIZED
			if (
				!(
					(policyNegotiation.state === IdsContractNegotiationStateType.OFFERED &&
						message.event === IdsContractNegotiationEventType.ACCEPTED) ||
					(policyNegotiation.state === IdsContractNegotiationStateType.VERIFIED &&
						message.event === IdsContractNegotiationEventType.FINALIZED)
				)
			) {
				const err = await this.setErrorState(
					message.providerPid,
					message.consumerPid,
					undefined,
					new GeneralError(this.CLASS_NAME, "invalidState", {
						state: policyNegotiation.state
					})
				);
				return err;
			}

			// Update the state to the new state
			policyNegotiation.state = message.event;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			if (
				destination === "consumer" &&
				message.event === IdsContractNegotiationEventType.FINALIZED
			) {
				// Try and find the original requester of the negotiation
				// this will only happen on the consumer side
				const requesterId = policyNegotiation.handlerId;
				if (Is.stringValue(requesterId)) {
					const found = this._requesters.find(r => r.requesterId === requesterId);

					// We can't find the requester, so error
					if (Is.empty(found)) {
						const err = await this.setErrorState(
							message.providerPid,
							message.consumerPid,
							policyNegotiation,
							new NotFoundError(this.CLASS_NAME, "requesterNotFound", requesterId)
						);
						return err;
					}

					// Tell the requester about the finalisation
					await found.requester.finalised(requesterId);
				}
			} else if (
				destination === "provider" &&
				message.event === IdsContractNegotiationEventType.ACCEPTED
			) {
				// Now that the offer was accepted by the consumer we can proceed with the agreement
				// Send the offer on the next cycle so we don't delay the current response
				const callbackAddress = policyNegotiation.callbackAddress;
				const pol = policyNegotiation;
				if (Is.stringValue(callbackAddress)) {
					setTimeout(async () => {
						await this.sendAgreementToConsumer(callbackAddress, pol);
					}, 100);
				}
			}
		} catch (error) {
			return this.setErrorState(
				message.providerPid,
				message.consumerPid,
				policyNegotiation,
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * A termination message has been received by the consumer.
	 * @param message The termination message to send.
	 * @param destination The destination is provider or consumer.
	 * @param proofToken The proof provided by the requester to support the termination.
	 * @returns The error if there is one.
	 */
	public async terminate(
		message: IIdsContractNegotiationTerminationMessage,
		destination: "provider" | "consumer",
		proofToken: string
	): Promise<IIdsContractNegotiationError | undefined> {
		Guards.object<IIdsContractNegotiationTerminationMessage>(
			this.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.arrayOneOf(this.CLASS_NAME, nameof(destination), destination, ["provider", "consumer"]);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);
		Guards.stringValue(this.CLASS_NAME, nameof(message.providerPid), message.providerPid);
		Guards.stringValue(this.CLASS_NAME, nameof(message.consumerPid), message.consumerPid);

		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			// Load the negotiation if there is one, use either the provider or consumer pid based on destination
			const policyId = destination === "provider" ? message.providerPid : message.consumerPid;
			try {
				policyNegotiation = await this._policyNegotiationAdminPointComponent.get(policyId);
			} catch (error) {
				if (BaseError.someErrorName(error, NotFoundError.CLASS_NAME)) {
					const err = await this.setErrorState(
						message.providerPid,
						message.consumerPid,
						undefined,
						new NotFoundError(this.CLASS_NAME, "negotiationNotFound", policyId)
					);
					return err;
				}
				throw error;
			}

			// If the target is a consumer we should notify the original
			// requester that the negotiation has been terminated
			if (destination === "consumer") {
				const requesterId = policyNegotiation.handlerId;
				if (Is.stringValue(requesterId)) {
					// Try and find the original requester of the negotiation
					const found = this._requesters.find(r => r.requesterId === requesterId);

					// We can't find the requester, so error
					if (Is.empty(found)) {
						const err = await this.setErrorState(
							message.providerPid,
							message.consumerPid,
							policyNegotiation,
							new NotFoundError(this.CLASS_NAME, "requesterNotFound", requesterId)
						);
						return err;
					}

					// Tell the requester about the termination
					await found.requester.terminated(requesterId);
				}
			}

			// Update the state to terminated
			policyNegotiation.state = IdsContractNegotiationStateType.TERMINATED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);
		} catch (error) {
			return this.setErrorState(
				message.providerPid,
				message.consumerPid,
				policyNegotiation,
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * Register a negotiator to use for handling data.
	 * @param negotiatorId The id of the negotiator to register.
	 * @param negotiator The negotiator to register.
	 * @returns Nothing.
	 */
	public async registerNegotiator(
		negotiatorId: string,
		negotiator: IPolicyNegotiator
	): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(negotiatorId), negotiatorId);
		Guards.objectValue<IPolicyNegotiator>(this.CLASS_NAME, nameof(negotiator), negotiator);

		const currentIndex = this._negotiators.findIndex(p => p.negotiatorId === negotiatorId);
		if (currentIndex !== -1) {
			this._negotiators[currentIndex].negotiator = negotiator;
		} else {
			this._negotiators.push({ negotiatorId, negotiator });
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "registeredNegotiator",
			data: {
				negotiatorId
			}
		});
	}

	/**
	 * Unregister a negotiator from the handling.
	 * @param negotiatorId The id of the negotiator to unregister.
	 * @returns Nothing.
	 */
	public async unregisterNegotiator(negotiatorId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(negotiatorId), negotiatorId);

		const currentIndex = this._negotiators.findIndex(p => p.negotiatorId === negotiatorId);
		if (currentIndex !== -1) {
			this._negotiators.splice(currentIndex, 1);
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "unregisteredNegotiator",
			data: {
				negotiatorId
			}
		});
	}

	/**
	 * Register a requester to use for handle returning offers.
	 * @param requesterId The id of the requester to register.
	 * @param requester The requester to register.
	 * @returns Nothing.
	 */
	public async registerRequester(requesterId: string, requester: IPolicyRequester): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(requesterId), requesterId);
		Guards.objectValue<IPolicyRequester>(this.CLASS_NAME, nameof(requester), requester);

		const currentIndex = this._requesters.findIndex(p => p.requesterId === requesterId);
		if (currentIndex !== -1) {
			this._requesters[currentIndex].requester = requester;
		} else {
			this._requesters.push({ requesterId, requester });
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "registeredRequester",
			data: {
				requesterId
			}
		});
	}

	/**
	 * Unregister a requester from the handling.
	 * @param requesterId The id of the requester to unregister.
	 * @returns Nothing.
	 */
	public async unregisterRequester(requesterId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(requesterId), requesterId);

		const currentIndex = this._requesters.findIndex(p => p.requesterId === requesterId);
		if (currentIndex !== -1) {
			this._requesters.splice(currentIndex, 1);
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "unregisteredRequester",
			data: {
				requesterId
			}
		});
	}

	/**
	 * Register an offer available for negotiation.
	 * @param offer The offer to register.
	 * @returns Nothing.
	 */
	public async registerOffer(offer: IOdrlOffer): Promise<void> {
		Guards.objectValue<IOdrlOffer>(this.CLASS_NAME, nameof(offer), offer);
		Guards.stringValue(this.CLASS_NAME, nameof(offer.uid), offer.uid);

		const index = this._offers.findIndex(o => o.uid === offer.uid);
		if (index !== -1) {
			this._offers[index] = offer;
		} else {
			this._offers.push(offer);
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "registeredOffer",
			data: {
				offerId: offer.uid
			}
		});
	}

	/**
	 * Unregister an offer.
	 * @param offerId The id of the offer to unregister.
	 * @returns Nothing.
	 */
	public async unregisterOffer(offerId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(offerId), offerId);

		const index = this._offers.findIndex(o => o.uid === offerId);
		if (index !== -1) {
			this._offers.splice(index, 1);
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "unregisteredOffer",
			data: {
				offerId
			}
		});
	}

	/**
	 * Set the error state for a negotiation.
	 * @param providerId The provider id for the negotiation.
	 * @param consumerId The consumer id for the negotiation.
	 * @param policyNegotiation The policy negotiation.
	 * @param error The error that occurred.
	 * @returns The error response.
	 * @internal
	 */
	private async setErrorState(
		providerId: string,
		consumerId: string,
		policyNegotiation: IPolicyNegotiation | undefined,
		error: unknown
	): Promise<IIdsContractNegotiationError> {
		const err = BaseError.fromError(error);
		const translated = ErrorHelper.formatErrors(error);

		const errMessage: IIdsContractNegotiationError = {
			"@context": IdsContractNegotiationContexts.ContextRoot,
			"@type": IdsContractNegotiationTypes.ContractNegotiationError,
			providerPid: providerId,
			consumerPid: consumerId,
			code: err.message,
			reason: translated.map(item => ({
				"@value": item,
				"@language": "en-US"
			}))
		};

		if (!Is.empty(policyNegotiation)) {
			policyNegotiation.code = errMessage.code;
			policyNegotiation.reason = errMessage.reason;
			policyNegotiation.state = IdsContractNegotiationStateType.TERMINATED;

			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);
		}

		return errMessage;
	}

	/**
	 * Construct a negotiation message.
	 * @param providerId The provider id.
	 * @param consumerId The consumer id.
	 * @param state The state.
	 * @returns The negotiation message.
	 * @internal
	 */
	private constructNegotiationMessage(
		providerId: string,
		consumerId: string,
		state: IdsContractNegotiationStateType
	): IIdsContractNegotiation {
		return {
			"@context": IdsContractNegotiationContexts.ContextRoot,
			"@type": IdsContractNegotiationTypes.ContractNegotiation,
			providerPid: providerId,
			consumerPid: consumerId,
			state
		};
	}

	/**
	 * Send an offer message to the consumer.
	 * @param callbackAddress The callback address to send the offer to.
	 * @param policyNegotiation The current state of the policy negotiation.
	 * @returns Nothing.
	 * @internal
	 */
	private async sendOfferToConsumer(
		callbackAddress: string,
		policyNegotiation: IPolicyNegotiation
	): Promise<void> {
		try {
			Guards.stringValue(this.CLASS_NAME, nameof(callbackAddress), callbackAddress);
			Guards.object<IPolicyNegotiation>(
				this.CLASS_NAME,
				nameof(policyNegotiation),
				policyNegotiation
			);
			Guards.object<IOdrlOffer>(
				this.CLASS_NAME,
				nameof(policyNegotiation.offer),
				policyNegotiation.offer
			);

			if (!Is.stringValue(this._nodeIdentity)) {
				throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
			}

			const offerMessage: IIdsContractOfferMessage = {
				"@context": IdsContractNegotiationContexts.ContextRoot,
				"@type": IdsContractNegotiationTypes.ContractOfferMessage,
				providerPid: policyNegotiation.id,
				consumerPid: policyNegotiation.correlationId,
				offer: policyNegotiation.offer,
				callbackAddress: this._baseCallbackUrl
			};

			const policyRequest: IPolicyRequest = {
				"@context": RightsManagementContexts.ContextRoot,
				type: RightsManagementTypes.PolicyRequest,
				providerPid: policyNegotiation.id,
				consumerPid: policyNegotiation.correlationId
			};

			const sendProofToken = await RightsManagementTokenHelper.createToken(
				this._identityConnector,
				DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
				policyRequest,
				this._proofTtlInSeconds
			);

			policyNegotiation.state = IdsContractNegotiationStateType.OFFERED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			const negotiationComponent = await this._negotiationComponentCreator(callbackAddress);
			const response = await negotiationComponent.offerFromProvider(offerMessage, sendProofToken);

			// If there was no error then the consumer will now send an event if they accepted the offer
			await this.terminateIfResponseError(response, policyNegotiation);
		} catch (error) {
			// As this method is called async we need to store the error in the negotiation
			await this.setErrorState(
				policyNegotiation.id,
				policyNegotiation.correlationId,
				policyNegotiation,
				error
			);
		}
	}

	/**
	 * Send an event message to the provider.
	 * @param callbackAddress The callback address to send the agreement to.
	 * @param policyNegotiation The current state of the policy negotiation.
	 * @param event The event to send to the provider.
	 * @param destination The destination for the event
	 * @returns Nothing.
	 * @internal
	 */
	private async sendEvent(
		callbackAddress: string,
		policyNegotiation: IPolicyNegotiation,
		event: IdsContractNegotiationEventType,
		destination: "provider" | "consumer"
	): Promise<void> {
		try {
			Guards.stringValue(this.CLASS_NAME, nameof(callbackAddress), callbackAddress);
			Guards.object<IPolicyNegotiation>(
				this.CLASS_NAME,
				nameof(policyNegotiation),
				policyNegotiation
			);
			const offer = policyNegotiation.offer;
			Guards.object<IOdrlOffer>(this.CLASS_NAME, nameof(offer), offer);

			if (!Is.stringValue(this._nodeIdentity)) {
				throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
			}

			// Create the finalisation message
			const eventMessage: IIdsContractNegotiationEventMessage = {
				"@context": IdsContractNegotiationContexts.ContextRoot,
				"@type": IdsContractNegotiationTypes.ContractNegotiationEventMessage,
				providerPid:
					destination === "consumer" ? policyNegotiation.id : policyNegotiation.correlationId,
				consumerPid:
					destination === "provider" ? policyNegotiation.id : policyNegotiation.correlationId,
				event
			};

			const policyRequest: IPolicyRequest = {
				"@context": RightsManagementContexts.ContextRoot,
				type: RightsManagementTypes.PolicyRequest,
				providerPid:
					destination === "consumer" ? policyNegotiation.id : policyNegotiation.correlationId,
				consumerPid:
					destination === "provider" ? policyNegotiation.id : policyNegotiation.correlationId
			};

			const sendProofToken = await RightsManagementTokenHelper.createToken(
				this._identityConnector,
				DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
				policyRequest,
				this._proofTtlInSeconds
			);

			policyNegotiation.state = event;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			const negotiationComponent = await this._negotiationComponentCreator(callbackAddress);
			const response = await negotiationComponent.event(eventMessage, destination, sendProofToken);

			await this.terminateIfResponseError(response, policyNegotiation);
		} catch (error) {
			// As this method is called async we need to store the error in the negotiation
			await this.setErrorState(
				policyNegotiation.id,
				policyNegotiation.correlationId,
				policyNegotiation,
				error
			);
		}
	}

	/**
	 * Send an agreement message to the consumer.
	 * @param callbackAddress The callback address to send the agreement to.
	 * @param policyNegotiation The current state of the policy negotiation.
	 * @returns Nothing.
	 * @internal
	 */
	private async sendAgreementToConsumer(
		callbackAddress: string,
		policyNegotiation: IPolicyNegotiation
	): Promise<void> {
		try {
			Guards.stringValue(this.CLASS_NAME, nameof(callbackAddress), callbackAddress);
			Guards.object<IPolicyNegotiation>(
				this.CLASS_NAME,
				nameof(policyNegotiation),
				policyNegotiation
			);
			const offer = policyNegotiation.offer;
			Guards.object<IOdrlOffer>(this.CLASS_NAME, nameof(offer), offer);

			if (!Is.stringValue(this._nodeIdentity)) {
				throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
			}

			const found = this._negotiators.find(n => n.negotiator.supportsOffer(offer));
			if (Is.empty(found)) {
				// No negotiator, so set the error on the negotiation
				await this.setErrorState(
					policyNegotiation.id,
					policyNegotiation.correlationId,
					policyNegotiation,
					new GeneralError(this.CLASS_NAME, "noNegotiatorFound", {
						offerId: offer.uid
					})
				);
			} else {
				// Use the negotiator to create the agreement for the offer
				const agreement = await found.negotiator.createAgreement(
					offer,
					policyNegotiation.information
				);

				if (Is.empty(agreement)) {
					// No agreement, so set the error on the negotiation
					await this.setErrorState(
						policyNegotiation.id,
						policyNegotiation.correlationId,
						policyNegotiation,
						new GeneralError(this.CLASS_NAME, "noAgreementCreated", {
							offerId: offer.uid
						})
					);
				} else {
					// Create the agreement message
					const agreementMessage: IIdsContractAgreementMessage = {
						"@context": IdsContractNegotiationContexts.ContextRoot,
						"@type": IdsContractNegotiationTypes.ContractAgreementMessage,
						providerPid: policyNegotiation.id,
						consumerPid: policyNegotiation.correlationId,
						agreement,
						callbackAddress: this._baseCallbackUrl
					};

					const policyRequest: IPolicyRequest = {
						"@context": RightsManagementContexts.ContextRoot,
						type: RightsManagementTypes.PolicyRequest,
						providerPid: policyNegotiation.id,
						consumerPid: policyNegotiation.correlationId
					};

					const sendProofToken = await RightsManagementTokenHelper.createToken(
						this._identityConnector,
						DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
						policyRequest,
						this._proofTtlInSeconds
					);

					policyNegotiation.state = IdsContractNegotiationStateType.AGREED;
					policyNegotiation.agreement = agreement;
					await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

					const negotiationComponent = await this._negotiationComponentCreator(callbackAddress);
					const response = await negotiationComponent.agreementFromProvider(
						agreementMessage,
						sendProofToken
					);

					// If there was no error then the consumer will now send an agreement verification
					await this.terminateIfResponseError(response, policyNegotiation);
				}
			}
		} catch (error) {
			// As this method is called async we need to store the error in the negotiation
			await this.setErrorState(
				policyNegotiation.id,
				policyNegotiation.correlationId,
				policyNegotiation,
				error
			);
		}
	}

	/**
	 * Send an agreement verification message to the provider.
	 * @param callbackAddress The callback address to send the offer to.
	 * @param policyNegotiation The current state of the policy negotiation.
	 * @returns Nothing.
	 * @internal
	 */
	private async sendAgreementVerificationToProvider(
		callbackAddress: string,
		policyNegotiation: IPolicyNegotiation
	): Promise<void> {
		try {
			Guards.stringValue(this.CLASS_NAME, nameof(callbackAddress), callbackAddress);
			Guards.object<IPolicyNegotiation>(
				this.CLASS_NAME,
				nameof(policyNegotiation),
				policyNegotiation
			);

			if (!Is.stringValue(this._nodeIdentity)) {
				throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
			}

			const agreementVerificationMessage: IIdsContractAgreementVerificationMessage = {
				"@context": IdsContractNegotiationContexts.ContextRoot,
				"@type": IdsContractNegotiationTypes.ContractAgreementVerificationMessage,
				providerPid: policyNegotiation.correlationId,
				consumerPid: policyNegotiation.id
			};

			const policyRequest: IPolicyRequest = {
				"@context": RightsManagementContexts.ContextRoot,
				type: RightsManagementTypes.PolicyRequest,
				providerPid: policyNegotiation.correlationId,
				consumerPid: policyNegotiation.id
			};

			const sendProofToken = await RightsManagementTokenHelper.createToken(
				this._identityConnector,
				DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
				policyRequest,
				this._proofTtlInSeconds
			);

			policyNegotiation.state = IdsContractNegotiationStateType.VERIFIED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			const negotiationComponent = await this._negotiationComponentCreator(callbackAddress);
			const response = await negotiationComponent.agreementVerificationFromConsumer(
				agreementVerificationMessage,
				sendProofToken
			);

			await this.terminateIfResponseError(response, policyNegotiation);
		} catch (error) {
			// As this method is called async we need to store the error in the negotiation
			await this.setErrorState(
				policyNegotiation.id,
				policyNegotiation.correlationId,
				policyNegotiation,
				error
			);
		}
	}

	/**
	 * The result possible contains a failure, if it does then terminate the negotiation.
	 * @param response The response to check for an error.
	 * @param policyNegotiation The negotiation to update.
	 * @returns Nothing
	 * @internal
	 */
	private async terminateIfResponseError(
		response: IIdsContractNegotiationError | undefined,
		policyNegotiation: IPolicyNegotiation
	): Promise<void> {
		if (
			response?.["@type"] === IdsContractNegotiationTypes.ContractNegotiationError &&
			Is.object<IIdsContractNegotiationError>(response)
		) {
			policyNegotiation.state = IdsContractNegotiationStateType.TERMINATED;
			policyNegotiation.reason = response.reason;
			policyNegotiation.code = response.code;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);
		}
	}
}
