// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import type { OdrlActionType, IOdrlDuty } from "@twin.org/standards-w3c-odrl";

/**
 * Interface describing a Policy Obligation Enforcer.
 */
export interface IPolicyObligationEnforcer extends IComponent {
	/**
	 * Enforces obligations regarding policy access to data.
	 * @param policy The policy to evaluate.
	 * @param duty The duty to enforce.
	 * @param information Information provided by the requester to determine if a policy can be created.
	 * @param data The data to make a decision on.
	 * @param action Optional action to make a decision on, if not provided, the enforcer will evaluate all actions in the duty.
	 * @returns Whether the obligations were successfully enforced.
	 */
	enforce<D = unknown>(
		policy: IDataspaceProtocolPolicy,
		duty: IOdrlDuty,
		information?: { [id: string]: IJsonLdNodeObject },
		data?: D,
		action?: OdrlActionType | string
	): Promise<boolean>;
}
