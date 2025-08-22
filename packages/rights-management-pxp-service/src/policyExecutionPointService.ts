// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyExecutionPointComponent,
	PolicyActionCallback,
	PolicyDecisionStage
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyExecutionPointServiceOptions } from "./models/IPolicyExecutionPointServiceOptions";

/**
 * Class implementation of Policy Execution Point Component.
 */
export class PolicyExecutionPointService implements IPolicyExecutionPointComponent {
	/**
	 * The class name of the Policy Execution Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyExecutionPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * Create a new instance of PolicyExecutionPointService (PXP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyExecutionPointServiceOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Execute actions based on the PDP's decisions.
	 * @param stage The stage at which the PXP is executed in the PDP.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param data The data used in the decision by the PDP.
	 * @param userIdentity The user identity to use in the decision making.
	 * @param nodeIdentity The node identity to use in the decision making.
	 * @param policies The policies that apply to the data.
	 * @returns Nothing.
	 */
	public async executeActions<T = unknown>(
		stage: PolicyDecisionStage,
		assetType: string,
		action: string,
		data: T | undefined,
		userIdentity: string,
		nodeIdentity: string,
		policies: IOdrlPolicy[]
	): Promise<void> {}

	/**
	 * Register an action to be executed.
	 * @param actionId The id of the action to register.
	 * @param stage The stage at which the action should be executed.
	 * @param action The action to execute.
	 * @returns Nothing.
	 */
	public async registerAction<T = unknown>(
		actionId: string,
		stage: PolicyDecisionStage,
		action: PolicyActionCallback<T>
	): Promise<void> {}

	/**
	 * Unregister an action from the execution point.
	 * @param actionId The id of the action to unregister.
	 * @returns Nothing.
	 */
	public async unregisterAction(actionId: string): Promise<void> {}
}
