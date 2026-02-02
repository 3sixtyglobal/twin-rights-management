// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, GeneralError, Guards } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	PolicyArbiterFactory,
	PolicyDecisionStage,
	PolicyInformationAccessMode,
	type IPolicyDecision,
	type IPolicyDecisionPointComponent,
	type IPolicyExecutionPointComponent,
	type IPolicyInformationPointComponent,
	type IPolicyManagementPointComponent
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyDecisionPointServiceConstructorOptions } from "./models/IPolicyDecisionPointServiceConstructorOptions.js";

/**
 * Class implementation of Policy Decision Point Component.
 */
export class PolicyDecisionPointService implements IPolicyDecisionPointComponent {
	/**
	 * The class name of the Policy Decision Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<PolicyDecisionPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The policy management point component.
	 * @internal
	 */
	private readonly _policyManagementPointComponent: IPolicyManagementPointComponent;

	/**
	 * The policy information point component.
	 * @internal
	 */
	private readonly _policyInformationPointComponent: IPolicyInformationPointComponent;

	/**
	 * The policy execution point component.
	 * @internal
	 */
	private readonly _policyExecutionPointComponent: IPolicyExecutionPointComponent;

	/**
	 * Create a new instance of PolicyDecisionPointService (PDP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyDecisionPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._policyManagementPointComponent = ComponentFactory.get<IPolicyManagementPointComponent>(
			options?.policyManagementPointComponentType ?? "policy-management-point"
		);
		this._policyInformationPointComponent = ComponentFactory.get<IPolicyInformationPointComponent>(
			options?.policyInformationPointComponentType ?? "policy-information-point"
		);
		this._policyExecutionPointComponent = ComponentFactory.get<IPolicyExecutionPointComponent>(
			options?.policyExecutionPointComponentType ?? "policy-execution-point"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyDecisionPointService.CLASS_NAME;
	}

	/**
	 * Evaluate requests from a Policy Enforcement Point (PEP).
	 * Uses the Policy Management Point (PMP) to retrieve the policies and the
	 * Policy Information Point (PIP) to retrieve additional information.
	 * Executes any actions on the Policy Execution Point (PXP) before and after decision is made.
	 * @param policy The policy to evaluate.
	 * @param data The data to make a decision on.
	 * @returns Returns the policy decisions which apply to the data so that the PEP
	 * can manipulate the data accordingly.
	 */
	public async evaluate<D = unknown>(policy: IOdrlPolicy, data?: D): Promise<IPolicyDecision[]> {
		Guards.objectValue<IOdrlPolicy>(PolicyDecisionPointService.CLASS_NAME, nameof(policy), policy);

		const decisions: IPolicyDecision[] = [];

		const arbiterNames = PolicyArbiterFactory.names();
		const arbiters = arbiterNames.map(name => PolicyArbiterFactory.get(name));

		if (arbiters.length === 0) {
			throw new GeneralError(PolicyDecisionPointService.CLASS_NAME, "noArbiters");
		}

		await this._policyExecutionPointComponent.executeActions(
			policy,
			decisions,
			data,
			PolicyDecisionStage.Before
		);

		const information = await this._policyInformationPointComponent.retrieve(
			policy,
			PolicyInformationAccessMode.Any,
			data
		);

		for (const arbiter of arbiters) {
			try {
				const arbiterDecisions = await arbiter.decide(policy, information, data);
				decisions.push(...arbiterDecisions);
			} catch (error) {
				await this._logging?.log({
					level: "error",
					source: PolicyDecisionPointService.CLASS_NAME,
					ts: Date.now(),
					message: "decidingFailed",
					data: {
						arbiterId: arbiter.className(),
						policyId: policy.uid
					},
					error: BaseError.fromError(error)
				});
				throw new GeneralError(
					PolicyDecisionPointService.CLASS_NAME,
					"decidingFailed",
					{ arbiterId: arbiter.className(), policyId: policy.uid },
					error
				);
			}
		}

		await this._policyExecutionPointComponent.executeActions(
			policy,
			decisions,
			data,
			PolicyDecisionStage.After
		);

		return decisions;
	}
}
