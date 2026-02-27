// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ContextIdHelper, ContextIdKeys, ContextIdStore } from "@twin.org/context";
import {
	ArrayHelper,
	BaseError,
	ComponentFactory,
	ErrorHelper,
	GeneralError,
	Guards,
	Is,
	NotFoundError,
	StringHelper,
	Url,
	Urn
} from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	PolicyInformationAccessMode,
	PolicyNegotiatorFactory,
	PolicyRequesterFactory,
	RightsManagementNamespaces,
	type IPolicyAdministrationPointComponent,
	type IPolicyInformationPointComponent,
	type IPolicyNegotiation,
	type IPolicyNegotiationAdminPointComponent,
	type IPolicyNegotiationPointComponent
} from "@twin.org/rights-management-models";
import {
	DataspaceProtocolContexts,
	DataspaceProtocolContractNegotiationEventType,
	DataspaceProtocolContractNegotiationStateType,
	DataspaceProtocolContractNegotiationTypes,
	type IDataspaceProtocolContractAgreementMessage,
	type IDataspaceProtocolContractAgreementVerificationMessage,
	type IDataspaceProtocolContractNegotiation,
	type IDataspaceProtocolContractNegotiationError,
	type IDataspaceProtocolContractNegotiationEventMessage,
	type IDataspaceProtocolContractNegotiationTerminationMessage,
	type IDataspaceProtocolContractOfferMessage,
	type IDataspaceProtocolContractRequestMessage
} from "@twin.org/standards-dataspace-protocol";
import { OdrlContexts, OdrlTypes, type IOdrlOffer } from "@twin.org/standards-w3c-odrl";
import {
	type ITrustVerificationInfo,
	TrustHelper,
	type ITrustComponent
} from "@twin.org/trust-models";
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
	 * The trust component.
	 * @internal
	 */
	private readonly _trustComponent: ITrustComponent;

	/**
	 * The path to send in negotiation messages as the callback address.
	 * Will be combined with the public origin url from hosting component.
	 * @internal
	 */
	private readonly _callbackPath: string;

	/**
	 * The type of the remote negotiation component.
	 * @internal
	 */
	private readonly _policyNegotiationPointRemoteComponentType: string;

	/**
	 * Override the default trust generator.
	 * @internal
	 */
	private readonly _overrideTrustGeneratorType?: string;

	/**
	 * Whether to include error details in the error responses.
	 * @internal
	 */
	private readonly _includeErrorDetails: boolean;

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
		this._trustComponent = ComponentFactory.get<ITrustComponent>(
			options.trustComponentType ?? "trust"
		);
		this._callbackPath = Is.stringValue(options.config.callbackPath)
			? StringHelper.trimLeadingSlashes(options.config.callbackPath)
			: "";
		this._policyNegotiationPointRemoteComponentType =
			options.policyNegotiationPointRemoteComponentType ?? "policy-negotiation-point-remote";
		this._overrideTrustGeneratorType = options.config.overrideTrustGeneratorType;
		this._includeErrorDetails = options.config.includeErrorDetails ?? false;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyNegotiationPointService.CLASS_NAME;
	}

	/**
	 * Get the current state of the negotiation.
	 * @param id The id of the negotiation to retrieve.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the negotiation or an error.
	 */
	public async getNegotiation(
		id: string,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiation | IDataspaceProtocolContractNegotiationError> {
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(id), id);

		try {
			await TrustHelper.verifyTrust(
				this._trustComponent,
				trustPayload,
				"getNegotiation",
				undefined,
				this._includeErrorDetails
			);

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
	 * @param requesterType The type of the requester to use for the request, will use the registered requester to provide update.
	 * @param odrlOfferId The id of the offer to request.
	 * @param publicOrigin The public origin url of this PNP service.
	 * @returns The negotiation id.
	 */
	public async sendRequestToProvider(
		url: string,
		requesterType: string,
		odrlOfferId: string,
		publicOrigin: string
	): Promise<string> {
		Url.guard(PolicyNegotiationPointService.CLASS_NAME, nameof(url), url);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(requesterType),
			requesterType
		);
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(odrlOfferId), odrlOfferId);

		const policyRequester = PolicyRequesterFactory.getIfExists(requesterType);
		if (Is.empty(policyRequester)) {
			throw new NotFoundError(
				PolicyNegotiationPointService.CLASS_NAME,
				"noRequesterFound",
				requesterType
			);
		}

		const consumerPid = Urn.generateRandom(RightsManagementNamespaces.ContractNegotiation).toString(
			false
		);

		const policyData = await this._policyInformationPointComponent.retrieve(
			undefined,
			PolicyInformationAccessMode.Public
		);

		// The organization id should be available from the current context
		// but we need to guard against it not being there
		// we capture it in the negotiation so we can use it to generate the
		// trust payload for any outgoing messages related to this negotiation
		const contextIds = await ContextIdStore.getContextIds();
		ContextIdHelper.guard(contextIds, ContextIdKeys.Organization);
		const organizationIdentity = contextIds[ContextIdKeys.Organization];

		const trustPayload = await this._trustComponent.generate(
			organizationIdentity,
			this._overrideTrustGeneratorType,
			{
				subject: policyData
			}
		);

		const negotiationComponent = ComponentFactory.create<IPolicyNegotiationPointComponent>(
			this._policyNegotiationPointRemoteComponentType,
			{ endpoint: url }
		);

		const requestMessage: IDataspaceProtocolContractRequestMessage = {
			"@context": [DataspaceProtocolContexts.Context],
			"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
			consumerPid,
			offer: {
				"@context": OdrlContexts.Context,
				"@type": OdrlTypes.Offer,
				uid: odrlOfferId,
				assigner: organizationIdentity
			},
			callbackAddress: `${publicOrigin}/${this._callbackPath}`
		};

		const response = await negotiationComponent.requestFromConsumer(
			requestMessage,
			publicOrigin,
			trustPayload
		);

		if (
			OdrlPolicyHelper.getType(response) ===
				DataspaceProtocolContractNegotiationTypes.ContractNegotiationError &&
			Is.object<IDataspaceProtocolContractNegotiationError>(response)
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
			state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
			dateCreated: new Date(Date.now()).toISOString(),
			organizationIdentity,
			handlerId: requesterType,
			trustVerificationInfo: {
				identity: organizationIdentity,
				data: policyData
			}
		};

		await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

		return consumerPid;
	}

	/**
	 * Processes an incoming request on a provider from a consumer.
	 * https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#contract-request-message.
	 * @param message The negotiation request.
	 * @param publicOrigin The public origin url of this PNP service.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the contract negotiation or an error.
	 */
	public async requestFromConsumer(
		message: IDataspaceProtocolContractRequestMessage,
		publicOrigin: string,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiation | IDataspaceProtocolContractNegotiationError> {
		Guards.object<IDataspaceProtocolContractRequestMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.consumerPid),
			message.consumerPid
		);
		Guards.object<IOdrlOffer>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.offer),
			message.offer
		);
		const offerUid = OdrlPolicyHelper.getUid(message.offer);
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(offerUid), offerUid);
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
			const trustInfo = await TrustHelper.verifyTrust(
				this._trustComponent,
				trustPayload,
				"requestFromConsumer",
				undefined,
				this._includeErrorDetails
			);

			// Now lookup the offer being requested
			let providerOffer: IOdrlOffer | undefined;

			try {
				providerOffer = await this._policyAdministrationPointComponent.getOffer(offerUid);
			} catch {}

			if (Is.empty(providerOffer)) {
				// No offer, so error
				const err = await this.setErrorState(
					providerPid,
					message.consumerPid,
					undefined,
					new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "noOfferFound", {
						offerId: offerUid
					})
				);
				return err;
			}

			const negotiatorNames = PolicyNegotiatorFactory.names();
			const negotiators = negotiatorNames.map(name => PolicyNegotiatorFactory.get(name));

			// See if we have a negotiator that supports the offer
			const negotiator = negotiators.find(n => n.supportsOffer(providerOffer));
			if (Is.empty(negotiator)) {
				// No negotiator, so error
				const err = await this.setErrorState(
					providerPid,
					message.consumerPid,
					undefined,
					new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "noNegotiatorFound", {
						offerId: offerUid
					})
				);
				return err;
			}

			// On an initial request a consumer can send additional information to support the negotiation
			// this could include information such as the geography of the consumer
			const policyInformation = trustInfo.data;

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
				if (policyNegotiation.state !== DataspaceProtocolContractNegotiationStateType.REQUESTED) {
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
				policyNegotiation.trustVerificationInfo = trustInfo;
				policyNegotiation.handlerId = negotiator.className();
			} else {
				// We need an organization id to generate the trust payload, but we have no context
				// as this request arrived through a trust channel, so we should use the
				// assigner from the policy as the organization id in the trust payload
				const assigner = OdrlPolicyHelper.extractAssignerIdentity(providerOffer);
				const organizationIdentity = ArrayHelper.fromObjectOrArray(assigner)[0];
				if (!Is.stringValue(organizationIdentity)) {
					throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "assignerNotIdentity");
				}

				policyNegotiation = {
					id: providerPid,
					correlationId: message.consumerPid,
					dateCreated: new Date(Date.now()).toISOString(),
					offer: providerOffer,
					state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
					callbackAddress: message.callbackAddress,
					organizationIdentity,
					trustVerificationInfo: trustInfo,
					handlerId: negotiator.className()
				};
			}

			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			const negotiateResult = await negotiator.handleOffer(providerOffer, policyInformation);

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
						await this.sendOfferToConsumer(callbackAddress, pol, publicOrigin);
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
					offerId: OdrlPolicyHelper.getUid(providerOffer) ?? ""
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
	 * @param publicOrigin The public origin url of this PNP service.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the contract negotiation or an error.
	 */
	public async offerFromProvider(
		message: IDataspaceProtocolContractOfferMessage,
		publicOrigin: string,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiation | IDataspaceProtocolContractNegotiationError> {
		Guards.object<IDataspaceProtocolContractOfferMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.providerPid),
			message.providerPid
		);

		let consumerPid;
		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			await TrustHelper.verifyTrust(
				this._trustComponent,
				trustPayload,
				"offerFromProvider",
				undefined,
				this._includeErrorDetails
			);

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
				if (policyNegotiation.state !== DataspaceProtocolContractNegotiationStateType.REQUESTED) {
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
				throw new GeneralError(
					PolicyNegotiationPointService.CLASS_NAME,
					"providerInitiatedNotSupported"
				);
			}

			// If we have an associated requester id then notify
			const requesterType = policyNegotiation.handlerId;
			if (Is.stringValue(requesterType)) {
				// Try and find the original requester of the negotiation
				const policyRequester = PolicyRequesterFactory.getIfExists(requesterType);

				// We can't find the requester, so error
				if (Is.empty(policyRequester)) {
					const err = await this.setErrorState(
						message.providerPid,
						consumerPid,
						policyNegotiation,
						new NotFoundError(
							PolicyNegotiationPointService.CLASS_NAME,
							"requesterNotFound",
							requesterType
						)
					);
					return err;
				}

				// Tell the requester about the offer
				const accepted = await policyRequester.offer(policyNegotiation.id, message.offer);

				if (!accepted) {
					const err = await this.setErrorState(
						message.providerPid,
						consumerPid,
						policyNegotiation,
						new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "offerNotAccepted", {
							offerId: OdrlPolicyHelper.getUid(message.offer) ?? ""
						})
					);
					return err;
				}
			}

			// The offer was accepted by the consumer, so update the state
			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.ACCEPTED;
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
						DataspaceProtocolContractNegotiationEventType.ACCEPTED,
						"provider",
						publicOrigin
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
	 * @param publicOrigin The public origin url of this PNP service.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	public async agreementFromProvider(
		message: IDataspaceProtocolContractAgreementMessage,
		publicOrigin: string,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined> {
		Guards.object<IDataspaceProtocolContractAgreementMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
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
			await TrustHelper.verifyTrust(
				this._trustComponent,
				trustPayload,
				"agreementFromProvider",
				undefined,
				this._includeErrorDetails
			);

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
			if (policyNegotiation.state !== DataspaceProtocolContractNegotiationStateType.ACCEPTED) {
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
			const requesterType = policyNegotiation.handlerId;
			if (Is.stringValue(requesterType)) {
				// Try and find the original requester of the negotiation
				const policyRequester = PolicyRequesterFactory.getIfExists(requesterType);

				// We can't find the requester, so error
				if (Is.empty(policyRequester)) {
					const err = await this.setErrorState(
						message.providerPid,
						message.consumerPid,
						policyNegotiation,
						new NotFoundError(
							PolicyNegotiationPointService.CLASS_NAME,
							"requesterNotFound",
							requesterType
						)
					);
					return err;
				}

				// Tell the requester about the offer
				const accepted = await policyRequester.agreement(policyNegotiation.id, message.agreement);

				if (!accepted) {
					const err = await this.setErrorState(
						message.providerPid,
						message.consumerPid,
						policyNegotiation,
						new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "agreementNotAccepted", {
							agreementId: OdrlPolicyHelper.getUid(message.agreement) ?? ""
						})
					);
					return err;
				}
			}

			// The agreement was accepted by the consumer, so update the state
			// and store the agreement
			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.AGREED;
			policyNegotiation.agreement = message.agreement;

			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			// Send the agreement verification to the provider on the next cycle so we don't delay the current response
			const callbackAddress = message.callbackAddress;
			const pol = policyNegotiation;
			setTimeout(async () => {
				await this.sendAgreementVerificationToProvider(callbackAddress, pol, publicOrigin);
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
	 * @param publicOrigin The public origin url of this PNP service.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	public async agreementVerificationFromConsumer(
		message: IDataspaceProtocolContractAgreementVerificationMessage,
		publicOrigin: string,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined> {
		Guards.object<IDataspaceProtocolContractAgreementVerificationMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
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
			await TrustHelper.verifyTrust(
				this._trustComponent,
				trustPayload,
				"agreementVerificationFromConsumer",
				undefined,
				this._includeErrorDetails
			);
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
			if (policyNegotiation.state !== DataspaceProtocolContractNegotiationStateType.AGREED) {
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
			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.FINALIZED;
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
						DataspaceProtocolContractNegotiationEventType.FINALIZED,
						"consumer",
						publicOrigin
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
	 * @param publicOrigin The public origin url of this PNP service.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	public async event(
		message: IDataspaceProtocolContractNegotiationEventMessage,
		destination: "provider" | "consumer",
		publicOrigin: string,
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined> {
		Guards.object<IDataspaceProtocolContractNegotiationEventMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.arrayOneOf(PolicyNegotiationPointService.CLASS_NAME, nameof(destination), destination, [
			"provider",
			"consumer"
		]);
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
			await TrustHelper.verifyTrust(
				this._trustComponent,
				trustPayload,
				"event",
				undefined,
				this._includeErrorDetails
			);

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
					(policyNegotiation.state === DataspaceProtocolContractNegotiationStateType.OFFERED &&
						message.event === DataspaceProtocolContractNegotiationEventType.ACCEPTED) ||
					(policyNegotiation.state === DataspaceProtocolContractNegotiationStateType.VERIFIED &&
						message.event === DataspaceProtocolContractNegotiationEventType.FINALIZED)
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

			if (
				destination === "consumer" &&
				message.event === DataspaceProtocolContractNegotiationEventType.FINALIZED
			) {
				// Try and find the original requester of the negotiation
				// this will only happen on the consumer side
				const requesterType = policyNegotiation.handlerId;
				if (Is.stringValue(requesterType)) {
					const policyRequester = PolicyRequesterFactory.getIfExists(requesterType);

					// We can't find the requester, so error
					if (Is.empty(policyRequester)) {
						const err = await this.setErrorState(
							message.providerPid,
							message.consumerPid,
							policyNegotiation,
							new NotFoundError(
								PolicyNegotiationPointService.CLASS_NAME,
								"requesterNotFound",
								requesterType
							)
						);
						return err;
					}

					// Tell the requester about the finalisation
					await policyRequester.finalised(policyNegotiation.id);
				}
			} else if (
				destination === "provider" &&
				message.event === DataspaceProtocolContractNegotiationEventType.ACCEPTED
			) {
				// Now that the offer was accepted by the consumer we can proceed with the agreement
				// Send the offer on the next cycle so we don't delay the current response
				const callbackAddress = policyNegotiation.callbackAddress;
				const pol = policyNegotiation;
				if (Is.stringValue(callbackAddress)) {
					setTimeout(async () => {
						await this.sendAgreementToConsumer(callbackAddress, pol, publicOrigin);
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
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	public async terminate(
		message: IDataspaceProtocolContractNegotiationTerminationMessage,
		destination: "provider" | "consumer",
		trustPayload: unknown
	): Promise<IDataspaceProtocolContractNegotiationError | undefined> {
		Guards.object<IDataspaceProtocolContractNegotiationTerminationMessage>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message),
			message
		);
		Guards.arrayOneOf(PolicyNegotiationPointService.CLASS_NAME, nameof(destination), destination, [
			"provider",
			"consumer"
		]);
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
			await TrustHelper.verifyTrust(
				this._trustComponent,
				trustPayload,
				"terminate",
				undefined,
				this._includeErrorDetails
			);
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
				const requesterType = policyNegotiation.handlerId;
				if (Is.stringValue(requesterType)) {
					// Try and find the original requester of the negotiation
					const policyRequester = PolicyRequesterFactory.getIfExists(requesterType);

					// We can't find the requester, so error
					if (Is.empty(policyRequester)) {
						const err = await this.setErrorState(
							message.providerPid,
							message.consumerPid,
							policyNegotiation,
							new NotFoundError(
								PolicyNegotiationPointService.CLASS_NAME,
								"requesterNotFound",
								requesterType
							)
						);
						return err;
					}

					// Tell the requester about the termination
					await policyRequester.terminated(policyNegotiation.id);
				}
			}

			// Update the state to terminated
			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.TERMINATED;
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
	 * Send a terminate message to a consumer at the given callback address.
	 * Used by stall cleanup to notify consumers that their negotiation has been terminated.
	 * @param callbackAddress The consumer callback URL to send the termination to.
	 * @param providerPid The provider negotiation id.
	 * @param consumerPid The consumer negotiation id.
	 */
	public async sendTerminateToConsumer(
		callbackAddress: string,
		providerPid: string,
		consumerPid: string
	): Promise<void> {
		Guards.stringValue(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(callbackAddress),
			callbackAddress
		);
		Url.guard(PolicyNegotiationPointService.CLASS_NAME, nameof(callbackAddress), callbackAddress);
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(providerPid), providerPid);
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(consumerPid), consumerPid);

		const terminationMessage: IDataspaceProtocolContractNegotiationTerminationMessage = {
			"@context": [DataspaceProtocolContexts.Context],
			"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationTerminationMessage,
			providerPid,
			consumerPid
		};

		const policyNegotiation = await this._policyNegotiationAdminPointComponent.get(providerPid);

		const trustPayload = await this._trustComponent.generate(
			policyNegotiation.organizationIdentity,
			this._overrideTrustGeneratorType
		);

		const negotiationComponent = ComponentFactory.create<IPolicyNegotiationPointComponent>(
			this._policyNegotiationPointRemoteComponentType,
			{ endpoint: callbackAddress }
		);

		await negotiationComponent.terminate(terminationMessage, "consumer", trustPayload);
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
	): Promise<IDataspaceProtocolContractNegotiationError> {
		const err = BaseError.fromError(error);
		const translated = ErrorHelper.formatErrors(error);
		const details = this._includeErrorDetails ? err.toJsonObject(true) : undefined;

		const errMessage: IDataspaceProtocolContractNegotiationError & { details?: unknown } = {
			"@context": [DataspaceProtocolContexts.Context],
			"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationError,
			providerPid: providerId,
			consumerPid: consumerId,
			code: err.message,
			reason: translated.map(item => ({
				"@value": item,
				"@language": "en-US"
			})),
			details
		};

		if (!Is.empty(policyNegotiation)) {
			policyNegotiation.code = errMessage.code;
			policyNegotiation.reason = errMessage.reason;
			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.TERMINATED;
			policyNegotiation.errorDetails = details;

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
		state: DataspaceProtocolContractNegotiationStateType
	): IDataspaceProtocolContractNegotiation {
		return {
			"@context": [DataspaceProtocolContexts.Context],
			"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiation,
			providerPid: providerId,
			consumerPid: consumerId,
			state
		};
	}

	/**
	 * Send an offer message to the consumer.
	 * @param callbackAddress The callback address to send the offer to.
	 * @param policyNegotiation The current state of the policy negotiation.
	 * @param publicOrigin The public origin to use in the trust payload.
	 * @returns Nothing.
	 * @internal
	 */
	private async sendOfferToConsumer(
		callbackAddress: string,
		policyNegotiation: IPolicyNegotiation,
		publicOrigin: string
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

			const offerMessage: IDataspaceProtocolContractOfferMessage = {
				"@context": [DataspaceProtocolContexts.Context],
				"@type": DataspaceProtocolContractNegotiationTypes.ContractOfferMessage,
				providerPid: policyNegotiation.id,
				consumerPid: policyNegotiation.correlationId,
				offer: policyNegotiation.offer,
				callbackAddress: `${publicOrigin}/${this._callbackPath}`
			};

			const trustPayload = await this._trustComponent.generate(
				policyNegotiation.organizationIdentity,
				this._overrideTrustGeneratorType
			);

			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.OFFERED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			const negotiationComponent = ComponentFactory.create<IPolicyNegotiationPointComponent>(
				this._policyNegotiationPointRemoteComponentType,
				{ endpoint: callbackAddress }
			);

			const response = await negotiationComponent.offerFromProvider(
				offerMessage,
				publicOrigin,
				trustPayload
			);

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
	 * @param publicOrigin The public origin to use in the trust payload.
	 * @returns Nothing.
	 * @internal
	 */
	private async sendEvent(
		callbackAddress: string,
		policyNegotiation: IPolicyNegotiation,
		event: DataspaceProtocolContractNegotiationEventType,
		destination: "provider" | "consumer",
		publicOrigin: string
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

			// Create the finalisation message
			const eventMessage: IDataspaceProtocolContractNegotiationEventMessage = {
				"@context": [DataspaceProtocolContexts.Context],
				"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
				providerPid:
					destination === "consumer" ? policyNegotiation.id : policyNegotiation.correlationId,
				consumerPid:
					destination === "provider" ? policyNegotiation.id : policyNegotiation.correlationId,
				event
			};

			const trustPayload = await this._trustComponent.generate(
				policyNegotiation.organizationIdentity,
				this._overrideTrustGeneratorType
			);

			policyNegotiation.state = event;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			const negotiationComponent = ComponentFactory.create<IPolicyNegotiationPointComponent>(
				this._policyNegotiationPointRemoteComponentType,
				{ endpoint: callbackAddress }
			);

			const response = await negotiationComponent.event(
				eventMessage,
				destination,
				publicOrigin,
				trustPayload
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
	 * Send an agreement message to the consumer.
	 * @param callbackAddress The callback address to send the agreement to.
	 * @param policyNegotiation The current state of the policy negotiation.
	 * @param publicOrigin The public origin to use in the trust payload.
	 * @returns Nothing.
	 * @internal
	 */
	private async sendAgreementToConsumer(
		callbackAddress: string,
		policyNegotiation: IPolicyNegotiation,
		publicOrigin: string
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

			Guards.object<ITrustVerificationInfo>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(policyNegotiation.trustVerificationInfo),
				policyNegotiation.trustVerificationInfo
			);

			const negotiatorNames = PolicyNegotiatorFactory.names();
			const negotiators = negotiatorNames.map(name => PolicyNegotiatorFactory.get(name));
			const negotiator = negotiators.find(n => n.supportsOffer(offer));
			if (Is.empty(negotiator)) {
				// No negotiator, so set the error on the negotiation
				await this.setErrorState(
					policyNegotiation.id,
					policyNegotiation.correlationId,
					policyNegotiation,
					new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "noNegotiatorFound", {
						offerId: OdrlPolicyHelper.getUid(offer) ?? ""
					})
				);
			} else {
				// Use the negotiator to create the agreement for the offer
				const agreement = await negotiator.createAgreement(
					offer,
					policyNegotiation.trustVerificationInfo.identity,
					policyNegotiation.trustVerificationInfo.data
				);

				if (Is.empty(agreement)) {
					// No agreement, so set the error on the negotiation
					await this.setErrorState(
						policyNegotiation.id,
						policyNegotiation.correlationId,
						policyNegotiation,
						new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "noAgreementCreated", {
							offerId: OdrlPolicyHelper.getUid(offer) ?? ""
						})
					);
				} else {
					// Create the agreement message
					const agreementMessage: IDataspaceProtocolContractAgreementMessage = {
						"@context": [DataspaceProtocolContexts.Context],
						"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
						providerPid: policyNegotiation.id,
						consumerPid: policyNegotiation.correlationId,
						agreement,
						callbackAddress: `${publicOrigin}/${this._callbackPath}`
					};

					const trustPayload = await this._trustComponent.generate(
						policyNegotiation.organizationIdentity,
						this._overrideTrustGeneratorType
					);

					policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.AGREED;
					policyNegotiation.agreement = agreement;
					await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

					const negotiationComponent = ComponentFactory.create<IPolicyNegotiationPointComponent>(
						this._policyNegotiationPointRemoteComponentType,
						{ endpoint: callbackAddress }
					);

					const response = await negotiationComponent.agreementFromProvider(
						agreementMessage,
						publicOrigin,
						trustPayload
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
	 * @param publicOrigin The public origin to use in the trust payload.
	 * @returns Nothing.
	 * @internal
	 */
	private async sendAgreementVerificationToProvider(
		callbackAddress: string,
		policyNegotiation: IPolicyNegotiation,
		publicOrigin: string
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

			const agreementVerificationMessage: IDataspaceProtocolContractAgreementVerificationMessage = {
				"@context": [DataspaceProtocolContexts.Context],
				"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementVerificationMessage,
				providerPid: policyNegotiation.correlationId,
				consumerPid: policyNegotiation.id
			};

			const trustPayload = await this._trustComponent.generate(
				policyNegotiation.organizationIdentity,
				this._overrideTrustGeneratorType
			);

			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.VERIFIED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			const negotiationComponent = ComponentFactory.create<IPolicyNegotiationPointComponent>(
				this._policyNegotiationPointRemoteComponentType,
				{ endpoint: callbackAddress }
			);

			const response = await negotiationComponent.agreementVerificationFromConsumer(
				agreementVerificationMessage,
				publicOrigin,
				trustPayload
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
		response: unknown,
		policyNegotiation: IPolicyNegotiation
	): Promise<void> {
		if (
			Is.object<IDataspaceProtocolContractNegotiationError>(response) &&
			OdrlPolicyHelper.getType(response) ===
				DataspaceProtocolContractNegotiationTypes.ContractNegotiationError
		) {
			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.TERMINATED;
			policyNegotiation.reason = response.reason;
			policyNegotiation.code = response.code;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);
		}
	}
}
