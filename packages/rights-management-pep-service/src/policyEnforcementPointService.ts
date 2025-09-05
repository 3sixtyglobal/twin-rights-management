// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, ComponentFactory, GeneralError, Guards, ObjectHelper } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyContext,
	IPolicyDecisionPointComponent,
	IPolicyEnforcementPointComponent,
	IPolicyEnforcementProcessor
} from "@twin.org/rights-management-models";
import type { IPolicyEnforcementPointServiceConstructorOptions } from "./models/IPolicyEnforcementPointServiceConstructorOptions";

/**
 * Class implementation of Policy Enforcement Point Component.
 */
export class PolicyEnforcementPointService implements IPolicyEnforcementPointComponent {
	/**
	 * The class name of the Policy Enforcement Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyEnforcementPointService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _logging?: ILoggingComponent;

	/**
	 * The policy decision point component.
	 * @internal
	 */
	private readonly _policyDecisionPointComponent: IPolicyDecisionPointComponent;

	/**
	 * These processors can be registered to handle data after decision is made.
	 * @internal
	 */
	private readonly _processors: {
		processorId: string;
		processor: IPolicyEnforcementProcessor;
	}[];

	/**
	 * Create a new instance of PolicyEnforcementPointService (PEP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyEnforcementPointServiceConstructorOptions) {
		this._logging = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType ?? "logging"
		);
		this._policyDecisionPointComponent = ComponentFactory.get<IPolicyDecisionPointComponent>(
			options?.policyDecisionPointComponentType ?? "policy-decision-point"
		);
		this._processors = options?.config?.processors ?? [];
	}

	/**
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param context The context for the policy enforcement.
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

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "intercepting",
			data: {
				assetType,
				action
			}
		});

		const policies = await this._policyDecisionPointComponent.evaluate(
			assetType,
			action,
			context,
			data
		);

		let processedData: unknown = ObjectHelper.clone(data);

		for (const { processorId, processor } of this._processors) {
			try {
				this._logging?.log({
					level: "info",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "processing",
					data: {
						assetType,
						action,
						processorId
					}
				});

				processedData = await processor.process(
					assetType,
					action,
					context,
					processedData,
					policies
				);
			} catch (error) {
				this._logging?.log({
					level: "error",
					source: this.CLASS_NAME,
					ts: Date.now(),
					message: "processingFailed",
					data: {
						processorId,
						assetType,
						action
					},
					error: BaseError.fromError(error)
				});
				throw new GeneralError(
					this.CLASS_NAME,
					"processingFailed",
					{ processorId, assetType, action },
					error
				);
			}
		}

		return processedData as R;
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
		Guards.stringValue(this.CLASS_NAME, nameof(processorId), processorId);
		Guards.objectValue<IPolicyEnforcementProcessor>(this.CLASS_NAME, nameof(processor), processor);

		const currentIndex = this._processors.findIndex(p => p.processorId === processorId);
		if (currentIndex !== -1) {
			this._processors[currentIndex].processor = processor;
		} else {
			this._processors.push({ processorId, processor });
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "registeredProcessor",
			data: {
				processorId
			}
		});
	}

	/**
	 * Unregister a processor from the handling.
	 * @param processorId The id of the processor to unregister.
	 * @returns Nothing.
	 */
	public async unregisterProcessor(processorId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(processorId), processorId);

		const currentIndex = this._processors.findIndex(p => p.processorId === processorId);
		if (currentIndex !== -1) {
			this._processors.splice(currentIndex, 1);
		}

		this._logging?.log({
			level: "info",
			source: this.CLASS_NAME,
			ts: Date.now(),
			message: "unregisteredProcessor",
			data: {
				processorId
			}
		});
	}
}
