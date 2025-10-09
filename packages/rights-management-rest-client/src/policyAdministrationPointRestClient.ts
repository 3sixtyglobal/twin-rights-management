// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import {
	HttpParameterHelper,
	type IBaseRestClientConfig,
	type ICreatedResponse
} from "@twin.org/api-models";
import { Coerce, Guards } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import type {
	IPapCreateRequest,
	IPapQueryRequest,
	IPapQueryResponse,
	IPapRemoveRequest,
	IPapGetRequest,
	IPapGetResponse,
	IPapUpdateRequest,
	IPolicyAdministrationPointComponent
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * Client for performing Rights Management Policy Administration through to REST endpoints.
 */
export class PolicyAdministrationPointRestClient
	extends BaseRestClient
	implements IPolicyAdministrationPointComponent
{
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<PolicyAdministrationPointRestClient>();

	/**
	 * Create a new instance of PolicyAdministrationPointClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<PolicyAdministrationPointRestClient>(), config, "rights-management");
	}

	/**
	 * Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	public async create(policy: Omit<IOdrlPolicy, "uid"> & { uid?: string }): Promise<string> {
		Guards.object(PolicyAdministrationPointRestClient.CLASS_NAME, nameof(policy), policy);

		const response = await this.fetch<IPapCreateRequest, ICreatedResponse>(
			"/policy/admin",
			"POST",
			{
				body: policy
			}
		);

		return response.headers.location;
	}

	/**
	 * Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns Nothing.
	 */
	public async update(policy: IOdrlPolicy): Promise<void> {
		Guards.object(PolicyAdministrationPointRestClient.CLASS_NAME, nameof(policy), policy);
		Guards.stringValue(
			PolicyAdministrationPointRestClient.CLASS_NAME,
			nameof(policy.uid),
			policy.uid
		);

		await this.fetch<IPapUpdateRequest, never>("/policy/admin/:id", "PUT", {
			pathParams: {
				id: policy.uid
			},
			body: policy
		});
	}

	/**
	 * Get a policy.
	 * @param policyId The id of the policy to get.
	 * @returns The policy.
	 */
	public async get(policyId: string): Promise<IOdrlPolicy> {
		Guards.stringValue(PolicyAdministrationPointRestClient.CLASS_NAME, nameof(policyId), policyId);

		const response = await this.fetch<IPapGetRequest, IPapGetResponse>("/policy/admin/:id", "GET", {
			pathParams: {
				id: policyId
			}
		});

		return response.body;
	}

	/**
	 * Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns Nothing.
	 */
	public async remove(policyId: string): Promise<void> {
		Guards.stringValue(PolicyAdministrationPointRestClient.CLASS_NAME, nameof(policyId), policyId);

		await this.fetch<IPapRemoveRequest, never>("/policy/admin/:id", "DELETE", {
			pathParams: {
				id: policyId
			}
		});
	}

	/**
	 * Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param limit The number of results to return per page.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	public async query(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		limit?: number
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}> {
		const response = await this.fetch<IPapQueryRequest, IPapQueryResponse>("/policy/admin", "GET", {
			query: {
				cursor,
				conditions: HttpParameterHelper.objectToString(conditions),
				limit: Coerce.string(limit)
			}
		});

		return response.body;
	}
}
