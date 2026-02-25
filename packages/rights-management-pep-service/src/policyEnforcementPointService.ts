// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, GeneralError, Guards, ObjectHelper } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	PolicyEnforcementProcessorFactory,
	type IPolicyAdministrationPointComponent,
	type IPolicyDecisionPointComponent,
	type IPolicyEnforcementPointComponent,
	type IPolicyManagementPointComponent
} from "@twin.org/rights-management-models";
import { PolicyType, type ActionType, type IOdrlAgreement } from "@twin.org/standards-w3c-odrl";
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
	 * @param agreement The agreement to enforce.
	 * @param data The data to process.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The manipulated data with any policies applied.
	 */
	public async interceptWithPolicy<D = unknown, R = D>(
		agreement: IOdrlAgreement,
		data?: D,
		action?: ActionType | string
	): Promise<R> {
		Guards.objectValue<IOdrlAgreement>(
			PolicyEnforcementPointService.CLASS_NAME,
			nameof(agreement),
			agreement
		);

		await this._logging?.log({
			level: "info",
			source: PolicyEnforcementPointService.CLASS_NAME,
			ts: Date.now(),
			message: "intercepting",
			data: {
				policyId: OdrlPolicyHelper.getUid(agreement) ?? ""
			}
		});

		const decisions = await this._policyDecisionPointComponent.evaluate(agreement, data, action);

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
						policyId: OdrlPolicyHelper.getUid(agreement) ?? "",
						processorId: processor.className()
					}
				});

				processedData = await processor.process(agreement, decisions, processedData, action);
			} catch (error) {
				await this._logging?.log({
					level: "error",
					source: PolicyEnforcementPointService.CLASS_NAME,
					ts: Date.now(),
					message: "processingFailed",
					data: {
						processorId: processor.className(),
						policyId: OdrlPolicyHelper.getUid(agreement) ?? ""
					},
					error: BaseError.fromError(error)
				});
				throw new GeneralError(
					PolicyEnforcementPointService.CLASS_NAME,
					"processingFailed",
					{
						processorId: processor.className(),
						policyId: OdrlPolicyHelper.getUid(agreement) ?? ""
					},
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
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The manipulated data with any policies applied.
	 */
	public async interceptWithId<D = unknown, R = D>(
		uid: string,
		data?: D,
		action?: ActionType | string
	): Promise<R> {
		Guards.stringValue(PolicyEnforcementPointService.CLASS_NAME, nameof(uid), uid);

		const agreement = await this._policyAdministrationPointComponent.getAgreement(uid);

		return this.interceptWithPolicy<D, R>(agreement, data, action);
	}

	/**
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param locator The match criteria to look up agreements.
	 * @param locator.assigner The assigner attribute to match.
	 * @param locator.assignee The assignee attribute to match.
	 * @param locator.target The target attribute to match.
	 * @param locator.action The action attribute to match.
	 * @param data The data to process.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The manipulated data with any policies applied.
	 */
	public async interceptWithLocator<D = unknown, R = D>(
		locator: {
			assigner?: string;
			assignee?: string;
			target?: string;
			action?: string;
		},
		data?: D,
		action?: ActionType | string
	): Promise<R> {
		const policiesResult = await this._policyManagementPointComponent.retrieve(locator);

		const agreements = policiesResult.policies.filter(
			p => OdrlPolicyHelper.getType(p) === PolicyType.Agreement
		) as IOdrlAgreement[];

		if (agreements.length === 0) {
			throw new GeneralError(PolicyEnforcementPointService.CLASS_NAME, "noAgreementsFound", {
				locator: JSON.stringify(locator)
			});
		} else if (agreements.length > 1) {
			throw new GeneralError(PolicyEnforcementPointService.CLASS_NAME, "multipleAgreementsFound", {
				locator: JSON.stringify(locator)
			});
		}

		return this.interceptWithPolicy<D, R>(agreements[0], data, action);
	}
}
