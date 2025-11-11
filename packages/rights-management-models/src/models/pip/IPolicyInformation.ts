// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyInformationItems } from "./IPolicyInformationItems.js";

/**
 * Interface describing a Policy Information.
 */
export interface IPolicyInformation {
	[source: string]: IPolicyInformationItems;
}
