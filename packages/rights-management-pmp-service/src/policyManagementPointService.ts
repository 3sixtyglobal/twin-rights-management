// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards, Is } from "@twin.org/core";
import { ComparisonOperator, type EntityCondition } from "@twin.org/entity";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	LocatorHelper,
	type IPolicyAdministrationPointComponent,
	type IPolicyLocator,
	type IPolicyManagementPointComponent
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
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
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
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
	 * @param locator The locator to find relevant policies.
	 * @param data The data to retrieve the policies for.
	 * @param cursor An optional cursor to continue a previous query.
	 * @returns Returns the policies which apply to the data and context so that the PDP can make a decision.
	 */
	public async retrieve<D = unknown>(
		locator: IPolicyLocator,
		data?: D,
		cursor?: string
	): Promise<{
		policies: IOdrlPolicy[];
		cursor?: string;
	}> {
		Guards.object<IPolicyLocator>(
			PolicyManagementPointService.CLASS_NAME,
			nameof(locator),
			locator
		);
		if (!Is.empty(locator.assetType)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(locator.assetType),
				locator.assetType
			);
		}
		if (!Is.empty(locator.action)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(locator.action),
				locator.action
			);
		}
		if (!Is.empty(locator.assignee)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(locator.assignee),
				locator.assignee
			);
		}
		if (!Is.empty(locator.resourceId)) {
			Guards.string(
				PolicyManagementPointService.CLASS_NAME,
				nameof(locator.resourceId),
				locator.resourceId
			);
		}

		await this._logging?.log({
			level: "info",
			source: PolicyManagementPointService.CLASS_NAME,
			ts: Date.now(),
			message: "retrieving",
			data: { locator: LocatorHelper.toString(locator) }
		});

		const condition: EntityCondition<IOdrlPolicy> = {
			conditions: []
		};

		condition.conditions.push({
			property: "action",
			comparison: ComparisonOperator.Equals,
			value: Is.stringValue(locator.action) ? locator.action : undefined
		});

		condition.conditions.push({
			property: "assignee",
			comparison: ComparisonOperator.Equals,
			value: Is.stringValue(locator.assignee) ? locator.assignee : undefined
		});

		// TODO: Support more complex target matching (e.g. asset collections)
		// or specific resource ids.
		condition.conditions.push({
			property: "target",
			comparison: ComparisonOperator.Equals,
			value: Is.stringValue(locator.assetType) ? locator.assetType : undefined
		});

		const result = await this._policyAdministrationPointComponent.query(condition, cursor);

		await this._logging?.log({
			level: "info",
			source: PolicyManagementPointService.CLASS_NAME,
			ts: Date.now(),
			message: "retrieved",
			data: {
				locator: LocatorHelper.toString(locator),
				count: result.policies.length
			}
		});

		return result;
	}
}
