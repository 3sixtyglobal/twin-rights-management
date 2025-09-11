// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyInformationItems } from "./IPolicyInformationItems";

/**
 * Interface describing a Policy Information.
 */
export interface IPolicyInformation {
	[source: string]: IPolicyInformationItems;
}
