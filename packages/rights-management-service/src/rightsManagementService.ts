// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyAdministrationPointComponent,
	IPolicyEnforcementPointComponent,
	IRightsManagementComponent
} from "@twin.org/rights-management-models";
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
	}

	/**
	 * PAP: Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	public async papCreate(policy: Omit<IOdrlPolicy, "uid">): Promise<string> {
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
	 * @param data The data to process.
	 * @param userIdentity The user identity to use in the decision making.
	 * @param nodeIdentity The node identity to use in the decision making.
	 * @returns The manipulated data with any policies applied.
	 */
	public async pepIntercept<T = unknown>(
		assetType: string,
		action: string,
		data: T | undefined,
		userIdentity: string | undefined,
		nodeIdentity: string | undefined
	): Promise<T | undefined> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);

		try {
			const result = await this._policyEnforcementPointComponent.intercept(
				assetType,
				action,
				data,
				userIdentity,
				nodeIdentity
			);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "pepInterceptFailed", undefined, error);
		}
	}
}
