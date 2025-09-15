// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import {
	DocumentHelper,
	IdentityConnectorFactory,
	type IIdentityConnector
} from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyInformationPointComponent,
	type IPolicyLocator,
	type IPolicyNegotiationPointComponent,
	type IPolicyNegotiationRequest,
	type IPolicyNegotiationRequestPointComponent,
	type IPolicyRequest,
	type IPolicyState,
	LocatorHelper,
	PolicyInformationAccessMode,
	RightsManagementContexts,
	RightsManagementTokenHelper,
	RightsManagementTypes
} from "@twin.org/rights-management-models";
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
	 * The id of the identity method to use when signing/verifying proofs.
	 * @internal
	 */
	private readonly _rightsManagementMethodId: string;

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
	 * The time-to-live (TTL) for proof in seconds.
	 * @internal
	 */
	private readonly _proofTtlInSeconds: number;

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
		this._rightsManagementMethodId =
			options?.config.rightsManagementMethodId ?? "rights-management-assertion";
		this._negotiationComponentCreator = options.config.negotiationComponentCreator;
		this._proofTtlInSeconds = options?.config?.proofTtlInSeconds ?? 300; // Default to 5 minutes
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
	 * @param locator The locator to find relevant policies.
	 * @returns The state of the policy.
	 */
	public async negotiate(
		url: string,
		locator: Omit<IPolicyLocator, "assignee">
	): Promise<IPolicyState> {
		Guards.stringValue(this.CLASS_NAME, nameof(url), url);
		Guards.object<IPolicyLocator>(this.CLASS_NAME, nameof(locator), locator);

		if (!Is.stringValue(this._nodeIdentity)) {
			throw new GeneralError(this.CLASS_NAME, "missingNodeIdentity");
		}

		const policyLocator: IPolicyLocator = {
			...locator,
			assignee: this._nodeIdentity
		};

		const policyNegotiationRequest: IPolicyNegotiationRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.PolicyNegotiationRequest,
			...policyLocator
		};

		const information = await this._policyInformationPointComponent.retrieve(
			policyLocator,
			PolicyInformationAccessMode.Public
		);

		const proofToken = await RightsManagementTokenHelper.createToken(
			this._identityConnector,
			DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
			policyNegotiationRequest,
			this._proofTtlInSeconds
		);

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "negotiationRequest",
			data: {
				url,
				locator: LocatorHelper.toString(policyLocator)
			}
		});

		const negotiationClient = await this._negotiationComponentCreator(url);
		const result = await negotiationClient.negotiate(policyLocator, information, proofToken);

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "negotiationResponse",
			data: {
				url,
				locator: LocatorHelper.toString(policyLocator),
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

		const policyRequest: IPolicyRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.PolicyRequest,
			id: policyId
		};

		const proofToken = await RightsManagementTokenHelper.createToken(
			this._identityConnector,
			DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
			policyRequest,
			this._proofTtlInSeconds
		);

		const negotiationClient = await this._negotiationComponentCreator(url);
		const result = await negotiationClient.negotiationState(policyId, proofToken);

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

		const policyRequest: IPolicyRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.PolicyRequest,
			id: policyId
		};

		const proofToken = await RightsManagementTokenHelper.createToken(
			this._identityConnector,
			DocumentHelper.joinId(this._nodeIdentity, this._rightsManagementMethodId),
			policyRequest,
			this._proofTtlInSeconds
		);

		const negotiationClient = await this._negotiationComponentCreator(url);
		await negotiationClient.negotiationCancel(policyId, proofToken);
	}
}
