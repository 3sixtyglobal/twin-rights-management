// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { ArrayHelper, Is, ObjectHelper } from "@twin.org/core";
import type { IJsonLdNodeObject, JsonLdObjectWithOptionalAtId } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import type { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import type { IRightsManagementPolicy } from "@twin.org/rights-management-models";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import { OdrlContexts, OdrlPolicyType, type OdrlContextType } from "@twin.org/standards-w3c-odrl";
import {
	createTestPolicies,
	resetOdrlPolicyStorage,
	SAMPLE_POLICY,
	TEST_ASSET_ID,
	TEST_DIRECTORY_ROOT,
	TEST_POLICY_ID,
	TEST_USER_IDENTITY,
	testPolicyMapping
} from "./setupTestEnv.js";
import { OdrlPolicy } from "../src/entities/odrlPolicy.js";
import { PolicyAdministrationPointService } from "../src/policyAdministrationPointService.js";
import { buildPapStorageContext } from "../src/utils/policyContextHelper.js";

describe("PolicyAdministrationPointService", () => {
	let policyAdminPoint: PolicyAdministrationPointService;
	let odrlPolicyEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;

	beforeEach(() => {
		odrlPolicyEntityStorage = resetOdrlPolicyStorage();

		policyAdminPoint = new PolicyAdministrationPointService({
			odrlPolicyEntityStorageType: "odrl-policy"
		});
	});

	afterEach(async () => {
		await odrlPolicyEntityStorage?.teardown();
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

		const store = await odrlPolicyEntityStorage.getStore();
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

	test("should throw AlreadyExistsError when creating a policy with an id that already exists", async () => {
		const uid = await policyAdminPoint.create({
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Set,
			"@id": TEST_POLICY_ID,
			permission: [{ target: TEST_ASSET_ID, action: "use" }]
		});

		await expect(
			policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Set,
				"@id": uid,
				permission: [{ target: TEST_ASSET_ID, action: "use" }]
			})
		).rejects.toMatchObject({ name: "AlreadyExistsError" });
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

		let store = await odrlPolicyEntityStorage.getStore();
		expect(store.length).toEqual(1);

		const retrievedPolicy = await policyAdminPoint.get(createdUid);
		expect(retrievedPolicy).toBeDefined();

		await policyAdminPoint.remove(createdUid);

		store = await odrlPolicyEntityStorage.getStore();
		expect(store.length).toEqual(0);

		await expect(policyAdminPoint.get(createdUid)).rejects.toThrow();
	});

	test("should query policies without conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		const store = await odrlPolicyEntityStorage.getStore();
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

	test("should query policies with model-shaped properties list", async () => {
		await createTestPolicies(policyAdminPoint);

		const result = await policyAdminPoint.query(undefined, undefined, undefined, undefined, [
			"@id",
			"@type"
		]);

		expect(result.policies.length).toEqual(10);
		for (const policy of result.policies) {
			expect(policy["@id"]).toBeDefined();
			expect(policy["@type"]).toBeDefined();
			expect(policy.permission).toBeUndefined();
		}
	});

	test("should query policies with storage-shaped properties list", async () => {
		await createTestPolicies(policyAdminPoint);

		const result = await policyAdminPoint.query(undefined, undefined, undefined, undefined, [
			"id",
			"type"
		] as unknown as (keyof IRightsManagementPolicy)[]);

		expect(result.policies.length).toEqual(10);
		for (const policy of result.policies) {
			expect(policy["@id"]).toBeDefined();
			expect(policy["@type"]).toBeDefined();
			expect(policy.permission).toBeUndefined();
		}
	});

	test("should always include the policy id when querying with a reduced properties list", async () => {
		await createTestPolicies(policyAdminPoint);

		const result = await policyAdminPoint.query(undefined, undefined, undefined, undefined, [
			"dateCreated"
		]);

		expect(result.policies.length).toEqual(10);
		for (const policy of result.policies) {
			expect(policy["@id"]).toBeDefined();
			expect(policy.dateCreated).toBeDefined();
			expect(policy["@type"]).toBeUndefined();
			expect(policy.permission).toBeUndefined();
		}
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
			"@type": OdrlPolicyType.Set,
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
			"@type": "InvalidPolicyType" as OdrlPolicyType,
			permission: [
				{
					target: "http://example.com/asset/123",
					action: "invalidAction"
				}
			]
		};

		await expect(policyAdminPoint.create(invalidOdrlPolicy)).rejects.toThrow();
	});

	test("should auto-generate UID when not provided", async () => {
		const policyWithoutUid = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Set,
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
			"@type": OdrlPolicyType.Set,
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
			"@type": OdrlPolicyType.Set,
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
		if (Is.object(result.assigner) && "uid" in result.assigner) {
			expect(result.assigner.uid).toEqual("http://example.com/party/1");
			expect(result.assigner["@type"]).toEqual("Organization");
		}

		expect(result.assignee).toBeDefined();
		if (Is.object(result.assignee) && "uid" in result.assignee) {
			expect(result.assignee.uid).toEqual("http://example.com/party/2");
		}

		// Check original permission was NOT preserved (policy was replaced)
		expect(result.permission).toBeUndefined();
	});

	test("should replace arrays entirely in update", async () => {
		const initialPolicy = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Set,
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

		await expect(policyAdminPoint.update(invalidUpdate)).rejects.toThrow();
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

	test("should build pipe-delimited index fields on create, including rule-level targets and actions", async () => {
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
					target: "http://example.com/asset/rule-level",
					action: "display"
				}
			]
		};

		const uid = await policyAdminPoint.create(policy);
		const store = await odrlPolicyEntityStorage.getStore();
		expect(store).toHaveLength(1);
		const stored = store[0];
		expect(stored.id).toEqual(uid);
		expect(stored.assignerIndex).toEqual("|user:assigner-1|");
		expect(stored.assigneeIndex).toEqual("|user:assignee-1|");
		expect(stored.targetIndex).toEqual(
			"|http://example.com/asset/alpha|http://example.com/asset/rule-level|"
		);
		expect(stored.actionIndex).toEqual("|use|display|");
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

	test("should query policies by target and action indexes, including rule-level fields", async () => {
		const uid1 = await policyAdminPoint.create({
			"@context": OdrlContexts.Context,
			"@type": "Set",
			target: "http://example.com/asset/t1",
			action: "use",
			permission: [
				{
					target: "http://example.com/asset/rule-only",
					action: "display"
				}
			]
		});

		const uid2 = await policyAdminPoint.create({
			"@context": OdrlContexts.Context,
			"@type": "Set",
			target: "http://example.com/asset/t2",
			action: "display"
		});

		const byTarget = await policyAdminPoint.query({ target: "http://example.com/asset/t1" });
		expect(byTarget.policies).toHaveLength(1);
		expect(byTarget.policies[0]["@id"]).toEqual(uid1);

		const byRuleTarget = await policyAdminPoint.query({
			target: "http://example.com/asset/rule-only"
		});
		expect(byRuleTarget.policies).toHaveLength(1);
		expect(byRuleTarget.policies[0]["@id"]).toEqual(uid1);

		const byAction = await policyAdminPoint.query({ action: "display" });
		expect(byAction.policies).toHaveLength(2);

		const byTopLevelAction = await policyAdminPoint.query({ action: "use" });
		expect(byTopLevelAction.policies).toHaveLength(1);
		expect(byTopLevelAction.policies[0]["@id"]).toEqual(uid1);

		const byUid2Action = await policyAdminPoint.query({ action: "display" });
		const ids = byUid2Action.policies.map(p => p["@id"]);
		expect(ids).toContain(uid1);
		expect(ids).toContain(uid2);
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

		const store = await odrlPolicyEntityStorage.getStore();
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

	test("should query by permission target/action even when top-level fields are missing", async () => {
		const uid = await policyAdminPoint.create({
			"@context": OdrlContexts.Context,
			"@type": "Set",
			permission: [
				{
					target: "http://example.com/asset/only-in-permission",
					action: "use"
				}
			]
		});

		const store = await odrlPolicyEntityStorage.getStore();
		expect(store).toHaveLength(1);
		expect(store[0].targetIndex).toEqual("|http://example.com/asset/only-in-permission|");
		expect(store[0].actionIndex).toEqual("|use|");

		const byTarget = await policyAdminPoint.query({
			target: "http://example.com/asset/only-in-permission"
		});
		expect(byTarget.policies).toHaveLength(1);
		expect(byTarget.policies[0]["@id"]).toEqual(uid);

		const byAction = await policyAdminPoint.query({ action: "use" });
		expect(byAction.policies).toHaveLength(1);
		expect(byAction.policies[0]["@id"]).toEqual(uid);
	});

	describe("getAgreement", () => {
		test("should return agreement when type matches", async () => {
			const uid = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [{ action: "use", target: "http://example.com/asset/1" }]
			});

			const result = await policyAdminPoint.getAgreement(uid);

			expect(result["@type"]).toBe(OdrlPolicyType.Agreement);
			expect(result["@id"]).toBe(uid);
			expect(result.assigner).toBe("did:example:assigner");
			expect(result.assignee).toBe("did:example:assignee");
		});

		test("should throw agreementNotFound when policy does not exist", async () => {
			await expect(policyAdminPoint.getAgreement("urn:twin:policy:non-existent")).rejects.toThrow(
				"agreementNotFound"
			);
		});

		test("should throw agreementTypeMismatch when type is not Agreement", async () => {
			const uid = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Set,
				permission: [{ action: "use", target: "http://example.com/asset/1" }]
			});

			await expect(policyAdminPoint.getAgreement(uid)).rejects.toThrow("agreementTypeMismatch");
		});
	});

	describe("getOffer", () => {
		test("should return offer when type matches", async () => {
			const uid = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Offer,
				assigner: "did:example:assigner",
				permission: [{ action: "use", target: "http://example.com/asset/1" }]
			});

			const result = await policyAdminPoint.getOffer(uid);

			expect(result["@type"]).toBe(OdrlPolicyType.Offer);
			expect(result["@id"]).toBe(uid);
			expect(result.assigner).toBe("did:example:assigner");
		});

		test("should throw offerNotFound when policy does not exist", async () => {
			await expect(policyAdminPoint.getOffer("urn:twin:policy:non-existent")).rejects.toThrow(
				"offerNotFound"
			);
		});

		test("should throw offerTypeMismatch when type is not Offer", async () => {
			const uid = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Set,
				permission: [{ action: "use", target: "http://example.com/asset/1" }]
			});

			await expect(policyAdminPoint.getOffer(uid)).rejects.toThrow("offerTypeMismatch");
		});
	});

	describe("getSet", () => {
		test("should return set when type matches", async () => {
			const uid = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Set,
				permission: [{ action: "use", target: "http://example.com/asset/1" }]
			});

			const result = await policyAdminPoint.getSet(uid);

			expect(result["@type"]).toBe(OdrlPolicyType.Set);
			expect(result["@id"]).toBe(uid);
		});

		test("should throw setNotFound when policy does not exist", async () => {
			await expect(policyAdminPoint.getSet("urn:twin:policy:non-existent")).rejects.toThrow(
				"setNotFound"
			);
		});

		test("should throw setTypeMismatch when type is not Set", async () => {
			const uid = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Offer,
				assigner: "did:example:assigner",
				permission: [{ action: "use", target: "http://example.com/asset/1" }]
			});

			await expect(policyAdminPoint.getSet(uid)).rejects.toThrow("setTypeMismatch");
		});
	});

	describe("policy lifecycle timestamps", () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date("2025-06-10T10:00:00.000Z"));
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		test("should store dateCreated and dateModified on create", async () => {
			const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
			ObjectHelper.propertyDelete(policyWithoutUid, "@id");

			const policyId = await policyAdminPoint.create(policyWithoutUid);
			const retrievedPolicy = await policyAdminPoint.get(policyId);

			expect(retrievedPolicy.dateCreated).toBe("2025-06-10T10:00:00.000Z");
			expect(retrievedPolicy.dateModified).toBe("2025-06-10T10:00:00.000Z");
		});

		test("should ignore caller-supplied lifecycle timestamps on create", async () => {
			const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
			ObjectHelper.propertyDelete(policyWithoutUid, "@id");
			ObjectHelper.propertySet(policyWithoutUid, "dateCreated", "2020-01-01T00:00:00.000Z");
			ObjectHelper.propertySet(policyWithoutUid, "dateModified", "2020-01-02T00:00:00.000Z");

			const policyId = await policyAdminPoint.create(policyWithoutUid);
			const retrievedPolicy = await policyAdminPoint.get(policyId);

			expect(retrievedPolicy.dateCreated).toBe("2025-06-10T10:00:00.000Z");
			expect(retrievedPolicy.dateModified).toBe("2025-06-10T10:00:00.000Z");
		});

		test("should preserve dateCreated and refresh dateModified on update", async () => {
			const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
			ObjectHelper.propertyDelete(policyWithoutUid, "@id");
			const policyId = await policyAdminPoint.create(policyWithoutUid);

			vi.setSystemTime(new Date("2025-06-10T11:00:00.000Z"));

			await policyAdminPoint.update({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Set,
				"@id": policyId,
				permission: [{ target: TEST_ASSET_ID, action: "read" }]
			});

			const retrievedPolicy = await policyAdminPoint.get(policyId);

			expect(retrievedPolicy.dateCreated).toBe("2025-06-10T10:00:00.000Z");
			expect(retrievedPolicy.dateModified).toBe("2025-06-10T11:00:00.000Z");
		});

		test("should include lifecycle term definitions in JSON-LD context when lifecycle fields are present", async () => {
			const policyWithoutUid = ObjectHelper.clone(SAMPLE_POLICY);
			ObjectHelper.propertyDelete(policyWithoutUid, "@id");

			const policyId = await policyAdminPoint.create(policyWithoutUid);
			const retrievedPolicy = await policyAdminPoint.get(policyId);
			const storedEntity = await odrlPolicyEntityStorage.get(policyId);

			expect(retrievedPolicy["@context"]).toEqual(buildPapStorageContext());
			expect(storedEntity?.context).toEqual(retrievedPolicy["@context"]);
		});

		test("should not echo caller context on read", async () => {
			const twinContext = [
				OdrlContexts.Context,
				{
					twin: "https://w3id.org/twin/odrl/"
				}
			] as OdrlContextType;

			const policyId = await policyAdminPoint.create({
				"@context": twinContext,
				"@type": OdrlPolicyType.Set,
				permission: [{ target: TEST_ASSET_ID, action: "use" }]
			});

			const retrievedPolicy = await policyAdminPoint.get(policyId);

			expect(retrievedPolicy["@context"]).toEqual(buildPapStorageContext());
		});

		test("should not echo caller context after update", async () => {
			const policyId = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Set,
				permission: [{ target: TEST_ASSET_ID, action: "use" }]
			});

			await policyAdminPoint.update({
				"@context": [
					OdrlContexts.Context,
					{
						newprefix: "https://example.org/new/"
					}
				] as OdrlContextType,
				"@type": OdrlPolicyType.Set,
				"@id": policyId,
				permission: [{ target: TEST_ASSET_ID, action: "read" }]
			});

			const retrievedPolicy = await policyAdminPoint.get(policyId);
			expect(retrievedPolicy["@context"]).toEqual(buildPapStorageContext());
		});

		test("should round-trip Offer via get then update with returned body", async () => {
			const policyId = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Offer,
				assigner: TEST_USER_IDENTITY,
				permission: [{ target: TEST_ASSET_ID, action: "use" }]
			});

			const retrievedPolicy = await policyAdminPoint.get(policyId);
			await expect(policyAdminPoint.update(retrievedPolicy)).resolves.toBeUndefined();
		});

		test("should round-trip Set via get then update with returned body", async () => {
			const policyId = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Set,
				permission: [{ target: TEST_ASSET_ID, action: "use" }]
			});

			const retrievedPolicy = await policyAdminPoint.get(policyId);
			await expect(policyAdminPoint.update(retrievedPolicy)).resolves.toBeUndefined();
		});

		test("should round-trip Agreement via get then update with returned body", async () => {
			const policyId = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [{ target: TEST_ASSET_ID, action: "use" }]
			});

			const retrievedPolicy = await policyAdminPoint.get(policyId);
			await expect(policyAdminPoint.update(retrievedPolicy)).resolves.toBeUndefined();
		});

		test("should return lifecycle fields from typed getters and query", async () => {
			const agreementId = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [{ target: TEST_ASSET_ID, action: "use" }]
			});

			const agreement = await policyAdminPoint.getAgreement(agreementId);
			expect(agreement.dateCreated).toBe("2025-06-10T10:00:00.000Z");
			expect(agreement.dateModified).toBe("2025-06-10T10:00:00.000Z");

			const offerId = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Offer,
				assigner: "did:example:assigner",
				permission: [{ target: TEST_ASSET_ID, action: "use" }]
			});

			const offer = await policyAdminPoint.getOffer(offerId);
			expect(offer.dateCreated).toBe("2025-06-10T10:00:00.000Z");
			expect(offer.dateModified).toBe("2025-06-10T10:00:00.000Z");

			const setId = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Set,
				permission: [{ target: TEST_ASSET_ID, action: "use" }]
			});

			const set = await policyAdminPoint.getSet(setId);
			expect(set.dateCreated).toBe("2025-06-10T10:00:00.000Z");
			expect(set.dateModified).toBe("2025-06-10T10:00:00.000Z");

			const queryResult = await policyAdminPoint.query({ target: TEST_ASSET_ID });
			expect(queryResult.policies[0]?.dateCreated).toBe("2025-06-10T10:00:00.000Z");
			expect(queryResult.policies[0]?.dateModified).toBe("2025-06-10T10:00:00.000Z");
		});

		test("should not return lifecycle fields for legacy policies until updated", async () => {
			const legacyPolicy = new OdrlPolicy();
			legacyPolicy.id = TEST_POLICY_ID;
			legacyPolicy.type = OdrlPolicyType.Set;
			legacyPolicy.permission = [{ target: TEST_ASSET_ID, action: "use" }];
			legacyPolicy.assignerIndex = "||";
			legacyPolicy.assigneeIndex = "||";
			legacyPolicy.targetIndex = `|${TEST_ASSET_ID}|`;
			legacyPolicy.actionIndex = "|use|";

			await odrlPolicyEntityStorage.set(legacyPolicy);

			const legacyRetrieved = await policyAdminPoint.get(TEST_POLICY_ID);
			expect(legacyRetrieved.dateCreated).toBeUndefined();
			expect(legacyRetrieved.dateModified).toBeUndefined();
			expect(legacyRetrieved["@context"]).toBe(OdrlContexts.Context);

			vi.setSystemTime(new Date("2025-06-10T12:00:00.000Z"));

			await policyAdminPoint.update({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Set,
				"@id": TEST_POLICY_ID,
				permission: [{ target: TEST_ASSET_ID, action: "display" }]
			});

			const updatedLegacy = await policyAdminPoint.get(TEST_POLICY_ID);
			expect(updatedLegacy.dateCreated).toBe("2025-06-10T12:00:00.000Z");
			expect(updatedLegacy.dateModified).toBe("2025-06-10T12:00:00.000Z");
			expect(updatedLegacy["@context"]).toEqual(buildPapStorageContext());
		});
	});

	describe("trustData", () => {
		const TRUST_DATA: { [key: string]: IJsonLdNodeObject } = {
			"did:example:identity": { "@type": "VerifiedIdentity" }
		};

		test("survives create -> get round-trip", async () => {
			const uid = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Set,
				permission: [{ target: TEST_ASSET_ID, action: "use" }],
				trustData: TRUST_DATA
			});

			const retrieved = await policyAdminPoint.get(uid);

			expect(retrieved.trustData).toEqual(TRUST_DATA);
		});

		test("survives create -> getAgreement round-trip", async () => {
			const uid = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [{ target: TEST_ASSET_ID, action: "use" }],
				trustData: TRUST_DATA
			});

			const agreement = await policyAdminPoint.getAgreement(uid);

			expect(agreement.trustData).toEqual(TRUST_DATA);
		});

		test("is stripped before ODRL validation so create does not fail", async () => {
			await expect(
				policyAdminPoint.create({
					"@context": OdrlContexts.Context,
					"@type": OdrlPolicyType.Agreement,
					assigner: "did:example:assigner",
					assignee: "did:example:assignee",
					permission: [{ target: TEST_ASSET_ID, action: "use" }],
					trustData: TRUST_DATA
				})
			).resolves.toMatch(/^urn:policy:/);
		});

		test("is stripped before ODRL validation on update so update does not fail", async () => {
			const uid = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [{ target: TEST_ASSET_ID, action: "use" }],
				trustData: TRUST_DATA
			});

			const retrieved = await policyAdminPoint.getAgreement(uid);

			// Feeding the retrieved body (which carries trustData) straight back into update
			// must not fail ODRL validation.
			await expect(policyAdminPoint.update(retrieved)).resolves.toBeUndefined();
		});

		test("is absent from stored entity when not supplied", async () => {
			const uid = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [{ target: TEST_ASSET_ID, action: "use" }]
			});

			const stored = await odrlPolicyEntityStorage.get(uid);

			expect(stored?.trustData).toBeUndefined();
		});

		test("is present on stored entity when supplied", async () => {
			const uid = await policyAdminPoint.create({
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [{ target: TEST_ASSET_ID, action: "use" }],
				trustData: TRUST_DATA
			});

			const stored = await odrlPolicyEntityStorage.get(uid);

			expect(stored?.trustData).toEqual(TRUST_DATA);
		});
	});
});
