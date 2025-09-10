// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyLocator,
	PolicyDecisionStage,
	PolicyInformationAccessMode,
	type IPolicyArbiter,
	type IPolicyDecision,
	type IPolicyDecisionPointComponent,
	type IPolicyExecutionPointComponent,
	type IPolicyInformationPointComponent,
	type IPolicyManagementPointComponent,
	LocatorHelper
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyDecisionPointServiceConstructorOptions } from "./models/IPolicyDecisionPointServiceConstructorOptions";

/**
 * Class implementation of Policy Decision Point Component.
 */
export class PolicyDecisionPointService implements IPolicyDecisionPointComponent {
	/**
	 * The class name of the Policy Decision Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyDecisionPointService>();

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
	 * These arbiters can be registered to make decision on specific types.
	 * @internal
	 */
	private readonly _arbiters: {
		arbiterId: string;
		arbiter: IPolicyArbiter;
	}[];

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
		this._arbiters = options?.config?.arbiters ?? [];
	}

	/**
	 * Evaluate requests from a Policy Enforcement Point (PEP).
	 * Uses the Policy Management Point (PMP) to retrieve the policies and the
	 * Policy Information Point (PIP) to retrieve additional information.
	 * Executes any actions on the Policy Execution Point (PXP) before and after decision is made.
	 * @param locator The locator to find relevant policies.
	 * @param data The data to make a decision on.
	 * @returns Returns the policy decisions which apply to the data so that the PEP
	 * can manipulate the data accordingly.
	 */
	public async evaluate<D = unknown>(
		locator: IPolicyLocator,
		data?: D
	): Promise<IPolicyDecision[]> {
		Guards.objectValue<IPolicyLocator>(this.CLASS_NAME, nameof(locator), locator);

		const supportedArbiters = this._arbiters.filter(({ arbiter }) => {
			const supportedPolicies = arbiter.supportedPolicies();
			return (
				supportedPolicies.length === 0 ||
				LocatorHelper.findMatchingLocator(supportedPolicies, locator)
			);
		});

		if (supportedArbiters.length === 0) {
			throw new GeneralError(this.CLASS_NAME, "noSupportedArbiters", {
				locator: LocatorHelper.toString(locator)
			});
		}

		const policies: IOdrlPolicy[] = [];

		let cursor;
		do {
			const retrieveResult = await this._policyManagementPointComponent.retrieve(locator, data);

			cursor = retrieveResult.cursor;
			policies.push(...retrieveResult.policies);
		} while (Is.stringValue(cursor));

		const decisions: IPolicyDecision[] = [];

		await this._policyExecutionPointComponent.executeActions(
			PolicyDecisionStage.Before,
			locator,
			policies,
			decisions,
			data
		);

		const information = await this._policyInformationPointComponent.retrieve(
			locator,
			PolicyInformationAccessMode.Any,
			policies,
			data
		);

		for (const { arbiterId, arbiter } of supportedArbiters) {
			try {
				const arbiterDecisions = await arbiter.decide(locator, information, policies, data);
				decisions.push(...arbiterDecisions);
			} catch (error) {
				this._logging?.log({
					level: "error",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "decidingFailed",
					data: {
						arbiterId,
						locator: LocatorHelper.toString(locator)
					},
					error: BaseError.fromError(error)
				});
				throw new GeneralError(
					this.CLASS_NAME,
					"decidingFailed",
					{ arbiterId, locator: LocatorHelper.toString(locator) },
					error
				);
			}
		}

		await this._policyExecutionPointComponent.executeActions(
			PolicyDecisionStage.After,
			locator,
			policies,
			decisions,
			data
		);

		return decisions;
	}

	/**
	 * Register an arbiter to use for making decisions.
	 * @param arbiterId The id of the arbiter to register.
	 * @param arbiter The arbiter to register.
	 * @returns Nothing.
	 */
	public async registerArbiter(arbiterId: string, arbiter: IPolicyArbiter): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(arbiterId), arbiterId);
		Guards.object<IPolicyArbiter>(this.CLASS_NAME, nameof(arbiter), arbiter);

		const currentIndex = this._arbiters.findIndex(a => a.arbiterId === arbiterId);
		if (currentIndex !== -1) {
			this._arbiters[currentIndex].arbiter = arbiter;
		} else {
			this._arbiters.push({ arbiterId, arbiter });
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "registeredArbiter",
			data: {
				arbiterId
			}
		});
	}

	/**
	 * Unregister an arbiter from making decisions.
	 * @param arbiterId The id of the arbiter to unregister.
	 * @returns Nothing.
	 */
	public async unregisterArbiter(arbiterId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(arbiterId), arbiterId);

		const currentIndex = this._arbiters.findIndex(a => a.arbiterId === arbiterId);
		if (currentIndex !== -1) {
			this._arbiters.splice(currentIndex, 1);
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "unregisteredArbiter",
			data: {
				arbiterId
			}
		});
	}
}
