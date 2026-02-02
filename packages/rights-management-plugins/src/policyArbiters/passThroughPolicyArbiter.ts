// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	PolicyDecision,
	type IPolicyArbiter,
	type IPolicyDecision
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
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
	private readonly _logging: ILoggingComponent;

	/**
	 * Create a new instance of PassThroughPolicyArbiter.
	 * @param options The options for the pass through policy arbiter.
	 */
	constructor(options?: IPassThroughPolicyArbiterConstructorOptions) {
		this._logging = ComponentFactory.get<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
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
	 * @param policy The policy to evaluate.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param data The data to make a decision on.
	 * @returns The decisions about access to the data.
	 */
	public async decide<D = unknown>(
		policy: IOdrlPolicy,
		information?: { [id: string]: IJsonLdNodeObject },
		data?: D
	): Promise<IPolicyDecision[]> {
		Guards.object<IOdrlPolicy>(PassThroughPolicyArbiter.CLASS_NAME, nameof(policy), policy);

		await this._logging.log({
			level: "info",
			source: PassThroughPolicyArbiter.CLASS_NAME,
			ts: Date.now(),
			message: "decidingPolicy",
			data: {
				policyId: policy.uid
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
