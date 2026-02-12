// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	ArrayHelper,
	Coerce,
	ComponentFactory,
	GeneralError,
	Guards,
	Is,
	ObjectHelper
} from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { JsonPathHelper } from "@twin.org/data-json-path";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	PolicyDecision,
	PolicyObligationEnforcerFactory,
	type IPolicyAdministrationPointComponent,
	type IPolicyArbiter,
	type IPolicyDecision
} from "@twin.org/rights-management-models";
import {
	ConflictStrategyType,
	LogicalConstraintType,
	OperatorType,
	type ActionType,
	type IOdrlAgreement,
	type IOdrlConstraint,
	type IOdrlDuty,
	type IOdrlLogicalConstraint,
	type IOdrlLogicalConstraintOperand,
	type IOdrlPermission,
	type IOdrlPolicy,
	type IOdrlProhibition,
	type IOdrlRule
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
	 * Type indicating the operand type is JSONPath.
	 * @internal
	 */
	private static readonly _JSON_PATH_TYPE = "jsonpath";

	/**
	 * Prefix indicating the operand encodes a JSONPath.
	 * @internal
	 */
	private static readonly _JSON_PATH_OPERAND_PREFIX = `twin:${DefaultPolicyArbiter._JSON_PATH_TYPE}`;

	/**
	 * Prefix indicating the permission target references an item in the information map.
	 * @internal
	 */
	private static readonly _INFORMATION_TARGET_PREFIX = "twin:information:";

	/**
	 * Default maximum inheritance depth.
	 * @internal
	 */
	private static readonly _DEFAULT_MAX_INHERITANCE_DEPTH = 10;

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
		agreement: IOdrlAgreement,
		information?: { [id: string]: IJsonLdNodeObject },
		data?: D,
		action?: ActionType | string
	): Promise<IPolicyDecision[]> {
		Guards.object<IOdrlAgreement>(DefaultPolicyArbiter.CLASS_NAME, nameof(agreement), agreement);

		await this._logging.log({
			level: "info",
			source: DefaultPolicyArbiter.CLASS_NAME,
			ts: Date.now(),
			message: "decidingPolicy",
			data: {
				policyId: agreement.uid
			}
		});

		// Resolve and merge inherited policies.
		const mergedPolicy = await this.mergeInheritedPolicies(agreement);

		// Extract agreement parties once for use in rule evaluation
		const agreementAssigner = OdrlPolicyHelper.getPartyIds(agreement.assigner);
		const agreementAssignee = OdrlPolicyHelper.getPartyIds(agreement.assignee);

		// ODRL-style rule evaluation:
		// - Permission rules authorize if ANY applicable permission matches (OR across permissions).
		// - Default to denied when there are no permissions (closed-world for access control).
		// - Conflict strategy controls how applicable permissions/prohibitions are resolved.
		const permissions = ArrayHelper.fromObjectOrArray(mergedPolicy.permission ?? []);
		let permissionApplies = false;
		if (permissions.length > 0) {
			for (const permission of permissions) {
				if (
					await this.evaluatePermission(
						agreementAssigner,
						agreementAssignee,
						mergedPolicy,
						permission,
						information,
						data,
						action
					)
				) {
					permissionApplies = true;
					break;
				}
			}
		}

		const prohibitions = ArrayHelper.fromObjectOrArray<IOdrlProhibition>(
			mergedPolicy.prohibition ?? []
		);
		let prohibitionApplies = false;
		for (const prohibition of prohibitions) {
			if (
				this.evaluateProhibition(agreementAssigner, agreementAssignee, prohibition, data, action)
			) {
				prohibitionApplies = true;
				break;
			}
		}

		const conflictStrategy = mergedPolicy.conflict ?? ConflictStrategyType.Invalid;
		let decision: PolicyDecision;
		if (permissionApplies && prohibitionApplies) {
			switch (conflictStrategy) {
				case ConflictStrategyType.Perm:
					decision = PolicyDecision.Granted;
					break;
				case ConflictStrategyType.Prohibit:
				case ConflictStrategyType.Invalid:
				default:
					decision = PolicyDecision.Denied;
					break;
			}
		} else {
			decision = permissionApplies ? PolicyDecision.Granted : PolicyDecision.Denied;
		}

		return [{ target: "$", decision }];
	}

	/**
	 * Evaluate whether a prohibition applies.
	 * @param agreementAssigner The assigner ID from the agreement.
	 * @param agreementAssignee The assignee ID from the agreement.
	 * @param prohibition The prohibition to evaluate.
	 * @param data The request data/context.
	 * @param action Optional action to check against the prohibition's applicable actions.
	 * @returns True if the prohibition applies.
	 * @internal
	 */
	private evaluateProhibition(
		agreementAssigner: string[] | undefined,
		agreementAssignee: string[] | undefined,
		prohibition: IOdrlProhibition,
		data?: unknown,
		action?: ActionType | string
	): boolean {
		if (!this.isRuleApplicableToParties(prohibition, agreementAssigner, agreementAssignee)) {
			return false;
		}

		// Check if the prohibition's action(s) match the requested action
		if (!this.isActionApplicable(prohibition.action, action)) {
			return false;
		}

		// ODRL semantics: a rule without constraints is unconditional.
		const constraints = ArrayHelper.fromObjectOrArray(prohibition.constraint ?? []);
		if (constraints.length === 0) {
			return true;
		}

		return constraints.every(c => this.evaluateConstraint(c, data));
	}

	/**
	 * Merge inherited policies into the current policy.
	 * Inherited policies' permissions, prohibitions, and obligations are combined with the current policy's rules.
	 * @param policy The policy to evaluate.
	 * @returns A new policy with merged rules from all ancestors.
	 * @internal
	 */
	private async mergeInheritedPolicies(policy: IOdrlPolicy): Promise<IOdrlPolicy> {
		const visitedPolicyIds: string[] = [];
		visitedPolicyIds.push(policy.uid);
		const inheritedPolicies = await this.resolveInheritedPolicies(policy, visitedPolicyIds, 0);
		const conflictStrategies = new Set<string>();
		if (Is.stringValue(policy.conflict)) {
			conflictStrategies.add(policy.conflict);
		}

		// Start with copies of the current policy's rules
		const mergedPermissions: IOdrlPermission[] = ArrayHelper.fromObjectOrArray(
			policy.permission ?? []
		).map(permission => this.applyPolicyPartiesToRule(policy, permission));

		const mergedProhibitions: IOdrlProhibition[] = ArrayHelper.fromObjectOrArray(
			policy.prohibition ?? []
		).map(prohibition => this.applyPolicyPartiesToRule(policy, prohibition));

		const mergedObligations: IOdrlDuty[] = ArrayHelper.fromObjectOrArray(
			policy.obligation ?? []
		).map(obligation => this.applyPolicyPartiesToRule(policy, obligation));

		// Merge rules from each inherited policy
		for (const inheritedPolicy of inheritedPolicies) {
			if (Is.stringValue(inheritedPolicy.conflict)) {
				conflictStrategies.add(inheritedPolicy.conflict);
			}
			const inheritedPermissions = ArrayHelper.fromObjectOrArray(inheritedPolicy.permission ?? []);
			if (inheritedPermissions.length > 0) {
				mergedPermissions.push(
					...inheritedPermissions.map(permission =>
						this.applyPolicyPartiesToRule(inheritedPolicy, permission)
					)
				);
			}

			const inheritedProhibitions = ArrayHelper.fromObjectOrArray(
				inheritedPolicy.prohibition ?? []
			);
			if (inheritedProhibitions.length > 0) {
				mergedProhibitions.push(
					...inheritedProhibitions.map(prohibition =>
						this.applyPolicyPartiesToRule(inheritedPolicy, prohibition)
					)
				);
			}

			const inheritedObligations = ArrayHelper.fromObjectOrArray(inheritedPolicy.obligation ?? []);
			if (inheritedObligations.length > 0) {
				mergedObligations.push(
					...inheritedObligations.map(obligation =>
						this.applyPolicyPartiesToRule(inheritedPolicy, obligation)
					)
				);
			}
		}

		let mergedConflict: IOdrlPolicy["conflict"] | undefined;
		if (conflictStrategies.size === 1) {
			mergedConflict = Array.from(conflictStrategies)[0] as IOdrlPolicy["conflict"];
		} else if (conflictStrategies.size > 1) {
			mergedConflict = ConflictStrategyType.Invalid;
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
	 * Detects circular inheritance and throws an exception if detected.
	 * @param policy The policy that may have inheritFrom references.
	 * @param visitedPolicyIds Array of policy UIDs already visited in this inheritance chain.
	 * @returns Array of inherited policies fetched from the PAP.
	 * @throws GeneralError if a parent policy cannot be found or if circular inheritance is detected.
	 * @internal
	 */
	private async resolveInheritedPolicies(
		policy: IOdrlPolicy,
		visitedPolicyIds: string[],
		currentDepth: number
	): Promise<IOdrlPolicy[]> {
		const inheritedPolicies: IOdrlPolicy[] = [];

		// If policy has no inheritFrom, return empty array
		if (Is.empty(policy.inheritFrom)) {
			return inheritedPolicies;
		}

		const inheritFromIds = ArrayHelper.fromObjectOrArray<string>(policy.inheritFrom) ?? [];

		for (const inheritFromId of inheritFromIds) {
			const nextDepth = currentDepth + 1;
			if (nextDepth > this._maxInheritanceDepth) {
				throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "maxInheritanceDepthExceeded", {
					policyId: policy.uid,
					inheritFromId,
					maxInheritanceDepth: this._maxInheritanceDepth
				});
			}

			// Check for circular inheritance
			if (visitedPolicyIds.includes(inheritFromId)) {
				throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "circularInheritanceDetected", {
					policyId: policy.uid,
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
	 * Apply policy-level assigner/assignee values to rules that don't override them.
	 * @param policy The policy providing defaults.
	 * @param rule The rule to apply defaults to.
	 * @returns The rule with policy-level assigner/assignee applied.
	 * @internal
	 */
	private applyPolicyPartiesToRule<T extends IOdrlRule>(policy: IOdrlPolicy, rule: T): T {
		const assigner = Is.empty(rule.assigner) ? policy.assigner : rule.assigner;
		const assignee = Is.empty(rule.assignee) ? policy.assignee : rule.assignee;

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

		if (assignerEqual && assigneeEqual) {
			return rule;
		}

		return {
			...rule,
			assigner,
			assignee
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
		agreementAssignee: string[] | undefined
	): boolean {
		const ruleAssigners = OdrlPolicyHelper.getPartyIds(rule.assigner);
		const ruleAssignees = OdrlPolicyHelper.getPartyIds(rule.assignee);

		if (!this.isPartyApplicable(ruleAssigners, agreementAssigner)) {
			return false;
		}

		if (!this.isPartyApplicable(ruleAssignees, agreementAssignee)) {
			return false;
		}

		return true;
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
		requestedAction?: ActionType | string
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

		// Both rule actions and requested action are specified - check for match
		const ruleActionArray = ArrayHelper.fromObjectOrArray(ruleActions) ?? [];

		// Check if the requested action matches any of the rule's actions
		for (const ruleAction of ruleActionArray) {
			const ruleActionId = Is.string(ruleAction)
				? ruleAction
				: ((ruleAction as IJsonLdNodeObject).uid ?? (ruleAction as IJsonLdNodeObject)["@id"]);
			const requestedActionId = Is.string(requestedAction)
				? requestedAction
				: ((requestedAction as IJsonLdNodeObject)?.uid ??
					(requestedAction as IJsonLdNodeObject)?.["@id"]);

			if (Is.stringValue(ruleActionId) && Is.stringValue(requestedActionId)) {
				if (ruleActionId === requestedActionId) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Apply a permission and create decisions based on that information.
	 * @param agreementAssigner The assigner ID from the agreement.
	 * @param agreementAssignee The assignee ID from the agreement.
	 * @param policy The policy containing the permission.
	 * @param permission The permission to apply.
	 * @param information Additional facts provided by the PIP.
	 * @param data The request data/context.
	 * @returns True if the permission applies.
	 * @internal
	 */
	private async evaluatePermission(
		agreementAssigner: string[] | undefined,
		agreementAssignee: string[] | undefined,
		policy: IOdrlPolicy,
		permission: IOdrlPermission,
		information?: { [id: string]: IJsonLdNodeObject },
		data?: unknown,
		action?: ActionType | string
	): Promise<boolean> {
		if (!this.isRuleApplicableToParties(permission, agreementAssigner, agreementAssignee)) {
			return false;
		}

		// Check if the permission's action(s) match the requested action
		if (!this.isActionApplicable(permission.action, action)) {
			return false;
		}

		// ODRL semantics: a Permission without constraints is unconditional.
		const constraints = ArrayHelper.fromObjectOrArray(permission.constraint ?? []);
		if (constraints.length === 0) {
			return this.enforcePermissionDuties(policy, permission, information, data);
		}

		// Resolve the data context for evaluating this permission.
		// If the target starts with twin:information:<key>, the key references an entry in the information map.
		const ruleDataContext = this.resolveRuleDataContext(permission, information, data);

		// All constraints must be satisfied for the permission to apply.
		const constraintsSatisfied = constraints.every(c =>
			this.evaluateConstraint(c, ruleDataContext)
		);

		if (!constraintsSatisfied) {
			return false;
		}

		return this.enforcePermissionDuties(policy, permission, information, ruleDataContext);
	}

	/**
	 * Enforce duties attached to a permission.
	 * @param policy The policy being evaluated.
	 * @param permission The permission being evaluated.
	 * @param information Additional facts provided by the PIP.
	 * @param data The request data/context.
	 * @returns True if all duties are enforced or none are present.
	 * @internal
	 */
	private async enforcePermissionDuties(
		policy: IOdrlPolicy,
		permission: IOdrlPermission,
		information?: { [id: string]: IJsonLdNodeObject },
		data?: unknown
	): Promise<boolean> {
		const duties = ArrayHelper.fromObjectOrArray(permission.duty ?? []);
		if (duties.length === 0) {
			return true;
		}

		for (const duty of duties) {
			const enforced = await this.enforceDuty(policy, duty, information, data);
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
	 * @param information Additional facts provided by the PIP.
	 * @param data The request data/context.
	 * @returns True if any enforcer succeeds.
	 * @internal
	 */
	private async enforceDuty(
		policy: IOdrlPolicy,
		duty: IOdrlDuty,
		information?: { [id: string]: IJsonLdNodeObject },
		data?: unknown
	): Promise<boolean> {
		const enforcerNames = PolicyObligationEnforcerFactory.names();

		if (enforcerNames.length === 0) {
			throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "noObligationEnforcersRegistered");
		}

		for (const enforcerName of enforcerNames) {
			const enforcer = PolicyObligationEnforcerFactory.get(enforcerName);
			if (await enforcer.enforce(policy, duty, information, data)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Resolve the data context used when evaluating a permission's constraints.
	 * If the permission target is `twin:information:<key>`, the key references an entry in the information map.
	 * @param rule The permission being evaluated.
	 * @param information Additional facts provided by the PIP.
	 * @param data The request data/context.
	 * @returns The data context to use for JSONPath resolution.
	 * @throws GeneralError When the information target key is missing.
	 * @internal
	 */
	private resolveRuleDataContext(
		rule: IOdrlRule,
		information?: { [id: string]: IJsonLdNodeObject },
		data?: unknown
	): unknown {
		const targetId = this.getTargetId(rule.target);

		if (targetId?.startsWith(DefaultPolicyArbiter._INFORMATION_TARGET_PREFIX)) {
			const key = targetId.slice(DefaultPolicyArbiter._INFORMATION_TARGET_PREFIX.length);
			if (Is.empty(key) || Is.empty(information?.[key])) {
				throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "informationTargetMissing", {
					key
				});
			}

			return information[key];
		}

		return data;
	}

	/**
	 * Extract the target id from the permission.
	 * @param target The permission target.
	 * @returns The information key, or undefined when the target is not an information reference.
	 * @internal
	 */
	private getTargetId(target: IOdrlPermission["target"]): string | undefined {
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

		return Is.string(arr[0]) ? arr[0] : arr[0].uid;
	}

	/**
	 * Evaluate a single ODRL constraint against the available context.
	 * Supports logical constraint composition through nested refinements.
	 * @param constraint The constraint to evaluate.
	 * @param ruleDataContext The request data/context.
	 * @returns True if the constraint is satisfied.
	 * @internal
	 */
	private evaluateConstraint(
		constraint: IOdrlConstraint | IOdrlLogicalConstraint,
		ruleDataContext?: unknown
	): boolean {
		const logicalConstraint = this.getLogicalConstraintOperands(constraint);
		if (logicalConstraint) {
			return this.evaluateLogicalConstraint(logicalConstraint, ruleDataContext);
		}

		// Must be a regular constraint beyond this point
		const regularConstraint = constraint as IOdrlConstraint;

		// Evaluate the main constraint condition
		const leftValue = this.calculateOperandValue(regularConstraint.leftOperand, ruleDataContext);
		const rightValue = this.calculateOperandValue(regularConstraint.rightOperand, ruleDataContext);
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
				operator: LogicalConstraintType;
				constraints: (IOdrlConstraint | IOdrlLogicalConstraint)[];
		  }
		| undefined {
		const logicalConstraint = constraint as IOdrlLogicalConstraint;
		const operators: LogicalConstraintType[] = Object.values(LogicalConstraintType);
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
		operator: LogicalConstraintType
	): void {
		const seenIdentifiers = new Set<string>();

		for (let i = 0; i < constraints.length; i++) {
			const constraint = constraints[i];
			let identifier: string | undefined;

			// Try to get identifier from uid property
			if (Is.stringValue((constraint as IOdrlConstraint).uid)) {
				identifier = (constraint as IOdrlConstraint).uid;
			} else {
				// Try to get identifier from @id property (JSON-LD)
				const jsonLdId = (constraint as IJsonLdNodeObject)["@id"];
				if (Is.stringValue(jsonLdId)) {
					identifier = jsonLdId;
				}
			}

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
	 * @param ruleDataContext The request data/context.
	 * @returns True if the logical constraint is satisfied.
	 * @internal
	 */
	private evaluateLogicalConstraint(
		logicalConstraint: {
			operator: LogicalConstraintType;
			constraints: (IOdrlConstraint | IOdrlLogicalConstraint)[];
		},
		ruleDataContext?: unknown
	): boolean {
		const { operator, constraints } = logicalConstraint;
		if (constraints.length === 0) {
			return false;
		}

		switch (operator) {
			case LogicalConstraintType.And:
				return constraints.every(item => this.evaluateConstraint(item, ruleDataContext));
			case LogicalConstraintType.AndSequence: {
				for (const item of constraints) {
					if (!this.evaluateConstraint(item, ruleDataContext)) {
						return false;
					}
				}
				return true;
			}
			case LogicalConstraintType.Or:
				return constraints.some(item => this.evaluateConstraint(item, ruleDataContext));
			case LogicalConstraintType.Xone: {
				let satisfied = 0;
				for (const item of constraints) {
					if (this.evaluateConstraint(item, ruleDataContext)) {
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
	 * Calculate an operand value.
	 * @param operand The operand.
	 * @param ruleDataContext The request data/context.
	 * @returns The resolved operand value.
	 * @internal
	 */
	private calculateOperandValue(
		operand: IOdrlConstraint["leftOperand"] | IOdrlConstraint["rightOperand"] | string,
		ruleDataContext?: unknown
	): unknown {
		// Treat JSONPath operands as selectors against the current rule data context.
		// Will be in the format twin:jsonpath:<jsonPath>
		let jsonPath: string | undefined;
		if (Is.stringValue(operand)) {
			if (operand.startsWith(`${DefaultPolicyArbiter._JSON_PATH_OPERAND_PREFIX}:`)) {
				jsonPath = operand.slice(DefaultPolicyArbiter._JSON_PATH_OPERAND_PREFIX.length + 1);
				if (jsonPath.length === 0) {
					throw new GeneralError(DefaultPolicyArbiter.CLASS_NAME, "jsonPathOperandMissingTarget", {
						operand
					});
				}
			}
		} else if (Is.object<{ "@type": unknown; "@value": unknown }>(operand)) {
			// Is this an object { "@value": "18", "@type": "xsd:integer" } ?
			const value = operand["@value"];
			const type = operand["@type"];
			if (Is.stringValue(type)) {
				// If the type is set we can try and extract the value
				// is it twin:jsonpath ?
				if (type === DefaultPolicyArbiter._JSON_PATH_OPERAND_PREFIX) {
					if (Is.stringValue(value)) {
						jsonPath = value;
					}
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
			const jsonPaths = JsonPathHelper.query(jsonPath, ruleDataContext);
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
	private evaluateOperator(operator: OperatorType, left: unknown, right: unknown): boolean {
		// Handle array/collection left values (e.g. JSONPath returning multiple matches).
		const leftValues = ArrayHelper.fromObjectOrArray(left ?? []);

		switch (operator) {
			case OperatorType.Eq:
				return leftValues.some(v => ObjectHelper.equal(v, right, false));
			case OperatorType.Neq:
				return leftValues.every(v => !ObjectHelper.equal(v, right, false));
			case OperatorType.Gt:
				return leftValues.some(v => this.compareOrdered(v, right, (a, b) => a > b));
			case OperatorType.Gteq:
				return leftValues.some(v => this.compareOrdered(v, right, (a, b) => a >= b));
			case OperatorType.Lt:
				return leftValues.some(v => this.compareOrdered(v, right, (a, b) => a < b));
			case OperatorType.Lteq:
				return leftValues.some(v => this.compareOrdered(v, right, (a, b) => a <= b));
			case OperatorType.IsAnyOf: {
				return leftValues.some(v => {
					const stringValue =
						typeof v === "string" || typeof v === "number" || typeof v === "boolean"
							? String(v)
							: JSON.stringify(v);
					return (ArrayHelper.fromObjectOrArray(right) ?? []).includes(stringValue);
				});
			}
			case OperatorType.IsAllOf: {
				return ObjectHelper.equal(leftValues, ArrayHelper.fromObjectOrArray(right) ?? [], false);
			}
			case OperatorType.IsNoneOf: {
				return leftValues.every(v => !(ArrayHelper.fromObjectOrArray(right) ?? []).includes(v));
			}
			case OperatorType.LocTimeEq:
				return leftValues.some(v => ObjectHelper.equal(v, right, false));
			case OperatorType.LocTimeGteq:
				return leftValues.some(v => this.compareOrdered(v, right, (a, b) => a >= b));
			case OperatorType.IsA:
			case OperatorType.HasPart:
			case OperatorType.IsPartOf:
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
