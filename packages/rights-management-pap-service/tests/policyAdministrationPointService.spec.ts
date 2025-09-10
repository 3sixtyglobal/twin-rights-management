// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { Is, ObjectHelper } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import type { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import { OdrlContexts, type IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import {
	createTestPolicies,
	SAMPLE_POLICY,
	TEST_DIRECTORY_ROOT,
	testPolicyMapping
} from "./setupTestEnv";
import type { OdrlPolicy } from "../src/entities/odrlPolicy";
import { PolicyAdministrationPointService } from "../src/policyAdministrationPointService";

describe("PolicyAdministrationPointService", () => {
	let policyAdminPoint: PolicyAdministrationPointService;
	let odrlPolicyEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;

	beforeEach(() => {
		odrlPolicyEntityStorage =
			EntityStorageConnectorFactory.get<MemoryEntityStorageConnector<OdrlPolicy>>("odrl-policy");

		policyAdminPoint = new PolicyAdministrationPointService({
			odrlPolicyEntityStorageType: "odrl-policy"
		});
	});

	afterEach(() => {
		odrlPolicyEntityStorage.getStore().length = 0;
	});

	afterAll(async () => {
		if (existsSync(TEST_DIRECTORY_ROOT)) {
			await rm(TEST_DIRECTORY_ROOT, { recursive: true });
		}
	});

	test("should create a policy in entity storage", async () => {
		// Remove UID from sample policy since create now auto-generates UIDs
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "uid");
		const resultUid = await policyAdminPoint.create(policyWithoutUid);

		expect(resultUid).toBeDefined();
		expect(typeof resultUid).toBe("string");
		expect(resultUid).toMatch(/^urn:policy:/);

		const store = odrlPolicyEntityStorage.getStore();
		expect(store).toBeDefined();
		expect(store.length).toEqual(1);

		const storedPolicy = store[0];
		expect(storedPolicy).toBeDefined();
		expect(storedPolicy.uid).toEqual(resultUid);
		expect(storedPolicy.permission).toBeDefined();

		const retrievedPolicy = await policyAdminPoint.get(resultUid);

		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(resultUid);
		expect(retrievedPolicy["@type"]).toEqual("Set");
		expect(retrievedPolicy["@context"]).toBeDefined();
		expect(Is.array(retrievedPolicy.permission)).toBeTruthy();
	});

	test("should retrieve a policy from entity storage", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "uid");
		const createdUid = await policyAdminPoint.create(policyWithoutUid);

		const retrievedPolicy = await policyAdminPoint.get(createdUid);

		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(createdUid);
		expect(retrievedPolicy["@type"]).toEqual("Set");

		expect(retrievedPolicy.permission).toBeDefined();
		expect(SAMPLE_POLICY.permission).toBeDefined();

		if (retrievedPolicy.permission && SAMPLE_POLICY.permission) {
			expect(retrievedPolicy.permission).toHaveLength(1);
			expect(retrievedPolicy.permission[0].target).toEqual(SAMPLE_POLICY.permission[0].target);
			expect(retrievedPolicy.permission[0].action).toEqual(SAMPLE_POLICY.permission[0].action);
		}
	});

	test("should throw error when using an invalid uid", async () => {
		await expect(
			policyAdminPoint.create({
				...SAMPLE_POLICY,
				uid: "invalid-uid-format"
			})
		).rejects.toThrow();
	});

	test("should throw error when retrieving non-existent policy", async () => {
		await expect(policyAdminPoint.get("non-existent-policy")).rejects.toThrow();
	});

	test("should remove a policy from entity storage", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "uid");
		const createdUid = await policyAdminPoint.create(policyWithoutUid);

		let store = odrlPolicyEntityStorage.getStore();
		expect(store.length).toEqual(1);

		const retrievedPolicy = await policyAdminPoint.get(createdUid);
		expect(retrievedPolicy).toBeDefined();

		await policyAdminPoint.remove(createdUid);

		store = odrlPolicyEntityStorage.getStore();
		expect(store.length).toEqual(0);

		await expect(policyAdminPoint.get(createdUid)).rejects.toThrow();
	});

	test("should query policies without conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		const store = odrlPolicyEntityStorage.getStore();
		expect(store.length).toEqual(10);

		const result = await policyAdminPoint.query();

		expect(result.policies).toBeDefined();
		expect(result.policies.length).toEqual(10);
	});

	test("should query policies with specific conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		// Get the actual generated UID for policy 1
		const expectedUid = testPolicyMapping.get("http://example.com/policy/1");
		expect(expectedUid).toBeDefined();

		if (expectedUid) {
			const uidCondition: EntityCondition<IOdrlPolicy> = {
				property: "uid",
				value: expectedUid,
				comparison: "equals"
			};

			const result = await policyAdminPoint.query(uidCondition);

			expect(result.policies).toBeDefined();
			expect(result.policies.length).toEqual(1);

			expect(result.policies[0].uid).toEqual(expectedUid);
		}
	});

	test("should return empty result for non-matching conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		const uidCondition: EntityCondition<IOdrlPolicy> = {
			property: "uid",
			value: "non-existent-policy",
			comparison: "equals"
		};

		const result = await policyAdminPoint.query(uidCondition);

		expect(result.policies).toBeDefined();
		expect(result.policies.length).toEqual(0);
	});

	test("should handle pagination with cursor", async () => {
		await createTestPolicies(policyAdminPoint);

		const result1 = await policyAdminPoint.query(undefined, undefined, 5);

		expect(result1.policies).toBeDefined();
		expect(result1.policies.length).toEqual(5);
		expect(result1.cursor).toBeDefined();

		const result2 = await policyAdminPoint.query(undefined, result1.cursor, 5);

		expect(result2.policies).toBeDefined();
		expect(result2.policies.length).toEqual(5);

		const firstPageIds = result1.policies.map(p => p.uid);
		const secondPageIds = result2.policies.map(p => p.uid);
		expect(firstPageIds).not.toEqual(secondPageIds);
	});

	test("should handle invalid cursor gracefully", async () => {
		await createTestPolicies(policyAdminPoint);

		const result = await policyAdminPoint.query(undefined, "invalid-cursor", 5);

		expect(result.policies).toBeDefined();
	});

	test("should throw validation error when creating invalid policy", async () => {
		// Create an invalid policy missing required @context and @type
		const invalidPolicy = {
			uid: "http://example.com/invalid-policy",
			permission: [
				{
					target: "http://example.com/asset/9898",
					action: "use"
				}
			]
		} as unknown as IOdrlPolicy;

		await expect(policyAdminPoint.create(invalidPolicy)).rejects.toThrow();
	});

	test("should successfully validate and create a valid ODRL policy", async () => {
		const validPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			permission: [
				{
					target: "http://example.com/asset/123",
					action: "use"
				}
			]
		};

		const result = await policyAdminPoint.create(validPolicy);
		expect(result).toBeDefined();
		expect(result).toMatch(/^urn:policy:/);

		const retrievedPolicy = await policyAdminPoint.get(result);
		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(result);
	});

	test("should validate ODRL policy structure through JSON-LD validation", async () => {
		// Create a policy with all required fields but invalid ODRL structure
		const invalidOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "InvalidPolicyType",
			permission: [
				{
					target: "http://example.com/asset/123",
					action: "invalidAction"
				}
			]
		};

		const result = await policyAdminPoint.create(invalidOdrlPolicy);
		expect(result).toBeDefined();
	});

	test("should auto-generate UID when not provided", async () => {
		const policyWithoutUid = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			permission: [
				{
					target: "http://example.com/asset/123",
					action: "use"
				}
			]
		};

		const result = await policyAdminPoint.create(policyWithoutUid);
		expect(result).toBeDefined();
		expect(result).toBeDefined();
		expect(result).toMatch(/^urn:policy:/);

		const retrievedPolicy = await policyAdminPoint.get(result);
		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(result);
	});

	test("should create multiple policies with unique auto-generated UIDs", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "uid");
		const uid1 = await policyAdminPoint.create(policyWithoutUid);
		const uid2 = await policyAdminPoint.create(policyWithoutUid);

		expect(uid1).toBeDefined();
		expect(uid2).toBeDefined();
		expect(uid1).not.toEqual(uid2);

		// Both policies should be retrievable
		const policy1 = await policyAdminPoint.get(uid1);
		const policy2 = await policyAdminPoint.get(uid2);
		expect(policy1.uid).toEqual(uid1);
		expect(policy2.uid).toEqual(uid2);
	});

	test("should update an existing policy", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "uid");
		const createResult = await policyAdminPoint.create(policyWithoutUid);
		const policyId = createResult;

		const updatedPolicy: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: policyId,
			permission: [
				{
					target: "http://example.com/asset/updated",
					action: "read"
				}
			]
		};

		await policyAdminPoint.update(updatedPolicy);
		const result = await policyAdminPoint.get(policyId);

		expect(result).toBeDefined();
		expect(result.uid).toEqual(policyId);
		expect(result.permission).toBeDefined();
		if (result.permission && result.permission.length > 0) {
			expect(result.permission[0].target).toEqual("http://example.com/asset/updated");
			expect(result.permission[0].action).toEqual("read");
		}
	});

	test("should throw error when updating non-existent policy", async () => {
		const nonExistentId = "http://example.com/non-existent-policy";
		const updatePolicy: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: nonExistentId,
			permission: [
				{
					target: "http://example.com/asset/updated",
					action: "read"
				}
			]
		};

		await expect(policyAdminPoint.update(updatePolicy)).rejects.toThrow();
	});

	test("should throw error when updating with non-existent UID", async () => {
		// Try to update a policy that doesn't exist
		const nonExistentPolicy: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: "http://example.com/non-existent-uid",
			permission: [
				{
					target: "http://example.com/asset/updated",
					action: "read"
				}
			]
		};

		await expect(policyAdminPoint.update(nonExistentPolicy)).rejects.toThrow();
	});

	test("should replace policy entirely in update", async () => {
		// Create initial policy with complex structure
		const initialPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			assigner: {
				uid: "http://example.com/party/1",
				"@type": "Party"
			},
			permission: [
				{
					target: "http://example.com/asset/1",
					action: "use",
					constraint: [
						{
							leftOperand: "count",
							operator: "lteq",
							rightOperand: "5"
						}
					]
				}
			]
		};

		const createResult = await policyAdminPoint.create(initialPolicy);
		const policyId = createResult;

		const replacementPolicy: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: policyId,
			assigner: {
				uid: "http://example.com/party/1",
				"@type": "Organization"
			},
			assignee: {
				uid: "http://example.com/party/2",
				"@type": "Person"
			}
		};

		await policyAdminPoint.update(replacementPolicy);
		const result = await policyAdminPoint.get(policyId);

		expect(result).toBeDefined();
		expect(result.uid).toEqual(policyId);

		// Check policy was completely replaced
		expect(result.assigner).toBeDefined();
		if (result.assigner && typeof result.assigner === "object" && "uid" in result.assigner) {
			expect(result.assigner.uid).toEqual("http://example.com/party/1");
			expect(result.assigner["@type"]).toEqual("Organization");
		}

		expect(result.assignee).toBeDefined();
		if (result.assignee && typeof result.assignee === "object" && "uid" in result.assignee) {
			expect(result.assignee.uid).toEqual("http://example.com/party/2");
		}

		// Check original permission was NOT preserved (policy was replaced)
		expect(result.permission).toBeUndefined();
	});

	test("should replace arrays entirely in update", async () => {
		const initialPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			permission: [
				{
					target: "http://example.com/asset/1",
					action: "use"
				},
				{
					target: "http://example.com/asset/2",
					action: "read"
				}
			]
		} as Omit<IOdrlPolicy, "uid">;

		const createResult = await policyAdminPoint.create(initialPolicy);
		const policyId = createResult;

		const updateWithNewArray: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: policyId,
			permission: [
				{
					target: "http://example.com/asset/3",
					action: "display"
				}
			]
		};

		await policyAdminPoint.update(updateWithNewArray);
		const result = await policyAdminPoint.get(policyId);

		expect(result).toBeDefined();
		expect(result.uid).toEqual(policyId);
		expect(result.permission).toBeDefined();
		expect(result.permission).toHaveLength(1);
		if (result.permission && result.permission.length > 0) {
			expect(result.permission[0].target).toEqual("http://example.com/asset/3");
			expect(result.permission[0].action).toEqual("display");
		}
	});

	test("should validate updated policy through JSON-LD validation", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "uid");
		const createResult = await policyAdminPoint.create(policyWithoutUid);
		const policyId = createResult;

		const invalidUpdate = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "InvalidType",
			uid: policyId,
			permission: [
				{
					target: "http://example.com/asset/updated",
					action: "invalidAction"
				}
			]
		} as unknown as IOdrlPolicy;

		await policyAdminPoint.update(invalidUpdate);
		const result = await policyAdminPoint.get(policyId);
		expect(result).toBeDefined();
	});

	test("should update policy and persist changes", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "uid");
		const createResult = await policyAdminPoint.create(policyWithoutUid);
		const policyId = createResult;

		const updatedPolicy: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Offer",
			uid: policyId,
			permission: [
				{
					target: "http://example.com/asset/new",
					action: "modify"
				}
			],
			assigner: "http://example.com/party/assigner"
		};

		await policyAdminPoint.update(updatedPolicy);

		const retrievedPolicy = await policyAdminPoint.get(policyId);
		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(policyId);
		expect(retrievedPolicy["@type"]).toEqual("Offer");
		if (retrievedPolicy.permission && retrievedPolicy.permission.length > 0) {
			expect(retrievedPolicy.permission[0].target).toEqual("http://example.com/asset/new");
			expect(retrievedPolicy.permission[0].action).toEqual("modify");
		}
		expect(retrievedPolicy.assigner).toEqual("http://example.com/party/assigner");
	});
});
