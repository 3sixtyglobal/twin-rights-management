// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import type { IBaseRestClientConfig, INoContentResponse } from "@twin.org/api-models";
import { Guards } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type {
	IPnapGetRequest,
	IPnapGetResponse,
	IPnapQueryRequest,
	IPnapQueryResponse,
	IPnapRemoveRequest,
	IPnapSetRequest,
	IPolicyNegotiation,
	IPolicyNegotiationAdminPointComponent,
	PolicyNegotiationStatus
} from "@twin.org/rights-management-models";

/**
 * Client for performing Rights Management Policy Negotiation Admin through to REST endpoints.
 */
export class PolicyNegotiationAdminPointClient
	extends BaseRestClient
	implements IPolicyNegotiationAdminPointComponent
{
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyNegotiationAdminPointClient>();

	/**
	 * Create a new instance of PolicyNegotiationAdminPointClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<PolicyNegotiationAdminPointClient>(), config, "rights-management");
	}

	/**
	 * Retrieves a policy negotiation.
	 * @param policyId The ID of the policy to retrieve the negotiation for.
	 * @returns The policy negotiation.
	 */
	public async get(policyId: string): Promise<IPolicyNegotiation> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		const response = await this.fetch<IPnapGetRequest, IPnapGetResponse>("/pnap/:policyId", "GET", {
			pathParams: {
				policyId
			}
		});

		return response.body;
	}

	/**
	 * Sets a policy negotiation.
	 * @param negotiation The updated policy negotiation.
	 * @returns Nothing.
	 */
	public async set(negotiation: IPolicyNegotiation): Promise<void> {
		Guards.object<IPolicyNegotiation>(this.CLASS_NAME, nameof(negotiation), negotiation);

		await this.fetch<IPnapSetRequest, INoContentResponse>("/pnap/:policyId", "PUT", {
			pathParams: {
				policyId: negotiation.id
			},
			body: negotiation
		});
	}

	/**
	 * Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @returns Nothing.
	 */
	public async remove(policyId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		await this.fetch<IPnapRemoveRequest, INoContentResponse>("/pnap/:policyId", "DELETE", {
			pathParams: {
				policyId
			}
		});
	}

	/**
	 * Get a list of the negotiations.
	 * @param status The state of the negotiations to retrieve.
	 * @param cursor The cursor to use for pagination.
	 * @returns A list of negotiations and cursor if there are more entries.
	 */
	public async query(
		status?: PolicyNegotiationStatus,
		cursor?: string
	): Promise<{
		items: IPolicyNegotiation[];
		cursor?: string;
	}> {
		const response = await this.fetch<IPnapQueryRequest, IPnapQueryResponse>("/pnap", "GET", {
			query: {
				status,
				cursor
			}
		});

		return response.body;
	}
}
