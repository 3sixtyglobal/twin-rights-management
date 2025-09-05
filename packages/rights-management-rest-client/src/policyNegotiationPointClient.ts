// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import type { IBaseRestClientConfig, INoContentResponse } from "@twin.org/api-models";
import { Guards, NotImplementedError } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { nameof } from "@twin.org/nameof";
import type {
	IPnpNegotiateRequest,
	IPnpNegotiateResponse,
	IPnpNegotiationCancelRequest,
	IPnpNegotiationStateRequest,
	IPnpNegotiationStateResponse,
	IPolicyContext,
	IPolicyNegotiationPointComponent,
	IPolicyNegotiator,
	IPolicyState
} from "@twin.org/rights-management-models";
import type { IProof } from "@twin.org/standards-w3c-did";

/**
 * Client for performing Rights Management Policy Negotiation through to REST endpoints.
 */
export class PolicyNegotiationPointClient
	extends BaseRestClient
	implements IPolicyNegotiationPointComponent
{
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyNegotiationPointClient>();

	/**
	 * Create a new instance of PolicyNegotiationPointClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<PolicyNegotiationPointClient>(), config, "rights-management");
	}

	/**
	 * Negotiates the creation of a policy for the requested resource.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param resourceId The ID of the resource being requested, can be empty if asset type access requested.
	 * @param context The context from the requesting node.
	 * @param requesterInformation Information provided by the requester to determine if a policy can be created.
	 * @param proof The proof provided by the requester to support the policy creation.
	 * @returns The state of the policy.
	 */
	public async negotiate<C extends IPolicyContext = IPolicyContext>(
		assetType: string,
		action: string,
		resourceId: string | undefined,
		context: C,
		requesterInformation: { [source: string]: IJsonLdNodeObject[] } | undefined,
		proof: IProof
	): Promise<IPolicyState> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);
		Guards.stringValue(this.CLASS_NAME, nameof(resourceId), resourceId);
		Guards.object<IProof>(this.CLASS_NAME, nameof(proof), proof);

		const response = await this.fetch<IPnpNegotiateRequest, IPnpNegotiateResponse>(
			"/pnp/negotiate",
			"POST",
			{
				body: {
					assetType,
					action,
					resourceId,
					context,
					requesterInformation,
					proof
				}
			}
		);

		return response.body;
	}

	/**
	 * Retrieves the current state of a policy.
	 * @param policyId The ID of the policy to retrieve the state for.
	 * @param nodeIdentity The identity of the node requesting the state.
	 * @param proof The proof provided by the requester.
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

		const response = await this.fetch<IPnpNegotiationStateRequest, IPnpNegotiationStateResponse>(
			"/pnp/:policyId",
			"POST",
			{
				pathParams: {
					policyId
				},
				body: {
					nodeIdentity,
					proof
				}
			}
		);

		return response.body;
	}

	/**
	 * Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @param nodeIdentity The identity of the node requesting the cancellation.
	 * @param proof The proof provided by the requester.
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

		await this.fetch<IPnpNegotiationCancelRequest, INoContentResponse>("/pnp/:policyId", "DELETE", {
			pathParams: {
				policyId
			},
			body: {
				nodeIdentity,
				proof
			}
		});
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
		throw new NotImplementedError(this.CLASS_NAME, "registerNegotiator");
	}

	/**
	 * Unregister a negotiator from the handling.
	 * @param negotiatorId The id of the negotiator to unregister.
	 * @returns Nothing.
	 */
	public async unregisterNegotiator(negotiatorId: string): Promise<void> {
		throw new NotImplementedError(this.CLASS_NAME, "unregisterNegotiator");
	}
}
