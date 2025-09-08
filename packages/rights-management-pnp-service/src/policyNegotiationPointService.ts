// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	BaseError,
	ComponentFactory,
	GeneralError,
	Guards,
	Is,
	NotFoundError,
	Urn
} from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { IdentityConnectorFactory, type IIdentityConnector } from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	PolicyNegotiationStatus,
	RightsManagementContexts,
	RightsManagementNamespaces,
	RightsManagementTypes,
	type IPolicyAdministrationPointComponent,
	type IPolicyNegotiationAdminPointComponent,
	type IPolicyNegotiationPointComponent,
	type IPolicyNegotiationRequest,
	type IPolicyNegotiator,
	type IPolicyRequest,
	type IPolicyState
} from "@twin.org/rights-management-models";
import { DidContexts, type IProof } from "@twin.org/standards-w3c-did";
import type { PolicyNegotiation } from "./entities/policyNegotiation";
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
	 * The time-to-live (TTL) for proof in seconds.
	 * @internal
	 */
	private readonly _proofTtlInSeconds: number;

	/**
	 * These negotiators can be registered to handle negotiations for specific asset types and actions.
	 * @internal
	 */
	private readonly _negotiators: {
		negotiatorId: string;
		negotiator: IPolicyNegotiator;
	}[];

	/**
	 * Create a new instance of PolicyNegotiationPointService (PNP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyNegotiationPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._identityConnector = IdentityConnectorFactory.get(
			options?.identityConnectorType ?? "identity"
		);
		this._policyNegotiationAdminPointComponent =
			ComponentFactory.get<IPolicyNegotiationAdminPointComponent>(
				options?.policyNegotiationAdministrationPointComponentType ??
					"policy-negotiation-admin-point"
			);
		this._policyAdministrationPointComponent =
			ComponentFactory.get<IPolicyAdministrationPointComponent>(
				options?.policyAdministrationPointComponentType ?? "policy-administration-point"
			);

		this._proofTtlInSeconds = options?.config?.proofTtlInSeconds ?? 300; // Default to 5 minutes
		this._negotiators = options?.config?.negotiators ?? [];
	}

	/**
	 * Processes an incoming negotiation request for the resource.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param resourceId The ID of the resource being requested, can be empty if asset type access requested.
	 * @param nodeIdentity The identity of the node making the request.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param proof The proof provided by the requester to support the policy creation.
	 * @returns The state of the policy.
	 */
	public async negotiate(
		assetType: string,
		action: string,
		resourceId: string | undefined,
		nodeIdentity: string,
		information: { [source: string]: IJsonLdNodeObject[] } | undefined,
		proof: IProof
	): Promise<IPolicyState> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);
		Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		Guards.object<IProof>(this.CLASS_NAME, nameof(proof), proof);

		// First verify the proof
		await this.verifyProofNegotiation(assetType, action, resourceId, nodeIdentity, proof);

		// Proof verified so find a negotiator for the asset type and action
		const findResult = this._negotiators.find(n => n.negotiator.canNegotiate(assetType, action));
		if (Is.empty(findResult)) {
			throw new GeneralError(this.CLASS_NAME, "noNegotiatorFound", { assetType, action });
		}

		// Allocate a new policy Id, this will be used for the actual policy later as well
		const policyId = Urn.generateRandom(RightsManagementNamespaces.Policy).toString(false);

		// Found a negotiator so use it to negotiate the policy
		const negotiated = await findResult.negotiator.negotiate(
			policyId,
			assetType,
			action,
			resourceId,
			nodeIdentity,
			information
		);

		// The only time we don't store the state is when the policy was
		// approved, in this case the state retrieval will use the entry
		// in the policies so no need for the additional information to be retained
		if (negotiated.state.status !== PolicyNegotiationStatus.Approved) {
			// For all other states we need to maintain the state for a period
			// of time in case the state method is called to retrieve its current status
			const policyNegotiation: PolicyNegotiation = {
				id: policyId,
				dateCreated: new Date(Date.now()).toISOString(),
				assetType,
				action,
				resourceId,
				nodeIdentity,
				information,
				status: negotiated.state.status,
				reason: negotiated.state.reason
			};

			await this._policyNegotiationAdminPointComponent.set(policyNegotiation);
		}

		return {
			...negotiated.state,
			// If the policy has been created we can also return the expiration date if it has one
			expires: Is.empty(negotiated.policy)
				? undefined
				: OdrlPolicyHelper.findExpirationDate(negotiated.policy)
		};
	}

	/**
	 * Retrieves the current state of a policy negotiation.
	 * @param policyId The ID of the policy to retrieve the state for.
	 * @param nodeIdentity The identity of the node requesting the state retrieval.
	 * @param proof The proof provided by the requester to support the policy retrieval.
	 * @returns The current state of the policy.
	 */
	public async negotiationState(
		policyId: string,
		nodeIdentity: string,
		proof: IProof
	): Promise<IPolicyState> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		Guards.object<IProof>(this.CLASS_NAME, nameof(proof), proof);

		await this.verifyProofPolicyId(policyId, nodeIdentity, proof);

		try {
			// First try and get the policy from the PAP
			// if it exists then we can locate expiry date if it has one
			const policy = await this._policyAdministrationPointComponent.get(policyId);

			return {
				"@context": RightsManagementContexts.ContextRoot,
				type: RightsManagementTypes.PolicyState,
				id: policyId,
				status: PolicyNegotiationStatus.Approved,
				expires: OdrlPolicyHelper.findExpirationDate(policy)
			};
		} catch (error) {
			// If the error was anything other than not found we should
			// probably log it
			if (!BaseError.isErrorName(error, NotFoundError.CLASS_NAME)) {
				this?._logging?.log({
					level: "error",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "policyFailed",
					data: {
						policyId
					}
				});

				// Something failed in the state retrieval so better throw that
				throw new GeneralError(this.CLASS_NAME, "policyFailed", { policyId }, error);
			}
		}

		try {
			// No existing policy so check the state of any in progress negotiations
			const policy = await this._policyNegotiationAdminPointComponent.get(policyId);

			// We found an in-progress negotiation so just return the details from that
			if (Is.object<PolicyNegotiation>(policy)) {
				return {
					"@context": RightsManagementContexts.ContextRoot,
					type: RightsManagementTypes.PolicyState,
					id: policy.id,
					status: policy.status,
					reason: policy.reason
				};
			}

			// Didn't find anything in progress so throw not found
			throw new NotFoundError(this.CLASS_NAME, "policyNotFound", policyId);
		} catch (error) {
			// Something failed in the state retrieval so better throw that
			throw new GeneralError(this.CLASS_NAME, "stateFailed", { policyId }, error);
		}
	}

	/**
	 * Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @param nodeIdentity The identity of the node requesting the cancellation.
	 * @param proof The proof provided by the requester to support the cancellation.
	 * @returns Nothing.
	 */
	public async negotiationCancel(
		policyId: string,
		nodeIdentity: string,
		proof: IProof
	): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		Guards.object<IProof>(this.CLASS_NAME, nameof(proof), proof);

		await this.verifyProofPolicyId(policyId, nodeIdentity, proof);

		await this._policyNegotiationAdminPointComponent.remove(policyId);
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
	 * Verify the proof for a specific action and asset type.
	 * @param assetType The type of the asset being accessed.
	 * @param action The action being performed.
	 * @param resourceId The specific resource id or can be left undefined for a whole asset class.
	 * @param nodeIdentity The identity of the node performing the action.
	 * @param proof The proof object containing the necessary information.
	 * @throws GeneralError is the proof verification fails.
	 * @internal
	 */
	private async verifyProofNegotiation(
		assetType: string,
		action: string,
		resourceId: string | undefined,
		nodeIdentity: string,
		proof: IProof
	): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);
		Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		Guards.objectValue<IProof>(this.CLASS_NAME, nameof(proof), proof);

		this.verifyCreated(proof, nodeIdentity);

		const proofDocument: Omit<IPolicyNegotiationRequest, "proof"> = {
			"@context": [RightsManagementContexts.ContextRoot, DidContexts.ContextVCv2],
			type: RightsManagementTypes.PolicyNegotiationRequest,
			assetType,
			action,
			resourceId,
			nodeIdentity
		};

		const isValid = await this._identityConnector.verifyProof(
			proofDocument as unknown as IJsonLdNodeObject,
			proof
		);

		if (!isValid) {
			throw new GeneralError(this.CLASS_NAME, "proofNegotiationFailed", {
				assetType,
				action,
				nodeIdentity
			});
		}
	}

	/**
	 * Verify the proof for a policy id.
	 * @param policyId The id of the policy being accessed.
	 * @param nodeIdentity The identity of the node performing the action.
	 * @param proof The proof object containing the necessary information.
	 * @throws GeneralError is the proof verification fails.
	 * @internal
	 */
	private async verifyProofPolicyId(
		policyId: string,
		nodeIdentity: string,
		proof: IProof
	): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		Guards.objectValue<IProof>(this.CLASS_NAME, nameof(proof), proof);

		this.verifyCreated(proof, nodeIdentity);

		const proofDocument: Omit<IPolicyRequest, "proof"> = {
			"@context": [RightsManagementContexts.ContextRoot, DidContexts.ContextVCv2],
			type: RightsManagementTypes.PolicyRequest,
			id: policyId,
			nodeIdentity
		};

		const isValid = await this._identityConnector.verifyProof(
			proofDocument as unknown as IJsonLdNodeObject,
			proof
		);

		if (!isValid) {
			throw new GeneralError(this.CLASS_NAME, "proofPolicyIdFailed", { policyId, nodeIdentity });
		}
	}

	/**
	 * Verify that the proof has a created date and that it is within the allowed time-to-live (TTL).
	 * @param proof The proof object to verify.
	 * @param nodeIdentity The identity of the node performing the action.
	 * @throws GeneralError if the proof is missing the created date or if it has expired.
	 * @internal
	 */
	private verifyCreated(proof: IProof, nodeIdentity: string): void {
		if (Is.empty(proof.created)) {
			throw new GeneralError(this.CLASS_NAME, "proofMissingCreated", {
				nodeIdentity
			});
		}

		const proofCreated = new Date(proof.created);
		const now = Date.now();
		const proofTtlInMs = this._proofTtlInSeconds * 1000;

		// If the proof has expired then we should reject it
		if (proofCreated.getTime() + proofTtlInMs < now) {
			throw new GeneralError(this.CLASS_NAME, "proofExpired", {
				nodeIdentity
			});
		}
	}
}
