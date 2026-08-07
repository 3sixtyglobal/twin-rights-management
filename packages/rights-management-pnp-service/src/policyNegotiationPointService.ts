// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HttpContextIdKeys, HttpUrlHelper, type IPlatformComponent } from "@twin.org/api-models";
import { ContextIdHelper, ContextIdKeys, ContextIdStore } from "@twin.org/context";
import {
	AlreadyExistsError,
	ArrayHelper,
	BaseError,
	Coerce,
	ComponentFactory,
	ErrorHelper,
	GeneralError,
	Guards,
	Is,
	Mutex,
	NotFoundError,
	StringHelper,
	UnauthorizedError,
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
	type IDataspaceProtocolContractRequestMessage,
	type IDataspaceProtocolOffer
} from "@twin.org/standards-dataspace-protocol";
import { OdrlContexts, OdrlTypes } from "@twin.org/standards-w3c-odrl";
import {
	TrustHelper,
	type ITrustComponent,
	type ITrustVerificationInfo
} from "@twin.org/trust-models";
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
	 * The type of the remote negotiation component.
	 * @internal
	 */
	private readonly _policyNegotiationPointRemoteComponentType: string;

	/**
	 * The platform component.
	 * @internal
	 */
	private readonly _platformComponent: IPlatformComponent;

	/**
	 * The path to append to the public origin for callback addresses.
	 * @internal
	 */
	private readonly _callbackPath: string;

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
	 * Timeout in milliseconds to wait when acquiring a mutex lock.
	 * @internal
	 */
	private readonly _mutexTimeoutMs?: number;

	/**
	 * Create a new instance of PolicyNegotiationPointService (PNP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyNegotiationPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);
		this._policyNegotiationAdminPointComponent =
			ComponentFactory.get<IPolicyNegotiationAdminPointComponent>(
				options?.policyNegotiationAdministrationPointComponentType ??
					"policy-negotiation-admin-point"
			);
		this._policyAdministrationPointComponent =
			ComponentFactory.get<IPolicyAdministrationPointComponent>(
				options?.policyAdministrationPointComponentType ?? "policy-administration-point"
			);
		this._policyInformationPointComponent = ComponentFactory.get<IPolicyInformationPointComponent>(
			options?.policyInformationPointComponentType ?? "policy-information-point"
		);
		this._trustComponent = ComponentFactory.get<ITrustComponent>(
			options?.trustComponentType ?? "trust"
		);
		this._policyNegotiationPointRemoteComponentType =
			options?.policyNegotiationPointRemoteComponentType ?? "policy-negotiation-point-remote";
		this._platformComponent = ComponentFactory.get<IPlatformComponent>(
			options?.platformComponentType ?? "platform"
		);
		this._callbackPath = Is.stringValue(options?.config?.callbackPath)
			? StringHelper.trimLeadingSlashes(options.config.callbackPath)
			: "";
		this._overrideTrustGeneratorType = options?.config?.overrideTrustGeneratorType;
		this._includeErrorDetails = options?.config?.includeErrorDetails ?? false;
		this._mutexTimeoutMs = Coerce.integer(options?.config?.mutexTimeoutMs);
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
			const trustInfo = await TrustHelper.verifyTrust(
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

			this.validateCallerIsNegotiationParty(negotiation, trustInfo);

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

		// Signing identity is the node DID
		const contextIds = await ContextIdStore.getContextIds();
		ContextIdHelper.guard(contextIds, ContextIdKeys.Organization);
		const organizationIdentity = contextIds[ContextIdKeys.Organization];

		// Use the opaque tenant id hash to match the one used in trust payloads
		const trustPayload = await this._trustComponent.generate(
			organizationIdentity,
			this._overrideTrustGeneratorType,
			{
				subject: policyData
			}
		);

		const requestMessage: IDataspaceProtocolContractRequestMessage = {
			"@context": [DataspaceProtocolContexts.Context],
			"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
			consumerPid,
			offer: {
				"@type": OdrlTypes.Offer,
				"@id": odrlOfferId,
				assigner: organizationIdentity
			},
			callbackAddress: await this.buildCallbackUrl(publicOrigin, organizationIdentity)
		};

		const response = await this.withPolicyNegotiationPointComponent(url, async c =>
			c.requestFromConsumer(requestMessage, trustPayload)
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
			// Persist the requested offer so agreementOfferIdCollision has something to compare
			// against on the direct-agreement fast path too, where offerFromProvider (which
			// populates this on the full cycle) is never called.
			offer: {
				"@context": OdrlContexts.Context,
				...requestMessage.offer
			}
		};

		await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

		return consumerPid;
	}

	/**
	 * Processes an incoming request on a provider from a consumer.
	 * @param message The negotiation request.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the contract negotiation or an error.
	 * @see https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#contract-request-message
	 */
	public async requestFromConsumer(
		message: IDataspaceProtocolContractRequestMessage,
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
		Guards.object<IDataspaceProtocolOffer>(
			PolicyNegotiationPointService.CLASS_NAME,
			nameof(message.offer),
			message.offer
		);
		const offerUid = OdrlPolicyHelper.getUid(message.offer);
		Guards.stringValue(PolicyNegotiationPointService.CLASS_NAME, nameof(offerUid), offerUid);
		// callbackAddress is optional per the DSP spec. When provided, it must be a valid URL;
		// when omitted, the consumer is expected to poll GET /negotiations/admin/:policyId to
		// observe state changes and read the negotiation (including offer and agreement).
		if (Is.stringValue(message.callbackAddress)) {
			Url.guard(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(message.callbackAddress),
				message.callbackAddress
			);
		}

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
			let providerOffer: IDataspaceProtocolOffer | undefined;

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

			const requestContextIds = await ContextIdStore.getContextIds();
			ContextIdHelper.guard(requestContextIds, ContextIdKeys.Organization);
			const requestOrganizationId = requestContextIds[ContextIdKeys.Organization];
			const publicOrigin = requestContextIds[HttpContextIdKeys.PublicOrigin];

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

				// DSP 2025-1: OFFERED --> REQUESTED is a valid Consumer transition (a counter-offer),
				// alongside REQUESTED --> REQUESTED (revising before any reply).
				const validCounterRequestStates: DataspaceProtocolContractNegotiationStateType[] = [
					DataspaceProtocolContractNegotiationStateType.REQUESTED,
					DataspaceProtocolContractNegotiationStateType.OFFERED
				];
				if (!validCounterRequestStates.includes(policyNegotiation.state)) {
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

				// Explicit reset: OFFERED is now also a valid predecessor, so it can no longer be
				// assumed the stored state is already REQUESTED.
				policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.REQUESTED;
				policyNegotiation.offer = providerOffer;
				policyNegotiation.trustVerificationInfo = trustInfo;
				policyNegotiation.handlerId = negotiator.className();
				policyNegotiation.publicOrigin = publicOrigin;
				policyNegotiation.organizationIdentity = requestOrganizationId;
			} else {
				policyNegotiation = {
					id: providerPid,
					correlationId: message.consumerPid,
					dateCreated: new Date(Date.now()).toISOString(),
					offer: providerOffer,
					state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
					callbackAddress: message.callbackAddress,
					publicOrigin,
					organizationIdentity: requestOrganizationId,
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

					if (negotiateResult.directAgreement) {
						// DSP 2025-1 permits a direct REQUESTED -> AGREED transition (see
						// docs/architecture/components.md). Skip the OFFERED/ACCEPTED round-trip
						// and go straight to building and sending the agreement, on the next cycle
						// so we don't delay the current response.
						setTimeout(async () => {
							await this.sendAgreementToConsumer(callbackAddress, pol);
						}, 100);
					} else {
						// Schedule the state advancement (REQUESTED → OFFERED) on the next cycle so we
						// don't delay the current response. sendOfferToConsumer advances state regardless
						// of callbackAddress; when omitted (spec-allowed) the consumer polls instead.
						setTimeout(async () => {
							await this.sendOfferToConsumer(callbackAddress, pol);
						}, 100);
					}
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
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The current state of the contract negotiation or an error.
	 */
	public async offerFromProvider(
		message: IDataspaceProtocolContractOfferMessage,
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
			const trustInfo = await TrustHelper.verifyTrust(
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
			policyNegotiation.trustVerificationInfo = trustInfo;
			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.ACCEPTED;
			// Update correlationId from the provider's PID (may not have been set at creation time)
			if (Is.stringValue(message.providerPid)) {
				policyNegotiation.correlationId = message.providerPid;
			}
			policyNegotiation.offer = {
				"@context": OdrlContexts.Context,
				...message.offer
			};

			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			// Schedule the ACCEPTED event so we don't delay the current response. sendEvent
			// advances state regardless of callbackAddress; when omitted (spec-allowed) the
			// provider polls instead.
			const callbackAddress = message.callbackAddress;
			const pol = policyNegotiation;
			setTimeout(async () => {
				await this.sendEvent(
					callbackAddress,
					pol,
					DataspaceProtocolContractNegotiationEventType.ACCEPTED,
					"provider"
				);
			}, 100);

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
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	public async agreementFromProvider(
		message: IDataspaceProtocolContractAgreementMessage,
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
		// callbackAddress is optional per the DSP spec. When provided, it must be a valid URL;
		// when omitted, the provider is expected to poll GET /negotiations/admin/:policyId to
		// observe state changes and read the negotiation (including agreement).
		if (Is.stringValue(message.callbackAddress)) {
			Url.guard(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(message.callbackAddress),
				message.callbackAddress
			);
		}

		let policyNegotiation: IPolicyNegotiation | undefined;
		try {
			const trustInfo = await TrustHelper.verifyTrust(
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

			// ACCEPTED is the full-cycle predecessor; REQUESTED is valid when the provider used
			// the DSP-permitted direct REQUESTED -> AGREED shortcut, so this negotiation never
			// passed through OFFERED/ACCEPTED locally either (see docs/architecture/components.md).
			const validPredecessorStates: DataspaceProtocolContractNegotiationStateType[] = [
				DataspaceProtocolContractNegotiationStateType.ACCEPTED,
				DataspaceProtocolContractNegotiationStateType.REQUESTED
			];
			if (!validPredecessorStates.includes(policyNegotiation.state)) {
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

			// IPolicyNegotiation has no role discriminator: a Provider-side record (handlerId is a
			// negotiator class name, set via negotiator.className()) and a Consumer-side record
			// (handlerId is an integrator-chosen requester type) share the same storage shape.
			// Widening the state guard above to admit REQUESTED means a long-lived Provider-side
			// record (up to the cleanup TTL, or indefinitely under interventionRequired) could
			// otherwise be addressed here by a counterparty who legitimately knows its id. Reject
			// early if handlerId matches a registered negotiator's className() - a strong signal
			// this is a Provider-side record, not ours to process as a Consumer-side agreement.
			// Compare against className(), not PolicyNegotiatorFactory.names(): names() returns
			// registration keys, which the engine sets to a kebab-case type name distinct from the
			// class name actually stored in handlerId.
			const handlerId = policyNegotiation.handlerId;
			if (
				Is.stringValue(handlerId) &&
				PolicyNegotiatorFactory.names().some(
					name => PolicyNegotiatorFactory.get(name).className() === handlerId
				)
			) {
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

			if (Is.stringValue(policyNegotiation.trustVerificationInfo?.identity)) {
				// A prior OFFERED interaction already pinned the counterparty identity
				// (offerFromProvider does this on the full cycle); verify against it.
				this.validateCallerIsNegotiationParty(policyNegotiation, trustInfo);
			} else {
				// REQUESTED predecessor via the directAgreement fast path skipped OFFERED, so this
				// is the first trusted interaction for this negotiation - pin it now, mirroring what
				// offerFromProvider does on the full cycle.
				policyNegotiation.trustVerificationInfo = trustInfo;
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
				const accepted = await policyRequester.agreement(policyNegotiation.id, {
					"@context": OdrlContexts.Context,
					...message.agreement
				});

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
			// Update correlationId from the provider's PID (may not have been set at creation time).
			// On the full cycle this is already set by offerFromProvider to the same value, so this
			// is idempotent there; on the direct-agreement fast path, offerFromProvider is never
			// called, so this is the only place the consumer record ever learns the provider's pid.
			if (Is.stringValue(message.providerPid)) {
				policyNegotiation.correlationId = message.providerPid;
			}
			policyNegotiation.agreement = {
				"@context": OdrlContexts.Context,
				...message.agreement
			};

			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			// Schedule the state advancement (AGREED → VERIFIED) on the next cycle so we don't
			// delay the current response. sendAgreementVerificationToProvider advances state
			// regardless of callbackAddress; when omitted (spec-allowed) the provider polls instead.
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
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	public async agreementVerificationFromConsumer(
		message: IDataspaceProtocolContractAgreementVerificationMessage,
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
			const trustInfo = await TrustHelper.verifyTrust(
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

			this.validateCallerIsNegotiationParty(policyNegotiation, trustInfo);

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
			await this._policyAdministrationPointComponent.create({
				...policyNegotiation.agreement,
				trustData: policyNegotiation.trustVerificationInfo?.data
			});

			// The agreement was created, so update the state to finalized
			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.FINALIZED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			// Schedule the FINALIZED event so we don't delay the current response. The verification
			// message doesn't carry a callbackAddress so we use the one stored on the negotiation.
			// sendEvent advances state regardless of callbackAddress; when omitted the peer polls.
			const callbackAddress = policyNegotiation?.callbackAddress;
			const pol = policyNegotiation;
			setTimeout(async () => {
				await this.sendEvent(
					callbackAddress,
					pol,
					DataspaceProtocolContractNegotiationEventType.FINALIZED,
					"consumer"
				);
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
	 * An event has been received by the provider or consumer.
	 * @param message The event message to send.
	 * @param destination The destination is provider or consumer.
	 * @param trustPayload Trust payload to verify the requesters identity.
	 * @returns The error if there is one.
	 */
	public async event(
		message: IDataspaceProtocolContractNegotiationEventMessage,
		destination: "provider" | "consumer",
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
			const trustInfo = await TrustHelper.verifyTrust(
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

			this.validateCallerIsNegotiationParty(policyNegotiation, trustInfo);

			// We can only transition from OFFERED to ACCEPTED or VERIFIED to FINALIZED
			// https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#state-machine
			if (!(
				(policyNegotiation.state === DataspaceProtocolContractNegotiationStateType.OFFERED &&
					message.event === DataspaceProtocolContractNegotiationEventType.ACCEPTED) ||
				(policyNegotiation.state === DataspaceProtocolContractNegotiationStateType.VERIFIED &&
					message.event === DataspaceProtocolContractNegotiationEventType.FINALIZED)
			)) {
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
				// Persist the finalized agreement into the consumer's PAP so it is resolvable by agreementId
				if (!Is.empty(policyNegotiation.agreement)) {
					// The agreement must carry its own id (the negotiator
					// allocates a fresh one in createAgreement). If a negotiator reused the
					// offer id the agreement would collide with the offer in the PAP, and the
					// AlreadyExists catch below would silently swallow it, leaving no consumer
					// agreement.
					const agreementUid = OdrlPolicyHelper.getUid(policyNegotiation.agreement);
					const offerUid = OdrlPolicyHelper.getUid(policyNegotiation.offer);
					if (Is.stringValue(agreementUid) && agreementUid === offerUid) {
						throw new GeneralError(
							PolicyNegotiationPointService.CLASS_NAME,
							"agreementOfferIdCollision",
							{ id: agreementUid }
						);
					}
					try {
						await this._policyAdministrationPointComponent.create({
							...policyNegotiation.agreement,
							trustData: policyNegotiation.trustVerificationInfo?.data
						});
					} catch (error) {
						// An AlreadyExistsError falls through to finalised(), the agreement is already in the PAP
						if (!BaseError.isErrorName(error, AlreadyExistsError.CLASS_NAME)) {
							const err = await this.setErrorState(
								message.providerPid,
								message.consumerPid,
								policyNegotiation,
								BaseError.fromError(error)
							);
							if (Is.stringValue(policyNegotiation.handlerId)) {
								// getIfExists returning undefined is intentionally not treated as a
								// requesterNotFound error here: a second setErrorState would overwrite
								// the stored PAP-failure diagnostics with a less useful code/reason.
								const policyRequester = PolicyRequesterFactory.getIfExists(
									policyNegotiation.handlerId
								);
								try {
									await policyRequester?.terminated(policyNegotiation.id);
								} catch (terminatedError) {
									await this._logging?.log({
										level: "warn",
										source: PolicyNegotiationPointService.CLASS_NAME,
										ts: Date.now(),
										message: "terminatedCallbackFailed",
										data: { negotiationId: policyNegotiation.id },
										error: BaseError.fromError(terminatedError)
									});
								}
							}
							return err;
						}
					}
				}

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
				// Now that the offer was accepted by the consumer we can proceed with the agreement.
				// Schedule the state advancement (ACCEPTED → AGREED) on the next cycle so we don't
				// delay the current response. sendAgreementToConsumer advances state regardless of
				// callbackAddress; when omitted (spec-allowed) the consumer polls instead.
				const callbackAddress = policyNegotiation.callbackAddress;
				const pol = policyNegotiation;
				setTimeout(async () => {
					await this.sendAgreementToConsumer(callbackAddress, pol);
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
			const trustInfo = await TrustHelper.verifyTrust(
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

			this.validateCallerIsNegotiationParty(policyNegotiation, trustInfo);

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
	 * @returns A promise that resolves when the terminate message has been sent.
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

		const trustPayload = await this.generateNegotiationTrustPayload(policyNegotiation, {
			providerPid,
			consumerPid
		});

		await this.withPolicyNegotiationPointComponent(callbackAddress, async c =>
			c.terminate(terminationMessage, "consumer", trustPayload)
		);
	}

	/**
	 * Check that a stored negotiation exists and is in one of the expected states.
	 * @param negotiationId The id of the negotiation to look up.
	 * @param expectedState The state, or one of the states, the negotiation must be in to proceed.
	 * @returns The current negotiation record if the state matches.
	 * @throws NotFoundError if the negotiation does not exist.
	 * @throws GeneralError with code "invalidState" if the negotiation is in a different state.
	 * @internal
	 */
	private async checkNegotiationInState(
		negotiationId: string,
		expectedState:
			| DataspaceProtocolContractNegotiationStateType
			| DataspaceProtocolContractNegotiationStateType[]
	): Promise<IPolicyNegotiation> {
		const negotiation = await this._policyNegotiationAdminPointComponent.get(negotiationId);
		const validStates = ArrayHelper.fromObjectOrArray(
			expectedState
		) as DataspaceProtocolContractNegotiationStateType[];
		if (!validStates.includes(negotiation.state)) {
			throw new GeneralError(PolicyNegotiationPointService.CLASS_NAME, "invalidState", {
				state: negotiation.state,
				negotiationId
			});
		}
		return negotiation;
	}

	/**
	 * Returns true when the error is one of the expected "state guard" failures that
	 * async send-* methods should absorb silently instead of recording as a terminal error.
	 * @param error The error to test.
	 * @returns True if the error is a state guard error.
	 * @internal
	 */
	private isStateGuardError(error: unknown): boolean {
		return (
			BaseError.someErrorName(error, NotFoundError.CLASS_NAME) ||
			BaseError.someErrorMessage(error, `${PolicyNegotiationPointService.CLASS_NAME}.invalidState`)
		);
	}

	/**
	 * Logs an outbound delivery failure. Deliberately does not call setErrorState — the
	 * negotiation itself is still valid, only the notification failed to reach the peer.
	 * @param policyNegotiation The negotiation whose notification could not be delivered.
	 * @param error The delivery error.
	 * @internal
	 */
	private async logDeliveryFailure(
		policyNegotiation: IPolicyNegotiation,
		error: unknown
	): Promise<void> {
		await this._logging?.log({
			level: "warn",
			source: PolicyNegotiationPointService.CLASS_NAME,
			ts: Date.now(),
			message: "callbackDeliveryFailed",
			data: {
				negotiationId: policyNegotiation.id,
				state: policyNegotiation.state,
				callbackAddress: policyNegotiation.callbackAddress
			},
			error: BaseError.fromError(error)
		});
	}

	/**
	 * Validate that the caller's verified identity matches the counterparty identity
	 * captured from the first trusted interaction in this negotiation.
	 * @param negotiation The policy negotiation to check against.
	 * @param callerTrustInfo The caller's verified identity from trust verification.
	 * @throws UnauthorizedError if the caller is not the expected counterparty.
	 * @internal
	 */
	private validateCallerIsNegotiationParty(
		negotiation: IPolicyNegotiation,
		callerTrustInfo: ITrustVerificationInfo
	): void {
		if (
			!Is.stringValue(negotiation.trustVerificationInfo?.identity) ||
			!Is.stringValue(callerTrustInfo?.identity) ||
			negotiation.trustVerificationInfo.identity !== callerTrustInfo.identity
		) {
			throw new UnauthorizedError(
				PolicyNegotiationPointService.CLASS_NAME,
				"callerNotAuthorizedForNegotiation"
			);
		}
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

			await this.setIfExists(policyNegotiation);
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
	 * @returns A promise that resolves when the offer has been sent.
	 * @internal
	 */
	private async sendOfferToConsumer(
		callbackAddress: string | undefined,
		policyNegotiation: IPolicyNegotiation
	): Promise<void> {
		try {
			Guards.object<IPolicyNegotiation>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(policyNegotiation),
				policyNegotiation
			);
			Guards.object<IDataspaceProtocolOffer>(
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
				callbackAddress: await this.buildCallbackUrl(
					policyNegotiation.publicOrigin,
					policyNegotiation.organizationIdentity
				)
			};

			const trustPayload = await this.generateNegotiationTrustPayload(policyNegotiation, {
				providerPid: policyNegotiation.id,
				consumerPid: policyNegotiation.correlationId
			});

			await this.checkNegotiationInState(
				policyNegotiation.id,
				DataspaceProtocolContractNegotiationStateType.REQUESTED
			);
			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.OFFERED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			// Only push to the consumer when a callbackAddress was supplied. Without one the
			// consumer is expected to poll GET /negotiations/admin/:policyId, which returns
			// the full negotiation entity (offer included).
			if (Is.stringValue(callbackAddress)) {
				try {
					const response = await this.withPolicyNegotiationPointComponent(
						callbackAddress,
						async c => c.offerFromProvider(offerMessage, trustPayload)
					);

					// If there was no error then the consumer will now send an event if they accepted the offer
					await this.terminateIfResponseError(response, policyNegotiation);
				} catch (deliveryError) {
					await this.logDeliveryFailure(policyNegotiation, deliveryError);
				}
			}
		} catch (error) {
			if (this.isStateGuardError(error)) {
				return;
			}
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
	 * @param destination The destination for the event.
	 * @returns A promise that resolves when the event has been sent.
	 * @internal
	 */
	private async sendEvent(
		callbackAddress: string | undefined,
		policyNegotiation: IPolicyNegotiation,
		event: DataspaceProtocolContractNegotiationEventType,
		destination: "provider" | "consumer"
	): Promise<void> {
		try {
			Guards.object<IPolicyNegotiation>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(policyNegotiation),
				policyNegotiation
			);
			const offer = policyNegotiation.offer;
			Guards.object<IDataspaceProtocolOffer>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(offer),
				offer
			);

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

			const trustPayload = await this.generateNegotiationTrustPayload(policyNegotiation, {
				providerPid: eventMessage.providerPid,
				consumerPid: eventMessage.consumerPid
			});

			await this.checkNegotiationInState(policyNegotiation.id, event);
			policyNegotiation.state = event;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			// Only push the event when a callbackAddress was supplied. Without one the peer
			// polls GET /negotiations/admin/:policyId to discover the transition.
			if (Is.stringValue(callbackAddress)) {
				try {
					const response = await this.withPolicyNegotiationPointComponent(
						callbackAddress,
						async c => c.event(eventMessage, destination, trustPayload)
					);

					await this.terminateIfResponseError(response, policyNegotiation);
				} catch (deliveryError) {
					await this.logDeliveryFailure(policyNegotiation, deliveryError);
				}
			}
		} catch (error) {
			if (this.isStateGuardError(error)) {
				return;
			}
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
	 * @returns A promise that resolves when the agreement has been sent.
	 * @internal
	 */
	private async sendAgreementToConsumer(
		callbackAddress: string | undefined,
		policyNegotiation: IPolicyNegotiation
	): Promise<void> {
		try {
			Guards.object<IPolicyNegotiation>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(policyNegotiation),
				policyNegotiation
			);
			const offer = policyNegotiation.offer;
			Guards.object<IDataspaceProtocolOffer>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(offer),
				offer
			);

			Guards.object<ITrustVerificationInfo>(
				PolicyNegotiationPointService.CLASS_NAME,
				nameof(policyNegotiation.trustVerificationInfo),
				policyNegotiation.trustVerificationInfo
			);

			// ACCEPTED is the full-cycle predecessor; REQUESTED is valid when the negotiator
			// signalled directAgreement and the OFFERED/ACCEPTED round-trip was skipped (see
			// docs/architecture/components.md, DSP 2025-1 REQUESTED -> AGREED transition).
			await this.checkNegotiationInState(policyNegotiation.id, [
				DataspaceProtocolContractNegotiationStateType.ACCEPTED,
				DataspaceProtocolContractNegotiationStateType.REQUESTED
			]);

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
				// Stamp the agreement assignee as the consumer's organization identity
				const consumerAssignee = policyNegotiation.trustVerificationInfo.identity;

				// Use the negotiator to create the agreement for the offer
				const agreement = await negotiator.createAgreement(
					offer,
					consumerAssignee,
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
						callbackAddress: await this.buildCallbackUrl(
							policyNegotiation.publicOrigin,
							policyNegotiation.organizationIdentity
						)
					};

					const trustPayload = await this.generateNegotiationTrustPayload(policyNegotiation, {
						providerPid: policyNegotiation.id,
						consumerPid: policyNegotiation.correlationId
					});

					policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.AGREED;
					policyNegotiation.agreement = agreement;
					await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

					// Only push to the consumer when a callbackAddress was supplied. Without one the
					// consumer polls GET /negotiations/admin/:policyId, which returns the full
					// negotiation entity (agreement included).
					if (Is.stringValue(callbackAddress)) {
						try {
							const response = await this.withPolicyNegotiationPointComponent(
								callbackAddress,
								async c => c.agreementFromProvider(agreementMessage, trustPayload)
							);

							// If there was no error then the consumer will now send an agreement verification
							await this.terminateIfResponseError(response, policyNegotiation);
						} catch (deliveryError) {
							await this.logDeliveryFailure(policyNegotiation, deliveryError);
						}
					}
				}
			}
		} catch (error) {
			if (this.isStateGuardError(error)) {
				return;
			}
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
	 * @returns A promise that resolves when the verification message has been sent.
	 * @internal
	 */
	private async sendAgreementVerificationToProvider(
		callbackAddress: string | undefined,
		policyNegotiation: IPolicyNegotiation
	): Promise<void> {
		try {
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

			const trustPayload = await this.generateNegotiationTrustPayload(policyNegotiation, {
				providerPid: policyNegotiation.correlationId,
				consumerPid: policyNegotiation.id
			});

			await this.checkNegotiationInState(
				policyNegotiation.id,
				DataspaceProtocolContractNegotiationStateType.AGREED
			);
			policyNegotiation.state = DataspaceProtocolContractNegotiationStateType.VERIFIED;
			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);

			// Only push to the provider when a callbackAddress was supplied. Without one the
			// provider polls GET /negotiations/admin/:policyId to discover the new VERIFIED state.
			if (Is.stringValue(callbackAddress)) {
				try {
					const response = await this.withPolicyNegotiationPointComponent(
						callbackAddress,
						async c =>
							c.agreementVerificationFromConsumer(agreementVerificationMessage, trustPayload)
					);

					await this.terminateIfResponseError(response, policyNegotiation);
				} catch (deliveryError) {
					await this.logDeliveryFailure(policyNegotiation, deliveryError);
				}
			}
		} catch (error) {
			if (this.isStateGuardError(error)) {
				return;
			}
			await this.setErrorState(
				policyNegotiation.id,
				policyNegotiation.correlationId,
				policyNegotiation,
				error
			);
		}
	}

	/**
	 * Update a negotiation only if it still exists, coordinated with remove() via a
	 * per-id mutex. This is an internal state-machine concern for the PNP service.
	 * @param negotiation The negotiation state to persist.
	 * @returns True if the negotiation was found and updated, false if it no longer exists.
	 * @internal
	 */
	private async setIfExists(negotiation: IPolicyNegotiation): Promise<boolean> {
		await Mutex.lock(negotiation.id, { throwOnTimeout: true, timeoutMs: this._mutexTimeoutMs });
		try {
			try {
				await this._policyNegotiationAdminPointComponent.get(negotiation.id);
			} catch (err) {
				if (BaseError.someErrorName(err, NotFoundError.CLASS_NAME)) {
					return false;
				}
				throw err;
			}
			await this._policyNegotiationAdminPointComponent.set(negotiation);
			return true;
		} finally {
			Mutex.unlock(negotiation.id);
		}
	}

	/**
	 * The result possible contains a failure, if it does then terminate the negotiation.
	 * @param response The response to check for an error.
	 * @param policyNegotiation The negotiation to update.
	 * @returns A promise that resolves when the negotiation state has been updated if an error was detected.
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
			await this.setIfExists(policyNegotiation);
		}
	}

	/**
	 * Build the outbound callback URL for a negotiation.
	 * @param publicOrigin The public origin to use as the URL base.
	 * @param organizationId The organization id.
	 * @returns The callback URL.
	 * @internal
	 */
	private async buildCallbackUrl(
		publicOrigin: string | undefined,
		organizationId: string
	): Promise<string> {
		// Combine the public origin (host) with the configured callback path
		const origin = StringHelper.trimTrailingSlashes(publicOrigin ?? "");

		const url = Is.stringValue(this._callbackPath) ? `${origin}/${this._callbackPath}` : origin;

		return HttpUrlHelper.addQueryStringParam(url, ContextIdKeys.Organization, organizationId);
	}

	/**
	 * Invoke an action against the negotiation component for a given endpoint URL.
	 * When the URL resolves to this node via the platform component, the action runs
	 * against this service directly under the correct local context, bypassing HTTP.
	 * Falls back to a freshly constructed remote component otherwise.
	 * @param url The endpoint URL to resolve.
	 * @param action The action to perform with the resolved component.
	 * @returns The result of the action.
	 * @internal
	 */
	private async withPolicyNegotiationPointComponent<T>(
		url: string,
		action: (component: IPolicyNegotiationPointComponent) => Promise<T>
	): Promise<T> {
		try {
			const localContext = await this._platformComponent.getLocalOriginContext(url);
			if (!Is.empty(localContext)) {
				return await ContextIdStore.run(localContext, async () => action(this));
			}
		} catch {
			// Fall back to remote component if locality check throws
		}
		const remoteComponent = ComponentFactory.create<IPolicyNegotiationPointComponent>(
			this._policyNegotiationPointRemoteComponentType,
			{ endpoint: url, pathPrefix: "" }
		);
		return action(remoteComponent);
	}

	/**
	 * Build the trust payload for an outbound negotiation message.
	 * @param policyNegotiation The stored negotiation record.
	 * @param subject The trust payload subject (DSP-specific claims).
	 * @returns The opaque trust payload (typically a JWT VC string).
	 * @internal
	 */
	private async generateNegotiationTrustPayload(
		policyNegotiation: IPolicyNegotiation,
		subject: { [key: string]: unknown }
	): Promise<unknown> {
		return this._trustComponent.generate(
			policyNegotiation.organizationIdentity,
			this._overrideTrustGeneratorType,
			{ subject }
		);
	}
}
