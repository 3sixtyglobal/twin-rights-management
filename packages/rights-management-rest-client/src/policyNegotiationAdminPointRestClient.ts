// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import {
	HttpHeaderHelper,
	type IBaseRestClientConfig,
	type ICreatedResponse,
	type INoContentResponse
} from "@twin.org/api-models";
import { Guards } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type {
	IPnapCreateRequest,
	IPnapGetRequest,
	IPnapGetResponse,
	IPnapQueryRequest,
	IPnapQueryResponse,
	IPnapRemoveRequest,
	IPnapSetRequest,
	IPolicyNegotiation,
	IPolicyNegotiationAdminPointComponent
} from "@twin.org/rights-management-models";
import type { DataspaceProtocolContractNegotiationStateType } from "@twin.org/standards-dataspace-protocol";
import { HttpMethod } from "@twin.org/web";

/**
 * Client for performing Rights Management Policy Negotiation Admin through to REST endpoints.
 */
export class PolicyNegotiationAdminPointRestClient
	extends BaseRestClient
	implements IPolicyNegotiationAdminPointComponent
{
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<PolicyNegotiationAdminPointRestClient>();

	/**
	 * Create a new instance of PolicyNegotiationAdminPointClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<PolicyNegotiationAdminPointRestClient>(), config, "rights-management");
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyNegotiationAdminPointRestClient.CLASS_NAME;
	}

	/**
	 * Pre-registers a consumer-side negotiation entry.
	 * @param id The consumer-side negotiation identifier.
	 * @returns The negotiation id (same as the caller-supplied id).
	 */
	public async create(id: string): Promise<string> {
		Guards.stringValue(PolicyNegotiationAdminPointRestClient.CLASS_NAME, nameof(id), id);

		const response = await this.fetch<IPnapCreateRequest, ICreatedResponse>(
			"/negotiations/admin",
			HttpMethod.POST,
			{ body: { id } }
		);

		return HttpHeaderHelper.extractId(
			response.headers,
			`${this.getPathPrefix()}/negotiations/admin/:id`
		);
	}

	/**
	 * Retrieves a policy negotiation.
	 * @param policyId The ID of the policy to retrieve the negotiation for.
	 * @returns The policy negotiation.
	 */
	public async get(policyId: string): Promise<IPolicyNegotiation> {
		Guards.stringValue(
			PolicyNegotiationAdminPointRestClient.CLASS_NAME,
			nameof(policyId),
			policyId
		);

		const response = await this.fetch<IPnapGetRequest, IPnapGetResponse>(
			"/negotiations/admin/:policyId",
			HttpMethod.GET,
			{
				pathParams: {
					policyId
				}
			}
		);

		return response.body;
	}

	/**
	 * Sets a policy negotiation.
	 * @param negotiation The updated policy negotiation.
	 * @returns A promise that resolves when the negotiation has been stored.
	 */
	public async set(negotiation: IPolicyNegotiation): Promise<void> {
		Guards.object<IPolicyNegotiation>(
			PolicyNegotiationAdminPointRestClient.CLASS_NAME,
			nameof(negotiation),
			negotiation
		);

		await this.fetch<IPnapSetRequest, INoContentResponse>(
			"/negotiations/admin/:policyId",
			HttpMethod.PUT,
			{
				pathParams: {
					policyId: negotiation.id
				},
				body: negotiation
			}
		);
	}

	/**
	 * Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @returns A promise that resolves when the negotiation has been removed.
	 */
	public async remove(policyId: string): Promise<void> {
		Guards.stringValue(
			PolicyNegotiationAdminPointRestClient.CLASS_NAME,
			nameof(policyId),
			policyId
		);

		await this.fetch<IPnapRemoveRequest, INoContentResponse>(
			"/negotiations/admin/:policyId",
			HttpMethod.DELETE,
			{
				pathParams: {
					policyId
				}
			}
		);
	}

	/**
	 * Get a list of the negotiations.
	 * @param state The state of the negotiations to retrieve.
	 * @param cursor The cursor to use for pagination.
	 * @returns A list of negotiations and cursor if there are more entries.
	 */
	public async query(
		state?: DataspaceProtocolContractNegotiationStateType,
		cursor?: string
	): Promise<{
		items: IPolicyNegotiation[];
		cursor?: string;
	}> {
		const response = await this.fetch<IPnapQueryRequest, IPnapQueryResponse>(
			"/negotiations/admin",
			HttpMethod.GET,
			{
				query: {
					state,
					cursor
				}
			}
		);

		return {
			items: response.body,
			cursor: HttpHeaderHelper.extractCursor(response.headers)
		};
	}
}
