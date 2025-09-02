// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyContext } from "./IPolicyContext";

/**
 * Interface for policy enforcement processors.
 */
export interface IPolicyEnforcementProcessor {
	/**
	 * Process the response from the policy decision point.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param context The context information to use in the decision making.
	 * @param data The data to process.
	 * @param policies The policies that apply to the data.
	 * @returns The data after processing.
	 */
	process<C extends IPolicyContext = IPolicyContext, D = unknown, R = unknown>(
		assetType: string,
		action: string,
		context: C | undefined,
		data: D | undefined,
		policies: IOdrlPolicy[]
	): Promise<R | undefined>;
}
