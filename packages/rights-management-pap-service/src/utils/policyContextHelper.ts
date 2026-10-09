// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is, ObjectHelper } from "@3sixty/core";
import { JsonLdProcessor } from "@3sixty/data-json-ld";
import {
	POLICY_METADATA_CONTEXT,
	type IRightsManagementPolicyMetadata
} from "@3sixty/rights-management-models";
import { OdrlContexts, type OdrlContextType } from "@3sixty/standards-w3c-odrl";

/**
 * Normalizes the caller JSON-LD context, defaulting to ODRL when omitted.
 * @param context The optional JSON-LD context from the caller.
 * @returns The normalized context value.
 */
export function normalizeContext(context?: OdrlContextType): OdrlContextType {
	if (Is.empty(context)) {
		return OdrlContexts.Context;
	}

	return context;
}

/**
 * Returns true when the context already includes the policy metadata term definitions.
 * @param context The JSON-LD context value.
 * @returns Whether policy metadata context is present.
 */
export function hasPolicyMetadataContext(context: OdrlContextType): boolean {
	if (!Is.array(context)) {
		return false;
	}

	return context.some(
		entry => Is.object(entry) && ObjectHelper.equal(entry, POLICY_METADATA_CONTEXT)
	);
}

/**
 * Ensures policy metadata term definitions are present in the JSON-LD context without duplicating them.
 * @param context The JSON-LD context value.
 * @returns The context with policy metadata terms included when missing.
 */
export function ensurePolicyMetadataContext(context: OdrlContextType): OdrlContextType {
	if (hasPolicyMetadataContext(context)) {
		return context;
	}

	return JsonLdProcessor.combineContexts(context, POLICY_METADATA_CONTEXT) as OdrlContextType;
}

/**
 * Server-controlled JSON-LD context persisted and returned for policies with metadata timestamps.
 * Caller-supplied context is not stored or echoed on read.
 * @returns ODRL context with policy metadata term definitions.
 */
export function buildPapStorageContext(): OdrlContextType {
	return ensurePolicyMetadataContext(OdrlContexts.Context);
}

/**
 * Returns true when the policy has PAP-managed metadata timestamps.
 * @param policy The policy or stored entity to check.
 * @returns Whether policy metadata is present.
 */
export function hasPolicyMetadata(policy: IRightsManagementPolicyMetadata): boolean {
	return Is.stringValue(policy.dateCreated) || Is.stringValue(policy.dateModified);
}
