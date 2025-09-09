// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards } from "@twin.org/core";
import { ComparisonOperator, type EntityCondition } from "@twin.org/entity";
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
	 * Get the policies from a PAP based on the data and identities.
	 * @param assetType The type of asset being processed, wildcard * means all asset types.
	 * @param action The action being performed on the asset, wildcard * means all actions.
	 * @param nodeIdentity The identity of the node making the request, wildcard * means all node identities.
	 * @param data The data to retrieve the policies for.
	 * @param cursor An optional cursor to continue a previous query.
	 * @returns Returns the policies which apply to the data and context so that the PDP can make a decision.
	 */
	public async retrieve<D = unknown>(
		assetType: string,
		action: string,
		nodeIdentity: string,
		data: D | undefined,
		cursor?: string
	): Promise<{
		policies: IOdrlPolicy[];
		cursor?: string;
	}> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);
		Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "retrieving",
			data: {
				assetType,
				action,
				nodeIdentity
			}
		});

		const condition: EntityCondition<IOdrlPolicy> = {
			conditions: []
		};

		condition.conditions.push({
			property: "target",
			comparison: ComparisonOperator.Equals,
			value: assetType === "*" ? undefined : assetType
		});

		condition.conditions.push({
			property: "action",
			comparison: ComparisonOperator.Equals,
			value: action === "*" ? undefined : action
		});

		condition.conditions.push({
			property: "assignee",
			comparison: ComparisonOperator.Equals,
			value: nodeIdentity === "*" ? undefined : nodeIdentity
		});

		const result = await this._policyAdministrationPointComponent.query(condition, cursor);

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "retrieved",
			data: {
				assetType,
				action,
				nodeIdentity,
				count: result.policies.length
			}
		});

		return result;
	}
}
