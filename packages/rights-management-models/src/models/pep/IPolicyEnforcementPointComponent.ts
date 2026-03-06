// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IDataspaceProtocolAgreement } from "@twin.org/standards-dataspace-protocol";
import type { ActionType } from "@twin.org/standards-w3c-odrl";

/**
 * Interface describing a Policy Enforcement Point (PEP) contract.
 * Intercepts data and uses the Policy Decision Point (PDP) to make decisions on
 * access to a resource, based on the decision a manipulated data object can
 * be returned.
 */
export interface IPolicyEnforcementPointComponent extends IComponent {
	/**
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param agreement The agreement to enforce.
	 * @param data The data to process.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The manipulated data with any policies applied.
	 */
	interceptWithPolicy<D = unknown, R = D>(
		agreement: IDataspaceProtocolAgreement,
		data?: D,
		action?: ActionType | string
	): Promise<R>;

	/**
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param uid The uid of the agreement to look up.
	 * @param data The data to process.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The manipulated data with any policies applied.
	 */
	interceptWithId<D = unknown, R = D>(
		uid: string,
		data?: D,
		action?: ActionType | string
	): Promise<R>;

	/**
	 * Process the data using Policy Decision Point (PDP) and return the manipulated data.
	 * @param locator The match criteria to look up agreements.
	 * @param locator.assigner The assigner attribute to match.
	 * @param locator.assignee The assignee attribute to match.
	 * @param locator.target The target attribute to match.
	 * @param locator.action The action attribute to match.
	 * @param data The data to process.
	 * @param action Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.
	 * @returns The manipulated data with any policies applied.
	 */
	interceptWithLocator<D = unknown, R = D>(
		locator: {
			assigner?: string;
			assignee?: string;
			target?: string;
			action?: string;
		},
		data?: D,
		action?: ActionType | string
	): Promise<R>;
}
