// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards, Is } from "@3sixty/core";
import type { ILoggingComponent } from "@3sixty/logging-models";
import { nameof } from "@3sixty/nameof";
import type {
	IPolicyAdministrationPointComponent,
	IPolicyLocator,
	IPolicyManagementPointComponent,
	IRightsManagementPolicy
} from "@3sixty/rights-management-models";
import type { IPolicyManagementPointServiceConstructorOptions } from "./models/IPolicyManagementPointServiceConstructorOptions.js";

/**
 * Class implementation of Policy Management Point Component.
 */
export class PolicyManagementPointService implements IPolicyManagementPointComponent {
	/**
	 * The class name of the Policy Management Point Service.
	 */
	public static readonly CLASS_NAME: string = nameof<PolicyManagementPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The policy administration point component.
	 * @internal
	 */
	private readonly _policyAdministrationPointComponent: IPolicyAdministrationPointComponent;

	/**
	 * Create a new instance of PolicyManagementPointService (PMP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyManagementPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);
		this._policyAdministrationPointComponent =
			ComponentFactory.get<IPolicyAdministrationPointComponent>(
				options?.policyAdministrationPointComponentType ?? "policy-administration-point"
			);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PolicyManagementPointService.CLASS_NAME;
	}

	/**
	 * Get the policies from a PAP based on the data and identities.
	 * @param locator Optional locator to filter by type, assigner, assignee, target, or action.
	 * @param cursor An optional cursor to continue a previous query.
	 * @returns Returns the policies which apply to the data and context so that the PDP can make a decision.
	 */
	public async retrieve(
		locator?: IPolicyLocator,
		cursor?: string
	): Promise<{
		policies: IRightsManagementPolicy[];
		cursor?: string;
	}> {
		if (!Is.empty(locator?.assigner)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(locator.assigner),
				locator.assigner
			);
		}
		if (!Is.empty(locator?.assignee)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(locator.assignee),
				locator.assignee
			);
		}
		if (!Is.empty(locator?.target)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(locator.target),
				locator.target
			);
		}
		if (!Is.empty(locator?.action)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(locator.action),
				locator.action
			);
		}

		await this._logging?.log({
			level: "info",
			source: PolicyManagementPointService.CLASS_NAME,
			ts: Date.now(),
			message: "retrieving",
			data: {
				locator: JSON.stringify(locator ?? {})
			}
		});

		const result = await this._policyAdministrationPointComponent.query(locator, undefined, cursor);

		await this._logging?.log({
			level: "info",
			source: PolicyManagementPointService.CLASS_NAME,
			ts: Date.now(),
			message: "retrieved",
			data: {
				locator: JSON.stringify(locator ?? {}),
				count: result.policies.length
			}
		});

		return result;
	}
}
