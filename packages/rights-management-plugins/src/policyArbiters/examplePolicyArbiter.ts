// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyArbiter,
	IPolicyDecision,
	IPolicyInformation,
	IPolicyLocator
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IExamplePolicyArbiterConstructorOptions } from "../models/IExamplePolicyArbiterConstructorOptions.js";

/**
 * Example Policy Arbiter.
 */
export class ExamplePolicyArbiter implements IPolicyArbiter {
	/**
	 * The class name of the Example Policy Arbiter.
	 */
	public static readonly CLASS_NAME: string = nameof<ExamplePolicyArbiter>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging: ILoggingComponent;

	/**
	 * Create a new instance of ExamplePolicyArbiter.
	 * @param options The options for the example policy arbiter.
	 */
	constructor(options?: IExamplePolicyArbiterConstructorOptions) {
		this._logging = ComponentFactory.get<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return ExamplePolicyArbiter.CLASS_NAME;
	}

	/**
	 * The policies supported by this arbiter.
	 * @returns The supported policies, if empty can be used for all.
	 */
	public supportedPolicies(): IPolicyLocator[] {
		return [];
	}

	/**
	 * Makes decisions regarding policy access to data.
	 * @param locator The locator to find relevant policies.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param policies The policies that apply to the data.
	 * @param data The data to make a decision on.
	 * @returns The decisions about access to the data.
	 */
	public async decide<D = unknown>(
		locator: IPolicyLocator,
		information?: IPolicyInformation,
		policies?: IOdrlPolicy[],
		data?: D
	): Promise<IPolicyDecision[]> {
		return [];
	}
}
