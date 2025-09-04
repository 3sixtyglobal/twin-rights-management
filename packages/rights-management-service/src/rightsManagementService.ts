// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyAdministrationPointComponent,
	IPolicyContext,
	IPolicyEnforcementPointComponent,
	IPolicyNegotiation,
	IPolicyNegotiationAdminPointComponent,
	IPolicyNegotiationPointComponent,
	IPolicyState,
	IRightsManagementComponent,
	PolicyNegotiationStatus
} from "@twin.org/rights-management-models";
import type { IProof } from "@twin.org/standards-w3c-did";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IRightsManagementServiceConstructorOptions } from "./models/IRightsManagementServiceConstructorOptions";

/**
 * Service for performing Rights Management operations.
 * This is a unified service that provides access to all Rights Management components.
 */
export class RightsManagementService implements IRightsManagementComponent {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<RightsManagementService>();

	/**
	 * The PAP component implementation.
	 * @internal
	 */
	private readonly _policyAdministrationPointComponent: IPolicyAdministrationPointComponent;

	/**
	 * The PEP component implementation.
	 * @internal
	 */
	private readonly _policyEnforcementPointComponent: IPolicyEnforcementPointComponent;

	/**
	 * The PNP component implementation.
	 * @internal
	 */
	private readonly _policyNegotiationPointComponent: IPolicyNegotiationPointComponent;

	/**
	 * The PNAP component implementation.
	 * @internal
	 */
	private readonly _policyNegotiationAdminPointComponent: IPolicyNegotiationAdminPointComponent;

	/**
	 * Create a new instance of RightsManagementService.
	 * @param options The options for the service.
	 */
	constructor(options?: IRightsManagementServiceConstructorOptions) {
		this._policyAdministrationPointComponent =
			ComponentFactory.get<IPolicyAdministrationPointComponent>(
				options?.policyAdministrationPointComponentType ?? "policy-administration-point"
			);
		this._policyEnforcementPointComponent = ComponentFactory.get<IPolicyEnforcementPointComponent>(
			options?.policyEnforcementPointComponentType ?? "policy-enforcement-point"
		);
		this._policyNegotiationPointComponent = ComponentFactory.get<IPolicyNegotiationPointComponent>(
			options?.policyNegotiationPointComponentType ?? "policy-negotiation-point"
		);
		this._policyNegotiationAdminPointComponent =
			ComponentFactory.get<IPolicyNegotiationAdminPointComponent>(
				options?.policyNegotiationAdminPointComponentType ?? "policy-negotiation-admin-point"
			);
	}

	/**
	 * PAP: Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	public async papCreate(policy: Omit<IOdrlPolicy, "uid"> & { uid?: string }): Promise<string> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);

		try {
			const result = await this._policyAdministrationPointComponent.create(policy);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papCreateFailed", undefined, error);
		}
	}

	/**
	 * PAP: Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns Nothing.
	 */
	public async papUpdate(policy: IOdrlPolicy): Promise<void> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);

		try {
			await this._policyAdministrationPointComponent.update(policy);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papUpdateFailed", undefined, error);
		}
	}

	/**
	 * PAP: Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @returns The policy.
	 */
	public async papRetrieve(policyId: string): Promise<IOdrlPolicy> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		try {
			const policy = await this._policyAdministrationPointComponent.retrieve(policyId);
			return policy;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papRetrieveFailed", undefined, error);
		}
	}

	/**
	 * PAP: Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns Nothing.
	 */
	public async papRemove(policyId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		try {
			await this._policyAdministrationPointComponent.remove(policyId);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papRemoveFailed", undefined, error);
		}
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
		if (!Is.empty(conditions)) {
			Guards.object(this.CLASS_NAME, nameof(conditions), conditions);
		}
		if (!Is.empty(cursor)) {
			Guards.stringValue(this.CLASS_NAME, nameof(cursor), cursor);
		}
		if (!Is.empty(pageSize)) {
			Guards.integer(this.CLASS_NAME, nameof(pageSize), pageSize);
		}

		try {
			const result = await this._policyAdministrationPointComponent.query(
				conditions,
				cursor,
				pageSize
			);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papQueryFailed", undefined, error);
		}
	}

	/**
	 * PEP: Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param context The context to use in the decision making.
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

		try {
			const result = await this._policyEnforcementPointComponent.intercept<C, D, R>(
				assetType,
				action,
				context,
				data
			);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "pepInterceptFailed", undefined, error);
		}
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

		try {
			const result = await this._policyNegotiationPointComponent.negotiate<C>(
				assetType,
				action,
				resourceId,
				context,
				requesterInformation,
				proof
			);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "pnpNegotiateFailed", undefined, error);
		}
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

		try {
			const result = await this._policyNegotiationPointComponent.negotiationState(
				policyId,
				nodeIdentity,
				proof
			);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "pnpNegotiationState", undefined, error);
		}
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

		try {
			await this._policyNegotiationPointComponent.negotiationCancel(policyId, nodeIdentity, proof);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "pnpNegotiationCancelFailed", undefined, error);
		}
	}

	/**
	 * PNAP: Retrieves a policy negotiation.
	 * @param policyId The ID of the policy to retrieve the negotiation for.
	 * @returns The policy negotiation.
	 */
	public async pnapGet(policyId: string): Promise<IPolicyNegotiation> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		try {
			return this._policyNegotiationAdminPointComponent.get(policyId);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "pnapGetFailed", undefined, error);
		}
	}

	/**
	 * PNAP: Sets a policy negotiation.
	 * @param negotiation The updated policy negotiation.
	 * @returns Nothing.
	 */
	public async pnapSet(negotiation: IPolicyNegotiation): Promise<void> {
		Guards.object<IPolicyNegotiation>(this.CLASS_NAME, nameof(negotiation), negotiation);

		try {
			return this._policyNegotiationAdminPointComponent.set(negotiation);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "pnapSetFailed", undefined, error);
		}
	}

	/**
	 * PNAP: Removes a policy negotiation record.
	 * @param policyId The ID of the policy negotiation to remove.
	 * @returns Nothing.
	 */
	public async pnapRemove(policyId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		try {
			await this._policyNegotiationAdminPointComponent.remove(policyId);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "pnapRemoveFailed", undefined, error);
		}
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
		try {
			const result = await this._policyNegotiationAdminPointComponent.query(status, cursor);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "pnapQueryFailed", undefined, error);
		}
	}
}
