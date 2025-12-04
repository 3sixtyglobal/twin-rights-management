// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IPolicyLocator } from "../IPolicyLocator.js";

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
	intercept<D = unknown, R = D>(locator: IPolicyLocator, data?: D): Promise<R>;
}
