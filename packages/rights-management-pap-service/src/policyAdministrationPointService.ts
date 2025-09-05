// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	ComponentFactory,
	GeneralError,
	Guards,
	Is,
	NotFoundError,
	Urn,
	Validation,
	type IValidationFailure
} from "@twin.org/core";
import { JsonLdHelper } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	RightsManagementNamespaces,
	type IPolicyAdministrationPointComponent
} from "@twin.org/rights-management-models";
import { OdrlDataTypes, type IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { OdrlPolicy } from "./entities/odrlPolicy";
import type { IPolicyAdministrationPointServiceConstructorOptions } from "./models/IPolicyAdministrationPointServiceConstructorOptions";
import { convertFromStoragePolicy, convertToStoragePolicy } from "./utils/odrlPolicyConverters";

/**
 * Class implementation of Policy Administration Point Component.
 */
export class PolicyAdministrationPointService implements IPolicyAdministrationPointComponent {
	/**
	 * The class name of the Policy Administration Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyAdministrationPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The entity storage component for storing policies.
	 * @internal
	 */
	private readonly _odrlPolicyEntityStorage: IEntityStorageConnector<OdrlPolicy>;

	/**
	 * Create a new instance of PolicyAdministrationPointService (PAP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyAdministrationPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);

		OdrlDataTypes.registerRedirects();
		OdrlDataTypes.registerTypes();

		this._odrlPolicyEntityStorage = EntityStorageConnectorFactory.get(
			options?.odrlPolicyEntityStorageType ?? "odrl-policy"
		);
	}

	/**
	 * Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	public async create(policy: Omit<IOdrlPolicy, "uid"> & { uid?: string }): Promise<string> {
		Guards.object<IOdrlPolicy>(this.CLASS_NAME, nameof(policy), policy);

		// We allow the caller to provide a uid, but if they don't we generate one for them.
		// if they provide one, we still validate it is a proper URN with the correct namespace.
		if (Is.string(policy.uid)) {
			Urn.guard(this.CLASS_NAME, nameof(policy.uid), policy.uid);
			const urnParsed = Urn.fromValidString(policy.uid);

			if (urnParsed.namespaceMethod() !== RightsManagementNamespaces.Policy) {
				throw new GeneralError(this.CLASS_NAME, "namespaceMismatch", {
					namespace: RightsManagementNamespaces.Policy,
					id: policy.uid
				});
			}
		}

		const uid = policy.uid ?? Urn.generateRandom(RightsManagementNamespaces.Policy).toString(false);

		const completePolicy: IOdrlPolicy = {
			...policy,
			uid
		};

		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(completePolicy, validationFailures);
		Validation.asValidationError(this.CLASS_NAME, nameof(completePolicy), validationFailures);

		const storagePolicy = convertToStoragePolicy(completePolicy);
		await this._odrlPolicyEntityStorage.set(storagePolicy);

		return uid;
	}

	/**
	 * Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns Nothing.
	 */
	public async update(policy: IOdrlPolicy): Promise<void> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);
		Guards.stringValue(this.CLASS_NAME, "policy.uid", policy.uid);

		const policyId = policy.uid;
		const existingStoragePolicy = await this._odrlPolicyEntityStorage.get(policyId);
		if (!existingStoragePolicy) {
			throw new NotFoundError(this.CLASS_NAME, "policyNotFound", policyId);
		}

		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(policy, validationFailures);
		Validation.asValidationError(this.CLASS_NAME, nameof(policy), validationFailures);

		const storagePolicy = convertToStoragePolicy(policy);
		await this._odrlPolicyEntityStorage.set(storagePolicy);
	}

	/**
	 * Get a policy from the entity storage.
	 * @param policyId The ID of the policy to get.
	 * @returns The policy.
	 */
	public async get(policyId: string): Promise<IOdrlPolicy> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		const storagePolicy = await this._odrlPolicyEntityStorage.get(policyId);
		if (!storagePolicy) {
			throw new NotFoundError(this.CLASS_NAME, "policyNotFound", policyId);
		}
		return convertFromStoragePolicy(storagePolicy);
	}

	/**
	 * Remove a policy from the entity storage.
	 * @param policyId The ID of the policy to remove.
	 */
	public async remove(policyId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		await this._odrlPolicyEntityStorage.remove(policyId);
	}

	/**
	 * Query the entity storage for policies.
	 * @param conditions The conditions to query the entity storage with.
	 * @param cursor The cursor to use for pagination.
	 * @param pageSize The number of results to return per page.
	 * @returns The policies.
	 */
	public async query(
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

		const result = await this._odrlPolicyEntityStorage.query(
			conditions,
			undefined,
			undefined,
			cursor,
			pageSize
		);
		return {
			cursor: result.cursor,
			policies: result.entities.map(entity => convertFromStoragePolicy(entity as OdrlPolicy))
		};
	}
}
