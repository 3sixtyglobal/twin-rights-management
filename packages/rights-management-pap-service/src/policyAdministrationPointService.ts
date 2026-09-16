// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	AlreadyExistsError,
	ArrayHelper,
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
import {
	ComparisonOperator,
	LogicalOperator,
	SortDirection,
	type EntityCondition
} from "@twin.org/entity";
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
	type IPolicyLocator,
	type IRightsManagementAgreement,
	type IRightsManagementOffer,
	type IRightsManagementPolicy,
	type IRightsManagementPolicyMetadata,
	type IRightsManagementSet
} from "@twin.org/rights-management-models";
import {
	OdrlContexts,
	OdrlDataTypes,
	OdrlPolicyType,
	type OdrlContextType
} from "@twin.org/standards-w3c-odrl";
import { OdrlPolicy } from "./entities/odrlPolicy.js";
import type { IPolicyAdministrationPointServiceConstructorOptions } from "./models/IPolicyAdministrationPointServiceConstructorOptions.js";
import { buildPapStorageContext, hasPolicyMetadata } from "./utils/policyContextHelper.js";

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

		const validatePolicy = this.toValidatePolicy(policy, id);

		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(JsonLdHelper.toNodeObject(validatePolicy), validationFailures, {
			failOnMissingType: true
		});
		Validation.asValidationError(
			PolicyAdministrationPointService.CLASS_NAME,
			nameof(validatePolicy),
			validationFailures
		);

		const storagePolicy = this.convertToStoragePolicy(
			{
				...policy,
				"@id": id
			},
			{
				dateCreated: now,
				dateModified: now
			},
			this.buildStorageContext()
		);
		await this._odrlPolicyEntityStorage.set(storagePolicy);

		return id;
	}

	/**
	 * Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns A promise that resolves when the policy has been updated.
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

		const validatePolicy = this.toValidatePolicy(policy, policyUid);

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

		const storagePolicy = this.convertToStoragePolicy(
			{
				...policy,
				"@id": policyUid
			},
			{
				dateCreated,
				dateModified
			},
			this.buildStorageContext()
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

		return this.convertFromStoragePolicy(policy);
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

		return this.convertFromStoragePolicy(policy);
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

		return this.convertFromStoragePolicy(policy);
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

		return this.convertFromStoragePolicy(policy);
	}

	/**
	 * Remove a policy from the entity storage.
	 * @param policyId The ID of the policy to remove.
	 * @returns A promise that resolves when the policy has been removed.
	 */
	public async remove(policyId: string): Promise<void> {
		Guards.stringValue(PolicyAdministrationPointService.CLASS_NAME, nameof(policyId), policyId);

		await this._odrlPolicyEntityStorage.remove(policyId);
	}

	/**
	 * Query the entity storage for policies.
	 * @param locator Optional locator to filter by type, assigner, assignee, target, or action.
	 * @param conditions The conditions to query the entity storage with.
	 * @param cursor The cursor to use for pagination.
	 * @param limit The number of results to return per page.
	 * @param properties Optional list of policy property names to include in the response, the policy "@id" is always included.
	 * @param orderBy The policy property to order the results by.
	 * @param orderByDirection The direction for the order, defaults to descending.
	 * @returns The matching policies and an optional cursor for the next page of results.
	 */
	public async query(
		locator?: IPolicyLocator,
		conditions?: EntityCondition<IRightsManagementPolicy>,
		cursor?: string,
		limit?: number,
		properties?: (keyof IRightsManagementPolicy)[],
		orderBy?: keyof IRightsManagementPolicy,
		orderByDirection?: SortDirection
	): Promise<{
		cursor?: string;
		policies: IRightsManagementPolicy[];
	}> {
		if (!Is.empty(locator?.type)) {
			Guards.arrayOneOf(
				PolicyAdministrationPointService.CLASS_NAME,
				nameof(locator.type),
				locator.type,
				Object.values(OdrlPolicyType)
			);
		}
		if (!Is.empty(locator?.action)) {
			Guards.stringValue(
				PolicyAdministrationPointService.CLASS_NAME,
				nameof(locator.action),
				locator.action
			);
		}
		if (!Is.empty(locator?.assignee)) {
			Guards.stringValue(
				PolicyAdministrationPointService.CLASS_NAME,
				nameof(locator.assignee),
				locator.assignee
			);
		}
		if (!Is.empty(locator?.assigner)) {
			Guards.stringValue(
				PolicyAdministrationPointService.CLASS_NAME,
				nameof(locator.assigner),
				locator.assigner
			);
		}
		if (!Is.empty(locator?.target)) {
			Guards.stringValue(
				PolicyAdministrationPointService.CLASS_NAME,
				nameof(locator.target),
				locator.target
			);
		}
		if (!Is.empty(conditions)) {
			Guards.object(PolicyAdministrationPointService.CLASS_NAME, nameof(conditions), conditions);
		}
		if (!Is.empty(cursor)) {
			Guards.stringValue(PolicyAdministrationPointService.CLASS_NAME, nameof(cursor), cursor);
		}
		if (!Is.empty(limit)) {
			Guards.integer(PolicyAdministrationPointService.CLASS_NAME, nameof(limit), limit);
		}
		if (!Is.empty(properties)) {
			Guards.array(PolicyAdministrationPointService.CLASS_NAME, nameof(properties), properties);
		}
		if (!Is.empty(orderBy)) {
			Guards.stringValue(PolicyAdministrationPointService.CLASS_NAME, nameof(orderBy), orderBy);
		}
		if (!Is.empty(orderByDirection)) {
			Guards.arrayOneOf(
				PolicyAdministrationPointService.CLASS_NAME,
				nameof(orderByDirection),
				orderByDirection,
				Object.values(SortDirection)
			);
		}

		const allConditions: EntityCondition<IRightsManagementPolicy> = {
			conditions: [],
			logicalOperator: LogicalOperator.And
		};

		if (Is.stringValue(locator?.type)) {
			allConditions.conditions.push({
				property: "type",
				comparison: ComparisonOperator.Equals,
				value: locator.type
			});
		}

		if (Is.stringValue(locator?.assigner)) {
			allConditions.conditions.push({
				property: "assignerIndex",
				comparison: ComparisonOperator.Includes,
				value: `|${locator.assigner}|`
			});
		}

		if (Is.stringValue(locator?.assignee)) {
			allConditions.conditions.push({
				property: "assigneeIndex",
				comparison: ComparisonOperator.Includes,
				value: `|${locator.assignee}|`
			});
		}

		if (Is.stringValue(locator?.target)) {
			allConditions.conditions.push({
				property: "targetIndex",
				comparison: ComparisonOperator.Includes,
				value: `|${locator.target}|`
			});
		}

		if (Is.stringValue(locator?.action)) {
			allConditions.conditions.push({
				property: "actionIndex",
				comparison: ComparisonOperator.Includes,
				value: `|${locator.action}|`
			});
		}

		if (!Is.empty(conditions)) {
			allConditions.conditions.push(conditions);
		}

		const result = await this._odrlPolicyEntityStorage.query(
			allConditions.conditions.length > 0 ? allConditions : undefined,
			Is.stringValue(orderBy)
				? [
						{
							property: this.convertToStorageProperty(orderBy),
							sortDirection: orderByDirection ?? SortDirection.Descending
						}
					]
				: undefined,
			this.convertToStorageProperties(properties),
			cursor,
			limit
		);
		return {
			cursor: result.cursor,
			policies: result.entities.map(entity => this.convertFromStoragePolicy(entity as OdrlPolicy))
		};
	}

	/**
	 * Strip PAP-managed fields before ODRL validation.
	 * @param policy The policy to prepare for validation.
	 * @param uid The policy uid for validation.
	 * @returns The policy shape expected by JsonLdHelper validation.
	 * @internal
	 */
	private toValidatePolicy(
		policy: JsonLdObjectWithOptionalAtId<IRightsManagementPolicy> | IRightsManagementPolicy,
		uid: string
	): IRightsManagementPolicy & { uid: string } {
		const policyForValidation = ObjectHelper.clone(policy) as IRightsManagementPolicy;
		ObjectHelper.propertyDelete(policyForValidation, "@id");
		ObjectHelper.propertyDelete(policyForValidation, "dateCreated");
		ObjectHelper.propertyDelete(policyForValidation, "dateModified");
		ObjectHelper.propertyDelete(policyForValidation, "trustData");

		return {
			...policyForValidation,
			uid
		};
	}

	/**
	 * Converts an IDataspaceProtocolPolicy to an OdrlPolicy for storage.
	 * @param policy The policy to convert.
	 * @param metadata PAP-managed lifecycle metadata.
	 * @param context Server-controlled JSON-LD context to persist.
	 * @returns The converted policy.
	 * @internal
	 */
	private convertToStoragePolicy<T extends IRightsManagementPolicy>(
		policy: T,
		metadata?: IRightsManagementPolicyMetadata,
		context?: OdrlContextType
	): OdrlPolicy {
		const storagePolicy = new OdrlPolicy();
		storagePolicy.id = OdrlPolicyHelper.getUid(policy) ?? "";
		storagePolicy.type = (OdrlPolicyHelper.getType(policy) ??
			OdrlPolicyType.Policy) as OdrlPolicyType;

		storagePolicy.profile = policy.profile;
		storagePolicy.assigner = policy.assigner;
		storagePolicy.assignee = policy.assignee;
		storagePolicy.target = policy.target;
		storagePolicy.action = policy.action;
		storagePolicy.inheritFrom = policy.inheritFrom;
		storagePolicy.conflict = policy.conflict;
		storagePolicy.permission = policy.permission;
		storagePolicy.prohibition = policy.prohibition;
		storagePolicy.obligation = policy.obligation;

		if (Is.stringValue(metadata?.dateCreated)) {
			storagePolicy.dateCreated = metadata.dateCreated;
		}
		if (Is.stringValue(metadata?.dateModified)) {
			storagePolicy.dateModified = metadata.dateModified;
		}
		if (!Is.empty(context)) {
			storagePolicy.context = context;
		}
		if (!Is.empty(policy.trustData)) {
			storagePolicy.trustData = policy.trustData;
		}

		// Build the indexes
		const assigner = ArrayHelper.fromObjectOrArray(OdrlPolicyHelper.getPartyIds(policy.assigner));
		storagePolicy.assignerIndex = `|${assigner.join("|")}|`;

		const assignee = ArrayHelper.fromObjectOrArray(OdrlPolicyHelper.getPartyIds(policy.assignee));
		storagePolicy.assigneeIndex = `|${assignee.join("|")}|`;

		const targetTokens: string[] = OdrlPolicyHelper.getTargets(policy);
		storagePolicy.targetIndex = `|${targetTokens.join("|")}|`;

		const actionTokens: string[] = OdrlPolicyHelper.getActions(policy);
		storagePolicy.actionIndex = `|${actionTokens.join("|")}|`;

		return storagePolicy;
	}

	/**
	 * Converts an OdrlPolicy from storage to an IDataspaceProtocolPolicy.
	 * @param storagePolicy The storage policy to convert.
	 * @returns The converted IDataspaceProtocolPolicy.
	 * @internal
	 */
	private convertFromStoragePolicy<T extends IRightsManagementPolicy>(
		storagePolicy: OdrlPolicy
	): T {
		const hasMetadata = hasPolicyMetadata(storagePolicy);

		const policy: IRightsManagementPolicy = {
			"@context": hasMetadata
				? (storagePolicy.context ?? buildPapStorageContext())
				: OdrlContexts.Context,
			"@type": storagePolicy.type,
			"@id": storagePolicy.id
		};

		policy.profile = storagePolicy.profile;
		policy.assigner = storagePolicy.assigner;
		policy.assignee = storagePolicy.assignee;
		policy.target = storagePolicy.target;
		policy.action = storagePolicy.action;
		policy.inheritFrom = storagePolicy.inheritFrom;
		policy.conflict = storagePolicy.conflict;
		policy.permission = storagePolicy.permission;
		policy.prohibition = storagePolicy.prohibition;
		policy.obligation = storagePolicy.obligation;

		if (hasMetadata) {
			policy.dateCreated = storagePolicy.dateCreated;
			policy.dateModified = storagePolicy.dateModified;
		}

		if (!Is.empty(storagePolicy.trustData)) {
			policy.trustData = storagePolicy.trustData;
		}

		return policy as T;
	}

	/**
	 * Converts a properties list to storage keys, accepting both the model "@"-prefixed and storage forms.
	 * The policy id is always included so reduced results remain identifiable.
	 * @param properties The optional list of policy property names.
	 * @returns The storage-shaped properties list, or undefined when no list was supplied.
	 * @internal
	 */
	private convertToStorageProperties(
		properties?: (keyof IRightsManagementPolicy)[]
	): (keyof OdrlPolicy)[] | undefined {
		if (!Is.arrayValue(properties)) {
			return undefined;
		}

		const storageProperties = new Set<keyof OdrlPolicy>(["id"]);
		for (const property of properties) {
			storageProperties.add(this.convertToStorageProperty(property));
		}

		return [...storageProperties];
	}

	/**
	 * Converts a policy property name to its storage key, accepting both the model "@"-prefixed and storage forms.
	 * @param property The policy property name.
	 * @returns The storage-shaped property name.
	 * @internal
	 */
	private convertToStorageProperty(property: keyof IRightsManagementPolicy): keyof OdrlPolicy {
		if (property === "@id") {
			return "id";
		} else if (property === "@type") {
			return "type";
		} else if (property === "@context") {
			return "context";
		}
		return property;
	}

	/**
	 * Builds the server-controlled JSON-LD context stored for policies with lifecycle timestamps.
	 * @returns The context to persist, with lifecycle term definitions included.
	 * @internal
	 */
	private buildStorageContext(): ReturnType<typeof buildPapStorageContext> {
		return buildPapStorageContext();
	}
}
