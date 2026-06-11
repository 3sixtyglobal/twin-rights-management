// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	AlreadyExistsError,
	BaseError,
	ComponentFactory,
	GeneralError,
	Guards,
	Is,
	NotFoundError,
	ObjectHelper,
	Urn,
	Validation,
	type IValidationFailure
} from "@twin.org/core";
import type { JsonLdObjectWithOptionalAtId } from "@twin.org/data-json-ld";
import { JsonLdHelper } from "@twin.org/data-json-ld";
import { ComparisonOperator, LogicalOperator, type EntityCondition } from "@twin.org/entity";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	RightsManagementNamespaces,
	type IPolicyAdministrationPointComponent,
	type IRightsManagementAgreement,
	type IRightsManagementOffer,
	type IRightsManagementPolicy,
	type IRightsManagementSet
} from "@twin.org/rights-management-models";
import { OdrlDataTypes, OdrlPolicyType } from "@twin.org/standards-w3c-odrl";
import type { OdrlPolicy } from "./entities/odrlPolicy.js";
import type { IPolicyAdministrationPointServiceConstructorOptions } from "./models/IPolicyAdministrationPointServiceConstructorOptions.js";
import {
	convertFromStoragePolicy,
	convertToStoragePolicy,
	buildStorageContext
} from "./utils/odrlPolicyConverters.js";

/**
 * Class implementation of Policy Administration Point Component.
 */
export class PolicyAdministrationPointService implements IPolicyAdministrationPointComponent {
	/**
	 * The class name of the Policy Administration Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<PolicyAdministrationPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-private-class-members
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
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);

		OdrlDataTypes.registerRedirects();
		OdrlDataTypes.registerTypes();

		this._odrlPolicyEntityStorage = EntityStorageConnectorFactory.get(
			options?.odrlPolicyEntityStorageType ?? "odrl-policy"
		);
	}

	/**
	 * Strip PAP-managed fields before ODRL validation.
	 * @param policy The policy to prepare for validation.
	 * @param uid The policy uid for validation.
	 * @returns The policy shape expected by JsonLdHelper validation.
	 * @internal
	 */
	private static toValidatePolicy(
		policy: JsonLdObjectWithOptionalAtId<IRightsManagementPolicy> | IRightsManagementPolicy,
		uid: string
	): IRightsManagementPolicy & { uid: string } {
		const policyForValidation = ObjectHelper.clone(policy) as IRightsManagementPolicy;
		ObjectHelper.propertyDelete(policyForValidation, "@id");
		ObjectHelper.propertyDelete(policyForValidation, "dateCreated");
		ObjectHelper.propertyDelete(policyForValidation, "dateModified");

		return {
			...policyForValidation,
			uid
		};
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyAdministrationPointService.CLASS_NAME;
	}

	/**
	 * Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	public async create(
		policy: JsonLdObjectWithOptionalAtId<IRightsManagementPolicy>
	): Promise<string> {
		Guards.object<IRightsManagementPolicy>(
			PolicyAdministrationPointService.CLASS_NAME,
			nameof(policy),
			policy
		);

		// We allow the caller to provide a uid, but if they don't we generate one for them.
		// if they provide one, we still validate it is a proper URN with the correct namespace.
		const policyUid = OdrlPolicyHelper.getUid(policy);
		if (Is.string(policyUid)) {
			Urn.guard(PolicyAdministrationPointService.CLASS_NAME, nameof(policyUid), policyUid);
			const urnParsed = Urn.fromValidString(policyUid);

			if (urnParsed.namespaceIdentifier() !== RightsManagementNamespaces.Policy) {
				throw new GeneralError(PolicyAdministrationPointService.CLASS_NAME, "namespaceMismatch", {
					namespace: RightsManagementNamespaces.Policy,
					id: policyUid
				});
			}

			const existing = await this._odrlPolicyEntityStorage.get(policyUid);
			if (!Is.empty(existing)) {
				throw new AlreadyExistsError(
					PolicyAdministrationPointService.CLASS_NAME,
					"policyAlreadyExists",
					policyUid
				);
			}
		}

		const id = policyUid ?? Urn.generateRandom(RightsManagementNamespaces.Policy).toString(false);
		const now = new Date().toISOString();

		const validatePolicy = PolicyAdministrationPointService.toValidatePolicy(policy, id);

		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(JsonLdHelper.toNodeObject(validatePolicy), validationFailures, {
			failOnMissingType: true
		});
		Validation.asValidationError(
			PolicyAdministrationPointService.CLASS_NAME,
			nameof(validatePolicy),
			validationFailures
		);

		const storagePolicy = convertToStoragePolicy(
			{
				...policy,
				"@id": id
			},
			{
				dateCreated: now,
				dateModified: now
			},
			buildStorageContext()
		);
		await this._odrlPolicyEntityStorage.set(storagePolicy);

		return id;
	}

	/**
	 * Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns Nothing.
	 */
	public async update(policy: IRightsManagementPolicy): Promise<void> {
		Guards.object(PolicyAdministrationPointService.CLASS_NAME, nameof(policy), policy);

		const policyUid = OdrlPolicyHelper.getUid(policy);
		Guards.stringValue(PolicyAdministrationPointService.CLASS_NAME, nameof(policyUid), policyUid);

		const existingStoragePolicy = await this._odrlPolicyEntityStorage.get(policyUid);
		if (!existingStoragePolicy) {
			throw new NotFoundError(
				PolicyAdministrationPointService.CLASS_NAME,
				"policyNotFound",
				policyUid
			);
		}

		const validatePolicy = PolicyAdministrationPointService.toValidatePolicy(policy, policyUid);

		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(JsonLdHelper.toNodeObject(validatePolicy), validationFailures, {
			failOnMissingType: true
		});
		Validation.asValidationError(
			PolicyAdministrationPointService.CLASS_NAME,
			nameof(policy),
			validationFailures
		);

		const now = new Date().toISOString();
		const dateCreated = existingStoragePolicy.dateCreated ?? now;
		const dateModified = now;

		const storagePolicy = convertToStoragePolicy(
			{
				...policy,
				"@id": policyUid
			},
			{
				dateCreated,
				dateModified
			},
			buildStorageContext()
		);
		await this._odrlPolicyEntityStorage.set(storagePolicy);
	}

	/**
	 * Get a policy from the entity storage.
	 * @param policyId The ID of the policy to get.
	 * @returns The policy.
	 */
	public async get(policyId: string): Promise<IRightsManagementPolicy> {
		Guards.stringValue(PolicyAdministrationPointService.CLASS_NAME, nameof(policyId), policyId);

		let policy;
		try {
			policy = await this._odrlPolicyEntityStorage.get(policyId);
		} catch (err) {
			if (!BaseError.isErrorName(err, NotFoundError.CLASS_NAME)) {
				throw err;
			}
		}

		if (Is.empty(policy)) {
			throw new NotFoundError(
				PolicyAdministrationPointService.CLASS_NAME,
				"policyNotFound",
				policyId
			);
		}

		return convertFromStoragePolicy<IRightsManagementPolicy>(policy);
	}

	/**
	 * Get an agreement from the entity storage.
	 * @param agreementId The ID of the agreement to get.
	 * @returns The agreement.
	 */
	public async getAgreement(agreementId: string): Promise<IRightsManagementAgreement> {
		Guards.stringValue(
			PolicyAdministrationPointService.CLASS_NAME,
			nameof(agreementId),
			agreementId
		);

		let policy;
		try {
			policy = await this._odrlPolicyEntityStorage.get(agreementId);
		} catch (err) {
			if (!BaseError.isErrorName(err, NotFoundError.CLASS_NAME)) {
				throw err;
			}
		}

		if (Is.empty(policy)) {
			throw new NotFoundError(
				PolicyAdministrationPointService.CLASS_NAME,
				"agreementNotFound",
				agreementId
			);
		}

		const policyType = OdrlPolicyHelper.getType(policy);
		if (policyType !== OdrlPolicyType.Agreement) {
			throw new GeneralError(PolicyAdministrationPointService.CLASS_NAME, "agreementTypeMismatch", {
				agreementId,
				type: policyType ?? ""
			});
		}

		return convertFromStoragePolicy<IRightsManagementAgreement>(policy);
	}

	/**
	 * Get an offer from the entity storage.
	 * @param offerId The ID of the offer to get.
	 * @returns The offer.
	 */
	public async getOffer(offerId: string): Promise<IRightsManagementOffer> {
		Guards.stringValue(PolicyAdministrationPointService.CLASS_NAME, nameof(offerId), offerId);

		let policy;
		try {
			policy = await this._odrlPolicyEntityStorage.get(offerId);
		} catch (err) {
			if (!BaseError.isErrorName(err, NotFoundError.CLASS_NAME)) {
				throw err;
			}
		}

		if (Is.empty(policy)) {
			throw new NotFoundError(
				PolicyAdministrationPointService.CLASS_NAME,
				"offerNotFound",
				offerId
			);
		}

		const policyType = OdrlPolicyHelper.getType(policy);
		if (policyType !== OdrlPolicyType.Offer) {
			throw new GeneralError(PolicyAdministrationPointService.CLASS_NAME, "offerTypeMismatch", {
				offerId,
				type: policyType ?? ""
			});
		}

		return convertFromStoragePolicy<IRightsManagementOffer>(policy);
	}

	/**
	 * Get a set from the entity storage.
	 * @param setId The ID of the set to get.
	 * @returns The set.
	 */
	public async getSet(setId: string): Promise<IRightsManagementSet> {
		Guards.stringValue(PolicyAdministrationPointService.CLASS_NAME, nameof(setId), setId);

		let policy;
		try {
			policy = await this._odrlPolicyEntityStorage.get(setId);
		} catch (err) {
			if (!BaseError.isErrorName(err, NotFoundError.CLASS_NAME)) {
				throw err;
			}
		}

		if (Is.empty(policy)) {
			throw new NotFoundError(PolicyAdministrationPointService.CLASS_NAME, "setNotFound", setId);
		}

		const policyType = OdrlPolicyHelper.getType(policy);
		if (policyType !== OdrlPolicyType.Set) {
			throw new GeneralError(PolicyAdministrationPointService.CLASS_NAME, "setTypeMismatch", {
				setId,
				type: policyType ?? ""
			});
		}

		return convertFromStoragePolicy<IRightsManagementSet>(policy);
	}

	/**
	 * Remove a policy from the entity storage.
	 * @param policyId The ID of the policy to remove.
	 */
	public async remove(policyId: string): Promise<void> {
		Guards.stringValue(PolicyAdministrationPointService.CLASS_NAME, nameof(policyId), policyId);

		await this._odrlPolicyEntityStorage.remove(policyId);
	}

	/**
	 * Query the entity storage for policies.
	 * @param options Optional options to filter by assigner or assignee.
	 * @param options.assigner The assigner to filter by.
	 * @param options.assignee The assignee to filter by.
	 * @param options.target The target to filter by.
	 * @param options.action The action to filter by.
	 * @param conditions The conditions to query the entity storage with.
	 * @param cursor The cursor to use for pagination.
	 * @param limit The number of results to return per page.
	 * @returns The policies.
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
		limit?: number
	): Promise<{
		cursor?: string;
		policies: IRightsManagementPolicy[];
	}> {
		if (!Is.empty(conditions)) {
			Guards.object(PolicyAdministrationPointService.CLASS_NAME, nameof(conditions), conditions);
		}
		if (!Is.empty(cursor)) {
			Guards.stringValue(PolicyAdministrationPointService.CLASS_NAME, nameof(cursor), cursor);
		}
		if (!Is.empty(limit)) {
			Guards.integer(PolicyAdministrationPointService.CLASS_NAME, nameof(limit), limit);
		}

		const allConditions: EntityCondition<IRightsManagementPolicy> = {
			conditions: [],
			logicalOperator: LogicalOperator.And
		};

		if (Is.stringValue(options?.assigner)) {
			allConditions.conditions.push({
				property: "assignerIndex",
				comparison: ComparisonOperator.Includes,
				value: `|${options.assigner}|`
			});
		}

		if (Is.stringValue(options?.assignee)) {
			allConditions.conditions.push({
				property: "assigneeIndex",
				comparison: ComparisonOperator.Includes,
				value: `|${options.assignee}|`
			});
		}

		if (Is.stringValue(options?.target)) {
			allConditions.conditions.push({
				property: "targetIndex",
				comparison: ComparisonOperator.Includes,
				value: `|${options.target}|`
			});
		}

		if (Is.stringValue(options?.action)) {
			allConditions.conditions.push({
				property: "actionIndex",
				comparison: ComparisonOperator.Includes,
				value: `|${options.action}|`
			});
		}

		if (!Is.empty(conditions)) {
			allConditions.conditions.push(conditions);
		}

		const result = await this._odrlPolicyEntityStorage.query(
			allConditions.conditions.length > 0 ? allConditions : undefined,
			undefined,
			undefined,
			cursor,
			limit
		);
		return {
			cursor: result.cursor,
			policies: result.entities.map(entity => convertFromStoragePolicy(entity as OdrlPolicy))
		};
	}
}
