// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, GeneralError, Guards, ObjectHelper } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	LocatorHelper,
	PolicyEnforcementProcessorFactory,
	type IPolicyDecisionPointComponent,
	type IPolicyEnforcementPointComponent,
	type IPolicyLocator
} from "@twin.org/rights-management-models";
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
	 * @param locator The locator to find relevant policies.
	 * @param data The data to process.
	 * @returns The manipulated data with any policies applied.
	 */
	public async intercept<D = unknown, R = D>(locator: IPolicyLocator, data?: D): Promise<R> {
		Guards.objectValue<IPolicyLocator>(
			PolicyEnforcementPointService.CLASS_NAME,
			nameof(locator),
			locator
		);

		await this._logging?.log({
			level: "info",
			source: PolicyEnforcementPointService.CLASS_NAME,
			ts: Date.now(),
			message: "intercepting",
			data: {
				locator: LocatorHelper.toString(locator)
			}
		});

		const decisions = await this._policyDecisionPointComponent.evaluate(locator, data);

		let processedData: unknown = ObjectHelper.clone(data);

		const processorNames = PolicyEnforcementProcessorFactory.names();
		const processors = processorNames.map(name => PolicyEnforcementProcessorFactory.get(name));

		for (const processor of processors) {
			try {
				await this._logging?.log({
					level: "info",
					source: PolicyEnforcementPointService.CLASS_NAME,
					ts: Date.now(),
					message: "processing",
					data: {
						locator: LocatorHelper.toString(locator),
						processorId: processor.className()
					}
				});

				processedData = await processor.process(locator, decisions, processedData);
			} catch (error) {
				await this._logging?.log({
					level: "error",
					source: PolicyEnforcementPointService.CLASS_NAME,
					ts: Date.now(),
					message: "processingFailed",
					data: {
						processorId: processor.className(),
						locator: LocatorHelper.toString(locator)
					},
					error: BaseError.fromError(error)
				});
				throw new GeneralError(
					PolicyEnforcementPointService.CLASS_NAME,
					"processingFailed",
					{ processorId: processor.className(), locator: LocatorHelper.toString(locator) },
					error
				);
			}
		}

		return processedData as R;
	}
}
