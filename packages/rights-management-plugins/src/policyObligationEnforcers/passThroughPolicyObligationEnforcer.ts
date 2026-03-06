// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	type IPolicyObligationEnforcer
} from "@twin.org/rights-management-models";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import type { ActionType, IOdrlDuty } from "@twin.org/standards-w3c-odrl";
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
	private readonly _logging: ILoggingComponent;

	/**
	 * Create a new instance of Pass Through Policy Obligation Enforcer.
	 * @param options The options for the pass through policy obligation enforcer.
	 */
	constructor(options?: IPassThroughPolicyObligationEnforcerConstructorOptions) {
		this._logging = ComponentFactory.get<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
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
		policy: IDataspaceProtocolPolicy,
		duty: IOdrlDuty,
		information?: { [id: string]: IJsonLdNodeObject },
		data?: D,
		action?: ActionType | string
	): Promise<boolean> {
		Guards.object<IDataspaceProtocolPolicy>(
			PassThroughPolicyObligationEnforcer.CLASS_NAME,
			nameof(policy),
			policy
		);
		Guards.object<IOdrlDuty>(PassThroughPolicyObligationEnforcer.CLASS_NAME, nameof(duty), duty);

		await this._logging.log({
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
