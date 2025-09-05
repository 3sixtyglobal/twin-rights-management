// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import type { IBaseRestClientConfig } from "@twin.org/api-models";
import { Guards, NotImplementedError } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type {
	IPepInterceptRequest,
	IPepInterceptResponse,
	IPolicyContext,
	IPolicyEnforcementPointComponent,
	IPolicyEnforcementProcessor
} from "@twin.org/rights-management-models";

/**
 * Client for performing Rights Management Policy Enforcement through to REST endpoints.
 */
export class PolicyEnforcementPointClient
	extends BaseRestClient
	implements IPolicyEnforcementPointComponent
{
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyEnforcementPointClient>();

	/**
	 * Create a new instance of PolicyEnforcementPointClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<PolicyEnforcementPointClient>(), config, "rights-management");
	}

	/**
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param context The context in which the action is being performed.
	 * @param data The data to process.
	 * @returns The manipulated data with any policies applied.
	 */
	public async intercept<C extends IPolicyContext = IPolicyContext, D = unknown, R = unknown>(
		assetType: string,
		action: string,
		context: C | undefined,
		data: D | undefined
	): Promise<R | undefined> {
		Guards.stringValue(this.CLASS_NAME, nameof(assetType), assetType);
		Guards.stringValue(this.CLASS_NAME, nameof(action), action);

		const response = await this.fetch<IPepInterceptRequest, IPepInterceptResponse>(
			"/pep/intercept",
			"POST",
			{
				body: {
					assetType,
					action,
					context,
					data
				}
			}
		);

		return response.body as R;
	}

	/**
	 * Register a processor to use for handling data.
	 * @param processorId The id of the processor to register.
	 * @param processor The processor to register.
	 * @returns Nothing.
	 */
	public async registerProcessor(
		processorId: string,
		processor: IPolicyEnforcementProcessor
	): Promise<void> {
		throw new NotImplementedError(this.CLASS_NAME, "registerProcessor");
	}

	/**
	 * Unregister a processor from the handling.
	 * @param processorId The id of the processor to unregister.
	 * @returns Nothing.
	 */
	public async unregisterProcessor(processorId: string): Promise<void> {
		throw new NotImplementedError(this.CLASS_NAME, "unregisterProcessor");
	}
}
