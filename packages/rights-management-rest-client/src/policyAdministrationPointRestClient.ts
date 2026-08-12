// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import {
	HttpHeaderHelper,
	HttpParameterHelper,
	type IBaseRestClientConfig,
	type ICreatedResponse
} from "@twin.org/api-models";
import { Coerce, Guards } from "@twin.org/core";
import type { JsonLdObjectWithOptionalAtId } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import {
	type IPapCreateRequest,
	type IPapQueryRequest,
	type IPapQueryResponse,
	type IPapRemoveRequest,
	type IPapGetRequest,
	type IPapGetResponse,
	type IPapUpdateRequest,
	type IPapGetAgreementRequest,
	type IPapGetAgreementResponse,
	type IPapGetOfferRequest,
	type IPapGetOfferResponse,
	type IPapGetSetRequest,
	type IPapGetSetResponse,
	type IRightsManagementAgreement,
	type IRightsManagementOffer,
	type IRightsManagementPolicy,
	type IRightsManagementSet,
	type IPolicyAdministrationPointComponent,
	OdrlPolicyHelper
} from "@twin.org/rights-management-models";
import { HttpMethod } from "@twin.org/web";

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
	 * Create a new instance of PolicyAdministrationPointRestClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<PolicyAdministrationPointRestClient>(), config, "rights-management");
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyAdministrationPointRestClient.CLASS_NAME;
	}

	/**
	 * Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	public async create(
		policy: JsonLdObjectWithOptionalAtId<IRightsManagementPolicy>
	): Promise<string> {
		Guards.object(PolicyAdministrationPointRestClient.CLASS_NAME, nameof(policy), policy);

		const response = await this.fetch<IPapCreateRequest, ICreatedResponse>(
			"/policy/admin",
			HttpMethod.POST,
			{
				body: policy
			}
		);

		return HttpHeaderHelper.extractId(response.headers, `${this.getPathPrefix()}/policy/admin/:id`);
	}

	/**
	 * Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns A promise that resolves when the policy has been updated.
	 */
	public async update(policy: IRightsManagementPolicy): Promise<void> {
		Guards.object(PolicyAdministrationPointRestClient.CLASS_NAME, nameof(policy), policy);

		const policyId = OdrlPolicyHelper.getUid(policy);
		Guards.stringValue(PolicyAdministrationPointRestClient.CLASS_NAME, nameof(policyId), policyId);

		await this.fetch<IPapUpdateRequest, never>("/policy/admin/:id", HttpMethod.PUT, {
			pathParams: {
				id: policyId
			},
			body: policy
		});
	}

	/**
	 * Get a policy.
	 * @param policyId The id of the policy to get.
	 * @returns The policy.
	 */
	public async get(policyId: string): Promise<IRightsManagementPolicy> {
		Guards.stringValue(PolicyAdministrationPointRestClient.CLASS_NAME, nameof(policyId), policyId);

		const response = await this.fetch<IPapGetRequest, IPapGetResponse>(
			"/policy/admin/:id",
			HttpMethod.GET,
			{
				pathParams: {
					id: policyId
				}
			}
		);

		return response.body;
	}

	/**
	 * Get an agreement.
	 * @param agreementId The id of the agreement to get.
	 * @returns The agreement.
	 */
	public async getAgreement(agreementId: string): Promise<IRightsManagementAgreement> {
		Guards.stringValue(
			PolicyAdministrationPointRestClient.CLASS_NAME,
			nameof(agreementId),
			agreementId
		);

		const response = await this.fetch<IPapGetAgreementRequest, IPapGetAgreementResponse>(
			"/policy/admin/agreement/:id",
			HttpMethod.GET,
			{
				pathParams: {
					id: agreementId
				}
			}
		);

		return response.body;
	}

	/**
	 * Get a set.
	 * @param setId The id of the set to get.
	 * @returns The set.
	 */
	public async getSet(setId: string): Promise<IRightsManagementSet> {
		Guards.stringValue(PolicyAdministrationPointRestClient.CLASS_NAME, nameof(setId), setId);

		const response = await this.fetch<IPapGetSetRequest, IPapGetSetResponse>(
			"/policy/admin/set/:id",
			HttpMethod.GET,
			{
				pathParams: {
					id: setId
				}
			}
		);

		return response.body;
	}

	/**
	 * Get an offer.
	 * @param offerId The id of the offer to get.
	 * @returns The offer.
	 */
	public async getOffer(offerId: string): Promise<IRightsManagementOffer> {
		Guards.stringValue(PolicyAdministrationPointRestClient.CLASS_NAME, nameof(offerId), offerId);

		const response = await this.fetch<IPapGetOfferRequest, IPapGetOfferResponse>(
			"/policy/admin/offer/:id",
			HttpMethod.GET,
			{
				pathParams: {
					id: offerId
				}
			}
		);

		return response.body;
	}

	/**
	 * Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns A promise that resolves when the policy has been removed.
	 */
	public async remove(policyId: string): Promise<void> {
		Guards.stringValue(PolicyAdministrationPointRestClient.CLASS_NAME, nameof(policyId), policyId);

		await this.fetch<IPapRemoveRequest, never>("/policy/admin/:id", HttpMethod.DELETE, {
			pathParams: {
				id: policyId
			}
		});
	}

	/**
	 * Query the policies using the specified conditions.
	 * @param options Optional options to filter by assigner or assignee.
	 * @param options.assigner The assigner to filter by.
	 * @param options.assignee The assignee to filter by.
	 * @param options.target The target to filter by.
	 * @param options.action The action to filter by.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param limit The number of results to return per page.
	 * @param properties Optional list of policy property names to include in the response.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	public async query(
		options?: {
			assigner?: string;
			assignee?: string;
			target?: string;
			action?: string;
		},
		conditions?: EntityCondition<IRightsManagementPolicy>,
		cursor?: string,
		limit?: number,
		properties?: (keyof IRightsManagementPolicy)[]
	): Promise<{
		cursor?: string;
		policies: IRightsManagementPolicy[];
	}> {
		const response = await this.fetch<IPapQueryRequest, IPapQueryResponse>(
			"/policy/admin",
			HttpMethod.GET,
			{
				query: {
					assigner: options?.assigner,
					assignee: options?.assignee,
					target: options?.target,
					action: options?.action,
					cursor,
					conditions: HttpParameterHelper.objectToString(conditions),
					limit: Coerce.string(limit),
					properties: HttpParameterHelper.arrayToString(properties)
				}
			}
		);

		return {
			policies: response.body,
			cursor: HttpHeaderHelper.extractCursor(response.headers)
		};
	}
}
