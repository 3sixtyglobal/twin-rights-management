// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import type { IProof } from "@twin.org/standards-w3c-did";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyContext } from "./IPolicyContext";
import type { IPolicyNegotiation } from "./IPolicyNegotiation";
import type { IPolicyState } from "./IPolicyState";
import type { PolicyNegotiationStatus } from "./policyNegotiationStatus";

/**
 * Interface describing a unified Rights Management Component.
 * This serves as a single point of entry for all rights management operations.
 */
export interface IRightsManagementComponent extends IComponent {
	/**
	 * Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	papCreate(policy: Omit<IOdrlPolicy, "uid"> & { uid?: string }): Promise<string>;

	/**
	 * PAP: Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns Nothing.
	 */
	papUpdate(policy: IOdrlPolicy): Promise<void>;

	/**
	 * PAP: Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @returns The policy.
	 */
	papRetrieve(policyId: string): Promise<IOdrlPolicy>;

	/**
	 * PAP: Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns Nothing.
	 */
	papRemove(policyId: string): Promise<void>;

	/**
	 * PAP: Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param pageSize The number of results to return per page.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	papQuery(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		pageSize?: number
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}>;

	/**
	 * PEP: Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param context The context information to use in the decision making.
	 * @param data The data to process.
	 * @returns The manipulated data with any policies applied.
	 */
	pepIntercept<C extends IPolicyContext = IPolicyContext, D = unknown>(
		assetType: string,
		action: string,
		context: C | undefined,
		data: D | undefined
	): Promise<Partial<D> | undefined>;

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
	pnpNegotiate<C extends IPolicyContext = IPolicyContext>(
		assetType: string,
		action: string,
		resourceId: string | undefined,
		context: C,
		requesterInformation: { [source: string]: IJsonLdNodeObject[] } | undefined,
		proof: IProof
	): Promise<IPolicyState>;

	/**
	 * PNP: Retrieves the current state of a policy.
	 * @param policyId The ID of the policy to retrieve the state for.
	 * @param nodeIdentity The identity of the node requesting the state.
	 * @param proof The proof provided by the requester.
	 * @returns The current state of the policy.
	 */
	pnpNegotiationState(policyId: string, nodeIdentity: string, proof: IProof): Promise<IPolicyState>;

	/**
	 * PNP: Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @param nodeIdentity The identity of the node requesting the cancellation.
	 * @param proof The proof provided by the requester.
	 * @returns Nothing.
	 */
	pnpNegotiationCancel(policyId: string, nodeIdentity: string, proof: IProof): Promise<void>;

	/**
	 * PNAP: Retrieves a policy negotiation.
	 * @param policyId The ID of the policy to retrieve the negotiation for.
	 * @returns The policy negotiation.
	 */
	pnapGet(policyId: string): Promise<IPolicyNegotiation>;

	/**
	 * PNAP: Sets a policy negotiation.
	 * @param negotiation The updated policy negotiation.
	 * @returns Nothing.
	 */
	pnapSet(negotiation: IPolicyNegotiation): Promise<void>;

	/**
	 * PNAP: Cancels an ongoing negotiation for a resource.
	 * @param policyId The ID of the policy to cancel.
	 * @returns Nothing.
	 */
	pnapRemove(policyId: string): Promise<void>;

	/**
	 * PNAP: Get a list of the negotiations.
	 * @param status The state of the negotiations to retrieve.
	 * @param cursor The cursor to use for pagination.
	 * @returns A list of negotiations and cursor if there are more entries.
	 */
	pnapQuery(
		status?: PolicyNegotiationStatus,
		cursor?: string
	): Promise<{ items: IPolicyNegotiation[]; cursor?: string }>;
}
