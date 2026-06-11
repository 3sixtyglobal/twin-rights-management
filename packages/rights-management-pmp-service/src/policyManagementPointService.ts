// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards, Is } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyAdministrationPointComponent,
	IPolicyManagementPointComponent,
	IRightsManagementPolicy
} from "@twin.org/rights-management-models";
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
	 * @param options Optional options to filter by assigner or assignee.
	 * @param options.assigner The assigner to filter by.
	 * @param options.assignee The assignee to filter by.
	 * @param options.target The target to filter by.
	 * @param options.action The action to filter by.
	 * @param cursor An optional cursor to continue a previous query.
	 * @returns Returns the policies which apply to the data and context so that the PDP can make a decision.
	 */
	public async retrieve(
		options?: {
			assigner?: string;
			assignee?: string;
			target?: string;
			action?: string;
		},
		cursor?: string
	): Promise<{
		policies: IRightsManagementPolicy[];
		cursor?: string;
	}> {
		if (!Is.empty(options?.assigner)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(options.assigner),
				options.assigner
			);
		}
		if (!Is.empty(options?.assignee)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(options.assignee),
				options.assignee
			);
		}
		if (!Is.empty(options?.target)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(options.target),
				options.target
			);
		}
		if (!Is.empty(options?.action)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(options.action),
				options.action
			);
		}

		await this._logging?.log({
			level: "info",
			source: PolicyManagementPointService.CLASS_NAME,
			ts: Date.now(),
			message: "retrieving",
			data: {
				locator: JSON.stringify(options ?? {})
			}
		});

		const result = await this._policyAdministrationPointComponent.query(options, undefined, cursor);

		await this._logging?.log({
			level: "info",
			source: PolicyManagementPointService.CLASS_NAME,
			ts: Date.now(),
			message: "retrieved",
			data: {
				locator: JSON.stringify(options ?? {}),
				count: result.policies.length
			}
		});

		return result;
	}
}
