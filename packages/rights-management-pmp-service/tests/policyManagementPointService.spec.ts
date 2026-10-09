// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Is } from "@3sixty/core";
import { ComparisonOperator } from "@3sixty/entity";
import { MemoryEntityStorageConnector } from "@3sixty/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@3sixty/entity-storage-models";
import {
	EntityStorageLoggingConnector,
	initSchema as initSchemaLogging,
	type LogEntry
} from "@3sixty/logging-connector-entity-storage";
import { LoggingConnectorFactory } from "@3sixty/logging-models";
import { LoggingService } from "@3sixty/logging-service";
import { nameof } from "@3sixty/nameof";
import {
	PolicyAdministrationPointService,
	initSchema as initSchemaPolicyAdministrationPoint,
	OdrlPolicyIndexHelper,
	type OdrlPolicy,
	type OdrlPolicyIndex
} from "@3sixty/rights-management-pap-service";
import { OdrlTypes } from "@3sixty/standards-w3c-odrl";
import { PolicyManagementPointService } from "../src/policyManagementPointService.js";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let odrlPolicyMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;
let odrlPolicyIndexMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicyIndex>;

/**
 * Store a policy along with the index entries the administration point would have created for it.
 * @param policy The policy to store.
 * @param indexes The index values to store for the policy, keyed by index type.
 * @param indexes.assigner The assigner index values.
 * @param indexes.assignee The assignee index values.
 * @param indexes.target The target index values.
 * @param indexes.action The action index values.
 * @returns Nothing.
 */
async function seedPolicy(
	policy: OdrlPolicy,
	indexes: { assigner?: string[]; assignee?: string[]; target?: string[]; action?: string[] }
): Promise<void> {
	await odrlPolicyMemoryEntityStorage.set(policy);

	const existing = await odrlPolicyIndexMemoryEntityStorage.query(
		{
			property: "policyId",
			comparison: ComparisonOperator.Equals,
			value: policy.id
		},
		undefined,
		["id"]
	);
	const removeIds = existing.entities.map(entry => entry.id as string);
	if (removeIds.length > 0) {
		await odrlPolicyIndexMemoryEntityStorage.removeBatch(removeIds);
	}

	// The administration point stores one entry per combination of the locator dimensions, and an
	// absent dimension contributes a single undefined value so the combinations do not collapse.
	function dimension(values?: string[]): (string | undefined)[] {
		return Is.arrayValue(values) ? values : [undefined];
	}

	const entries: OdrlPolicyIndex[] = [];
	for (const assigner of dimension(indexes.assigner)) {
		for (const assignee of dimension(indexes.assignee)) {
			for (const target of dimension(indexes.target)) {
				for (const action of dimension(indexes.action)) {
					entries.push(
						OdrlPolicyIndexHelper.createIndexEntry(
							policy.id,
							policy.dateCreated ?? "2026-01-01T00:00:00.000Z",
							assigner,
							assignee,
							target,
							action
						)
					);
				}
			}
		}
	}
	if (entries.length > 0) {
		await odrlPolicyIndexMemoryEntityStorage.setBatch(entries);
	}
}

describe("PolicyManagementPointService", () => {
	beforeEach(() => {
		initSchemaLogging();
		initSchemaPolicyAdministrationPoint();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>(),
			config: { storageKey: "log-entry" }
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());

		odrlPolicyMemoryEntityStorage = new MemoryEntityStorageConnector<OdrlPolicy>({
			entitySchema: nameof<OdrlPolicy>(),
			config: { storageKey: "odrl-policy" }
		});
		EntityStorageConnectorFactory.register("odrl-policy", () => odrlPolicyMemoryEntityStorage);

		odrlPolicyIndexMemoryEntityStorage = new MemoryEntityStorageConnector<OdrlPolicyIndex>({
			entitySchema: nameof<OdrlPolicyIndex>(),
			config: { storageKey: "odrl-policy-index" }
		});
		EntityStorageConnectorFactory.register(
			"odrl-policy-index",
			() => odrlPolicyIndexMemoryEntityStorage
		);

		ComponentFactory.register(
			"policy-administration-point",
			() => new PolicyAdministrationPointService()
		);
	});

	afterEach(async () => {
		await loggingMemoryEntityStorage?.teardown();
		await odrlPolicyMemoryEntityStorage?.teardown();
		await odrlPolicyIndexMemoryEntityStorage?.teardown();
	});

	test("can create the service", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		expect(policyManagementPoint).toBeInstanceOf(PolicyManagementPointService);
	});

	test("can query the service for a specific node identity", async () => {
		const policyManagementPoint = new PolicyManagementPointService();

		for (let i = 0; i < 10; i++) {
			await seedPolicy(
				{
					type: OdrlTypes.Policy,
					id: `policy${i + 1}`,
					assignee: "node1"
				},
				{ assignee: ["node1"], target: ["target:1234"], action: ["read"] }
			);
		}

		for (let i = 0; i < 5; i++) {
			await seedPolicy(
				{
					type: OdrlTypes.Policy,
					id: `policy${i + 1}`,
					target: "target:1234",
					action: "read"
				},
				{ target: ["target:1234"], action: ["read"] }
			);
		}

		const result = await policyManagementPoint.retrieve({ assignee: "node1" });
		expect(result.policies).toHaveLength(5);
		expect(result.policies.every(p => p.target === undefined && p.action === undefined)).toBe(true);
		expect(result.cursor).toBeUndefined();
	});

	test("can query the service for a specific target", async () => {
		const policyManagementPoint = new PolicyManagementPointService();

		for (let i = 0; i < 10; i++) {
			await seedPolicy(
				{
					type: OdrlTypes.Policy,
					id: `policy${i + 1}`,
					assignee: "node1",
					target: "target:1234",
					action: "read"
				},
				{ assignee: ["node1"], target: ["target:1234"], action: ["read"] }
			);
		}

		for (let i = 0; i < 5; i++) {
			await seedPolicy(
				{
					type: OdrlTypes.Policy,
					id: `policy${i + 1}`,
					assignee: "node1",
					action: "write"
				},
				{ assignee: ["node1"], action: ["write"] }
			);
		}

		// Wildcard action means action is undefined (property present)
		const result = await policyManagementPoint.retrieve({
			target: "target:1234",
			assignee: "node1"
		});
		expect(result.policies).toHaveLength(5);
		expect(result.policies.every(p => p.action === "read")).toBe(true);
		expect(result.cursor).toBeUndefined();
	});

	test("can query the service for a specific action", async () => {
		const policyManagementPoint = new PolicyManagementPointService();

		for (let i = 0; i < 10; i++) {
			await seedPolicy(
				{
					type: OdrlTypes.Policy,
					id: `policy${i + 1}`,
					assignee: "node1",
					target: "target:1234",
					action: "read"
				},
				{ assignee: ["node1"], target: ["target:1234"], action: ["read"] }
			);
		}

		for (let i = 0; i < 5; i++) {
			await seedPolicy(
				{
					type: OdrlTypes.Policy,
					id: `policy${i + 1}`,
					assignee: "node1",
					target: "target:1234",
					action: "read"
				},
				{ assignee: ["node1"], target: ["target:1234"], action: ["read"] }
			);
		}
		for (let i = 5; i < 10; i++) {
			await seedPolicy(
				{
					type: OdrlTypes.Policy,
					id: `policy${i + 1}`,
					assignee: "node1",
					target: undefined,
					action: "write"
				},
				{ assignee: ["node1"], action: ["write"] }
			);
		}
		// Wildcard target means target is undefined
		const result = await policyManagementPoint.retrieve({ action: "read", assignee: "node1" });
		expect(result.policies).toHaveLength(5);
		expect(result.policies.every(p => p.action === "read")).toBe(true);
		expect(result.cursor).toBeUndefined();
	});

	test("can query the service when there are lots of entries", async () => {
		const policyManagementPoint = new PolicyManagementPointService();

		// More entries than the administration point returns in a single page, so the retrieve has
		// to hand back a cursor for the caller to continue from.
		const total = 250;
		for (let i = 0; i < total; i++) {
			await seedPolicy(
				{
					type: OdrlTypes.Policy,
					id: `policy${i + 1}`,
					assignee: "node1",
					target: "target:1234",
					action: "read"
				},
				{ assignee: ["node1"], target: ["target:1234"], action: ["read"] }
			);
		}

		const locator = { target: "target:1234", action: "read", assignee: "node1" };

		const result = await policyManagementPoint.retrieve(locator);
		expect(result.policies.length).toBeLessThan(total);
		expect(result.cursor).toBeDefined();

		const seen = new Set(result.policies.map(p => p["@id"]));
		let cursor = result.cursor;
		while (Is.stringValue(cursor)) {
			const page = await policyManagementPoint.retrieve(locator, cursor);
			for (const policy of page.policies) {
				seen.add(policy["@id"]);
			}
			cursor = page.cursor;
		}

		expect(seen.size).toEqual(total);
	});

	test("returns empty array when no policies match", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		// No policies inserted
		const result = await policyManagementPoint.retrieve({
			target: "nonexistent-target",
			action: "nonexistent-action",
			assignee: "nonexistent-node"
		});
		expect(result.policies).toHaveLength(0);
		expect(result.cursor).toBeUndefined();
	});

	test("can retrieve policies with undefined assignee using wildcard", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await seedPolicy(
			{
				type: OdrlTypes.Policy,
				id: "policy-undef-assignee",
				target: "target:1234",
				action: "read"
				// assignee is undefined
			},
			{ target: ["target:1234"], action: ["read"] }
		);
		const result = await policyManagementPoint.retrieve({
			target: "target:1234",
			action: "read"
		});
		expect(result.policies).toHaveLength(1);
		expect(result.policies[0].assignee).toBeUndefined();
	});

	test("can retrieve policies with undefined target using wildcard", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await seedPolicy(
			{
				type: OdrlTypes.Policy,
				id: "policy-undef-target",
				assignee: "node1",
				action: "read"
				// target is undefined
			},
			{ assignee: ["node1"], action: ["read"] }
		);
		const result = await policyManagementPoint.retrieve({ action: "read", assignee: "node1" });
		expect(result.policies).toHaveLength(1);
		expect(result.policies[0].target).toBeUndefined();
	});

	test("can retrieve policies with undefined action using wildcard", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await seedPolicy(
			{
				type: OdrlTypes.Policy,
				id: "policy-undef-action",
				assignee: "node1",
				target: "target:1234"
				// action is undefined
			},
			{ assignee: ["node1"], target: ["target:1234"] }
		);
		const result = await policyManagementPoint.retrieve({
			target: "target:1234",
			assignee: "node1"
		});
		expect(result.policies).toHaveLength(1);
		expect(result.policies[0].action).toBeUndefined();
	});

	test("throws error for invalid target argument", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await expect(
			policyManagementPoint.retrieve({
				action: "read",
				assignee: "node1",
				target: 1234 as unknown as string
			})
		).rejects.toThrow();
	});

	test("throws error for invalid action argument", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await expect(
			policyManagementPoint.retrieve({
				target: "target:1234",
				action: 1234 as unknown as string,
				assignee: "node1"
			})
		).rejects.toThrow();
	});

	test("throws error for invalid assignee argument", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await expect(
			policyManagementPoint.retrieve({
				target: "target:1234",
				action: "read",
				assignee: 123 as unknown as string
			})
		).rejects.toThrow();
	});
});
