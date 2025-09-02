// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IStaticPolicyInformationSource } from "./IStaticPolicyInformationSource";

/**
 * Configuration for the Static Policy Information Source Component.
 */
export interface IStaticPolicyInformationSourceConfig {
	/**
	 * The information to return from the PIP.
	 */
	information?: IStaticPolicyInformationSource[];
}
