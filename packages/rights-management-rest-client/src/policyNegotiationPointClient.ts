// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import type { IBaseRestClientConfig, INoContentResponse } from "@twin.org/api-models";
import { Guards, NotImplementedError } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import {
	RightsManagementContexts,
	RightsManagementTypes,
	type IPnpNegotiateRequest,
	type IPnpNegotiateResponse,
	type IPnpNegotiationCancelRequest,
	type IPnpNegotiationStateRequest,
	type IPnpNegotiationStateResponse,
	type IPolicyInformation,
	type IPolicyLocator,
	type IPolicyNegotiationPointComponent,
	type IPolicyNegotiator,
	type IPolicyState
} from "@twin.org/rights-management-models";
import { HeaderTypes, MimeTypes } from "@twin.org/web";

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
	 * Processes an incoming negotiation request for the resource.
	 * @param locator The locator to find relevant policies.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param proofToken The proof provided by the requester to support the policy creation.
	 * @returns The state of the policy.
	 */
	public async negotiate(
		locator: IPolicyLocator,
		information: IPolicyInformation | undefined,
		proofToken: string
	): Promise<IPolicyState> {
		Guards.object<IPolicyLocator>(this.CLASS_NAME, nameof(locator), locator);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);

		const response = await this.fetch<IPnpNegotiateRequest, IPnpNegotiateResponse>(
			"/pnp/negotiate",
			"POST",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: proofToken
				},
				body: {
					"@context": RightsManagementContexts.ContextRoot,
					type: RightsManagementTypes.PolicyNegotiationRequest,
					...locator,
					information
				}
			}
		);

		return response.body;
	}

	/**
	 * Retrieves the current state of a policy.
	 * @param policyId The ID of the policy to retrieve the state for.
	 * @param proofToken The proof provided by the requester.
	 * @returns The current state of the policy.
	 */
	public async negotiationState(policyId: string, proofToken: string): Promise<IPolicyState> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);

		const response = await this.fetch<IPnpNegotiationStateRequest, IPnpNegotiationStateResponse>(
			"/pnp/:policyId",
			"GET",
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd,
					[HeaderTypes.Authorization]: proofToken
				},
				pathParams: {
					policyId
				}
			}
		);

		return response.body;
	}

	/**
	 * Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @param proofToken The proof provided by the requester.
	 * @returns Nothing.
	 */
	public async negotiationCancel(policyId: string, proofToken: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		Guards.stringValue(this.CLASS_NAME, nameof(proofToken), proofToken);

		await this.fetch<IPnpNegotiationCancelRequest, INoContentResponse>("/pnp/:policyId", "DELETE", {
			headers: {
				[HeaderTypes.Accept]: MimeTypes.JsonLd,
				[HeaderTypes.Authorization]: proofToken
			},
			pathParams: {
				policyId
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
