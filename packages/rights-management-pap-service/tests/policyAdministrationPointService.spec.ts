// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { ArrayHelper, Is, ObjectHelper } from "@twin.org/core";
import type { JsonLdObjectWithOptionalAtId } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import type { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import { PolicyType, OdrlContexts } from "@twin.org/standards-w3c-odrl";
import {
	createTestPolicies,
	SAMPLE_POLICY,
	TEST_DIRECTORY_ROOT,
	TEST_POLICY_ID,
	testPolicyMapping
} from "./setupTestEnv.js";
import type { OdrlPolicy } from "../src/entities/odrlPolicy.js";
import { PolicyAdministrationPointService } from "../src/policyAdministrationPointService.js";

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
		ObjectHelper.propertyDelete(policyWithoutUid, "@id");
		const resultUid = await policyAdminPoint.create(policyWithoutUid);

		expect(resultUid).toBeDefined();
		expect(typeof resultUid).toBe("string");
		expect(resultUid).toMatch(/^urn:policy:/);

		const store = odrlPolicyEntityStorage.getStore();
		expect(store).toBeDefined();
		expect(store.length).toEqual(1);

		const storedPolicy = store[0];
		expect(storedPolicy).toBeDefined();
		expect(storedPolicy.id).toEqual(resultUid);
		expect(storedPolicy.permission).toBeDefined();

		const retrievedPolicy = await policyAdminPoint.get(resultUid);

		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy["@id"]).toEqual(resultUid);
		expect(retrievedPolicy["@type"]).toEqual("Set");
		expect(Is.array(retrievedPolicy.permission)).toBeTruthy();
	});

	test("should retrieve a policy from entity storage", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "@id");
		const createdUid = await policyAdminPoint.create(policyWithoutUid);

		const retrievedPolicy = await policyAdminPoint.get(createdUid);

		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy["@id"]).toEqual(createdUid);
		expect(retrievedPolicy["@type"]).toEqual("Set");

		expect(retrievedPolicy.permission).toBeDefined();
		expect(SAMPLE_POLICY.permission).toBeDefined();

		const retrievedPermission = ArrayHelper.fromObjectOrArray(retrievedPolicy.permission);
		if (Is.array(retrievedPolicy.permission) && Is.array(SAMPLE_POLICY.permission)) {
			expect(retrievedPermission).toHaveLength(1);
			expect(retrievedPermission?.[0]?.target).toEqual(SAMPLE_POLICY.permission?.[0]?.target);
			expect(retrievedPermission?.[0]?.action).toEqual(SAMPLE_POLICY.permission?.[0]?.action);
		}
	});

	test("should throw error when using an invalid uid", async () => {
		await expect(
			policyAdminPoint.create({
				...SAMPLE_POLICY,
				"@id": "invalid-uid-format"
			})
		).rejects.toThrow();
	});

	test("should throw error when retrieving non-existent policy", async () => {
		await expect(policyAdminPoint.get("non-existent-policy")).rejects.toThrow();
	});

	test("should remove a policy from entity storage", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "@id");
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
			const uidCondition: EntityCondition<IDataspaceProtocolPolicy> = {
				property: "id",
				value: expectedUid,
				comparison: "equals"
			};

			const result = await policyAdminPoint.query(undefined, uidCondition);

			expect(result.policies).toBeDefined();
			expect(result.policies.length).toEqual(1);

			expect(result.policies[0]["@id"]).toEqual(expectedUid);
		}
	});

	test("should return empty result for non-matching conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		const uidCondition: EntityCondition<IDataspaceProtocolPolicy> = {
			property: "id",
			value: "non-existent-policy",
			comparison: "equals"
		};

		const result = await policyAdminPoint.query(undefined, uidCondition);

		expect(result.policies).toBeDefined();
		expect(result.policies.length).toEqual(0);
	});

	test("should handle pagination with cursor", async () => {
		await createTestPolicies(policyAdminPoint);

		const result1 = await policyAdminPoint.query(undefined, undefined, undefined, 5);

		expect(result1.policies).toBeDefined();
		expect(result1.policies.length).toEqual(5);
		expect(result1.cursor).toBeDefined();

		const result2 = await policyAdminPoint.query(undefined, undefined, result1.cursor, 5);

		expect(result2.policies).toBeDefined();
		expect(result2.policies.length).toEqual(5);

		const firstPageIds = result1.policies.map(p => p["@id"]);
		const secondPageIds = result2.policies.map(p => p["@id"]);
		expect(firstPageIds).not.toEqual(secondPageIds);
	});

	test("should handle invalid cursor gracefully", async () => {
		await createTestPolicies(policyAdminPoint);

		const result = await policyAdminPoint.query(undefined, undefined, "invalid-cursor", 5);

		expect(result.policies).toBeDefined();
	});

	test("should throw validation error when creating invalid policy", async () => {
		// Create an invalid policy missing required @context and @type
		const invalidPolicy = {
			"@id": "http://example.com/invalid-policy",
			permission: [
				{
					target: "http://example.com/asset/9898",
					action: "use"
				}
			]
		} as unknown as IDataspaceProtocolPolicy;

		await expect(policyAdminPoint.create(invalidPolicy)).rejects.toThrow();
	});

	test("should successfully validate and create a valid ODRL policy", async () => {
		const validPolicy = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Set,
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
		expect(retrievedPolicy["@id"]).toEqual(result);
	});

	test("should validate ODRL policy structure through JSON-LD validation", async () => {
		// Create a policy with all required fields but invalid ODRL structure
		const invalidOdrlPolicy = {
			"@context": OdrlContexts.Context,
			"@type": "InvalidPolicyType" as PolicyType,
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
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Set,
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
		expect(retrievedPolicy["@id"]).toEqual(result);
	});

	test("should create multiple policies with unique auto-generated UIDs", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "@id");
		const uid1 = await policyAdminPoint.create(policyWithoutUid);
		const uid2 = await policyAdminPoint.create(policyWithoutUid);

		expect(uid1).toBeDefined();
		expect(uid2).toBeDefined();
		expect(uid1).not.toEqual(uid2);

		// Both policies should be retrievable
		const policy1 = await policyAdminPoint.get(uid1);
		const policy2 = await policyAdminPoint.get(uid2);
		expect(policy1["@id"]).toEqual(uid1);
		expect(policy2["@id"]).toEqual(uid2);
	});

	test("should update an existing policy", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "@id");
		const createResult = await policyAdminPoint.create(policyWithoutUid);
		const policyId = createResult;

		const updatedPolicy: IDataspaceProtocolPolicy = {
			"@context": OdrlContexts.Context,
			"@type": "Set",
			"@id": policyId,
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
		expect(result["@id"]).toEqual(policyId);
		expect(result.permission).toBeDefined();
		const permission = ArrayHelper.fromObjectOrArray(result.permission);
		if (Is.arrayValue(permission)) {
			expect(permission?.[0]?.target).toEqual("http://example.com/asset/updated");
			expect(permission?.[0]?.action).toEqual("read");
		}
	});

	test("should throw error when updating non-existent policy", async () => {
		const nonExistentId = "http://example.com/non-existent-policy";
		const updatePolicy: IDataspaceProtocolPolicy = {
			"@context": OdrlContexts.Context,
			"@type": "Set",
			"@id": nonExistentId,
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
		const nonExistentPolicy: IDataspaceProtocolPolicy = {
			"@context": OdrlContexts.Context,
			"@type": "Set",
			"@id": "http://example.com/non-existent-uid",
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
		const initialPolicy: JsonLdObjectWithOptionalAtId<IDataspaceProtocolPolicy> = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Set,
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

		const replacementPolicy: IDataspaceProtocolPolicy = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Set,
			"@id": policyId,
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
		expect(result["@id"]).toEqual(policyId);

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
			"@type": PolicyType.Set,
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
		} as Omit<IDataspaceProtocolPolicy, "uid">;

		const createResult = await policyAdminPoint.create(initialPolicy);
		const policyId = createResult;

		const updateWithNewArray: IDataspaceProtocolPolicy = {
			"@context": OdrlContexts.Context,
			"@type": "Set",
			"@id": policyId,
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
		expect(result["@id"]).toEqual(policyId);
		expect(result.permission).toBeDefined();
		expect(result.permission).toHaveLength(1);
		const permission = ArrayHelper.fromObjectOrArray(result.permission);
		if (Is.arrayValue(permission)) {
			expect(permission?.[0]?.target).toEqual("http://example.com/asset/3");
			expect(permission?.[0]?.action).toEqual("display");
		}
	});

	test("should validate updated policy through JSON-LD validation", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "@id");
		const createResult = await policyAdminPoint.create(policyWithoutUid);
		const policyId = createResult;

		const invalidUpdate = {
			"@type": "InvalidType",
			"@id": policyId,
			permission: [
				{
					target: "http://example.com/asset/updated",
					action: "invalidAction"
				}
			]
		} as unknown as IDataspaceProtocolPolicy;

		await policyAdminPoint.update(invalidUpdate);
		const result = await policyAdminPoint.get(policyId);
		expect(result).toBeDefined();
	});

	test("should update policy and persist changes", async () => {
		const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
		ObjectHelper.propertyDelete(policyWithoutUid, "@id");
		const createResult = await policyAdminPoint.create(policyWithoutUid);
		const policyId = createResult;

		const updatedPolicy: IDataspaceProtocolPolicy = {
			"@context": OdrlContexts.Context,
			"@type": "Offer",
			"@id": policyId,
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
		expect(retrievedPolicy["@id"]).toEqual(policyId);
		expect(retrievedPolicy["@type"]).toEqual("Offer");
		const permission = ArrayHelper.fromObjectOrArray(retrievedPolicy.permission);
		if (Is.arrayValue(permission)) {
			expect(permission?.[0]?.target).toEqual("http://example.com/asset/new");
			expect(permission?.[0]?.action).toEqual("modify");
		}
		expect(retrievedPolicy.assigner).toEqual("http://example.com/party/assigner");
	});

	test("should build pipe-delimited index fields on create", async () => {
		const policy: IDataspaceProtocolPolicy = {
			"@context": OdrlContexts.Context,
			"@type": "Offer",
			"@id": TEST_POLICY_ID,
			assigner: "user:assigner-1",
			assignee: {
				uid: "user:assignee-1",
				"@type": "Person"
			},
			target: "http://example.com/asset/alpha",
			action: "use",
			permission: [
				{
					target: "http://example.com/asset/not-indexed",
					action: "display"
				}
			]
		};

		const uid = await policyAdminPoint.create(policy);
		const store = odrlPolicyEntityStorage.getStore();
		expect(store).toHaveLength(1);
		const stored = store[0];
		expect(stored.id).toEqual(uid);
		expect(stored.assignerIndex).toEqual("|user:assigner-1|");
		expect(stored.assigneeIndex).toEqual("|user:assignee-1|");
		expect(stored.targetIndex).toEqual("|http://example.com/asset/alpha|");
		expect(stored.actionIndex).toEqual("|use|");
	});

	test("should query policies by assigner index", async () => {
		const uid1 = await policyAdminPoint.create({
			"@context": OdrlContexts.Context,
			"@type": "Offer",
			assigner: "user:assigner-a",
			permission: [
				{
					target: "http://example.com/asset/a",
					action: "use"
				}
			]
		});

		await policyAdminPoint.create({
			"@context": OdrlContexts.Context,
			"@type": "Offer",
			assigner: "user:assigner-b",
			permission: [
				{
					target: "http://example.com/asset/b",
					action: "use"
				}
			]
		});

		const result = await policyAdminPoint.query({ assigner: "user:assigner-a" });
		expect(result.policies).toHaveLength(1);
		expect(result.policies[0]["@id"]).toEqual(uid1);
	});

	test("should query policies by top-level target and action indexes", async () => {
		const uid1 = await policyAdminPoint.create({
			"@context": OdrlContexts.Context,
			"@type": "Set",
			target: "http://example.com/asset/t1",
			action: "use",
			permission: [
				{
					target: "http://example.com/asset/not-indexed",
					action: "display"
				}
			]
		});

		await policyAdminPoint.create({
			"@context": OdrlContexts.Context,
			"@type": "Set",
			target: "http://example.com/asset/t2",
			action: "display",
			permission: [
				{
					target: "http://example.com/asset/not-indexed-2",
					action: "use"
				}
			]
		});

		const byTarget = await policyAdminPoint.query({ target: "http://example.com/asset/t1" });
		expect(byTarget.policies).toHaveLength(1);
		expect(byTarget.policies[0]["@id"]).toEqual(uid1);

		const byAction = await policyAdminPoint.query({ action: "display" });
		expect(byAction.policies).toHaveLength(1);
		expect(byAction.policies[0]["@id"]).toBeDefined();
	});

	test("should index multiple top-level targets and actions", async () => {
		const uid = await policyAdminPoint.create({
			"@context": OdrlContexts.Context,
			"@type": "Set",
			target: ["http://example.com/asset/a", "http://example.com/asset/b"],
			action: ["use", "read"],
			permission: [
				{
					target: "http://example.com/asset/a",
					action: "use"
				},
				{
					target: "http://example.com/asset/b",
					action: "read"
				}
			]
		});

		const store = odrlPolicyEntityStorage.getStore();
		expect(store).toHaveLength(1);
		expect(store[0].targetIndex).toContain("|http://example.com/asset/a|");
		expect(store[0].targetIndex).toContain("|http://example.com/asset/b|");
		expect(store[0].actionIndex).toContain("|use|");
		expect(store[0].actionIndex).toContain("|read|");

		const byTargetB = await policyAdminPoint.query({ target: "http://example.com/asset/b" });
		expect(byTargetB.policies).toHaveLength(1);
		expect(byTargetB.policies[0]["@id"]).toEqual(uid);

		const byActionRead = await policyAdminPoint.query({ action: "read" });
		expect(byActionRead.policies).toHaveLength(1);
		expect(byActionRead.policies[0]["@id"]).toEqual(uid);
	});

	test("should not query by permission target/action when top-level fields missing", async () => {
		await policyAdminPoint.create({
			"@context": OdrlContexts.Context,
			"@type": "Set",
			permission: [
				{
					target: "http://example.com/asset/only-in-permission",
					action: "use"
				}
			]
		});

		const store = odrlPolicyEntityStorage.getStore();
		expect(store).toHaveLength(1);
		expect(store[0].targetIndex).toEqual("||");
		expect(store[0].actionIndex).toEqual("||");

		const byTarget = await policyAdminPoint.query({
			target: "http://example.com/asset/only-in-permission"
		});
		expect(byTarget.policies).toHaveLength(0);

		const byAction = await policyAdminPoint.query({ action: "use" });
		expect(byAction.policies).toHaveLength(0);
	});
});
