// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyDecisionPointComponent,
	IPolicyEnforcementPointComponent
} from "@twin.org/rights-management-models";
import type { IPolicyEnforcementPointServiceConstructorOptions } from "./models/IPolicyEnforcementPointServiceConstructorOptions";

/**
 * Class implementation of Policy Enforcement Point Component.
 */
export class PolicyEnforcementPointService implements IPolicyEnforcementPointComponent {
	/**
	 * The class name of the Policy Enforcement Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyEnforcementPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The policy decision point component.
	 * @internal
	 */
	private readonly _policyDecisionPointComponent?: IPolicyDecisionPointComponent;

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
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param data The data to process.
	 * @param userIdentity The user identity to use in the decision making.
	 * @param nodeIdentity The node identity to use in the decision making.
	 * @returns The manipulated data with any policies applied.
	 */
	public async intercept<T = unknown>(
		assetType: string,
		action: string,
		data: T | undefined,
		userIdentity: string | undefined,
		nodeIdentity: string | undefined
	): Promise<T | undefined> {
		return undefined;
	}
}
