// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	OdrlPolicyHelper,
	type IPolicyDecision,
	type IPolicyEnforcementProcessor
} from "@twin.org/rights-management-models";
import type { IDataspaceProtocolAgreement } from "@twin.org/standards-dataspace-protocol";
import type { OdrlActionType } from "@twin.org/standards-w3c-odrl";
import type { IPassThroughPolicyEnforcementProcessorConstructorOptions } from "../models/IPassThroughPolicyEnforcementProcessorConstructorOptions.js";

/**
 * Pass Through Policy Enforcement Processor.
 */
export class PassThroughPolicyEnforcementProcessor implements IPolicyEnforcementProcessor {
	/**
	 * The class name of the Pass Through Policy Enforcement Processor.
	 */
	public static readonly CLASS_NAME: string = nameof<PassThroughPolicyEnforcementProcessor>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * Create a new instance of PassThroughPolicyEnforcementProcessor.
	 * @param options The options for the pass through policy enforcement processor.
	 */
	constructor(options?: IPassThroughPolicyEnforcementProcessorConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(options?.loggingComponentType);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return PassThroughPolicyEnforcementProcessor.CLASS_NAME;
	}

	/**
	 * Process the response from the policy decision point.
	 * @param agreement The agreement to process.
	 * @param decisions The decisions made by the policy decision point.
	 * @param data The data to process.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The data after processing.
	 */
	public async process<D = unknown, R = D>(
		agreement: IDataspaceProtocolAgreement,
		decisions: IPolicyDecision[],
		data?: D,
		action?: OdrlActionType | string
	): Promise<R> {
		Guards.object<IDataspaceProtocolAgreement>(
			PassThroughPolicyEnforcementProcessor.CLASS_NAME,
			nameof(agreement),
			agreement
		);

		await this._logging?.log({
			level: "info",
			source: PassThroughPolicyEnforcementProcessor.CLASS_NAME,
			ts: Date.now(),
			message: "processingPolicy",
			data: {
				policyId: OdrlPolicyHelper.getUid(agreement) ?? ""
			}
		});

		return data as unknown as R;
	}
}
