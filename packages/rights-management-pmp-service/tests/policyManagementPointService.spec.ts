// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageLoggingConnector,
	initSchema as initSchemaLogging,
	type LogEntry
} from "@twin.org/logging-connector-entity-storage";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import { LoggingService } from "@twin.org/logging-service";
import { nameof } from "@twin.org/nameof";
import {
	PolicyAdministrationPointService,
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy
} from "@twin.org/rights-management-pap-service";
import { OdrlTypes } from "@twin.org/standards-w3c-odrl";
import { PolicyManagementPointService } from "../src/policyManagementPointService";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let odrlPolicyMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;

describe("PolicyManagementPointService", () => {
	beforeEach(() => {
		initSchemaLogging();
		initSchemaPolicyAdministrationPoint();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());

		odrlPolicyMemoryEntityStorage = new MemoryEntityStorageConnector<OdrlPolicy>({
			entitySchema: nameof<OdrlPolicy>()
		});
		EntityStorageConnectorFactory.register("odrl-policy", () => odrlPolicyMemoryEntityStorage);

		ComponentFactory.register(
			"policy-administration-point",
			() => new PolicyAdministrationPointService()
		);
	});

	test("can create the service", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		expect(policyManagementPoint).toBeInstanceOf(PolicyManagementPointService);
	});

	test("can query the service for a specific node identity", async () => {
		const policyManagementPoint = new PolicyManagementPointService();

		for (let i = 0; i < 10; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				"@type": OdrlTypes.Policy,
				uid: `policy${i + 1}`,
				assignee: "node1",
				target: "asset:1234",
				action: "read"
			});
		}

		// 5 with defined target/action, 5 with undefined target/action
		for (let i = 0; i < 5; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				"@type": OdrlTypes.Policy,
				uid: `policy${i + 1}`,
				assignee: "node1",
				target: "asset:1234",
				action: "read"
			});
		}
		for (let i = 5; i < 10; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				"@type": OdrlTypes.Policy,
				uid: `policy${i + 1}`,
				assignee: "node1"
				// target and action are undefined
			});
		}
		// Wildcard means undefined
		const result = await policyManagementPoint.retrieve("*", "*", "node1", undefined);
		expect(result.policies).toHaveLength(5);
		expect(result.policies.every(p => p.target === undefined && p.action === undefined)).toBe(true);
		expect(result.cursor).toBeUndefined();
	});

	test("can query the service for a specific asset type", async () => {
		const policyManagementPoint = new PolicyManagementPointService();

		for (let i = 0; i < 10; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				"@type": OdrlTypes.Policy,
				uid: `policy${i + 1}`,
				assignee: "node1",
				target: "asset:1234",
				action: "read"
			});
		}

		for (let i = 0; i < 5; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				"@type": OdrlTypes.Policy,
				uid: `policy${i + 1}`,
				assignee: "node1",
				target: "asset:1234",
				action: "read"
			});
		}

		for (let i = 5; i < 10; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				"@type": OdrlTypes.Policy,
				uid: `policy${i + 1}`,
				assignee: "node1",
				target: "asset:1234"
			});
		}
		// Wildcard action means action is undefined (property present)
		const result = await policyManagementPoint.retrieve("asset:1234", "*", "node1", undefined);
		expect(result.policies).toHaveLength(5);
		expect(
			result.policies.every(
				p => Object.prototype.hasOwnProperty.call(p, "action") && p.action === undefined
			)
		).toBe(true);
		expect(result.cursor).toBeUndefined();
	});

	test("can query the service for a specific action", async () => {
		const policyManagementPoint = new PolicyManagementPointService();

		for (let i = 0; i < 10; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				"@type": OdrlTypes.Policy,
				uid: `policy${i + 1}`,
				assignee: "node1",
				target: "asset:1234",
				action: "read"
			});
		}

		for (let i = 0; i < 5; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				"@type": OdrlTypes.Policy,
				uid: `policy${i + 1}`,
				assignee: "node1",
				target: "asset:1234",
				action: "read"
			});
		}
		for (let i = 5; i < 10; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				"@type": OdrlTypes.Policy,
				uid: `policy${i + 1}`,
				assignee: "node1",
				target: undefined,
				action: "read"
			});
		}
		// Wildcard assetType means target is undefined
		const result = await policyManagementPoint.retrieve("*", "read", "node1", undefined);
		expect(result.policies).toHaveLength(5);
		expect(result.policies.every(p => p.target === undefined)).toBe(true);
		expect(result.cursor).toBeUndefined();
	});

	test("can query the service when there are lots of entries", async () => {
		const policyManagementPoint = new PolicyManagementPointService();

		for (let i = 0; i < 100; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				"@type": OdrlTypes.Policy,
				uid: `policy${i + 1}`,
				assignee: "node1",
				target: "asset:1234",
				action: "read"
			});
		}

		const result = await policyManagementPoint.retrieve("asset:1234", "read", "node1", undefined);
		expect(result.policies).toHaveLength(40);
		expect(result.cursor).toBeDefined();
	});

	test("returns empty array when no policies match", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		// No policies inserted
		const result = await policyManagementPoint.retrieve(
			"nonexistent-asset",
			"nonexistent-action",
			"nonexistent-node",
			undefined
		);
		expect(result.policies).toHaveLength(0);
		expect(result.cursor).toBeUndefined();
	});

	test("can retrieve policies with undefined assignee using wildcard", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await odrlPolicyMemoryEntityStorage.set({
			"@type": OdrlTypes.Policy,
			uid: "policy-undef-assignee",
			target: "asset:1234",
			action: "read"
			// assignee is undefined
		});
		const result = await policyManagementPoint.retrieve("asset:1234", "read", "*", undefined);
		expect(result.policies).toHaveLength(1);
		expect(result.policies[0].assignee).toBeUndefined();
	});

	test("can retrieve policies with undefined target using wildcard", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await odrlPolicyMemoryEntityStorage.set({
			"@type": OdrlTypes.Policy,
			uid: "policy-undef-target",
			assignee: "node1",
			action: "read"
			// target is undefined
		});
		const result = await policyManagementPoint.retrieve("*", "read", "node1", undefined);
		expect(result.policies).toHaveLength(1);
		expect(result.policies[0].target).toBeUndefined();
	});

	test("can retrieve policies with undefined action using wildcard", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await odrlPolicyMemoryEntityStorage.set({
			"@type": OdrlTypes.Policy,
			uid: "policy-undef-action",
			assignee: "node1",
			target: "asset:1234"
			// action is undefined
		});
		const result = await policyManagementPoint.retrieve("asset:1234", "*", "node1", undefined);
		expect(result.policies).toHaveLength(1);
		expect(result.policies[0].action).toBeUndefined();
	});

	test("throws error for invalid assetType argument", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await expect(
			policyManagementPoint.retrieve(undefined as unknown as string, "read", "node1", undefined)
		).rejects.toThrow();
	});

	test("throws error for invalid action argument", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await expect(
			policyManagementPoint.retrieve(
				"asset:1234",
				undefined as unknown as string,
				"node1",
				undefined
			)
		).rejects.toThrow();
	});

	test("throws error for invalid nodeIdentity argument", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await expect(
			policyManagementPoint.retrieve(
				"asset:1234",
				"read",
				undefined as unknown as string,
				undefined
			)
		).rejects.toThrow();
	});
});
