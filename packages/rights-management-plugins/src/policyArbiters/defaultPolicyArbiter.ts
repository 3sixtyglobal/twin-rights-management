// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	ArrayHelper,
	Coerce,
	ComponentFactory,
	GeneralError,
	Guards,
	Is,
	ObjectHelper,
	StringHelper
} from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { JsonPathHelper } from "@twin.org/data-json-path";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	OdrlProfiles,
	PolicyDecision,
	PolicyObligationEnforcerFactory,
	type IPolicyAdministrationPointComponent,
	type IPolicyArbiter,
	type IPolicyDecision,
	type IRightsManagementPolicy
} from "@twin.org/rights-management-models";
import type { IDataspaceProtocolAgreement } from "@twin.org/standards-dataspace-protocol";
import {
	type IOdrlAssetCollection,
	OdrlConflictStrategyType,
	OdrlLogicalConstraintType,
	OdrlOperatorType,
	OdrlTypes,
	type IOdrlAction,
	type IOdrlAsset,
	type IOdrlConstraint,
	type IOdrlDuty,
	type IOdrlLogicalConstraint,
	type IOdrlLogicalConstraintOperand,
	type IOdrlParty,
	type IOdrlPartyCollection,
	type IOdrlPermission,
	type IOdrlProhibition,
	type IOdrlRule,
	type OdrlActionType
} from "@twin.org/standards-w3c-odrl";
import type { IDefaultPolicyArbiterConstructorOptions } from "../models/IDefaultPolicyArbiterConstructorOptions.js";

/**
 * Default Policy Arbiter.
 */
export class DefaultPolicyArbiter implements IPolicyArbiter {
	/**
	 * The class name of the Default Policy Arbiter.
	 */
	public static readonly CLASS_NAME: string = nameof<DefaultPolicyArbiter>();

	/**
	 * ODRL profiles whose custom vocabulary this arbiter understands and supports.
	 * Any policy declaring a profile not in this set will be rejected.
	 * Add a new entry here when support for an additional profile is implemented.
	 */
	public static readonly SUPPORTED_PROFILES: ReadonlySet<string> = new Set([OdrlProfiles.Twin]);

	/**
	 * Default maximum inheritance depth.
	 * @internal
	 */
	private static readonly _DEFAULT_MAX_INHERITANCE_DEPTH = 10;

	/**
	 * TWIN prefix operations.
	 * @internal
	 */
	private static readonly _TWIN_PREFIX_OPERATIONS = "twin:";

	/**
	 * TWIN prefix JSONPath.
	 * @internal
	 */
	private static readonly _TWIN_PREFIX_JSONPATH = "jsonpath";

	/**
	 * TWIN prefix information.
	 * @internal
	 */
	private static readonly _TWIN_PREFIX_INFORMATION = "information";

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging: ILoggingComponent;

	/**
	 * The policy administration point component.
	 * @internal
	 */
	private readonly _policyAdministrationPoint: IPolicyAdministrationPointComponent;

	/**
	 * The maximum depth to traverse when resolving inherited policies.
	 * @internal
	 */
	private readonly _maxInheritanceDepth: number;

	/**
	 * Create a new instance of DefaultPolicyArbiter.
	 * @param options The options for the default policy arbiter.
	 */
	constructor(options?: IDefaultPolicyArbiterConstructorOptions) {
		this._logging = ComponentFactory.get<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);

		this._policyAdministrationPoint = ComponentFactory.get<IPolicyAdministrationPointComponent>(
			options?.policyAdministrationPointComponentType ?? "policy-administration-point"
		);

		this._maxInheritanceDepth =
			Coerce.integer(options?.config?.maxInheritanceDepth) ??
			DefaultPolicyArbiter._DEFAULT_MAX_INHERITANCE_DEPTH;
	}

	/**
	 * Normalises a profile IRI for comparison against the supported-profiles allowlist.
	 * Per RFC 3986: scheme and host are case-insensitive (the URL constructor folds them to
	 * lowercase automatically); a trailing slash on the terminal path segment is treated as
	 * equivalent to its absence; repeated slashes in the path are collapsed to a single slash.
	 * Non-URL strings are returned unchanged.
	 * @param iri The IRI to normalise.
	 * @returns The normalised IRI.
	 * @internal
	 */
	private static normalizeProfileIri(iri: string): string {
		try {
			const url = new URL(iri);
			const pathname = url.pathname.replace(/\/+/g, "/");
			return `${url.protocol}//${url.host}${StringHelper.trimTrailingSlashes(pathname)}`;
		} catch {
			return iri;
		}
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return DefaultPolicyArbiter.CLASS_NAME;
	}

	/**
	 * Makes decisions regarding policy access to data.
	 * @param agreement The agreement to evaluate.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param data The data to make a decision on.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The decisions about access to the data.
	 */
	public async decide<D = unknown>(
		agreement: IDataspaceProtocolAgreement,
		information?: { [id: string]: IJsonLdNodeObject },
		data?: D,
		action?: OdrlActionType | string
	): Promise<IPolicyDecision[]> {
		Guards.object<IDataspaceProtocolAgreement>(
			DefaultPolicyArbiter.CLASS_NAME,
			nameof(agreement),
			agreement
		);

		// ODRL policy profiles extend the vocabulary with additional semantics (e.g. custom
		// operators, left operands). Without profile-aware evaluation logic the arbiter
		// cannot guarantee correctness, so any policy that declares an unknown profile is
		// rejected. The TWIN platform profile is explicitly supported.
		//
		// Empty-string profile values (e.g. from over-eager schema defaults or serialization
		// round-trips) are treated as "no profile declared" and filtered out before comparison.
		//
		// Profile IRIs are normalized before lookup: scheme and host are case-folded to
		// lowercase and a trailing slash on the last path segment is stripped. This accepts
		// common IRI variants (HTTPS://, uppercase host, trailing slash) instead of silently
		// rejecting valid policies authored by IRI-aware tooling.
		//
		// `every` (conjunction) is intentional: a policy declaring ["TWIN", "unknown"] is
		// rejected — the arbiter refuses to evaluate rules from a profile whose semantics it
		// does not understand, even if other declared profiles are known.
		const declaredProfiles = ArrayHelper.fromObjectOrArray<string>(agreement.profile ?? [])
			.filter(p => Is.stringValue(p))
			.map(p => DefaultPolicyArbiter.normalizeProfileIri(p));
		if (
			Is.arrayValue(declaredProfiles) &&
			!declaredProfiles.every(p => DefaultPolicyArbiter.SUPPORTED_PROFILES.has(p))
		) {
			const unsupportedProfile = declaredProfiles.find(
				p => !DefaultPolicyArbiter.SUPPORTED_PROFILES.has(p)
			);
			throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "policyProfileNotSupported", {
				policyId: OdrlPolicyHelper.getUid(agreement) ?? "",
				unsupportedProfile
			});
		}

		await this._logging.log({
			level: "info",
			source: DefaultPolicyArbiter.CLASS_NAME,
			ts: Date.now(),
			message: "decidingPolicy",
			data: {
				policyId: OdrlPolicyHelper.getUid(agreement) ?? ""
			}
		});

		// Resolve and merge inherited policies.
		const mergedPolicy = await this.mergeInheritedPolicies(agreement);
		const expandedPolicy = this.expandCompactPolicyRules(mergedPolicy);
		const dataSources = {
			[`${DefaultPolicyArbiter._TWIN_PREFIX_OPERATIONS}${DefaultPolicyArbiter._TWIN_PREFIX_JSONPATH}`]:
				data,
			[`${DefaultPolicyArbiter._TWIN_PREFIX_OPERATIONS}${DefaultPolicyArbiter._TWIN_PREFIX_INFORMATION}`]:
				information
		};

		// Extract agreement parties once for use in rule evaluation
		const agreementAssigner = OdrlPolicyHelper.getPartyIds(agreement.assigner);
		const agreementAssignee = OdrlPolicyHelper.getPartyIds(agreement.assignee);
		const obligationsFulfilled = await this.evaluatePolicyObligations(
			agreementAssigner,
			agreementAssignee,
			expandedPolicy,
			dataSources
		);

		// ODRL-style rule evaluation grouped by decision target:
		// - Permission rules authorize if ANY applicable permission on the same target matches.
		// - Default to denied when no permission applies on a target (closed-world for access control).
		// - Conflict strategy controls how applicable permissions/prohibitions are resolved per target.
		const targetStates: {
			[target: string]: {
				permissionApplies: boolean;
				prohibitionApplies: boolean;
			};
		} = Object.create(null) as {
			[target: string]: {
				permissionApplies: boolean;
				prohibitionApplies: boolean;
			};
		};

		const permissions = ArrayHelper.fromObjectOrArray(expandedPolicy.permission ?? []);
		for (const permission of permissions) {
			const decisionTargets = this.resolveRuleDecisionTargets(permission, dataSources);
			for (const decisionTarget of decisionTargets) {
				const state = this.getOrCreateTargetState(targetStates, decisionTarget.target);
				if (
					await this.evaluatePermission(
						agreementAssigner,
						agreementAssignee,
						expandedPolicy,
						permission,
						decisionTarget.refinements,
						dataSources,
						action,
						decisionTarget.target
					)
				) {
					state.permissionApplies = true;
				}
			}
		}

		const prohibitions = ArrayHelper.fromObjectOrArray<IOdrlProhibition>(
			expandedPolicy.prohibition ?? []
		);
		for (const prohibition of prohibitions) {
			const decisionTargets = this.resolveRuleDecisionTargets(prohibition, dataSources);
			for (const decisionTarget of decisionTargets) {
				if (
					await this.evaluateProhibition(
						expandedPolicy,
						agreementAssigner,
						agreementAssignee,
						prohibition,
						decisionTarget.refinements,
						dataSources,
						action,
						decisionTarget.target
					)
				) {
					const state = this.getOrCreateTargetState(targetStates, decisionTarget.target);
					state.prohibitionApplies = true;
				}
			}
		}

		const conflictStrategy = expandedPolicy.conflict ?? OdrlConflictStrategyType.Invalid;
		if (Object.keys(targetStates).length === 0) {
			// Closed-world fallback when the policy has no rules at all.
			return [{ decision: PolicyDecision.Denied, target: "$" }];
		}

		const decisions: IPolicyDecision[] = [];
		for (const [target, state] of Object.entries(targetStates)) {
			let decision: PolicyDecision;
			if (state.permissionApplies && state.prohibitionApplies) {
				switch (conflictStrategy) {
					case OdrlConflictStrategyType.Perm:
						decision = PolicyDecision.Granted;
						break;
					case OdrlConflictStrategyType.Prohibit:
					case OdrlConflictStrategyType.Invalid:
					default:
						decision = PolicyDecision.Denied;
						break;
				}
			} else {
				decision = state.permissionApplies ? PolicyDecision.Granted : PolicyDecision.Denied;
			}

			if (!obligationsFulfilled) {
				decision = PolicyDecision.Denied;
			}

			decisions.push({
				decision,
				target
			});
		}

		return decisions;
	}

	/**
	 * Expand compact/compound policy rule forms into atomic rules.
	 * ODRL 2.7 allows compact forms where rule properties can be arrays.
	 * Evaluation in this arbiter is performed on expanded atomic rules.
	 * @param policy The policy to expand.
	 * @returns A policy with expanded rule arrays.
	 * @internal
	 */
	private expandCompactPolicyRules(policy: IRightsManagementPolicy): IRightsManagementPolicy {
		const expandedPermissions = this.expandRules(
			ArrayHelper.fromObjectOrArray<IOdrlPermission>(policy.permission ?? [])
		);
		const expandedProhibitions = this.expandRules(
			ArrayHelper.fromObjectOrArray<IOdrlProhibition>(policy.prohibition ?? [])
		);
		const expandedObligations = this.expandRules(
			ArrayHelper.fromObjectOrArray<IOdrlDuty>(policy.obligation ?? [])
		);

		return {
			...policy,
			permission: expandedPermissions.length > 0 ? expandedPermissions : undefined,
			prohibition: expandedProhibitions.length > 0 ? expandedProhibitions : undefined,
			obligation: expandedObligations.length > 0 ? expandedObligations : undefined
		};
	}

	/**
	 * Expand a rule list into atomic rules.
	 * @param rules The rules to expand.
	 * @returns Expanded atomic rules.
	 * @internal
	 */
	private expandRules<T extends IOdrlRule>(rules: T[]): T[] {
		const expanded: T[] = [];
		for (const rule of rules) {
			expanded.push(...this.expandRule(rule));
		}

		return expanded;
	}

	/**
	 * Expand a single compact/compound rule into atomic rules.
	 * @param rule The rule to expand.
	 * @returns Expanded atomic rules.
	 * @internal
	 */
	private expandRule<T extends IOdrlRule>(rule: T): T[] {
		const targets = this.normalizeRuleField<NonNullable<IOdrlRule["target"]>>(rule.target);
		const actions = this.normalizeRuleField<NonNullable<IOdrlRule["action"]>>(rule.action);
		const assigners = this.normalizeRuleField<NonNullable<IOdrlRule["assigner"]>>(rule.assigner);
		const assignees = this.normalizeRuleField<NonNullable<IOdrlRule["assignee"]>>(rule.assignee);

		const expanded: T[] = [];
		for (const target of targets) {
			for (const action of actions) {
				for (const assigner of assigners) {
					for (const assignee of assignees) {
						const atomicRule = { ...rule };
						atomicRule.target = target;
						atomicRule.action = action;
						atomicRule.assigner = assigner;
						atomicRule.assignee = assignee;
						expanded.push(atomicRule);
					}
				}
			}
		}

		return expanded;
	}

	/**
	 * Normalize a potentially compact rule field into an array for expansion.
	 * @param value The field value.
	 * @returns Normalized values (or a single undefined when not provided).
	 * @internal
	 */
	private normalizeRuleField<T>(value: T | undefined): (T | undefined)[] {
		if (Is.undefined(value)) {
			return [undefined];
		}

		const values = ArrayHelper.fromObjectOrArray(value);
		return values.length > 0 ? values : [undefined];
	}

	/**
	 * Get an existing target state or create an initial state if it doesn't exist.
	 * @param targetStates The dictionary of target states.
	 * @param target The target key.
	 * @returns The target state.
	 * @internal
	 */
	private getOrCreateTargetState(
		targetStates: {
			[target: string]: {
				permissionApplies: boolean;
				prohibitionApplies: boolean;
			};
		},
		target: string
	): {
		permissionApplies: boolean;
		prohibitionApplies: boolean;
	} {
		let state = targetStates[target];
		if (Is.undefined(state)) {
			state = {
				permissionApplies: false,
				prohibitionApplies: false
			};
			targetStates[target] = state;
		}

		return state;
	}

	/**
	 * Evaluate whether a prohibition applies.
	 * @param policy The policy containing the prohibition.
	 * @param agreementAssigner The assigner ID from the agreement.
	 * @param agreementAssignee The assignee ID from the agreement.
	 * @param prohibition The prohibition to evaluate.
	 * @param targetRefinements Additional constraints from target refinement.
	 * @param dataSources The operand lookup sources.
	 * @param action Optional action to check against the prohibition's applicable actions.
	 * @returns True if the prohibition applies.
	 * @internal
	 */
	private async evaluateProhibition(
		policy: IRightsManagementPolicy,
		agreementAssigner: string[] | undefined,
		agreementAssignee: string[] | undefined,
		prohibition: IOdrlProhibition,
		targetRefinements: (IOdrlConstraint | IOdrlLogicalConstraint)[],
		dataSources: { [prefix: string]: unknown },
		action?: OdrlActionType | string,
		decisionTarget?: string
	): Promise<boolean> {
		if (
			!this.isRuleApplicableToParties(
				prohibition,
				agreementAssigner,
				agreementAssignee,
				dataSources
			)
		) {
			return false;
		}

		// Check if the prohibition's action(s) match the requested action
		if (!this.isActionApplicable(prohibition.action, action, dataSources)) {
			return false;
		}

		// ODRL semantics: a rule without constraints is unconditional.
		const constraints = [
			...ArrayHelper.fromObjectOrArray(prohibition.constraint ?? []),
			...targetRefinements
		];
		if (
			constraints.length > 0 &&
			!constraints.every(c => this.evaluateConstraint(c, dataSources))
		) {
			return false;
		}

		const prohibitionTargetLookup = this.tryResolveTargetDataSource(
			this.buildRuleDataContextTargetId(
				this.getRuleDataContextTargetId(prohibition.target),
				decisionTarget
			),
			dataSources,
			true
		);
		const ruleDataContext = prohibitionTargetLookup.value;

		const remedies = ArrayHelper.fromObjectOrArray<IOdrlDuty>(prohibition.remedy ?? []);
		if (remedies.length === 0) {
			return true;
		}

		for (const remedy of remedies) {
			if (!(await this.enforceDuty(policy, remedy, dataSources, ruleDataContext))) {
				return true;
			}
		}

		// Remedies satisfied: prohibition is treated as no longer infringed.
		return false;
	}

	/**
	 * Evaluate all policy-level obligations.
	 * @param agreementAssigner The assigner ID from the agreement.
	 * @param agreementAssignee The assignee ID from the agreement.
	 * @param policy The policy containing obligations.
	 * @param dataSources The operand lookup sources.
	 * @returns True if all applicable obligations are fulfilled.
	 * @internal
	 */
	private async evaluatePolicyObligations(
		agreementAssigner: string[] | undefined,
		agreementAssignee: string[] | undefined,
		policy: IRightsManagementPolicy,
		dataSources: { [prefix: string]: unknown }
	): Promise<boolean> {
		const obligations = ArrayHelper.fromObjectOrArray<IOdrlDuty>(policy.obligation ?? []);
		for (const obligation of obligations) {
			if (
				!(await this.evaluateObligation(
					agreementAssigner,
					agreementAssignee,
					policy,
					obligation,
					dataSources
				))
			) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Evaluate whether a policy-level obligation is fulfilled.
	 * @param agreementAssigner The assigner ID from the agreement.
	 * @param agreementAssignee The assignee ID from the agreement.
	 * @param policy The policy containing the obligation.
	 * @param obligation The obligation to evaluate.
	 * @param dataSources The operand lookup sources.
	 * @returns True if the obligation is not applicable or is fulfilled.
	 * @internal
	 */
	private async evaluateObligation(
		agreementAssigner: string[] | undefined,
		agreementAssignee: string[] | undefined,
		policy: IRightsManagementPolicy,
		obligation: IOdrlDuty,
		dataSources: { [prefix: string]: unknown }
	): Promise<boolean> {
		if (
			!this.isRuleApplicableToParties(obligation, agreementAssigner, agreementAssignee, dataSources)
		) {
			return true;
		}

		const { refinements } = this.resolveRuleTarget(obligation, dataSources);
		const obligationTargetLookup = this.tryResolveTargetDataSource(
			this.getTargetId(obligation.target),
			dataSources,
			true
		);
		const ruleDataContext = obligationTargetLookup.value;
		const constraints = [
			...ArrayHelper.fromObjectOrArray(obligation.constraint ?? []),
			...refinements
		];

		if (
			constraints.length > 0 &&
			!constraints.every(c => this.evaluateConstraint(c, dataSources))
		) {
			return true;
		}

		return this.enforceDuty(policy, obligation, dataSources, ruleDataContext);
	}

	/**
	 * Merge inherited policies into the current policy.
	 * Inherited policies' permissions, prohibitions, and obligations are combined with the current policy's rules.
	 * @param policy The policy to evaluate.
	 * @returns A new policy with merged rules from all ancestors.
	 * @internal
	 */
	private async mergeInheritedPolicies(
		policy: IRightsManagementPolicy
	): Promise<IRightsManagementPolicy> {
		const visitedPolicyIds: string[] = [];
		visitedPolicyIds.push(OdrlPolicyHelper.getUid(policy) ?? "");
		const inheritedPolicies = await this.resolveInheritedPolicies(policy, visitedPolicyIds, 0);
		const conflictStrategies = new Set<OdrlConflictStrategyType>();
		if (Is.stringValue(policy.conflict)) {
			conflictStrategies.add(policy.conflict);
		}

		// Start with copies of the current policy's rules
		const mergedPermissions: IOdrlPermission[] = ArrayHelper.fromObjectOrArray(
			policy.permission ?? []
		).map(permission => this.applyPolicyDefaultsToRule(policy, permission));

		const mergedProhibitions: IOdrlProhibition[] = ArrayHelper.fromObjectOrArray(
			policy.prohibition ?? []
		).map(prohibition => this.applyPolicyDefaultsToRule(policy, prohibition));

		const mergedObligations: IOdrlDuty[] = ArrayHelper.fromObjectOrArray(
			policy.obligation ?? []
		).map(obligation => this.applyPolicyDefaultsToRule(policy, obligation));

		// Merge rules from each inherited policy, applying the same profile guard as the
		// top-level policy. A parent that declares an unsupported profile may carry rules
		// whose semantics the arbiter cannot guarantee, so it is rejected.
		for (const inheritedPolicy of inheritedPolicies) {
			const inheritedProfiles = ArrayHelper.fromObjectOrArray<string>(inheritedPolicy.profile ?? [])
				.filter(p => Is.stringValue(p))
				.map(p => DefaultPolicyArbiter.normalizeProfileIri(p));
			if (
				Is.arrayValue(inheritedProfiles) &&
				!inheritedProfiles.every(p => DefaultPolicyArbiter.SUPPORTED_PROFILES.has(p))
			) {
				throw new GeneralError(
					DefaultPolicyArbiter.CLASS_NAME,
					"inheritedPolicyProfileNotSupported",
					{ policyId: OdrlPolicyHelper.getUid(inheritedPolicy) ?? "" }
				);
			}

			if (Is.stringValue(inheritedPolicy.conflict)) {
				conflictStrategies.add(inheritedPolicy.conflict);
			}
			const inheritedPermissions = ArrayHelper.fromObjectOrArray(inheritedPolicy.permission ?? []);
			if (inheritedPermissions.length > 0) {
				mergedPermissions.push(
					...inheritedPermissions.map(permission =>
						this.applyPolicyDefaultsToRule(inheritedPolicy, permission)
					)
				);
			}

			const inheritedProhibitions = ArrayHelper.fromObjectOrArray(
				inheritedPolicy.prohibition ?? []
			);
			if (inheritedProhibitions.length > 0) {
				mergedProhibitions.push(
					...inheritedProhibitions.map(prohibition =>
						this.applyPolicyDefaultsToRule(inheritedPolicy, prohibition)
					)
				);
			}

			const inheritedObligations = ArrayHelper.fromObjectOrArray(inheritedPolicy.obligation ?? []);
			if (inheritedObligations.length > 0) {
				mergedObligations.push(
					...inheritedObligations.map(obligation =>
						this.applyPolicyDefaultsToRule(inheritedPolicy, obligation)
					)
				);
			}
		}

		let mergedConflict: OdrlConflictStrategyType | undefined;
		if (conflictStrategies.size === 1) {
			mergedConflict = Array.from(conflictStrategies)[0];
		} else if (conflictStrategies.size > 1) {
			mergedConflict = OdrlConflictStrategyType.Invalid;
		}

		// Return a new policy with merged rules
		return {
			...policy,
			conflict: mergedConflict,
			permission: mergedPermissions.length > 0 ? mergedPermissions : undefined,
			prohibition: mergedProhibitions.length > 0 ? mergedProhibitions : undefined,
			obligation: mergedObligations.length > 0 ? mergedObligations : undefined
		};
	}

	/**
	 * Resolve inherited policies by their UIDs from the Policy Administration Point.
	 * Policies can inherit from other policies via the inheritFrom property.
	 * @param policy The policy that may have inheritFrom references.
	 * @param visitedPolicyIds Array of policy UIDs already visited in this inheritance chain.
	 * @returns Array of inherited policies fetched from the PAP.
	 * @internal
	 */
	private async resolveInheritedPolicies(
		policy: IRightsManagementPolicy,
		visitedPolicyIds: string[],
		currentDepth: number
	): Promise<IRightsManagementPolicy[]> {
		const inheritedPolicies: IRightsManagementPolicy[] = [];

		// If policy has no inheritFrom, return empty array
		if (Is.empty(policy.inheritFrom)) {
			return inheritedPolicies;
		}

		const inheritFromIds = ArrayHelper.fromObjectOrArray<string>(policy.inheritFrom) ?? [];

		for (const inheritFromId of inheritFromIds) {
			const nextDepth = currentDepth + 1;
			if (nextDepth > this._maxInheritanceDepth) {
				throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "maxInheritanceDepthExceeded", {
					policyId: OdrlPolicyHelper.getUid(policy) ?? "",
					inheritFromId,
					maxInheritanceDepth: this._maxInheritanceDepth
				});
			}

			// Check for circular inheritance
			if (visitedPolicyIds.includes(inheritFromId)) {
				throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "circularInheritanceDetected", {
					policyId: OdrlPolicyHelper.getUid(policy) ?? "",
					inheritFromId
				});
			}

			// Fetch the inherited policy from the PAP
			const inheritedPolicy = await this._policyAdministrationPoint.get(inheritFromId);
			if (Is.empty(inheritedPolicy)) {
				throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "inheritedPolicyNotFound", {
					inheritFromId
				});
			}

			// Mark this policy as visited
			visitedPolicyIds.push(inheritFromId);

			inheritedPolicies.push(inheritedPolicy);

			// Recursively resolve inherited policies of the parent
			const grandparentPolicies = await this.resolveInheritedPolicies(
				inheritedPolicy,
				visitedPolicyIds,
				nextDepth
			);
			inheritedPolicies.push(...grandparentPolicies);
		}

		return inheritedPolicies;
	}

	/**
	 * Apply policy-level default values (assigner, assignee, target, action) to rules that don't override them.
	 * @param policy The policy providing defaults.
	 * @param rule The rule to apply defaults to.
	 * @returns The rule with policy-level defaults applied.
	 * @internal
	 */
	private applyPolicyDefaultsToRule<T extends IOdrlRule>(
		policy: IRightsManagementPolicy,
		rule: T
	): T {
		const assigner = Is.empty(rule.assigner) ? policy.assigner : rule.assigner;
		const assignee = Is.empty(rule.assignee) ? policy.assignee : rule.assignee;
		const target = Is.empty(rule.target) ? policy.target : rule.target;
		const action = Is.empty(rule.action) ? policy.action : rule.action;

		const assignerIds = OdrlPolicyHelper.getPartyIds(assigner);
		const ruleAssignerIds = OdrlPolicyHelper.getPartyIds(rule.assigner);
		const assigneeIds = OdrlPolicyHelper.getPartyIds(assignee);
		const ruleAssigneeIds = OdrlPolicyHelper.getPartyIds(rule.assignee);

		let assignerEqual = false;
		if (Is.empty(assignerIds) && Is.empty(ruleAssignerIds)) {
			assignerEqual = true;
		} else if (!Is.empty(assignerIds) && !Is.empty(ruleAssignerIds)) {
			assignerEqual =
				assignerIds.length === ruleAssignerIds.length &&
				assignerIds.every(id => ruleAssignerIds.includes(id));
		}

		let assigneeEqual = false;
		if (Is.empty(assigneeIds) && Is.empty(ruleAssigneeIds)) {
			assigneeEqual = true;
		} else if (!Is.empty(assigneeIds) && !Is.empty(ruleAssigneeIds)) {
			assigneeEqual =
				assigneeIds.length === ruleAssigneeIds.length &&
				assigneeIds.every(id => ruleAssigneeIds.includes(id));
		}

		const targetEqual = target === rule.target;
		const actionEqual = action === rule.action;

		if (assignerEqual && assigneeEqual && targetEqual && actionEqual) {
			return rule;
		}

		return {
			...rule,
			assigner,
			assignee,
			target,
			action
		};
	}

	/**
	 * Determine whether a rule applies to the agreement parties based on assigner/assignee.
	 * @param rule The rule to evaluate.
	 * @param agreementAssigner The assigner ID from the agreement.
	 * @param agreementAssignee The assignee ID from the agreement.
	 * @returns True if the rule is applicable to the agreement parties.
	 * @internal
	 */
	private isRuleApplicableToParties(
		rule: IOdrlRule,
		agreementAssigner: string[] | undefined,
		agreementAssignee: string[] | undefined,
		dataSources: { [prefix: string]: unknown }
	): boolean {
		const assignerContext = this.resolveRulePartyContext(rule.assigner);
		const assigneeContext = this.resolveRulePartyContext(rule.assignee);

		if (!this.isPartyApplicable(assignerContext.partyIds, agreementAssigner)) {
			return false;
		}

		if (
			assignerContext.refinements.length > 0 &&
			!assignerContext.refinements.every(c => this.evaluateConstraint(c, dataSources))
		) {
			return false;
		}

		if (!this.isPartyApplicable(assigneeContext.partyIds, agreementAssignee)) {
			return false;
		}

		if (
			assigneeContext.refinements.length > 0 &&
			!assigneeContext.refinements.every(c => this.evaluateConstraint(c, dataSources))
		) {
			return false;
		}

		return true;
	}

	/**
	 * Resolve rule party identifiers and refinements.
	 * PartyCollection source values are currently not supported for party matching.
	 * @param party The rule party value.
	 * @returns Resolved party identifiers and refinement constraints.
	 * @throws GeneralError if PartyCollection source has a value.
	 * @internal
	 */
	private resolveRulePartyContext(party: IOdrlRule["assigner"] | IOdrlRule["assignee"]): {
		partyIds: string[];
		refinements: (IOdrlConstraint | IOdrlLogicalConstraint)[];
	} {
		const partyIds: string[] = [];
		const refinements: (IOdrlConstraint | IOdrlLogicalConstraint)[] = [];

		const parties = ArrayHelper.fromObjectOrArray(party ?? []);
		for (const partyEntry of parties) {
			if (Is.stringValue(partyEntry)) {
				partyIds.push(partyEntry);
			} else if (Is.object<IOdrlParty>(partyEntry)) {
				// Guard against unsupported ODRL party properties
				if (Is.notEmpty(partyEntry.assignerOf)) {
					throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "partyAssignerOfNotSupported");
				}
				if (Is.notEmpty(partyEntry.assigneeOf)) {
					throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "partyAssigneeOfNotSupported");
				}
				if (Is.notEmpty(partyEntry.partOf)) {
					throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "partyPartOfNotSupported");
				}

				if (OdrlPolicyHelper.getType(partyEntry) === OdrlTypes.PartyCollection) {
					const partyCollectionEntry = partyEntry as IOdrlPartyCollection;
					if (Is.stringValue(partyCollectionEntry.source)) {
						throw new GeneralError(
							DefaultPolicyArbiter.CLASS_NAME,
							"partyCollectionSourceNotSupported",
							{
								source: partyCollectionEntry.source ?? ""
							}
						);
					}

					refinements.push(...ArrayHelper.fromObjectOrArray(partyCollectionEntry.refinement ?? []));
				} else {
					const partyId = OdrlPolicyHelper.getUid(partyEntry);
					if (Is.stringValue(partyId)) {
						partyIds.push(partyId);
					}
				}
			}
		}

		return {
			partyIds,
			refinements
		};
	}

	/**
	 * Determine whether a rule party constraint applies to the agreement parties.
	 * Rule party is treated as a constraint: if specified, it must match at least one agreement party.
	 * @param rulePartyIds The party ids specified on the rule (if any).
	 * @param agreementPartyIds The party ids extracted from the agreement.
	 * @returns True if the rule party constraint is satisfied.
	 * @internal
	 */
	private isPartyApplicable(
		rulePartyIds: string[] | undefined,
		agreementPartyIds: string[] | undefined
	): boolean {
		// No party specified on rule means it applies to any agreement party.
		if (Is.empty(rulePartyIds)) {
			return true;
		}

		// Rule specifies party/parties, but agreement doesn't provide any.
		if (Is.empty(agreementPartyIds)) {
			return false;
		}

		for (const rulePartyId of rulePartyIds) {
			if (agreementPartyIds.includes(rulePartyId)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Determine whether a rule's action(s) match the requested action.
	 * Supports exact match, includedIn hierarchy, and implies relationships.
	 * If no action is specified in the rule, it applies to all actions (action-agnostic).
	 * If an action is specified in the rule and a specific action is requested, they must match.
	 * If an action is specified in the rule but no specific action is requested, the rule applies (general evaluation).
	 * @param ruleActions The actions defined in the rule (can be string, object, or array).
	 * @param requestedAction The action being requested (optional).
	 * @returns True if the rule's action(s) apply.
	 * @internal
	 */
	private isActionApplicable(
		ruleActions: IOdrlRule["action"],
		requestedAction: OdrlActionType | string | undefined,
		dataSources: { [prefix: string]: unknown }
	): boolean {
		// If the rule has no action specified, it applies to all actions
		if (Is.empty(ruleActions)) {
			return true;
		}

		// If the rule has actions but no specific action is requested,
		// the rule applies (we're evaluating permissions in general)
		if (Is.empty(requestedAction)) {
			return true;
		}

		const requestedActionId = Is.string(requestedAction)
			? requestedAction
			: OdrlPolicyHelper.getUid(requestedAction);

		if (!Is.stringValue(requestedActionId)) {
			return false;
		}

		const ruleActionArray = ArrayHelper.fromObjectOrArray(ruleActions) ?? [];

		for (const ruleAction of ruleActionArray) {
			if (this.ruleActionCoversRequested(ruleAction, requestedActionId, dataSources)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Determine whether a single rule action covers a requested action.
	 * Covers exact match plus ODRL action hierarchy semantics.
	 * - includedIn: the rule action is a sub-action of a broader parent.
	 *   A rule naming the narrower action also covers requests for the parent.
	 *   E.g. rule action "print" with includedIn "reproduce" covers a request for "reproduce".
	 * - implies: the rule action entails another action.
	 *   A rule granting action X also covers action Y when X implies Y.
	 *   E.g. rule action "distribute" implying "reproduce" covers a request for "reproduce".
	 * @param ruleAction The action specified in the rule.
	 * @param requestedActionId The requested action identifier.
	 * @returns True if the rule action covers the requested action.
	 * @internal
	 */
	private ruleActionCoversRequested(
		ruleAction: OdrlActionType | string | IOdrlAction,
		requestedActionId: string,
		dataSources: { [prefix: string]: unknown }
	): boolean {
		// Extract the rule action ID — support both @id and rdf:value forms
		let ruleActionId: string | undefined;
		if (Is.string(ruleAction)) {
			ruleActionId = ruleAction;
		} else if (Is.object<IOdrlAction>(ruleAction)) {
			ruleActionId = ruleAction["rdf:value"]?.["@id"] ?? OdrlPolicyHelper.getUid(ruleAction);
		}

		// Determine whether this rule action covers the requested action via any semantic path.
		let covers = false;

		if (Is.stringValue(ruleActionId) && ruleActionId === requestedActionId) {
			// Exact match
			covers = true;
		} else if (Is.object<IOdrlAction>(ruleAction)) {
			// includedIn: rule action A includedIn B means A is a sub-type of B.
			// A rule that names the narrower action A with includedIn B also covers requests for B.
			if (Is.stringValue(ruleAction.includedIn) && ruleAction.includedIn === requestedActionId) {
				covers = true;
			}

			// implies: rule action A implies B means exercising A also entails B.
			// A rule granting A therefore also grants each implied action.
			if (!covers && (ruleAction.implies ?? []).includes(requestedActionId as OdrlActionType)) {
				covers = true;
			}
		}

		if (!covers) {
			return false;
		}

		// If the action specifies refinements, all must be satisfied for the action to apply.
		// Refinements constrain the manner in which the action is exercised (e.g. print count <= 5).
		if (Is.object<IOdrlAction>(ruleAction) && Is.notEmpty(ruleAction.refinement)) {
			const refinements = ArrayHelper.fromObjectOrArray<IOdrlConstraint | IOdrlLogicalConstraint>(
				ruleAction.refinement ?? []
			);
			return refinements.every((refinement: IOdrlConstraint | IOdrlLogicalConstraint) =>
				this.evaluateConstraint(refinement, dataSources)
			);
		}

		return true;
	}

	/**
	 * Apply a permission and create decisions based on that information.
	 * @param agreementAssigner The assigner ID from the agreement.
	 * @param agreementAssignee The assignee ID from the agreement.
	 * @param policy The policy containing the permission.
	 * @param permission The permission to apply.
	 * @param targetRefinements Additional constraints from target refinement.
	 * @param dataSources The operand lookup sources.
	 * @returns True if the permission applies.
	 * @internal
	 */
	private async evaluatePermission(
		agreementAssigner: string[] | undefined,
		agreementAssignee: string[] | undefined,
		policy: IRightsManagementPolicy,
		permission: IOdrlPermission,
		targetRefinements: (IOdrlConstraint | IOdrlLogicalConstraint)[],
		dataSources: { [prefix: string]: unknown },
		action?: OdrlActionType | string,
		decisionTarget?: string
	): Promise<boolean> {
		if (
			!this.isRuleApplicableToParties(permission, agreementAssigner, agreementAssignee, dataSources)
		) {
			return false;
		}

		// Check if the permission's action(s) match the requested action
		if (!this.isActionApplicable(permission.action, action, dataSources)) {
			return false;
		}

		// ODRL semantics: a Permission without constraints is unconditional.
		const constraints = [
			...ArrayHelper.fromObjectOrArray(permission.constraint ?? []),
			...targetRefinements
		];
		const permissionTargetLookup = this.tryResolveTargetDataSource(
			this.buildRuleDataContextTargetId(
				this.getRuleDataContextTargetId(permission.target),
				decisionTarget
			),
			dataSources,
			true
		);
		const ruleDataContext = permissionTargetLookup.value;
		if (constraints.length === 0) {
			return this.enforcePermissionDuties(policy, permission, dataSources, ruleDataContext);
		}

		// All constraints must be satisfied for the permission to apply.
		const constraintsSatisfied = constraints.every(c => this.evaluateConstraint(c, dataSources));

		if (!constraintsSatisfied) {
			return false;
		}

		return this.enforcePermissionDuties(policy, permission, dataSources, ruleDataContext);
	}

	/**
	 * Enforce duties attached to a permission.
	 * @param policy The policy being evaluated.
	 * @param permission The permission being evaluated.
	 * @param dataSources The operand lookup sources.
	 * @param ruleDataContext The target-scoped data context passed to enforcers.
	 * @returns True if all duties are enforced or none are present.
	 * @internal
	 */
	private async enforcePermissionDuties(
		policy: IRightsManagementPolicy,
		permission: IOdrlPermission,
		dataSources: { [prefix: string]: unknown },
		ruleDataContext?: unknown
	): Promise<boolean> {
		const duties = ArrayHelper.fromObjectOrArray(permission.duty ?? []);
		if (duties.length === 0) {
			return true;
		}

		for (const duty of duties) {
			const enforced = await this.enforceDuty(policy, duty, dataSources, ruleDataContext);
			if (!enforced) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Enforce a single duty using registered obligation enforcers.
	 * @param policy The policy being evaluated.
	 * @param duty The duty to enforce.
	 * @param dataSources The operand lookup sources.
	 * @param ruleDataContext The target-scoped data context passed to enforcers.
	 * @returns True if any enforcer succeeds.
	 * @internal
	 */
	private async enforceDuty(
		policy: IRightsManagementPolicy,
		duty: IOdrlDuty,
		dataSources: { [prefix: string]: unknown },
		ruleDataContext?: unknown
	): Promise<boolean> {
		const enforcerNames = PolicyObligationEnforcerFactory.names();
		const information = dataSources[
			`${DefaultPolicyArbiter._TWIN_PREFIX_OPERATIONS}${DefaultPolicyArbiter._TWIN_PREFIX_INFORMATION}`
		] as { [id: string]: IJsonLdNodeObject } | undefined;

		if (enforcerNames.length === 0) {
			throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "noObligationEnforcersRegistered");
		}

		for (const enforcerName of enforcerNames) {
			const enforcer = PolicyObligationEnforcerFactory.get(enforcerName);
			if (await enforcer.enforce(policy, duty, information, ruleDataContext)) {
				return true;
			}
		}

		const consequences = ArrayHelper.fromObjectOrArray<IOdrlDuty>(duty.consequence ?? []);
		if (consequences.length === 0) {
			return false;
		}

		for (const consequence of consequences) {
			if (!(await this.enforceDuty(policy, consequence, dataSources, ruleDataContext))) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Resolve a target string to a matching datasource prefix and remaining target value.
	 * @param targetId The target identifier to resolve.
	 * @param dataSources The available lookup sources.
	 * @param resolveValue True to resolve an item from the target path/key.
	 * @returns The matching prefix, source, remaining target and optional resolved value.
	 * @internal
	 */
	private tryResolveTargetDataSource(
		targetId: string | undefined,
		dataSources: { [prefix: string]: unknown },
		resolveValue: boolean = false
	): { prefix: string; source: unknown; target: string; value?: unknown } {
		// If there is no target id, default to the entire "twin:jsonpath" datasource
		if (Is.empty(targetId)) {
			return {
				prefix: `${DefaultPolicyArbiter._TWIN_PREFIX_OPERATIONS}${DefaultPolicyArbiter._TWIN_PREFIX_JSONPATH}`,
				source:
					dataSources[
						`${DefaultPolicyArbiter._TWIN_PREFIX_OPERATIONS}${DefaultPolicyArbiter._TWIN_PREFIX_JSONPATH}`
					],
				target: "$",
				value:
					dataSources[
						`${DefaultPolicyArbiter._TWIN_PREFIX_OPERATIONS}${DefaultPolicyArbiter._TWIN_PREFIX_JSONPATH}`
					]
			};
		}

		// Otherwise lookup the target id prefix in the datasources and return the remaining suffix as the target path/key
		const prefixes = Object.keys(dataSources).sort((a, b) => b.length - a.length);
		for (const prefix of prefixes) {
			if (targetId.startsWith(`${prefix}:`)) {
				const source = dataSources[prefix];
				const target = targetId.slice(prefix.length + 1);

				if (!target.startsWith("$")) {
					throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "ruleTargetNotSupported", {
						target: targetId
					});
				}

				if (!resolveValue) {
					return {
						prefix,
						source,
						target
					};
				}

				const matches = JsonPathHelper.query(target, source);
				if (matches.length === 0) {
					throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "ruleTargetNotSupported", {
						target: targetId
					});
				}

				return {
					prefix,
					source,
					target,
					value: matches.length === 1 ? matches[0].value : matches.map(m => m.value)
				};
			}
		}

		throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "ruleTargetNotSupported", {
			target: targetId
		});
	}

	/**
	 * Extract the target id from the permission.
	 * @param target The permission target.
	 * @returns The information key, or undefined when the target is not an information reference.
	 * @internal
	 */
	private getTargetId(target: IOdrlRule["target"]): string | undefined {
		if (Is.undefined(target)) {
			return undefined;
		}

		if (Is.array(target) && target.length > 1) {
			throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "multipleTargetsNotSupported");
		}

		const arr = ArrayHelper.fromObjectOrArray(target ?? []);
		if (arr.length === 0) {
			return undefined;
		}

		return Is.string(arr[0]) ? arr[0] : OdrlPolicyHelper.getUid(arr[0]);
	}

	/**
	 * Resolve the target identifier used for rule data context lookup.
	 * For AssetCollection targets the `source` property is used because the collection has no `uid`.
	 * Falls back to `getTargetId` for all other target forms.
	 * @param target The rule target field value.
	 * @returns The prefixed target string for data context resolution.
	 * @internal
	 */
	private getRuleDataContextTargetId(target: IOdrlRule["target"]): string | undefined {
		const arr = ArrayHelper.fromObjectOrArray(target ?? []);
		if (arr.length === 1) {
			const firstTarget = arr[0];
			if (
				Is.object<IOdrlAssetCollection>(firstTarget) &&
				OdrlPolicyHelper.getType(firstTarget) === OdrlTypes.AssetCollection &&
				Is.stringValue(firstTarget.source)
			) {
				return firstTarget.source;
			}
		}
		return this.getTargetId(target);
	}

	/**
	 * Build a concrete prefixed target id for rule data-context lookup.
	 * @param baseTargetId The original prefixed target id from the rule.
	 * @param decisionTarget The concrete decision JSONPath target.
	 * @returns The concrete prefixed target id.
	 * @internal
	 */
	private buildRuleDataContextTargetId(
		baseTargetId: string | undefined,
		decisionTarget: string | undefined
	): string | undefined {
		if (!Is.stringValue(decisionTarget) || decisionTarget === "$") {
			return baseTargetId;
		}

		if (!Is.stringValue(baseTargetId)) {
			return undefined;
		}

		const pathStartIndex = baseTargetId.indexOf(":$");
		if (pathStartIndex < 0) {
			return baseTargetId;
		}

		return `${baseTargetId.slice(0, pathStartIndex)}:${decisionTarget}`;
	}

	/**
	 * Resolve a rule target into a policy-decision JSONPath target and extracted refinements.
	 * For AssetCollection targets, `source` is treated as the decision target and `refinement`
	 * constraints are applied as additional rule constraints.
	 * @param rule The rule to resolve the target for.
	 * @returns The decision target and target refinements.
	 * @throws GeneralError if target is invalid or unsupported.
	 * @internal
	 */
	private resolveRuleTarget(
		rule: IOdrlRule,
		dataSources: { [prefix: string]: unknown }
	): {
		target: string;
		refinements: (IOdrlConstraint | IOdrlLogicalConstraint)[];
	} {
		const arr = ArrayHelper.fromObjectOrArray(rule.target ?? []);
		if (arr.length === 0) {
			return {
				target: "$",
				refinements: []
			};
		}

		if (arr.length > 1) {
			throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "multipleTargetsNotSupported");
		}

		const firstTarget = arr[0];

		if (Is.object<IOdrlAsset>(firstTarget)) {
			// Guard against unsupported ODRL asset properties
			if (Is.notEmpty(firstTarget.hasPolicy)) {
				throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "assetHasPolicyNotSupported");
			}
			if (Is.notEmpty(firstTarget.partOf)) {
				throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "assetPartOfNotSupported");
			}

			if (
				Is.object<IOdrlAssetCollection>(firstTarget) &&
				OdrlPolicyHelper.getType(firstTarget) === OdrlTypes.AssetCollection
			) {
				if (!Is.stringValue(firstTarget.source)) {
					throw new GeneralError(
						DefaultPolicyArbiter.CLASS_NAME,
						"assetCollectionSourceNotSupported",
						{
							source: firstTarget.source ?? ""
						}
					);
				}

				let sourceLookup: { prefix: string; source: unknown; target: string; value?: unknown };
				try {
					sourceLookup = this.tryResolveTargetDataSource(firstTarget.source, dataSources);
				} catch {
					throw new GeneralError(
						DefaultPolicyArbiter.CLASS_NAME,
						"assetCollectionSourceNotSupported",
						{
							source: firstTarget.source
						}
					);
				}

				return {
					target: sourceLookup.target,
					refinements: ArrayHelper.fromObjectOrArray(firstTarget.refinement ?? [])
				};
			}
		}

		const targetId = Is.string(firstTarget) ? firstTarget : OdrlPolicyHelper.getUid(firstTarget);
		if (!Is.stringValue(targetId)) {
			throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "ruleTargetNotSupported", {
				target: ""
			});
		}

		const targetLookup = this.tryResolveTargetDataSource(targetId, dataSources);

		return {
			target: targetLookup.target,
			refinements: []
		};
	}

	/**
	 * Resolve decision targets for a rule.
	 * AssetCollection wildcard targets with refinements are expanded to per-item targets.
	 * @param rule The rule being evaluated.
	 * @param dataSources The operand lookup sources.
	 * @returns The decision targets and scoped refinements.
	 * @internal
	 */
	private resolveRuleDecisionTargets(
		rule: IOdrlRule,
		dataSources: { [prefix: string]: unknown }
	): {
		target: string;
		refinements: (IOdrlConstraint | IOdrlLogicalConstraint)[];
	}[] {
		const resolvedTarget = this.resolveRuleTarget(rule, dataSources);

		if (!this.shouldExpandToPerItemTargets(rule, resolvedTarget)) {
			return [resolvedTarget];
		}

		const sourceLookup = this.tryResolveTargetDataSource(
			this.getRuleDataContextTargetId(rule.target),
			dataSources
		);
		const matches = JsonPathHelper.query(sourceLookup.target, sourceLookup.source);
		if (matches.length === 0) {
			return [resolvedTarget];
		}

		return matches.map(match => {
			const itemTarget = this.normalizeDecisionTargetPath(match.path ?? resolvedTarget.target);
			return {
				target: itemTarget,
				refinements: resolvedTarget.refinements.map(refinement =>
					this.rewriteRefinementForDecisionTarget(refinement, resolvedTarget.target, itemTarget)
				)
			};
		});
	}

	/**
	 * Determine if a rule should be expanded to per-item targets.
	 * @param rule The rule.
	 * @param resolvedTarget The resolved target details.
	 * @returns True if the rule should emit per-item decisions.
	 * @internal
	 */
	private shouldExpandToPerItemTargets(
		rule: IOdrlRule,
		resolvedTarget: {
			target: string;
			refinements: (IOdrlConstraint | IOdrlLogicalConstraint)[];
		}
	): boolean {
		if (resolvedTarget.refinements.length === 0 || !resolvedTarget.target.includes("[*]")) {
			return false;
		}

		const targets = ArrayHelper.fromObjectOrArray(rule.target ?? []);
		if (targets.length !== 1 || !Is.object<IOdrlAssetCollection>(targets[0])) {
			return false;
		}

		return OdrlPolicyHelper.getType(targets[0]) === OdrlTypes.AssetCollection;
	}

	/**
	 * Rewrite a refinement so wildcard paths are scoped to a concrete item target.
	 * @param refinement The refinement to rewrite.
	 * @param sourceTarget The wildcard source target.
	 * @param itemTarget The concrete item target.
	 * @returns The rewritten refinement.
	 * @internal
	 */
	private rewriteRefinementForDecisionTarget(
		refinement: IOdrlConstraint | IOdrlLogicalConstraint,
		sourceTarget: string,
		itemTarget: string
	): IOdrlConstraint | IOdrlLogicalConstraint {
		const logicalConstraint = this.getLogicalConstraintOperands(refinement);
		if (logicalConstraint) {
			return {
				...refinement,
				[logicalConstraint.operator]: logicalConstraint.constraints.map(item =>
					this.rewriteRefinementForDecisionTarget(item, sourceTarget, itemTarget)
				)
			} as IOdrlLogicalConstraint;
		}

		const regularConstraint = refinement as IOdrlConstraint;
		return {
			...regularConstraint,
			leftOperand: this.rewriteOperandForDecisionTarget(
				regularConstraint.leftOperand,
				sourceTarget,
				itemTarget
			) as IOdrlConstraint["leftOperand"],
			rightOperand: this.rewriteOperandForDecisionTarget(
				regularConstraint.rightOperand,
				sourceTarget,
				itemTarget
			)
		};
	}

	/**
	 * Rewrite JSONPath-based operands from wildcard source to concrete item target.
	 * @param operand The operand to rewrite.
	 * @param sourceTarget The wildcard source target.
	 * @param itemTarget The concrete item target.
	 * @returns The rewritten operand.
	 * @internal
	 */
	private rewriteOperandForDecisionTarget(
		operand: IOdrlConstraint["leftOperand"] | IOdrlConstraint["rightOperand"] | string,
		sourceTarget: string,
		itemTarget: string
	): IOdrlConstraint["leftOperand"] | IOdrlConstraint["rightOperand"] | string {
		if (Is.stringValue(operand)) {
			const prefix = `${DefaultPolicyArbiter._TWIN_PREFIX_OPERATIONS}${DefaultPolicyArbiter._TWIN_PREFIX_JSONPATH}:`;
			if (operand.startsWith(prefix)) {
				const valuePath = operand.slice(prefix.length);
				return `${prefix}${this.rewriteWildcardPath(valuePath, sourceTarget, itemTarget)}`;
			}
			return operand;
		}

		if (Is.object<{ "@type": unknown; "@value": unknown }>(operand)) {
			const typedOperand = { ...operand };
			if (
				typedOperand["@type"] ===
					`${DefaultPolicyArbiter._TWIN_PREFIX_OPERATIONS}${DefaultPolicyArbiter._TWIN_PREFIX_JSONPATH}` &&
				Is.stringValue(typedOperand["@value"])
			) {
				typedOperand["@value"] = this.rewriteWildcardPath(
					typedOperand["@value"],
					sourceTarget,
					itemTarget
				);
			}
			return typedOperand;
		}

		return operand;
	}

	/**
	 * Rewrite wildcard source JSONPath segments to a concrete item JSONPath.
	 * @param valuePath The operand path.
	 * @param sourceTarget The wildcard source path.
	 * @param itemTarget The concrete item path.
	 * @returns The rewritten path.
	 * @internal
	 */
	private rewriteWildcardPath(valuePath: string, sourceTarget: string, itemTarget: string): string {
		if (!sourceTarget.includes("[*]") || !valuePath.includes("[*]")) {
			return valuePath;
		}

		if (valuePath.startsWith(sourceTarget)) {
			return `${itemTarget}${valuePath.slice(sourceTarget.length)}`;
		}

		return valuePath;
	}

	/**
	 * Normalize JSONPath strings to dot notation for stable decision targets.
	 * @param path The JSONPath to normalize.
	 * @returns The normalized path.
	 * @internal
	 */
	private normalizeDecisionTargetPath(path: string): string {
		return path.replace(/\['([^']+)']/g, ".$1");
	}

	/**
	 * Evaluate a single ODRL constraint against the available context.
	 * Supports logical constraint composition through nested refinements.
	 * @param constraint The constraint to evaluate.
	 * @param dataSources The operand lookup sources.
	 * @returns True if the constraint is satisfied.
	 * @internal
	 */
	private evaluateConstraint(
		constraint: IOdrlConstraint | IOdrlLogicalConstraint,
		dataSources: { [prefix: string]: unknown }
	): boolean {
		const logicalConstraint = this.getLogicalConstraintOperands(constraint);
		if (logicalConstraint) {
			return this.evaluateLogicalConstraint(logicalConstraint, dataSources);
		}

		// Must be a regular constraint beyond this point
		const regularConstraint = constraint as IOdrlConstraint;

		// rightOperandReference is not supported — it requires an external IRI lookup that
		// is outside the scope of the local evaluation engine.
		if (Is.notEmpty(regularConstraint.rightOperandReference)) {
			throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "rightOperandReferenceNotSupported");
		}

		// dataType specifies how the rightOperand value should be coerced before comparison.
		// Without dataType-aware coercion logic the comparison may produce incorrect results.
		if (Is.notEmpty(regularConstraint.dataType)) {
			throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "constraintDataTypeNotSupported");
		}

		// unit specifies the measurement unit for the right operand (e.g. currency, length).
		// Unit-aware comparison is not implemented.
		if (Is.notEmpty(regularConstraint.unit)) {
			throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "constraintUnitNotSupported");
		}

		// status represents a state-based evaluation operand (e.g. odrl:policyUsage).
		// State-based evaluation is not implemented.
		if (Is.notEmpty(regularConstraint.status)) {
			throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "constraintStatusNotSupported");
		}

		// Evaluate the main constraint condition
		const leftValue = this.calculateOperandValue(regularConstraint.leftOperand, dataSources);
		const rightValue = this.calculateOperandValue(regularConstraint.rightOperand, dataSources);
		const mainSatisfied = this.evaluateOperator(regularConstraint.operator, leftValue, rightValue);

		// If main constraint is not satisfied, the overall constraint fails
		return mainSatisfied;
	}

	/**
	 * Extract logical constraint operands when present.
	 * @param constraint The constraint to inspect.
	 * @returns The logical operator and its operands, or undefined when not logical.
	 * @throws GeneralError if logical constraint operands are not unique.
	 * @internal
	 */
	private getLogicalConstraintOperands(constraint: IOdrlConstraint | IOdrlLogicalConstraint):
		| {
				operator: OdrlLogicalConstraintType;
				constraints: (IOdrlConstraint | IOdrlLogicalConstraint)[];
		  }
		| undefined {
		const logicalConstraint = constraint as IOdrlLogicalConstraint;
		const operators: OdrlLogicalConstraintType[] = Object.values(OdrlLogicalConstraintType);
		for (const operator of operators) {
			const value = logicalConstraint[operator];
			if (!Is.undefined(value)) {
				const constraints = this.normalizeLogicalConstraintOperands(value);
				this.validateLogicalConstraintOperandUniqueness(constraints, operator);
				return {
					operator,
					constraints
				};
			}
		}

		return undefined;
	}

	/**
	 * Normalize logical constraint operands into a constraint array.
	 * Handles both IOdrlConstraint and IOdrlLogicalConstraint types.
	 * @param raw The raw operand value.
	 * @returns The constraint array.
	 * @internal
	 */
	private normalizeLogicalConstraintOperands(
		raw: unknown
	): (IOdrlConstraint | IOdrlLogicalConstraint)[] {
		let normalized = raw;
		if (
			Is.object<IOdrlLogicalConstraintOperand>(normalized) &&
			!Is.undefined(normalized["@list"])
		) {
			normalized = normalized["@list"];
		}

		return (ArrayHelper.fromObjectOrArray(normalized) ?? [])
			.filter(item => Is.object(item))
			.map(item => item as IOdrlConstraint | IOdrlLogicalConstraint);
	}

	/**
	 * Validate that all operands in a logical constraint are unique.
	 * ODRL spec 2.5.2 requires that all operand values MUST be unique Constraint instances.
	 * Uniqueness is checked by uid property and id property.
	 * @param constraints The constraint operands to validate.
	 * @param operator The logical operator type (for error messaging).
	 * @throws GeneralError if duplicate constraints are found.
	 * @internal
	 */
	private validateLogicalConstraintOperandUniqueness(
		constraints: (IOdrlConstraint | IOdrlLogicalConstraint)[],
		operator: OdrlLogicalConstraintType
	): void {
		const seenIdentifiers = new Set<string>();

		for (let i = 0; i < constraints.length; i++) {
			const constraint = constraints[i];
			const identifier = OdrlPolicyHelper.getUid(constraint);

			// If we have an identifier, check for duplicates
			if (Is.stringValue(identifier)) {
				if (seenIdentifiers.has(identifier)) {
					throw new GeneralError(
						DefaultPolicyArbiter.CLASS_NAME,
						"logicalConstraintOperandNotUnique",
						{
							operator,
							identifier,
							index: i
						}
					);
				}
				seenIdentifiers.add(identifier);
			}
		}
	}

	/**
	 * Evaluate a logical constraint operator against its operands.
	 * @param logicalConstraint The operator and operand list.
	 * @param dataSources The operand lookup sources.
	 * @returns True if the logical constraint is satisfied.
	 * @internal
	 */
	private evaluateLogicalConstraint(
		logicalConstraint: {
			operator: OdrlLogicalConstraintType;
			constraints: (IOdrlConstraint | IOdrlLogicalConstraint)[];
		},
		dataSources: { [prefix: string]: unknown }
	): boolean {
		const { operator, constraints } = logicalConstraint;
		if (constraints.length === 0) {
			return false;
		}

		switch (operator) {
			case OdrlLogicalConstraintType.And:
				return constraints.every(item => this.evaluateConstraint(item, dataSources));
			case OdrlLogicalConstraintType.AndSequence: {
				for (const item of constraints) {
					if (!this.evaluateConstraint(item, dataSources)) {
						return false;
					}
				}
				return true;
			}
			case OdrlLogicalConstraintType.Or:
				return constraints.some(item => this.evaluateConstraint(item, dataSources));
			case OdrlLogicalConstraintType.Xone: {
				let satisfied = 0;
				for (const item of constraints) {
					if (this.evaluateConstraint(item, dataSources)) {
						satisfied += 1;
						if (satisfied > 1) {
							return false;
						}
					}
				}
				return satisfied === 1;
			}
			default:
				return false;
		}
	}

	/**
	 * Resolve a prefixed operand to its source object and JSONPath expression.
	 * Prefix matching is dictionary-driven so additional operand namespaces can be
	 * added in one place by extending the lookup sources map.
	 * @param operandTypeOrValue The string operand value or typed operand namespace.
	 * @param operandValue The JSONPath expression.
	 * @param dataSources The available lookup sources.
	 * @returns The resolved source and JSONPath, or undefined when not namespaced.
	 * @throws GeneralError if a twin: prefixed operand doesn't resolve to any available datasource key.
	 * @internal
	 */
	private tryResolveOperandLookup(
		operandTypeOrValue: string,
		operandValue: unknown,
		dataSources: { [prefix: string]: unknown }
	): { source: unknown; jsonPath: string } | undefined {
		let lookupTargetId: string | undefined;

		if (dataSources[operandTypeOrValue]) {
			if (!Is.stringValue(operandValue)) {
				return undefined;
			}

			lookupTargetId = `${operandTypeOrValue}:${operandValue}`;
		} else if (operandTypeOrValue.includes(":")) {
			lookupTargetId = operandTypeOrValue;
		} else {
			return undefined;
		}

		// Delegate prefixed path matching to shared datasource resolver
		if (operandTypeOrValue.startsWith(DefaultPolicyArbiter._TWIN_PREFIX_OPERATIONS)) {
			const resolved = this.tryResolveTargetDataSource(lookupTargetId, dataSources);
			return {
				source: resolved.source,
				jsonPath: resolved.target
			};
		}
	}

	/**
	 * Calculate an operand value.
	 * @param operand The operand.
	 * @param dataSources The available prefixed operand sources.
	 * @returns The resolved operand value.
	 * @internal
	 */
	private calculateOperandValue(
		operand: IOdrlConstraint["leftOperand"] | IOdrlConstraint["rightOperand"] | string,
		dataSources: { [prefix: string]: unknown }
	): unknown {
		// Treat prefixed operands as selectors against a namespaced source dictionary.
		// Examples: twin:jsonpath:$.field, twin:information:$.credentials.level
		let jsonPath: string | undefined;
		let operandRoot: unknown;
		if (Is.stringValue(operand)) {
			const lookup = this.tryResolveOperandLookup(operand, operand, dataSources);
			if (lookup) {
				jsonPath = lookup.jsonPath;
				operandRoot = lookup.source;
			}
		} else if (Is.object<{ "@type": unknown; "@value": unknown }>(operand)) {
			// Is this an object { "@value": "18", "@type": "xsd:integer" } ?
			const value = operand["@value"];
			const type = operand["@type"];
			if (Is.stringValue(type)) {
				const lookup = this.tryResolveOperandLookup(type, value, dataSources);
				if (lookup) {
					jsonPath = lookup.jsonPath;
					operandRoot = lookup.source;
				} else {
					const xsdValue = this.coerceXsdType(value, type);
					if (!Is.undefined(xsdValue)) {
						return xsdValue;
					}
				}
			}
		}

		// We have a JSON Path to resolve
		if (Is.stringValue(jsonPath)) {
			const jsonPaths = JsonPathHelper.query(jsonPath, operandRoot);
			if (jsonPaths.length === 0) {
				// No matches
				return undefined;
			} else if (jsonPaths.length === 1) {
				// Single match - return the value directly
				return jsonPaths[0].value;
			}

			// Multiple matches - return array of values
			return jsonPaths.map(p => p.value);
		}

		// Not JSON Path or object value so return as is
		return operand;
	}

	/**
	 * Evaluate an ODRL operator against resolved operands.
	 * @param operator The operator.
	 * @param left The resolved left operand.
	 * @param right The resolved right operand.
	 * @returns True if the comparison is satisfied.
	 * @internal
	 */
	private evaluateOperator(operator: OdrlOperatorType, left: unknown, right: unknown): boolean {
		// Handle array/collection left values (e.g. JSONPath returning multiple matches).
		const leftValues = ArrayHelper.fromObjectOrArray(left ?? []);

		switch (operator) {
			case OdrlOperatorType.Eq:
				return leftValues.some(v => ObjectHelper.equal(v, right, false));
			case OdrlOperatorType.Neq:
				return leftValues.every(v => !ObjectHelper.equal(v, right, false));
			case OdrlOperatorType.Gt:
				return leftValues.some(v => this.compareOrdered(v, right, (a, b) => a > b));
			case OdrlOperatorType.Gteq:
				return leftValues.some(v => this.compareOrdered(v, right, (a, b) => a >= b));
			case OdrlOperatorType.Lt:
				return leftValues.some(v => this.compareOrdered(v, right, (a, b) => a < b));
			case OdrlOperatorType.Lteq:
				return leftValues.some(v => this.compareOrdered(v, right, (a, b) => a <= b));
			case OdrlOperatorType.IsAnyOf: {
				return leftValues.some(v => {
					const stringValue =
						typeof v === "string" || typeof v === "number" || typeof v === "boolean"
							? String(v)
							: JSON.stringify(v);
					return (ArrayHelper.fromObjectOrArray(right) ?? []).includes(stringValue);
				});
			}
			case OdrlOperatorType.IsAllOf: {
				return ObjectHelper.equal(leftValues, ArrayHelper.fromObjectOrArray(right) ?? [], false);
			}
			case OdrlOperatorType.IsNoneOf: {
				return leftValues.every(v => !(ArrayHelper.fromObjectOrArray(right) ?? []).includes(v));
			}
			case OdrlOperatorType.LocTimeEq:
				return leftValues.some(v => ObjectHelper.equal(v, right, false));
			case OdrlOperatorType.LocTimeGteq:
				return leftValues.some(v => this.compareOrdered(v, right, (a, b) => a >= b));
			case OdrlOperatorType.IsA:
			case OdrlOperatorType.HasPart:
			case OdrlOperatorType.IsPartOf:
				// For now, treat these as simple equality/ordering semantics where meaningful.
				// Profiles can introduce richer semantics via additional arbiters.
				return leftValues.some(v => ObjectHelper.equal(v, right, false));
			default:
				return false;
		}
	}

	/**
	 * Compare values with numeric/date/string coercion.
	 * @param left The left value.
	 * @param right The right value.
	 * @param compare Comparison operator.
	 * @returns True if ordered comparison passes.
	 * @internal
	 */
	private compareOrdered(
		left: unknown,
		right: unknown,
		compare: (a: number, b: number) => boolean
	): boolean {
		const leftNum = Coerce.number(left);
		const rightNum = Coerce.number(right);
		if (!Is.undefined(leftNum) && !Is.undefined(rightNum)) {
			return compare(leftNum, rightNum);
		}
		const leftDate = Coerce.dateTime(left);
		const rightDate = Coerce.dateTime(right);
		if (!Is.undefined(leftDate) && !Is.undefined(rightDate)) {
			return compare(leftDate.getTime(), rightDate.getTime());
		}

		// Only use string ordering when both operands are actual strings.
		// Avoid coercing other types into strings, as that can cause
		// unintended comparisons like 18 >= "$.minAge" evaluating to true.
		if (Is.string(left) && Is.string(right)) {
			return compare(left.localeCompare(right), 0);
		}

		return false;
	}

	/**
	 * Coerce a value to a specific XSD type.
	 * @param value The value to coerce.
	 * @param type The XSD type.
	 * @returns The coerced value, or undefined when coercion is not possible.
	 * @internal
	 */
	private coerceXsdType(value: unknown, type: string): unknown {
		if (
			[
				"xsd:string",
				"xsd:normalizedString",
				"xsd:token",
				"xsd:anyURI",
				"xsd:QName",
				"xsd:NOTATION"
			].includes(type)
		) {
			// Handle standard xsd types
			return Coerce.string(value);
		} else if (
			[
				"xsd:integer",
				"xsd:decimal",
				"xsd:float",
				"xsd:double",
				"xsd:long",
				"xsd:int",
				"xsd:short",
				"xsd:byte"
			].includes(type)
		) {
			// Handle standard xsd types
			return Coerce.number(value);
		} else if (type === "xsd:boolean") {
			// Handle standard xsd types
			return Coerce.boolean(value);
		} else if (["xsd:date", "xsd:dateTime", "xsd:time"].includes(type)) {
			// Handle standard xsd types
			return Coerce.dateTime(value);
		}
		return undefined;
	}
}
