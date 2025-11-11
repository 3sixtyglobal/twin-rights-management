// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ContextIdHelper, ContextIdKeys, ContextIdStore } from "@twin.org/context";
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
	IdentityAuthenticationContexts,
	IdentityAuthenticationTypes,
	type IIdentityAuthenticationActionRequest
} from "@twin.org/identity-authentication";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	PolicyInformationAccessMode,
	RightsManagementNamespaces,
	type IPolicyAdministrationPointComponent,
	type IPolicyInformation,
	type IPolicyInformationPointComponent,
	type IPolicyNegotiation,
	type IPolicyNegotiationAdminPointComponent,
	type IPolicyNegotiationPointComponent,
	type IPolicyNegotiator,
	type IPolicyRequester
} from "@twin.org/rights-management-models";
import {
	ContractNegotiationContexts,
	ContractNegotiationEventType,
	ContractNegotiationStateType,
	ContractNegotiationTypes,
	type IContractAgreementMessage,
	type IContractAgreementVerificationMessage,
	type IContractNegotiation,
	type IContractNegotiationError,
	type IContractNegotiationEventMessage,
	type IContractNegotiationTerminationMessage,
	type IContractOfferMessage,
	type IContractRequestMessage
} from "@twin.org/standards-dataspace-protocol";
import { OdrlContexts, OdrlTypes, type IOdrlOffer } from "@twin.org/standards-w3c-odrl";
import type { IPolicyNegotiationPointServiceConfig } from "./models/IPolicyNegotiationPointServiceConfig.js";
import type { IPolicyNegotiationPointServiceConstructorOptions } from "./models/IPolicyNegotiationPointServiceConstructorOptions.js";

/**
 * Class implementation of Policy Negotiation Point Component.
 */
export class PolicyNegotiationPointService implements IPolicyNegotiationPointComponent {
	/**
	 * The class name of the Policy Negotiation Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<PolicyNegotiationPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

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
	private _nodeId?: string;

	/**
	 * Create a new instance of PolicyNegotiationPointService (PNP).
	 * @param options The options for the component.
	 */
	constructor(options: IPolicyNegotiationPointServiceConstructorOptions) {
		Guards.object<IPolicyNegotiationPointServiceConstructorOptions>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(options),
			options
		);
		Guards.object<IPolicyNegotiationPointServiceConfig>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(options.config),
			options.config
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(options.config.baseCallbackUrl),
			options.config.baseCallbackUrl
		);
		Guards.function(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(options.config.negotiationComponentCreator),
			options.config.negotiationComponentCreator
		);

		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options.loggingComponentType ?? "logging"
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
		this._negotiationComponentCreator = options.config.negotiationComponentCreator;
		this._negotiators = options.config.negotiators ?? [];
		this._requesters = options.config.requesters ?? [];
		this._offers = options.config.offers ?? [];
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyNegotiationPointService.CLASS_NAME;
	}

	/**
	 * The component needs to be started when the node is initialized.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns Nothing.
	 */
	public async start(nodeLoggingComponentType?: string): Promise<void> {
		const contextIds = await ContextIdStore.getContextIds();
		ContextIdHelper.guard(contextIds, ContextIdKeys.Node);
		this._nodeId = contextIds[ContextIdKeys.Node];
	}

	/**
	 * Get the current state of the negotiation.
	 * @param id The id of the negotiation to retrieve.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The current state of the negotiation or an error.
	 */
	public async getNegotiation(
		id: string,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiation | IContractNegotiationError> {
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(id), id);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);

		try {
			if (actionRequest.action !== "get-negotiation") {
				throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "incorrectActionType", {
					action: actionRequest.action,
					expecting: "get-negotiation"
				});
			}

			const negotiation = await this._policyNegotiationAdminPointComponent.get(id);
			if (Is.empty(negotiation)) {
				throw new NotFoundError(
					PolicyNegotiationPointService.CLASS_NAME,
					"negotiationNotFound",
					id
				);
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
		Url.guard(PolicyNegotiationPointService.CLASS_NAME, nameof(url), url);
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(requesterId), requesterId);
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(odrlOfferId), odrlOfferId);

		if (!Is.stringValue(this._nodeId)) {
			throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "missingNodeId");
		}

		const policyRequester = this._requesters.find(r => r.requesterId === requesterId)?.requester;
		if (Is.empty(policyRequester)) {
			throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "noRequesterFound", {
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

		const actionRequest: IIdentityAuthenticationActionRequest = {
			"@context": IdentityAuthenticationContexts.ContextRoot,
			type: IdentityAuthenticationTypes.ActionRequest,
			action: "request",
			requester: this._nodeId,
			data: policyInformation
		};

		const negotiationComponent = await this._negotiationComponentCreator(url);

		const requestMessage: IContractRequestMessage = {
			"@context": ContractNegotiationContexts.ContextRoot,
			"@type": ContractNegotiationTypes.ContractRequestMessage,
			consumerPid,
			offer: {
				"@context": OdrlContexts.ContextRoot,
				"@type": OdrlTypes.Offer,
				uid: odrlOfferId,
				assigner: this._nodeId
			},
			callbackAddress: this._baseCallbackUrl
		};
		const response = await negotiationComponent.requestFromConsumer(requestMessage, actionRequest);

		if (
			response["@type"] === ContractNegotiationTypes.ContractNegotiationError &&
			Is.object<IContractNegotiationError>(response)
		) {
			throw new GeneralError(
				PolicyNegotiationPointService.CLASS_NAME,
				response.code ?? "negotiationFailed",
				{
					offerId: odrlOfferId
				}
			);
		}

		const policyNegotiation: IPolicyNegotiation = {
			id: consumerPid,
			correlationId: response.providerPid,
			state: ContractNegotiationStateType.REQUESTED,
			dateCreated: new Date(Date.now()).toISOString(),
			handlerId: requesterId,
			information: policyInformation
		};

		await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

		return consumerPid;
	}

	/**
	 * Processes an incoming request on a provider from a consumer.
	 * https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#contract-request-message.
	 * @param message The negotiation request.
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The current state of the contract negotiation or an error.
	 */
	public async requestFromConsumer(
		message: IContractRequestMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiation | IContractNegotiationError> {
		Guards.object<IContractRequestMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);
		Guards.object<IOdrlOffer["offer"]>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.offer),
			message.offer
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.offer.uid),
			message.offer.uid
		);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);
		Url.guard(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.callbackAddress),
			message.callbackAddress
		);

		// Use the provided provider pid or generate a new one
		const providerPid =
			message.providerPid ??
			Urn.generateRandom(RightsManagementNamespaces.ContractNegotiation).toString(false);

		let policyNegotiation: IPolicyNegotiation | undefined;

		try {
			if (actionRequest.action !== "request") {
				throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "incorrectActionType", {
					action: actionRequest.action,
					expecting: "request"
				});
			}

			// Now lookup the offer being requested
			const providerOffer = this._offers.find(o => o.uid === message.offer.uid);
			if (Is.empty(providerOffer)) {
				// No offer, so error
				const err = await this.setErrorState(
					providerPid,
					message.consumerPid,
					undefined,
					new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "noOfferFound", {
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
					new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "noNegotiatorFound", {
						offerId: message.offer.uid
					})
				);
				return err;
			}

			// On an initial request a consumer can send additional information to support the negotiation
			// this could include information such as the geography of the consumer
			const policyInformation = actionRequest.data as IPolicyInformation;

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
							new NotFoundError(
								PolicyNegotiationPointService.CLASS_NAME,
								"negotiationNotFound",
								message.providerPid
							)
						);
						return err;
					}
					throw error;
				}

				// The negotiation must be in the REQUESTED state to update it
				if (policyNegotiation.state !== ContractNegotiationStateType.REQUESTED) {
					const err = await this.setErrorState(
						message.providerPid,
						policyNegotiation.correlationId,
						undefined,
						new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "invalidState", {
							state: policyNegotiation.state,
							negotiationId: message.consumerPid
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
					state: ContractNegotiationStateType.REQUESTED,
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
				new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "negotiationFailed", {
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
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The current state of the contract negotiation or an error.
	 */
	public async offerFromProvider(
		message: IContractOfferMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiation | IContractNegotiationError> {
		Guards.object<IContractOfferMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);

		let consumerPid;
		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			if (actionRequest.action !== "offer") {
				throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "incorrectActionType", {
					action: actionRequest.action,
					expecting: "offer"
				});
			}

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
							new NotFoundError(
								PolicyNegotiationPointService.CLASS_NAME,
								"negotiationNotFound",
								consumerPid
							)
						);
						return err;
					}
					throw error;
				}

				// The negotiation must be in the REQUESTED state to accept an offer
				if (policyNegotiation.state !== ContractNegotiationStateType.REQUESTED) {
					const err = await this.setErrorState(
						message.providerPid,
						message.consumerPid,
						undefined,
						new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "invalidState", {
							state: policyNegotiation.state,
							negotiationId: message.providerPid
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
					state: ContractNegotiationStateType.OFFERED
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
						new NotFoundError(
							PolicyNegotiationPointService.CLASS_NAME,
							"requesterNotFound",
							requesterId
						)
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
						new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "offerNotAccepted", {
							offerId: message.offer.uid
						})
					);
					return err;
				}
			}

			// The offer was accepted by the consumer, so update the state
			policyNegotiation.state = ContractNegotiationStateType.ACCEPTED;
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
						ContractNegotiationEventType.ACCEPTED,
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
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	public async agreementFromProvider(
		message: IContractAgreementMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiationError | undefined> {
		Guards.object<IContractAgreementMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);
		Url.guard(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.callbackAddress),
			message.callbackAddress
		);

		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			if (actionRequest.action !== "agreement") {
				throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "incorrectActionType", {
					action: actionRequest.action,
					expecting: "agreement"
				});
			}
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
						new NotFoundError(
							PolicyNegotiationPointService.CLASS_NAME,
							"negotiationNotFound",
							message.consumerPid
						)
					);
					return err;
				}
				throw error;
			}

			// The negotiation must be in the ACCEPTED state to accept an agreement
			if (policyNegotiation.state !== ContractNegotiationStateType.ACCEPTED) {
				const err = await this.setErrorState(
					message.providerPid,
					message.consumerPid,
					undefined,
					new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "invalidState", {
						state: policyNegotiation.state,
						negotiationId: message.providerPid
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
						new NotFoundError(
							PolicyNegotiationPointService.CLASS_NAME,
							"requesterNotFound",
							requesterId
						)
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
						new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "agreementNotAccepted", {
							agreementId: message.agreement.uid
						})
					);
					return err;
				}
			}

			// The agreement was accepted by the consumer, so update the state
			// and store the agreement
			policyNegotiation.state = ContractNegotiationStateType.AGREED;
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
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	public async agreementVerificationFromConsumer(
		message: IContractAgreementVerificationMessage,
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiationError | undefined> {
		Guards.object<IContractAgreementMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);

		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			if (actionRequest.action !== "agreement-verification") {
				throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "incorrectActionType", {
					action: actionRequest.action,
					expecting: "agreement-verification"
				});
			}
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
						new NotFoundError(
							PolicyNegotiationPointService.CLASS_NAME,
							"negotiationNotFound",
							message.providerPid
						)
					);
					return err;
				}
				throw error;
			}

			// The negotiation must be in the AGREED state to accept an agreement
			if (policyNegotiation.state !== ContractNegotiationStateType.AGREED) {
				const err = await this.setErrorState(
					message.providerPid,
					message.consumerPid,
					undefined,
					new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "invalidState", {
						state: policyNegotiation.state,
						negotiationId: message.consumerPid
					})
				);
				return err;
			}

			if (Is.empty(policyNegotiation.agreement)) {
				const err = await this.setErrorState(
					message.providerPid,
					message.consumerPid,
					policyNegotiation,
					new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "agreementMissing")
				);
				return err;
			}

			// Now that the agreement is finalised create the policy in the PAP
			await this._policyAdministrationPointComponent.create(policyNegotiation.agreement);

			// The agreement was created, so update the state to finalized
			policyNegotiation.state = ContractNegotiationStateType.FINALIZED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

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
						ContractNegotiationEventType.FINALIZED,
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
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	public async event(
		message: IContractNegotiationEventMessage,
		destination: "provider" | "consumer",
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiationError | undefined> {
		Guards.object<IContractNegotiationEventMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.arrayOneOf(PolicyNegotiationPointService.CLASS_NAME, nameof(destination), destination, [
			"provider",
			"consumer"
		]);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);

		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			if (actionRequest.action !== "event") {
				throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "incorrectActionType", {
					action: actionRequest.action,
					expecting: "event"
				});
			}
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
						new NotFoundError(
							PolicyNegotiationPointService.CLASS_NAME,
							"negotiationNotFound",
							policyId
						)
					);
					return err;
				}
				throw error;
			}

			// We can only transition from OFFERED to ACCEPTED or VERIFIED to FINALIZED
			// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#state-machine
			if (
				!(
					(policyNegotiation.state === ContractNegotiationStateType.OFFERED &&
						message.event === ContractNegotiationEventType.ACCEPTED) ||
					(policyNegotiation.state === ContractNegotiationStateType.VERIFIED &&
						message.event === ContractNegotiationEventType.FINALIZED)
				)
			) {
				const err = await this.setErrorState(
					message.providerPid,
					message.consumerPid,
					undefined,
					new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "invalidState", {
						state: policyNegotiation.state,
						negotiationId: policyId
					})
				);
				return err;
			}

			// Update the state to the new state
			policyNegotiation.state = message.event;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			if (destination === "consumer" && message.event === ContractNegotiationEventType.FINALIZED) {
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
							new NotFoundError(
								PolicyNegotiationPointService.CLASS_NAME,
								"requesterNotFound",
								requesterId
							)
						);
						return err;
					}

					// Tell the requester about the finalisation
					await found.requester.finalised(requesterId);
				}
			} else if (
				destination === "provider" &&
				message.event === ContractNegotiationEventType.ACCEPTED
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
	 * @param actionRequest The action request used in the verifiable credential.
	 * @returns The error if there is one.
	 */
	public async terminate(
		message: IContractNegotiationTerminationMessage,
		destination: "provider" | "consumer",
		actionRequest: IIdentityAuthenticationActionRequest
	): Promise<IContractNegotiationError | undefined> {
		Guards.object<IContractNegotiationTerminationMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.arrayOneOf(PolicyNegotiationPointService.CLASS_NAME, nameof(destination), destination, [
			"provider",
			"consumer"
		]);
		Guards.objectValue<IIdentityAuthenticationActionRequest>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(actionRequest),
			actionRequest
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);

		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			if (actionRequest.action !== "terminate") {
				throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "incorrectActionType", {
					action: actionRequest.action,
					expecting: "terminate"
				});
			}
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
						new NotFoundError(
							PolicyNegotiationPointService.CLASS_NAME,
							"negotiationNotFound",
							policyId
						)
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
							new NotFoundError(
								PolicyNegotiationPointService.CLASS_NAME,
								"requesterNotFound",
								requesterId
							)
						);
						return err;
					}

					// Tell the requester about the termination
					await found.requester.terminated(requesterId);
				}
			}

			// Update the state to terminated
			policyNegotiation.state = ContractNegotiationStateType.TERMINATED;
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
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(negotiatorId),
			negotiatorId
		);
		Guards.objectValue<IPolicyNegotiator>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(negotiator),
			negotiator
		);

		const currentIndex = this._negotiators.findIndex(p => p.negotiatorId === negotiatorId);
		if (currentIndex !== -1) {
			this._negotiators[currentIndex].negotiator = negotiator;
		} else {
			this._negotiators.push({ negotiatorId, negotiator });
		}

		await this._logging?.log({
			level: "info",
			source: PolicyNegotiationPointService.CLASS_NAME,
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
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(negotiatorId),
			negotiatorId
		);

		const currentIndex = this._negotiators.findIndex(p => p.negotiatorId === negotiatorId);
		if (currentIndex !== -1) {
			this._negotiators.splice(currentIndex, 1);
		}

		await this._logging?.log({
			level: "info",
			source: PolicyNegotiationPointService.CLASS_NAME,
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
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(requesterId), requesterId);
		Guards.objectValue<IPolicyRequester>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(requester),
			requester
		);

		const currentIndex = this._requesters.findIndex(p => p.requesterId === requesterId);
		if (currentIndex !== -1) {
			this._requesters[currentIndex].requester = requester;
		} else {
			this._requesters.push({ requesterId, requester });
		}

		await this._logging?.log({
			level: "info",
			source: PolicyNegotiationPointService.CLASS_NAME,
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
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(requesterId), requesterId);

		const currentIndex = this._requesters.findIndex(p => p.requesterId === requesterId);
		if (currentIndex !== -1) {
			this._requesters.splice(currentIndex, 1);
		}

		await this._logging?.log({
			level: "info",
			source: PolicyNegotiationPointService.CLASS_NAME,
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
		Guards.objectValue<IOdrlOffer>(PolicyNegotiationPointService.CLASS_NAME, nameof(offer), offer);
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(offer.uid), offer.uid);

		const index = this._offers.findIndex(o => o.uid === offer.uid);
		if (index !== -1) {
			this._offers[index] = offer;
		} else {
			this._offers.push(offer);
		}

		await this._logging?.log({
			level: "info",
			source: PolicyNegotiationPointService.CLASS_NAME,
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
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(offerId), offerId);

		const index = this._offers.findIndex(o => o.uid === offerId);
		if (index !== -1) {
			this._offers.splice(index, 1);
		}

		await this._logging?.log({
			level: "info",
			source: PolicyNegotiationPointService.CLASS_NAME,
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
	): Promise<IContractNegotiationError> {
		const err = BaseError.fromError(error);
		const translated = ErrorHelper.formatErrors(error);

		const errMessage: IContractNegotiationError = {
			"@context": ContractNegotiationContexts.ContextRoot,
			"@type": ContractNegotiationTypes.ContractNegotiationError,
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
			policyNegotiation.state = ContractNegotiationStateType.TERMINATED;

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
		state: ContractNegotiationStateType
	): IContractNegotiation {
		return {
			"@context": ContractNegotiationContexts.ContextRoot,
			"@type": ContractNegotiationTypes.ContractNegotiation,
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
			Guards.stringValue(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(callbackAddress),
				callbackAddress
			);
			Guards.object<IPolicyNegotiation>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(policyNegotiation),
				policyNegotiation
			);
			Guards.object<IOdrlOffer>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(policyNegotiation.offer),
				policyNegotiation.offer
			);

			if (!Is.stringValue(this._nodeId)) {
				throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "missingNodeId");
			}

			const offerMessage: IContractOfferMessage = {
				"@context": ContractNegotiationContexts.ContextRoot,
				"@type": ContractNegotiationTypes.ContractOfferMessage,
				providerPid: policyNegotiation.id,
				consumerPid: policyNegotiation.correlationId,
				offer: policyNegotiation.offer,
				callbackAddress: this._baseCallbackUrl
			};

			const actionRequest: IIdentityAuthenticationActionRequest = {
				"@context": IdentityAuthenticationContexts.ContextRoot,
				type: IdentityAuthenticationTypes.ActionRequest,
				action: "offer",
				requester: this._nodeId
			};

			policyNegotiation.state = ContractNegotiationStateType.OFFERED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			const negotiationComponent = await this._negotiationComponentCreator(callbackAddress);
			const response = await negotiationComponent.offerFromProvider(offerMessage, actionRequest);

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
		event: ContractNegotiationEventType,
		destination: "provider" | "consumer"
	): Promise<void> {
		try {
			Guards.stringValue(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(callbackAddress),
				callbackAddress
			);
			Guards.object<IPolicyNegotiation>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(policyNegotiation),
				policyNegotiation
			);
			const offer = policyNegotiation.offer;
			Guards.object<IOdrlOffer>(PolicyNegotiationPointService.CLASS_NAME, nameof(offer), offer);

			if (!Is.stringValue(this._nodeId)) {
				throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "missingNodeId");
			}

			// Create the finalisation message
			const eventMessage: IContractNegotiationEventMessage = {
				"@context": ContractNegotiationContexts.ContextRoot,
				"@type": ContractNegotiationTypes.ContractNegotiationEventMessage,
				providerPid:
					destination === "consumer" ? policyNegotiation.id : policyNegotiation.correlationId,
				consumerPid:
					destination === "provider" ? policyNegotiation.id : policyNegotiation.correlationId,
				event
			};

			const actionRequest: IIdentityAuthenticationActionRequest = {
				"@context": IdentityAuthenticationContexts.ContextRoot,
				type: IdentityAuthenticationTypes.ActionRequest,
				action: "event",
				requester: this._nodeId
			};

			policyNegotiation.state = event;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			const negotiationComponent = await this._negotiationComponentCreator(callbackAddress);
			const response = await negotiationComponent.event(eventMessage, destination, actionRequest);

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
			Guards.stringValue(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(callbackAddress),
				callbackAddress
			);
			Guards.object<IPolicyNegotiation>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(policyNegotiation),
				policyNegotiation
			);
			const offer = policyNegotiation.offer;
			Guards.object<IOdrlOffer>(PolicyNegotiationPointService.CLASS_NAME, nameof(offer), offer);

			if (!Is.stringValue(this._nodeId)) {
				throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "missingNodeId");
			}

			const found = this._negotiators.find(n => n.negotiator.supportsOffer(offer));
			if (Is.empty(found)) {
				// No negotiator, so set the error on the negotiation
				await this.setErrorState(
					policyNegotiation.id,
					policyNegotiation.correlationId,
					policyNegotiation,
					new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "noNegotiatorFound", {
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
						new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "noAgreementCreated", {
							offerId: offer.uid
						})
					);
				} else {
					// Create the agreement message
					const agreementMessage: IContractAgreementMessage = {
						"@context": ContractNegotiationContexts.ContextRoot,
						"@type": ContractNegotiationTypes.ContractAgreementMessage,
						providerPid: policyNegotiation.id,
						consumerPid: policyNegotiation.correlationId,
						agreement,
						callbackAddress: this._baseCallbackUrl
					};

					const actionRequest: IIdentityAuthenticationActionRequest = {
						"@context": IdentityAuthenticationContexts.ContextRoot,
						type: IdentityAuthenticationTypes.ActionRequest,
						action: "agreement",
						requester: this._nodeId
					};

					policyNegotiation.state = ContractNegotiationStateType.AGREED;
					policyNegotiation.agreement = agreement;
					await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

					const negotiationComponent = await this._negotiationComponentCreator(callbackAddress);
					const response = await negotiationComponent.agreementFromProvider(
						agreementMessage,
						actionRequest
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
			Guards.stringValue(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(callbackAddress),
				callbackAddress
			);
			Guards.object<IPolicyNegotiation>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(policyNegotiation),
				policyNegotiation
			);

			if (!Is.stringValue(this._nodeId)) {
				throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "missingNodeId");
			}

			const agreementVerificationMessage: IContractAgreementVerificationMessage = {
				"@context": ContractNegotiationContexts.ContextRoot,
				"@type": ContractNegotiationTypes.ContractAgreementVerificationMessage,
				providerPid: policyNegotiation.correlationId,
				consumerPid: policyNegotiation.id
			};

			const actionRequest: IIdentityAuthenticationActionRequest = {
				"@context": IdentityAuthenticationContexts.ContextRoot,
				type: IdentityAuthenticationTypes.ActionRequest,
				action: "agreement-verification",
				requester: this._nodeId
			};

			policyNegotiation.state = ContractNegotiationStateType.VERIFIED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			const negotiationComponent = await this._negotiationComponentCreator(callbackAddress);
			const response = await negotiationComponent.agreementVerificationFromConsumer(
				agreementVerificationMessage,
				actionRequest
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
		response: IContractNegotiationError | undefined,
		policyNegotiation: IPolicyNegotiation
	): Promise<void> {
		if (
			response?.["@type"] === ContractNegotiationTypes.ContractNegotiationError &&
			Is.object<IContractNegotiationError>(response)
		) {
			policyNegotiation.state = ContractNegotiationStateType.TERMINATED;
			policyNegotiation.reason = response.reason;
			policyNegotiation.code = response.code;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);
		}
	}
}
