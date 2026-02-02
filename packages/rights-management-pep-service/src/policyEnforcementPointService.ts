// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, GeneralError, Guards, ObjectHelper } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyAdministrationPointComponent,
	PolicyEnforcementProcessorFactory,
	type IPolicyDecisionPointComponent,
	type IPolicyEnforcementPointComponent,
	type IPolicyManagementPointComponent
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyEnforcementPointServiceConstructorOptions } from "./models/IPolicyEnforcementPointServiceConstructorOptions.js";

/**
 * Class implementation of Policy Enforcement Point Component.
 */
export class PolicyEnforcementPointService implements IPolicyEnforcementPointComponent {
	/**
	 * The class name of the Policy Enforcement Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<PolicyEnforcementPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The policy decision point component.
	 * @internal
	 */
	private readonly _policyDecisionPointComponent: IPolicyDecisionPointComponent;

	/**
	 * The policy administration point component.
	 * @internal
	 */
	private readonly _policyAdministrationPointComponent: IPolicyAdministrationPointComponent;

	/**
	 * The policy management point component.
	 * @internal
	 */
	private readonly _policyManagementPointComponent: IPolicyManagementPointComponent;

	/**
	 * Create a new instance of PolicyEnforcementPointService (PEP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyEnforcementPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._policyDecisionPointComponent = ComponentFactory.get<IPolicyDecisionPointComponent>(
			options?.policyDecisionPointComponentType ?? "policy-decision-point"
		);
		this._policyAdministrationPointComponent =
			ComponentFactory.get<IPolicyAdministrationPointComponent>(
				options?.policyAdministrationPointComponentType ?? "policy-administration-point"
			);
		this._policyManagementPointComponent = ComponentFactory.get<IPolicyManagementPointComponent>(
			options?.policyManagementPointComponentType ?? "policy-management-point"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyEnforcementPointService.CLASS_NAME;
	}

	/**
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param policy The policy to enforce.
	 * @param data The data to process.
	 * @returns The manipulated data with any policies applied.
	 */
	public async interceptWithPolicy<D = unknown, R = D>(policy: IOdrlPolicy, data?: D): Promise<R> {
		Guards.objectValue<IOdrlPolicy>(
			PolicyEnforcementPointService.CLASS_NAME,
			nameof(policy),
			policy
		);

		await this._logging?.log({
			level: "info",
			source: PolicyEnforcementPointService.CLASS_NAME,
			ts: Date.now(),
			message: "intercepting",
			data: {
				policyId: policy.uid
			}
		});

		const decisions = await this._policyDecisionPointComponent.evaluate(policy, data);

		let processedData: unknown = ObjectHelper.clone(data);

		const processorNames = PolicyEnforcementProcessorFactory.names();
		const processors = processorNames.map(name => PolicyEnforcementProcessorFactory.get(name));

		if (processors.length === 0) {
			throw new GeneralError(PolicyEnforcementPointService.CLASS_NAME, "noProcessors");
		}

		for (const processor of processors) {
			try {
				await this._logging?.log({
					level: "info",
					source: PolicyEnforcementPointService.CLASS_NAME,
					ts: Date.now(),
					message: "processing",
					data: {
						policyId: policy.uid,
						processorId: processor.className()
					}
				});

				processedData = await processor.process(policy, decisions, processedData);
			} catch (error) {
				await this._logging?.log({
					level: "error",
					source: PolicyEnforcementPointService.CLASS_NAME,
					ts: Date.now(),
					message: "processingFailed",
					data: {
						processorId: processor.className(),
						policyId: policy.uid
					},
					error: BaseError.fromError(error)
				});
				throw new GeneralError(
					PolicyEnforcementPointService.CLASS_NAME,
					"processingFailed",
					{ processorId: processor.className(), policyId: policy.uid },
					error
				);
			}
		}

		return processedData as R;
	}

	/**
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param uid The uid of the policy to look up.
	 * @param data The data to process.
	 * @returns The manipulated data with any policies applied.
	 */
	public async interceptWithId<D = unknown, R = D>(uid: string, data?: D): Promise<R> {
		Guards.stringValue(PolicyEnforcementPointService.CLASS_NAME, nameof(uid), uid);

		const policy = await this._policyAdministrationPointComponent.get(uid);

		return this.interceptWithPolicy<D, R>(policy, data);
	}

	/**
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param locator The match criteria to look up policies.
	 * @param locator.assigner The assigner attribute to match.
	 * @param locator.assignee The assignee attribute to match.
	 * @param locator.target The target attribute to match.
	 * @param locator.action The action attribute to match.
	 * @param data The data to process.
	 * @returns The manipulated data with any policies applied.
	 */
	public async interceptWithLocator<D = unknown, R = D>(
		locator: {
			assigner?: string;
			assignee?: string;
			target?: string;
			action?: string;
		},
		data?: D
	): Promise<R> {
		const policiesResult = await this._policyManagementPointComponent.retrieve(locator);

		if (policiesResult.policies.length === 0) {
			throw new GeneralError(PolicyEnforcementPointService.CLASS_NAME, "noPoliciesFound", {
				locator: JSON.stringify(locator)
			});
		} else if (policiesResult.policies.length > 1) {
			throw new GeneralError(PolicyEnforcementPointService.CLASS_NAME, "multiplePoliciesFound", {
				locator: JSON.stringify(locator)
			});
		}

		return this.interceptWithPolicy<D, R>(policiesResult.policies[0], data);
	}
}
