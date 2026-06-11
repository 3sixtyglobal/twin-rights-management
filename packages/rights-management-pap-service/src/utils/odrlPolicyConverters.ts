// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ArrayHelper, Is } from "@twin.org/core";
import {
	OdrlPolicyHelper,
	type IRightsManagementPolicy,
	type IRightsManagementPolicyMetadata
} from "@twin.org/rights-management-models";
import { OdrlPolicyType, OdrlContexts, type OdrlContextType } from "@twin.org/standards-w3c-odrl";
import { buildPapStorageContext, hasPolicyMetadata } from "./policyContextHelper.js";
import { OdrlPolicy } from "../entities/odrlPolicy.js";

/**
 * Converts an IDataspaceProtocolPolicy to an OdrlPolicy for storage.
 * @param policy The policy to convert.
 * @param metadata PAP-managed lifecycle metadata.
 * @param context Server-controlled JSON-LD context to persist.
 * @returns The converted policy.
 */
export function convertToStoragePolicy<T extends IRightsManagementPolicy>(
	policy: T,
	metadata?: IRightsManagementPolicyMetadata,
	context?: OdrlContextType
): OdrlPolicy {
	const storagePolicy = new OdrlPolicy();
	storagePolicy.id = OdrlPolicyHelper.getUid(policy) ?? "";
	storagePolicy.type = (OdrlPolicyHelper.getType(policy) ??
		OdrlPolicyType.Policy) as OdrlPolicyType;

	storagePolicy.profile = policy.profile;
	storagePolicy.assigner = policy.assigner;
	storagePolicy.assignee = policy.assignee;
	storagePolicy.target = policy.target;
	storagePolicy.action = policy.action;
	storagePolicy.inheritFrom = policy.inheritFrom;
	storagePolicy.conflict = policy.conflict;
	storagePolicy.permission = policy.permission;
	storagePolicy.prohibition = policy.prohibition;
	storagePolicy.obligation = policy.obligation;

	if (Is.stringValue(metadata?.dateCreated)) {
		storagePolicy.dateCreated = metadata.dateCreated;
	}
	if (Is.stringValue(metadata?.dateModified)) {
		storagePolicy.dateModified = metadata.dateModified;
	}
	if (!Is.empty(context)) {
		storagePolicy.context = context;
	}

	// Build the indexes
	const assigner = ArrayHelper.fromObjectOrArray(OdrlPolicyHelper.getPartyIds(policy.assigner));
	storagePolicy.assignerIndex = `|${assigner.join("|")}|`;

	const assignee = ArrayHelper.fromObjectOrArray(OdrlPolicyHelper.getPartyIds(policy.assignee));
	storagePolicy.assigneeIndex = `|${assignee.join("|")}|`;

	const targetTokens: string[] = OdrlPolicyHelper.getTargets(policy);
	storagePolicy.targetIndex = `|${targetTokens.join("|")}|`;

	const actionTokens: string[] = OdrlPolicyHelper.getActions(policy);
	storagePolicy.actionIndex = `|${actionTokens.join("|")}|`;

	return storagePolicy;
}

/**
 * Converts an OdrlPolicy from storage to an IDataspaceProtocolPolicy.
 * @param storagePolicy The storage policy to convert.
 * @returns The converted IDataspaceProtocolPolicy.
 */
export function convertFromStoragePolicy<T extends IRightsManagementPolicy>(
	storagePolicy: OdrlPolicy
): T {
	const hasMetadata = hasPolicyMetadata(storagePolicy);

	const policy: IRightsManagementPolicy = {
		"@context": hasMetadata
			? (storagePolicy.context ?? buildPapStorageContext())
			: OdrlContexts.Context,
		"@type": storagePolicy.type,
		"@id": storagePolicy.id
	};

	policy.profile = storagePolicy.profile;
	policy.assigner = storagePolicy.assigner;
	policy.assignee = storagePolicy.assignee;
	policy.target = storagePolicy.target;
	policy.action = storagePolicy.action;
	policy.inheritFrom = storagePolicy.inheritFrom;
	policy.conflict = storagePolicy.conflict;
	policy.permission = storagePolicy.permission;
	policy.prohibition = storagePolicy.prohibition;
	policy.obligation = storagePolicy.obligation;

	if (hasMetadata) {
		policy.dateCreated = storagePolicy.dateCreated;
		policy.dateModified = storagePolicy.dateModified;
	}

	return policy as T;
}

/**
 * Builds the server-controlled JSON-LD context stored for policies with lifecycle timestamps.
 * @returns The context to persist, with lifecycle term definitions included.
 */
export function buildStorageContext(): ReturnType<typeof buildPapStorageContext> {
	return buildPapStorageContext();
}
