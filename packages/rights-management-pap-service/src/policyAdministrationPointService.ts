// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	AlreadyExistsError,
	BaseError,
	ComponentFactory,
	Converter,
	GeneralError,
	Guards,
	Is,
	NotFoundError,
	ObjectHelper,
	RandomHelper,
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
	type EntityCondition,
	type IComparator
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
import type { OdrlPolicyIndex } from "./entities/odrlPolicyIndex.js";
import type { IPolicyAdministrationPointServiceConstructorOptions } from "./models/IPolicyAdministrationPointServiceConstructorOptions.js";
import type { IPolicyIndexCursor } from "./models/IPolicyIndexCursor.js";
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
	 * The maximum number of index entries read in one page, which bounds the size of the id list
	 * handed to the policy storage.
	 * @internal
	 */
	private static readonly _INDEX_PAGE_SIZE: number = 100;

	/**
	 * The version stored in the encoded locator cursor.
	 * @internal
	 */
	private static readonly _INDEX_CURSOR_VERSION: number = 1;

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
	 * The entity storage component for storing policy indexes.
	 * @internal
	 */
	private readonly _odrlPolicyIndexEntityStorage: IEntityStorageConnector<OdrlPolicyIndex>;

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

		this._odrlPolicyIndexEntityStorage = EntityStorageConnectorFactory.get(
			options?.odrlPolicyIndexEntityStorageType ?? "odrl-policy-index"
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

		const policyWithId = {
			...policy,
			"@id": id
		};

		const storagePolicy = this.convertToStoragePolicy(
			policyWithId,
			{
				dateCreated: now,
				dateModified: now
			},
			this.buildStorageContext()
		);
		await this._odrlPolicyEntityStorage.set(storagePolicy);
		await this.syncPolicyIndexes(id, policyWithId, now);

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

		const policyWithId = {
			...policy,
			"@id": policyUid
		};

		const storagePolicy = this.convertToStoragePolicy(
			policyWithId,
			{
				dateCreated,
				dateModified
			},
			this.buildStorageContext()
		);
		await this._odrlPolicyEntityStorage.set(storagePolicy);
		await this.syncPolicyIndexes(policyUid, policyWithId, dateCreated);
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
		await this.removePolicyIndexes(policyId);
	}

	/**
	 * Query the entity storage for policies.
	 * When the locator filters on assigner, assignee, target or action the page is driven by a
	 * single lookup on the index storage, and the returned cursor encodes the index paging state.
	 * The index orders by the policy creation date, so ordering by dateCreated applies across the
	 * whole result while ordering by any other property only applies within a page. A page can
	 * contain fewer policies than the limit, because the conditions can exclude some of them and
	 * because a policy can hold several index entries which match a locator that does not pin every
	 * field, so callers must page until the cursor is undefined rather than stop on a short page.
	 * No policy is returned by more than one page.
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

		// Every locator field which the index covers becomes one comparison on the composite index,
		// so however many of them are supplied the index is only read once per page.
		const indexConditions: IComparator[] = [];

		if (Is.stringValue(locator?.assigner)) {
			indexConditions.push(this.buildIndexComparator("assigner", locator.assigner));
		}

		if (Is.stringValue(locator?.assignee)) {
			indexConditions.push(this.buildIndexComparator("assignee", locator.assignee));
		}

		if (Is.stringValue(locator?.target)) {
			indexConditions.push(this.buildIndexComparator("target", locator.target));
		}

		if (Is.stringValue(locator?.action)) {
			indexConditions.push(this.buildIndexComparator("action", locator.action));
		}

		if (!Is.empty(conditions)) {
			allConditions.conditions.push(conditions);
		}

		const sortProperties = Is.stringValue(orderBy)
			? [
					{
						property: this.convertToStorageProperty(orderBy),
						sortDirection: orderByDirection ?? SortDirection.Descending
					}
				]
			: undefined;

		// Without an index lookup the policy storage drives the paging, so its cursor is returned.
		if (indexConditions.length === 0) {
			// A cursor from a locator query means the caller changed the locator midway through
			// paging. It belongs to the index storage, so passing it on would silently read from the
			// wrong place.
			if (!Is.empty(this.tryParsePolicyIndexCursor(cursor))) {
				throw new GeneralError(PolicyAdministrationPointService.CLASS_NAME, "invalidCursor", {
					cursor
				});
			}

			const result = await this._odrlPolicyEntityStorage.query(
				allConditions.conditions.length > 0 ? allConditions : undefined,
				sortProperties,
				this.convertToStorageProperties(properties),
				cursor,
				limit
			);
			return {
				cursor: result.cursor,
				policies: result.entities.map(entity => this.convertFromStoragePolicy(entity as OdrlPolicy))
			};
		}

		// One read of the index gives the page of policy ids, already ordered by creation date.
		const indexPage = await this.queryIndexedPolicyIds(
			indexConditions,
			orderByDirection ?? SortDirection.Descending,
			cursor,
			limit
		);

		if (indexPage.policyIds.length === 0) {
			return { cursor: indexPage.cursor, policies: [] };
		}

		allConditions.conditions.push({
			property: "id",
			comparison: ComparisonOperator.In,
			value: indexPage.policyIds
		});

		const result = await this._odrlPolicyEntityStorage.query(
			allConditions,
			sortProperties,
			this.convertToStorageProperties(properties),
			undefined,
			indexPage.policyIds.length
		);

		return {
			cursor: indexPage.cursor,
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

		return storagePolicy;
	}

	/**
	 * Synchronise the index storage with the current state of a policy. One entry is stored per
	 * combination of assigner, assignee, target and action, which is what lets a locator covering
	 * several of those fields be answered by a single lookup.
	 * @param policyId The id of the policy to synchronise the index entries for.
	 * @param policy The policy to derive the index entries from.
	 * @param dateCreated The creation date to copy onto the index entries so they can be ordered.
	 * @returns A promise that resolves when the index entries match the policy.
	 * @internal
	 */
	private async syncPolicyIndexes<T extends IRightsManagementPolicy>(
		policyId: string,
		policy: T,
		dateCreated: string
	): Promise<void> {
		// An absent dimension contributes a single undefined value, otherwise it would collapse the
		// combinations to none and the policy would not be indexed at all.
		const assigners = this.buildIndexDimension(OdrlPolicyHelper.getPartyIds(policy.assigner));
		const assignees = this.buildIndexDimension(OdrlPolicyHelper.getPartyIds(policy.assignee));
		const targets = this.buildIndexDimension(OdrlPolicyHelper.getTargets(policy));
		const actions = this.buildIndexDimension(OdrlPolicyHelper.getActions(policy));

		const required = new Map<string, Omit<OdrlPolicyIndex, "id">>();
		for (const assigner of assigners) {
			for (const assignee of assignees) {
				for (const target of targets) {
					for (const action of actions) {
						required.set(JSON.stringify([assigner, assignee, target, action]), {
							policyId,
							assigner,
							assignee,
							target,
							action,
							dateCreated
						});
					}
				}
			}
		}

		const existing = await this.queryPolicyIndexesForPolicy(policyId, [
			"id",
			"assigner",
			"assignee",
			"target",
			"action",
			"dateCreated"
		]);

		const retainedKeys = new Set<string>();
		const removeIds: string[] = [];

		for (const entry of existing) {
			if (Is.stringValue(entry.id)) {
				// Entries which are no longer required, duplicates of a retained entry, and entries
				// holding a stale creation date are removed so exactly one current entry remains
				// per combination.
				const key = JSON.stringify([entry.assigner, entry.assignee, entry.target, entry.action]);
				if (
					required.has(key) &&
					!retainedKeys.has(key) &&
					entry.dateCreated === required.get(key)?.dateCreated
				) {
					retainedKeys.add(key);
				} else {
					removeIds.push(entry.id);
				}
			}
		}

		const addEntries: OdrlPolicyIndex[] = [];
		for (const [key, entry] of required) {
			if (!retainedKeys.has(key)) {
				addEntries.push({
					id: Converter.bytesToHex(RandomHelper.generate(16)),
					...entry
				});
			}
		}

		if (removeIds.length > 0) {
			await this._odrlPolicyIndexEntityStorage.removeBatch(removeIds);
		}

		if (addEntries.length > 0) {
			await this._odrlPolicyIndexEntityStorage.setBatch(addEntries);
		}
	}

	/**
	 * Build the distinct values for one index dimension.
	 * @param values The values read from the policy.
	 * @returns The case folded distinct values, or a single undefined when there are none.
	 * @internal
	 */
	private buildIndexDimension(values: string[]): (string | undefined)[] {
		const dimension: string[] = [];
		for (const value of values) {
			if (Is.stringValue(value)) {
				// Index values are always stored case folded so lookups are case insensitive.
				const folded = value.toLowerCase();
				if (!dimension.includes(folded)) {
					dimension.push(folded);
				}
			}
		}

		return dimension.length === 0 ? [undefined] : dimension;
	}

	/**
	 * Remove all the index entries for a policy.
	 * @param policyId The id of the policy to remove the index entries for.
	 * @returns A promise that resolves when the index entries have been removed.
	 * @internal
	 */
	private async removePolicyIndexes(policyId: string): Promise<void> {
		const existing = await this.queryPolicyIndexesForPolicy(policyId, ["id"]);

		const removeIds: string[] = [];
		for (const entry of existing) {
			if (Is.stringValue(entry.id)) {
				removeIds.push(entry.id);
			}
		}

		if (removeIds.length > 0) {
			await this._odrlPolicyIndexEntityStorage.removeBatch(removeIds);
		}
	}

	/**
	 * Query every index entry belonging to a policy, walking all the pages. The entries are
	 * bounded by the combinations of a single policy, so the whole set is safe to hold in memory.
	 * @param policyId The id of the policy to get the index entries for.
	 * @param properties The properties to return.
	 * @returns The index entries for the policy.
	 * @internal
	 */
	private async queryPolicyIndexesForPolicy(
		policyId: string,
		properties: (keyof OdrlPolicyIndex)[]
	): Promise<Partial<OdrlPolicyIndex>[]> {
		const conditions: EntityCondition<OdrlPolicyIndex> = {
			property: "policyId",
			comparison: ComparisonOperator.Equals,
			value: policyId
		};

		const entities: Partial<OdrlPolicyIndex>[] = [];
		let cursor: string | undefined;

		do {
			const results = await this._odrlPolicyIndexEntityStorage.query(
				conditions,
				undefined,
				properties,
				cursor
			);
			entities.push(...results.entities);
			cursor = results.cursor;
		} while (Is.stringValue(cursor));

		return entities;
	}

	/**
	 * Read one page of policy ids from the index storage. Every locator field is a comparison on
	 * the same composite index, so the page costs a single query no matter how many fields the
	 * locator pins.
	 * @param indexConditions The comparisons for the locator fields the index covers.
	 * @param sortDirection The direction to order the index entries by creation date.
	 * @param cursor The cursor from a previous page.
	 * @param limit The number of index entries to read.
	 * @returns The distinct policy ids for the page and a cursor when more pages remain.
	 * @internal
	 */
	private async queryIndexedPolicyIds(
		indexConditions: IComparator[],
		sortDirection: SortDirection,
		cursor?: string,
		limit?: number
	): Promise<{ policyIds: string[]; cursor?: string }> {
		const pageSize =
			Is.integer(limit) && limit > 0
				? Math.min(limit, PolicyAdministrationPointService._INDEX_PAGE_SIZE)
				: PolicyAdministrationPointService._INDEX_PAGE_SIZE;

		const parsedCursor = this.parsePolicyIndexCursor(cursor);

		const results = await this._odrlPolicyIndexEntityStorage.query(
			indexConditions.length === 1
				? indexConditions[0]
				: { logicalOperator: LogicalOperator.And, conditions: indexConditions },
			[
				{ property: "dateCreated", sortDirection },
				{ property: "policyId", sortDirection: SortDirection.Ascending }
			],
			["policyId"],
			parsedCursor?.ic,
			pageSize
		);

		// A policy holds one entry per combination, so a locator which does not pin every field can
		// match several entries of the same policy. They are collapsed here, which is why a page can
		// hold fewer policies than entries were read. Ordering by policy id within a creation date
		// keeps those entries contiguous, so the only policy which can continue into the next page
		// is the last one of this page, and the cursor carries it to be skipped there.
		const policyIds: string[] = [];
		const seen = new Set<string>();
		for (const entity of results.entities) {
			if (Is.stringValue(entity.policyId) && entity.policyId !== parsedCursor?.sp) {
				if (!seen.has(entity.policyId)) {
					seen.add(entity.policyId);
					policyIds.push(entity.policyId);
				}
			}
		}

		const lastEntity = results.entities[results.entities.length - 1];
		const straddlingPolicyId = Is.stringValue(lastEntity?.policyId)
			? lastEntity.policyId
			: undefined;

		return {
			policyIds,
			cursor: this.buildPolicyIndexCursor(results.cursor, straddlingPolicyId)
		};
	}

	/**
	 * Build the comparison for a locator field against its index column.
	 * @param property The index column to compare.
	 * @param value The locator value, case folded to match the stored entries.
	 * @returns The comparison for the index column.
	 * @internal
	 */
	private buildIndexComparator(property: keyof OdrlPolicyIndex, value: string): IComparator {
		return {
			property,
			comparison: ComparisonOperator.Equals,
			value: value.toLowerCase()
		};
	}

	/**
	 * Encode the paging state for a locator query into an opaque cursor.
	 * @param indexCursor The cursor for the index storage.
	 * @param straddlingPolicyId The policy whose remaining index entries begin the next page.
	 * @returns The encoded cursor, or undefined when the index has no more entries.
	 * @internal
	 */
	private buildPolicyIndexCursor(
		indexCursor?: string,
		straddlingPolicyId?: string
	): string | undefined {
		if (!Is.stringValue(indexCursor)) {
			return undefined;
		}

		const cursorData: IPolicyIndexCursor = {
			v: PolicyAdministrationPointService._INDEX_CURSOR_VERSION,
			ic: indexCursor
		};

		if (Is.stringValue(straddlingPolicyId)) {
			cursorData.sp = straddlingPolicyId;
		}

		return Converter.bytesToBase64(ObjectHelper.toBytes(cursorData));
	}

	/**
	 * Decode the paging state for a locator query from an opaque cursor.
	 * @param cursor The cursor to decode.
	 * @returns The decoded paging state, or undefined when no cursor was supplied.
	 * @throws GeneralError if the cursor is not one produced by a locator query.
	 * @internal
	 */
	private parsePolicyIndexCursor(cursor?: string): IPolicyIndexCursor | undefined {
		if (!Is.stringValue(cursor)) {
			return undefined;
		}

		const parsed = this.tryParsePolicyIndexCursor(cursor);
		if (!Is.empty(parsed)) {
			return parsed;
		}

		throw new GeneralError(PolicyAdministrationPointService.CLASS_NAME, "invalidCursor", {
			cursor
		});
	}

	/**
	 * Decode the paging state for a locator query from an opaque cursor, without rejecting a cursor
	 * which belongs to a query of a different shape.
	 * @param cursor The cursor to decode.
	 * @returns The decoded paging state, or undefined when the cursor is not one of ours.
	 * @internal
	 */
	private tryParsePolicyIndexCursor(cursor?: string): IPolicyIndexCursor | undefined {
		if (Is.stringBase64(cursor)) {
			try {
				const parsed = ObjectHelper.fromBytes<IPolicyIndexCursor>(Converter.base64ToBytes(cursor));
				if (
					Is.object<IPolicyIndexCursor>(parsed) &&
					parsed.v === PolicyAdministrationPointService._INDEX_CURSOR_VERSION &&
					Is.stringValue(parsed.ic)
				) {
					return parsed;
				}
			} catch {
				// A cursor which cannot be decoded is simply not one of ours.
			}
		}

		return undefined;
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
