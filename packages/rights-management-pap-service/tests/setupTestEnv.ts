// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import path from "node:path";
import { Converter, RandomHelper } from "@twin.org/core";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import {
	type ActionType,
	OdrlContexts,
	type PolicyType,
	type IOdrlPolicy
} from "@twin.org/standards-w3c-odrl";
import * as dotenv from "dotenv";
import type { OdrlPolicy } from "../src/entities/odrlPolicy.js";
import type { PolicyAdministrationPointService } from "../src/policyAdministrationPointService.js";
import { initSchema } from "../src/schema.js";

console.debug("Setting up test environment from .env and .env.dev files");

dotenv.config({
	path: [path.join(__dirname, ".env"), path.join(__dirname, ".env.dev")],
	quiet: true
});

export const TEST_DIRECTORY_ROOT = "./.tmp/";
export const TEST_DIRECTORY = `${TEST_DIRECTORY_ROOT}test-data-${Converter.bytesToHex(RandomHelper.generate(8))}`;

export const TEST_POLICY_ID = "http://example.com/policy/1";
export const TEST_ASSET_ID = "http://example.com/asset/1";
export const TEST_USER_IDENTITY = "user:1234";
export const TEST_NODE_IDENTITY = "node:5678";

export const SAMPLE_POLICY: IOdrlPolicy = {
	"@context": OdrlContexts.ContextRoot,
	"@type": "Set",
	uid: TEST_POLICY_ID,
	permission: [
		{
			target: TEST_ASSET_ID,
			action: "use"
		}
	]
};

// Initialize the schema for the OdrlPolicy entity
initSchema();

// Register the memory storage connector for ODRL policies
EntityStorageConnectorFactory.register(
	"odrl-policy",
	() =>
		new MemoryEntityStorageConnector<OdrlPolicy>({
			entitySchema: nameof<OdrlPolicy>()
		})
);

// Helper function to create test policy without UID (for auto-generation)
const createTestPolicy = (
	id: string,
	policyType: PolicyType,
	assetId: string,
	action: ActionType
): Omit<IOdrlPolicy, "uid"> & { uid?: string } => ({
	"@context": OdrlContexts.ContextRoot,
	"@type": policyType,
	permission: [
		{
			target: assetId,
			action
		}
	]
});

// Store mapping of expected ID to generated UID
export const testPolicyMapping = new Map<string, string>();

export const createTestPolicies = async (
	policyAdminPoint: PolicyAdministrationPointService
): Promise<void> => {
	testPolicyMapping.clear();

	for (let i = 1; i <= 10; i++) {
		const policyType = i % 2 === 0 ? ("Set" as PolicyType) : ("Offer" as PolicyType);
		const assetId = `http://example.com/asset/${Math.ceil(i / 2)}`;
		const action = i % 3 === 0 ? ("display" as ActionType) : ("use" as ActionType);

		const policy = createTestPolicy(i.toString(), policyType, assetId, action);
		const generatedUid = await policyAdminPoint.create(policy);

		// Store mapping for tests that need to know the generated UID
		testPolicyMapping.set(`http://example.com/policy/${i}`, generatedUid);
	}
};
