// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { IdentityConnectorFactory, type IIdentityConnector } from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyInformationPointComponent,
	type IPolicyNegotiationPointComponent,
	type IPolicyNegotiationRequest,
	type IPolicyNegotiationRequestPointComponent,
	type IPolicyRequest,
	type IPolicyState,
	PolicyInformationAccessMode,
	RightsManagementContexts,
	RightsManagementTypes
} from "@twin.org/rights-management-models";
import { DidContexts, type IProof, ProofTypes } from "@twin.org/standards-w3c-did";
import type { IPolicyNegotiationRequestPointServiceConstructorOptions } from "./models/IPolicyNegotiationRequestPointServiceConstructorOptions";

/**
 * Class implementation of Policy Negotiation Request Point Component.
 */
export class PolicyNegotiationRequestPointService
	implements IPolicyNegotiationRequestPointComponent
{
	/**
	 * The class name of the Policy Negotiation Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyNegotiationRequestPointService>();

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
	 * The policy information point component.
	 * @internal
	 */
	private readonly _policyInformationPointComponent: IPolicyInformationPointComponent;

	/**
	 * The id of the identity method to use when signing/verifying negotiations.
	 * @internal
	 */
	private readonly _negotiationMethodId: string;

	/**
	 * A method for creating a new instance of the policy negotiation point component.
	 * @internal
	 */
	private readonly _negotiationComponentCreator: (
		url: string
	) => Promise<IPolicyNegotiationPointComponent>;

	/**
	 * The node identity.
	 * @internal
	 */
	private _nodeIdentity?: string;

	/**
	 * Create a new instance of PolicyNegotiationRequestPointService (PNRP).
	 * @param options The options for the component.
	 */
	constructor(options: IPolicyNegotiationRequestPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._identityConnector = IdentityConnectorFactory.get(
			options?.identityConnectorType ?? "identity"
		);
		this._policyInformationPointComponent = ComponentFactory.get<IPolicyInformationPointComponent>(
			options?.policyInformationPointComponentType ?? "policy-information-point"
		);
		this._negotiationMethodId =
			options?.config.negotiationMethodId ?? "policy-negotiation-assertion";
		this._negotiationComponentCreator = options.config.negotiationComponentCreator;
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
	 * Send a negotiation request to an external node.
	 * @param url The URL of the negotiation target.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param resourceId The ID of the resource being requested, can be empty if asset type access requested.
	 * @returns The state of the policy.
	 */
	public async negotiate(
		url: string,
		assetType: string,
		action: string,
		resourceId: string | undefined
	): Promise<IPolicyState> {
		Guards.stringValue(this.CLASS_NAME, nameof(url), url);
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const negotiationClient = await this._negotiationComponentCreator(url);

		const information = await this._policyInformationPointComponent.retrieve(
			assetType,
			action,
			PolicyInformationAccessMode.Public,
			this._nodeIdentity,
			undefined,
			[]
		);

		const proof = await this.createProofNegotiation(assetType, action, resourceId);

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "negotiationRequest",
			data: {
				url,
				assetType,
				action,
				resourceId: resourceId ?? ""
			}
		});

		const result = await negotiationClient.negotiate(
			assetType,
			action,
			resourceId,
			this._nodeIdentity,
			information,
			proof
		);

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "negotiationResponse",
			data: {
				url,
				assetType,
				action,
				status: result.status
			}
		});

		return result;
	}

	/**
	 * Retrieves the current state of a policy from an external node.
	 * @param url The URL of the negotiation target.
	 * @param policyId The ID of the policy to retrieve the state for.
	 * @returns The current state of the policy.
	 */
	public async negotiationState(url: string, policyId: string): Promise<IPolicyState> {
		Guards.stringValue(this.CLASS_NAME, nameof(url), url);
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const negotiationClient = await this._negotiationComponentCreator(url);

		const proof = await this.createProofPolicyId(policyId);

		const result = await negotiationClient.negotiationState(policyId, this._nodeIdentity, proof);

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "negotiationStatus",
			data: {
				url,
				policyId,
				status: result.status
			}
		});

		return result;
	}

	/**
	 * Cancels an ongoing negotiation for a resource from an external node.
	 * @param url The URL of the negotiation target.
	 * @param policyId The ID of the policy to cancel.
	 * @returns Nothing.
	 */
	public async negotiationCancel(url: string, policyId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(url), url);
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "negotiationCancel",
			data: {
				url,
				policyId
			}
		});

		const negotiationClient = await this._negotiationComponentCreator(url);

		const proof = await this.createProofPolicyId(policyId);

		await negotiationClient.negotiationCancel(policyId, this._nodeIdentity, proof);
	}

	/**
	 * Create the proof for a specific action and asset type.
	 * @param assetType The type of the asset being accessed.
	 * @param action The action being performed.
	 * @param resourceId The specific resource id or can be left undefined for a whole asset class.
	 * @returns The proof object.
	 * @throws GeneralError is the proof creation fails.
	 * @internal
	 */
	private async createProofNegotiation(
		assetType: string,
		action: string,
		resourceId?: string
	): Promise<IProof> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const unsecureDocument: Omit<IPolicyNegotiationRequest, "proof"> = {
			"@context": [RightsManagementContexts.ContextRoot, DidContexts.ContextVCv2],
			type: RightsManagementTypes.PolicyNegotiationRequest,
			assetType,
			action,
			resourceId,
			nodeIdentity: this._nodeIdentity
		};

		return await this._identityConnector.createProof(
			this._nodeIdentity,
			this._negotiationMethodId,
			ProofTypes.DataIntegrityProof,
			unsecureDocument as unknown as IJsonLdNodeObject
		);
	}

	/**
	 * Create the proof for a policy id.
	 * @param policyId The id of the policy being accessed.
	 * @param nodeIdentity The identity of the node performing the action.
	 * @returns The proof object.
	 * @throws GeneralError is the proof creation fails.
	 * @internal
	 */
	private async createProofPolicyId(policyId: string): Promise<IProof> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const unsecureDocument: Omit<IPolicyRequest, "proof"> = {
			"@context": [RightsManagementContexts.ContextRoot, DidContexts.ContextVCv2],
			type: RightsManagementTypes.PolicyRequest,
			id: policyId,
			nodeIdentity: this._nodeIdentity
		};

		return await this._identityConnector.createProof(
			this._nodeIdentity,
			this._negotiationMethodId,
			ProofTypes.DataIntegrityProof,
			unsecureDocument as unknown as IJsonLdNodeObject
		);
	}
}
