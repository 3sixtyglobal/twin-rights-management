// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import type { ActionType } from "@twin.org/standards-w3c-odrl";
import type { PolicyInformationAccessMode } from "./policyInformationAccessMode.js";

/**
 * Interface for policy information sources.
 */
export interface IPolicyInformationSource extends IComponent {
	/**
	 * Retrieve information from the sources.
	 * @param policy The policy to retrieve information for if available.
	 * @param accessMode The access mode to use for the retrieval.
	 * @param data The data to process.
	 * @param action Optional action to make a decision on, if not provided, the PIP will evaluate all actions in the policy.
	 * @returns The objects containing relevant information or undefined if nothing relevant is found.
	 */
	retrieve<D = unknown>(
		policy: IDataspaceProtocolPolicy | undefined,
		accessMode: PolicyInformationAccessMode,
		data?: D,
		action?: ActionType | string
	): Promise<{ [id: string]: IJsonLdNodeObject } | undefined>;
}
