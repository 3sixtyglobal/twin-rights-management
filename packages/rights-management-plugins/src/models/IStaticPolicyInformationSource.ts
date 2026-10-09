// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	IRightsManagementInformation,
	PolicyInformationAccessMode
} from "@3sixty/rights-management-models";

/**
 * Configuration for the Static Policy Information Source Component.
 */
export interface IStaticPolicyInformationSource {
	/**
	 * Is the information public, if so it will be shared with negotiation requests.
	 */
	accessMode: PolicyInformationAccessMode;

	/**
	 * Information is only provided for the specified locator combination.
	 */
	matchLocators?: {
		assignee?: string;
		assigner?: string;
		target?: string;
		action?: string;
	}[];

	/**
	 * The objects containing the information.
	 */
	objects: IRightsManagementInformation;
}
