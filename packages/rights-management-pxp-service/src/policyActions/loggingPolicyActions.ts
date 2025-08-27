// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Is } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import type { PolicyActionCallback, PolicyDecisionStage } from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * Create a callback for use with the PXP that logs policy actions.
 * @param loggingComponentType The logging component to use for logging.
 * @param options Options for the logger.
 * @param options.stages The policy decision stages to log, if undefined defaults to all.
 * @param options.includeData Whether to include the data in the log.
 * @param options.includePolicies Whether to include the policies in the log.
 * @returns The instance of the callback.
 */
export function createLoggingPolicyActionCallback(
	loggingComponentType: string,
	options?: {
		stages?: PolicyDecisionStage[];
		includeData?: boolean;
		includePolicies?: boolean;
	}
): PolicyActionCallback {
	return async (
		assetType: string,
		action: string,
		data: unknown | undefined,
		userIdentity: string,
		nodeIdentity: string,
		policies: IOdrlPolicy[],
		stage: PolicyDecisionStage
	) => {
		const logging = ComponentFactory.getIfExists<ILoggingComponent>(loggingComponentType);
		if (Is.empty(options?.stages) || options?.stages.includes(stage)) {
			// Even if we don't have the options to include data or include policies we
			// still create dummy entries, as the logging string still has them embedded
			let logData;
			if (!Is.empty(data)) {
				logData = options?.includeData ? data : "{...}";
			}
			const logPolicies = options?.includePolicies ? policies : "[...]";

			logging?.log({
				level: "info",
				source: "loggingPolicyAction",
				ts: Date.now(),
				message: "policyExecuted",
				data: {
					assetType,
					action,
					data: logData,
					userIdentity,
					nodeIdentity,
					policies: logPolicies,
					stage
				}
			});
		}
	};
}
