// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyContext,
	IPolicyDecisionPointComponent,
	IPolicyExecutionPointComponent,
	IPolicyInformationPointComponent,
	IPolicyManagementPointComponent
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
	 * Evaluate requests from a Policy Enforcement Point (PEP).
	 * Uses the Policy Management Point (PMP) to retrieve the policies and the
	 * Policy Information Point (PIP) to retrieve additional information.
	 * Executes any actions on the Policy Execution Point (PXP) when the decision is made.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param context The context information to use in the decision making.
	 * @param data The data to make a decision on.
	 * @returns Returns the policy decisions which apply to the data so that the PEP
	 * can manipulate the data accordingly.
	 */
	public async evaluate<C extends IPolicyContext = IPolicyContext, D = unknown>(
		assetType: string,
		action: string,
		context: C | undefined,
		data: D | undefined
	): Promise<IOdrlPolicy[]> {
		return [];
	}
}
