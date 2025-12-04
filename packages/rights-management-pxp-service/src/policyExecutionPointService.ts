// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, GeneralError, Guards } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type IPolicyDecision,
	type IPolicyExecutionPointComponent,
	type IPolicyLocator,
	LocatorHelper,
	PolicyDecisionStage,
	PolicyExecutionActionFactory
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyExecutionPointServiceConstructorOptions } from "./models/IPolicyExecutionPointServiceConstructorOptions.js";

/**
 * Class implementation of Policy Execution Point Component.
 */
export class PolicyExecutionPointService implements IPolicyExecutionPointComponent {
	/**
	 * The class name of the Policy Execution Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<PolicyExecutionPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * Create a new instance of PolicyExecutionPointService (PXP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyExecutionPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyExecutionPointService.CLASS_NAME;
	}

	/**
	 * Execute actions based on the PDP's decisions.
	 * @param stage The stage at which the PXP is executed in the PDP.
	 * @param locator The locator to find relevant policies.
	 * @param policies The policies that apply to the data.
	 * @param decisions The decisions made by the PDP.
	 * @param data The data used in the decision by the PDP.
	 * @returns Nothing.
	 */
	public async executeActions<D = unknown>(
		stage: PolicyDecisionStage,
		locator: IPolicyLocator,
		policies?: IOdrlPolicy[],
		decisions?: IPolicyDecision[],
		data?: D
	): Promise<void> {
		Guards.arrayOneOf(
			PolicyExecutionPointService.CLASS_NAME,
			nameof(stage),
			stage,
			Object.values(PolicyDecisionStage)
		);
		Guards.object<IPolicyLocator>(PolicyExecutionPointService.CLASS_NAME, nameof(locator), locator);

		const locatorDetails = LocatorHelper.toString(locator);

		await this._logging?.log({
			level: "info",
			source: PolicyExecutionPointService.CLASS_NAME,
			ts: Date.now(),
			message: "executingActions",
			data: {
				stage,
				locator: locatorDetails
			}
		});

		const actionNames = PolicyExecutionActionFactory.names();
		const actions = actionNames
			.map(actionName => PolicyExecutionActionFactory.get(actionName))
			.filter(a => a.supportedStages().includes(stage));

		for (const action of actions) {
			try {
				await this._logging?.log({
					level: "info",
					source: PolicyExecutionPointService.CLASS_NAME,
					ts: Date.now(),
					message: "executingAction",
					data: {
						stage,
						locator: locatorDetails
					}
				});
				await action.execute(stage, locator, policies, decisions, data);
			} catch (error) {
				await this._logging?.log({
					level: "error",
					source: PolicyExecutionPointService.CLASS_NAME,
					ts: Date.now(),
					message: "actionExecutionFailed",
					data: {
						actionId: action.className(),
						stage,
						locator: locatorDetails
					},
					error: BaseError.fromError(error)
				});
				throw new GeneralError(
					PolicyExecutionPointService.CLASS_NAME,
					"actionExecutionFailed",
					{
						actionId: action.className(),
						stage,
						locator: locatorDetails
					},
					error
				);
			}
		}
	}
}
