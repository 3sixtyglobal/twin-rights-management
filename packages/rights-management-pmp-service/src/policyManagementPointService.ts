// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyAdministrationPointComponent,
	IPolicyManagementPointComponent
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyManagementPointServiceConstructorOptions } from "./models/IPolicyManagementPointServiceConstructorOptions";

/**
 * Class implementation of Policy Management Point Component.
 */
export class PolicyManagementPointService implements IPolicyManagementPointComponent {
	/**
	 * The class name of the Policy Management Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyManagementPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The policy administration point component.
	 * @internal
	 */
	private readonly _policyAdministrationPointComponent?: IPolicyAdministrationPointComponent;

	/**
	 * Create a new instance of PolicyManagementPointService (PMP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyManagementPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._policyAdministrationPointComponent =
			ComponentFactory.get<IPolicyAdministrationPointComponent>(
				options?.policyAdministrationPointComponentType ?? "policy-administration-point"
			);
	}

	/**
	 * Get the policies from a PAP based on the data and identities.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param data The data to retrieve the policies for.
	 * @param userIdentity The user identity to retrieve the policies for.
	 * @param nodeIdentity The node identity to retrieve the policies for.
	 * @returns Returns the policies which apply to the data and identities so that the PDP can make a decision.
	 */
	public async retrieve<T = unknown>(
		assetType: string,
		action: string,
		data: T | undefined,
		userIdentity: string,
		nodeIdentity: string
	): Promise<IOdrlPolicy[]> {
		return [];
	}
}
