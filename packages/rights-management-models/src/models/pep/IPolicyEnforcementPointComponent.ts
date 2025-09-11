// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IPolicyLocator } from "../IPolicyLocator";
import type { IPolicyEnforcementProcessor } from "./IPolicyEnforcementProcessor";

/**
 * Interface describing a Policy Enforcement Point (PEP) contract.
 * Intercepts data and uses the Policy Decision Point (PDP) to make decisions on
 * access to a resource, based on the decision a manipulated data object can
 * be returned.
 */
export interface IPolicyEnforcementPointComponent extends IComponent {
	/**
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param locator The locator to find relevant policies.
	 * @param data The data to process.
	 * @returns The manipulated data with any policies applied.
	 */
	intercept<D = unknown, R = unknown>(locator: IPolicyLocator, data?: D): Promise<R | undefined>;

	/**
	 * Register a processor to use for handling data.
	 * @param processorId The id of the processor to register.
	 * @param processor The processor to register.
	 * @returns Nothing.
	 */
	registerProcessor(processorId: string, processor: IPolicyEnforcementProcessor): Promise<void>;

	/**
	 * Unregister a processor from the handling.
	 * @param processorId The id of the processor to unregister.
	 * @returns Nothing.
	 */
	unregisterProcessor(processorId: string): Promise<void>;
}
