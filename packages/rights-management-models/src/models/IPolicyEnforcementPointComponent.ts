// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";

/**
 * Interface describing a Policy Enforcement Point (PEP) contract.
 * Intercepts data and uses the Policy Decision Point (PDP) to make decisions on
 * access to a resource, based on the decision a manipulated data object can
 * be returned.
 */
export interface IPolicyEnforcementPointComponent extends IComponent {
	/**
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param data The data to process.
	 * @param userIdentity The user identity to use in the decision making.
	 * @param nodeIdentity The node identity to use in the decision making.
	 * @returns The manipulated data with any policies applied.
	 */
	intercept<T = unknown>(
		assetType: string,
		action: string,
		data: T | undefined,
		userIdentity: string | undefined,
		nodeIdentity: string | undefined
	): Promise<T | undefined>;
}
