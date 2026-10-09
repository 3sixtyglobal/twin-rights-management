// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards } from "@3sixty/core";
import type { ILoggingComponent } from "@3sixty/logging-models";
import { nameof } from "@3sixty/nameof";
import {
	OdrlPolicyHelper,
	PolicyDecision,
	type IPolicyArbiter,
	type IPolicyDecision,
	type IRightsManagementInformation
} from "@3sixty/rights-management-models";
import type { IDataspaceProtocolAgreement } from "@3sixty/standards-dataspace-protocol";
import type { OdrlActionType } from "@3sixty/standards-w3c-odrl";
import type { IPassThroughPolicyArbiterConstructorOptions } from "../models/IPassThroughPolicyArbiterConstructorOptions.js";

/**
 * Pass Through Policy Arbiter.
 */
export class PassThroughPolicyArbiter implements IPolicyArbiter {
	/**
	 * The class name of the Pass Through Policy Arbiter.
	 */
	public static readonly CLASS_NAME: string = nameof<PassThroughPolicyArbiter>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * Create a new instance of PassThroughPolicyArbiter.
	 * @param options The options for the pass through policy arbiter.
	 */
	constructor(options?: IPassThroughPolicyArbiterConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PassThroughPolicyArbiter.CLASS_NAME;
	}

	/**
	 * Makes decisions regarding policy access to data.
	 * @param agreement The agreement to evaluate.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param data The data to make a decision on.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The decisions about access to the data.
	 */
	public async decide<D = unknown>(
		agreement: IDataspaceProtocolAgreement,
		information?: IRightsManagementInformation,
		data?: D,
		action?: OdrlActionType | string
	): Promise<IPolicyDecision[]> {
		Guards.object<IDataspaceProtocolAgreement>(
			PassThroughPolicyArbiter.CLASS_NAME,
			nameof(agreement),
			agreement
		);

		await this._logging?.log({
			level: "info",
			source: PassThroughPolicyArbiter.CLASS_NAME,
			ts: Date.now(),
			message: "decidingPolicy",
			data: {
				policyId: OdrlPolicyHelper.getUid(agreement) ?? ""
			}
		});

		return [
			{
				target: "$",
				decision: PolicyDecision.Granted
			}
		];
	}
}
