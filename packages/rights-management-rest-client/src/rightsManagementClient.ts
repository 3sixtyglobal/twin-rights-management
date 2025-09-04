// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import {
	HttpParameterHelper,
	type INoContentResponse,
	type IBaseRestClientConfig,
	type ICreatedResponse
} from "@twin.org/api-models";
import { Coerce, Guards } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import type {
	IPapCreateRequest,
	IPapQueryRequest,
	IPapQueryResponse,
	IPapRemoveRequest,
	IPapRetrieveRequest,
	IPapRetrieveResponse,
	IPapUpdateRequest,
	IPepInterceptRequest,
	IPepInterceptResponse,
	IPnapGetRequest,
	IPnapGetResponse,
	IPnapQueryRequest,
	IPnapQueryResponse,
	IPnapRemoveRequest,
	IPnapSetRequest,
	IPnpNegotiateRequest,
	IPnpNegotiateResponse,
	IPnpNegotiationCancelRequest,
	IPnpNegotiationStateRequest,
	IPnpNegotiationStateResponse,
	IPolicyContext,
	IPolicyNegotiation,
	IPolicyState,
	IRightsManagementComponent,
	PolicyNegotiationStatus
} from "@twin.org/rights-management-models";
import type { IProof } from "@twin.org/standards-w3c-did";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * Client for performing Rights Management through to REST endpoints.
 */
export class RightsManagementClient extends BaseRestClient implements IRightsManagementComponent {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<RightsManagementClient>();

	/**
	 * Create a new instance of RightsManagementClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<RightsManagementClient>(), config, "rights-management");
	}

	/**
	 * PAP: Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	public async papCreate(policy: Omit<IOdrlPolicy, "uid"> & { uid?: string }): Promise<string> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);

		const response = await this.fetch<IPapCreateRequest, ICreatedResponse>("/pap", "POST", {
			body: policy
		});

		return response.headers.location;
	}

	/**
	 * PAP: Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns Nothing.
	 */
	public async papUpdate(policy: IOdrlPolicy): Promise<void> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);
		Guards.stringValue(this.CLASS_NAME, "policy.uid", policy.uid);

		await this.fetch<IPapUpdateRequest, never>("/pap/:id", "PUT", {
			pathParams: {
				id: policy.uid
			},
			body: policy
		});
	}

	/**
	 * PAP: Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @returns The policy.
	 */
	public async papRetrieve(policyId: string): Promise<IOdrlPolicy> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		const response = await this.fetch<IPapRetrieveRequest, IPapRetrieveResponse>(
			"/pap/:id",
			"GET",
			{
				pathParams: {
					id: policyId
				}
			}
		);

		return response.body;
	}

	/**
	 * PAP: Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns Nothing.
	 */
	public async papRemove(policyId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		await this.fetch<IPapRemoveRequest, never>("/pap/:id", "DELETE", {
			pathParams: {
				id: policyId
			}
		});
	}

	/**
	 * PAP: Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param pageSize The number of results to return per page.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	public async papQuery(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		pageSize?: number
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}> {
		const response = await this.fetch<IPapQueryRequest, IPapQueryResponse>("/pap/query", "GET", {
			query: {
				cursor,
				conditions: HttpParameterHelper.objectToString(conditions),
				pageSize: Coerce.string(pageSize)
			}
		});

		return response.body;
	}

	/**
	 * PEP: Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param context The context in which the action is being performed.
	 * @param data The data to process.
	 * @returns The manipulated data with any policies applied.
	 */
	public async pepIntercept<C extends IPolicyContext = IPolicyContext, D = unknown, R = unknown>(
		assetType: string,
		action: string,
		context: C | undefined,
		data: D | undefined
	): Promise<R | undefined> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);

		const response = await this.fetch<IPepInterceptRequest, IPepInterceptResponse>(
			"/pep/intercept",
			"POST",
			{
				body: {
					assetType,
					action,
					context,
					data
				}
			}
		);

		return response.body as R;
	}

	/**
	 * PNP: Negotiates the creation of a policy for the requested resource.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param resourceId The ID of the resource being requested, can be empty if asset type access requested.
	 * @param context The context from the requesting node.
	 * @param requesterInformation Information provided by the requester to determine if a policy can be created.
	 * @param proof The proof provided by the requester to support the policy creation.
	 * @returns The state of the policy.
	 */
	public async pnpNegotiate<C extends IPolicyContext = IPolicyContext>(
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
	 * PNP: Retrieves the current state of a policy.
	 * @param policyId The ID of the policy to retrieve the state for.
	 * @param nodeIdentity The identity of the node requesting the state.
	 * @param proof The proof provided by the requester.
	 * @returns The current state of the policy.
	 */
	public async pnpNegotiationState(
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
	 * PNP: Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @param nodeIdentity The identity of the node requesting the cancellation.
	 * @param proof The proof provided by the requester.
	 * @returns Nothing.
	 */
	public async pnpNegotiationCancel(
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
	 * PNAP: Retrieves a policy negotiation.
	 * @param policyId The ID of the policy to retrieve the negotiation for.
	 * @returns The policy negotiation.
	 */
	public async pnapGet(policyId: string): Promise<IPolicyNegotiation> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		const response = await this.fetch<IPnapGetRequest, IPnapGetResponse>("/pnap/:policyId", "GET", {
			pathParams: {
				policyId
			}
		});

		return response.body;
	}

	/**
	 * PNAP: Sets a policy negotiation.
	 * @param negotiation The updated policy negotiation.
	 * @returns Nothing.
	 */
	public async pnapSet(negotiation: IPolicyNegotiation): Promise<void> {
		Guards.object<IPolicyNegotiation>(this.CLASS_NAME, nameof(negotiation), negotiation);

		await this.fetch<IPnapSetRequest, INoContentResponse>("/pnap/:policyId", "PUT", {
			pathParams: {
				policyId: negotiation.id
			},
			body: negotiation
		});
	}

	/**
	 * PNAP: Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @returns Nothing.
	 */
	public async pnapRemove(policyId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		await this.fetch<IPnapRemoveRequest, INoContentResponse>("/pnap/:policyId", "DELETE", {
			pathParams: {
				policyId
			}
		});
	}

	/**
	 * PNAP: Get a list of the negotiations.
	 * @param status The state of the negotiations to retrieve.
	 * @param cursor The cursor to use for pagination.
	 * @returns A list of negotiations and cursor if there are more entries.
	 */
	public async pnapQuery(
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
