// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards } from "@3sixty/core";
import type { ILoggingComponent } from "@3sixty/logging-models";
import { nameof } from "@3sixty/nameof";
import {
	OdrlPolicyHelper,
	type IPolicyObligationEnforcer,
	type IRightsManagementInformation,
	type IRightsManagementPolicy
} from "@3sixty/rights-management-models";
import type { OdrlActionType, IOdrlDuty } from "@3sixty/standards-w3c-odrl";
import type { IPassThroughPolicyObligationEnforcerConstructorOptions } from "../models/IPassThroughPolicyObligationEnforcerConstructorOptions.js";

/**
 * Pass Through Policy Obligation Enforcer.
 */
export class PassThroughPolicyObligationEnforcer implements IPolicyObligationEnforcer {
	/**
	 * The class name of the Pass Through Policy Obligation Enforcer.
	 */
	public static readonly CLASS_NAME: string = nameof<PassThroughPolicyObligationEnforcer>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * Create a new instance of Pass Through Policy Obligation Enforcer.
	 * @param options The options for the pass through policy obligation enforcer.
	 */
	constructor(options?: IPassThroughPolicyObligationEnforcerConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PassThroughPolicyObligationEnforcer.CLASS_NAME;
	}

	/**
	 * Enforces obligations regarding policy access to data.
	 * @param policy The policy to evaluate.
	 * @param duty The duty to enforce.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param data The data to make a decision on.
	 * @param action Optional action to make a decision on, if not provided, the enforcer will evaluate all actions in the duty.
	 * @returns Whether the obligations were successfully enforced.
	 */
	public async enforce<D = unknown>(
		policy: IRightsManagementPolicy,
		duty: IOdrlDuty,
		information?: IRightsManagementInformation,
		data?: D,
		action?: OdrlActionType | string
	): Promise<boolean> {
		Guards.object<IRightsManagementPolicy>(
			PassThroughPolicyObligationEnforcer.CLASS_NAME,
			nameof(policy),
			policy
		);
		Guards.object<IOdrlDuty>(PassThroughPolicyObligationEnforcer.CLASS_NAME, nameof(duty), duty);

		await this._logging?.log({
			level: "info",
			source: PassThroughPolicyObligationEnforcer.CLASS_NAME,
			ts: Date.now(),
			message: "enforcingDuty",
			data: {
				policyId: OdrlPolicyHelper.getUid(policy) ?? ""
			}
		});

		return true;
	}
}
