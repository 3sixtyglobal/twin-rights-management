// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyDecision,
	IPolicyEnforcementProcessor,
	IPolicyLocator
} from "@twin.org/rights-management-models";
import type { IExamplePolicyEnforcementProcessorConstructorOptions } from "../models/IExamplePolicyEnforcementProcessorConstructorOptions.js";

/**
 * Example Policy Enforcement Processor.
 */
export class ExamplePolicyEnforcementProcessor implements IPolicyEnforcementProcessor {
	/**
	 * The class name of the Example Policy Enforcement Processor.
	 */
	public static readonly CLASS_NAME: string = nameof<ExamplePolicyEnforcementProcessor>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging: ILoggingComponent;

	/**
	 * Create a new instance of ExamplePolicyEnforcementProcessor.
	 * @param options The options for the example policy enforcement processor.
	 */
	constructor(options?: IExamplePolicyEnforcementProcessorConstructorOptions) {
		this._logging = ComponentFactory.get<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return ExamplePolicyEnforcementProcessor.CLASS_NAME;
	}

	/**
	 * Process the response from the policy decision point.
	 * @param locator The locator to find relevant policies.
	 * @param decisions The decisions made by the policy decision point.
	 * @param data The data to process.
	 * @returns The data after processing.
	 */
	public async process<D = unknown, R = D>(
		locator: IPolicyLocator,
		decisions: IPolicyDecision[],
		data?: D
	): Promise<R> {
		return data as unknown as R;
	}
}
