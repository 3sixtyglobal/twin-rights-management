// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyNegotiationAdminPointServiceConfig } from "./IPolicyNegotiationAdminPointServiceConfig";

/**
 * Options for the Policy Negotiation Admin Point Component.
 */
export interface IPolicyNegotiationAdminPointServiceConstructorOptions {
	/**
	 * The logging component for logging policy negotiation.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The task scheduler component for scheduling background tasks.
	 * @default task-scheduler
	 */
	taskSchedulerComponentType?: string;

	/**
	 * The entity storage component for storing policy negotiation.
	 * @default policy-negotiation
	 */
	policyNegotiationEntityStorageType?: string;

	/**
	 * The type of the policy information point component.
	 * @default policy-information-point
	 */
	policyInformationPointComponentType?: string;

	/**
	 * Configuration options for the policy negotiation point service.
	 */
	config?: IPolicyNegotiationAdminPointServiceConfig;
}
