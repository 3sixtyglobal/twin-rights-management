// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * Interface for policy enforcement processors.
 */
export interface IPolicyEnforcementProcessor {
	/**
	 * Process the response from the policy decision point.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param nodeIdentity The identity of the node making the request.
	 * @param data The data to process.
	 * @param policies The policies that apply to the data.
	 * @returns The data after processing.
	 */
	process<D = unknown, R = unknown>(
		assetType: string,
		action: string,
		nodeIdentity: string,
		data: D | undefined,
		policies: IOdrlPolicy[]
	): Promise<R | undefined>;
}
