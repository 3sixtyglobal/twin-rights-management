// Copyright 2025 IOTA Stiftung.
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
import { PolicyManagementPointService } from "../src/policyManagementPointService.js";

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
				type: OdrlTypes.Policy,
				id: `policy${i + 1}`,
				assignee: "node1",
				assignerIndex: "||",
				assigneeIndex: "|node1|",
				targetIndex: "|target:1234|",
				actionIndex: "|read|"
			});
		}

		for (let i = 0; i < 5; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				type: OdrlTypes.Policy,
				id: `policy${i + 1}`,
				target: "target:1234",
				action: "read",
				assignerIndex: "||",
				assigneeIndex: "||",
				targetIndex: "|target:1234|",
				actionIndex: "|read|"
			});
		}

		const result = await policyManagementPoint.retrieve({ assignee: "node1" });
		expect(result.policies).toHaveLength(5);
		expect(result.policies.every(p => p.target === undefined && p.action === undefined)).toBe(true);
		expect(result.cursor).toBeUndefined();
	});

	test("can query the service for a specific target", async () => {
		const policyManagementPoint = new PolicyManagementPointService();

		for (let i = 0; i < 10; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				type: OdrlTypes.Policy,
				id: `policy${i + 1}`,
				assignee: "node1",
				target: "target:1234",
				action: "read",
				assignerIndex: "||",
				assigneeIndex: "|node1|",
				targetIndex: "|target:1234|",
				actionIndex: "|read|"
			});
		}

		for (let i = 0; i < 5; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				type: OdrlTypes.Policy,
				id: `policy${i + 1}`,
				assignee: "node1",
				action: "write",
				assignerIndex: "||",
				assigneeIndex: "|node1|",
				targetIndex: "||",
				actionIndex: "|write|"
			});
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
			await odrlPolicyMemoryEntityStorage.set({
				type: OdrlTypes.Policy,
				id: `policy${i + 1}`,
				assignee: "node1",
				target: "target:1234",
				action: "read",
				assignerIndex: "||",
				assigneeIndex: "|node1|",
				targetIndex: "|target:1234|",
				actionIndex: "|read|"
			});
		}

		for (let i = 0; i < 5; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				type: OdrlTypes.Policy,
				id: `policy${i + 1}`,
				assignee: "node1",
				target: "target:1234",
				action: "read",
				assignerIndex: "||",
				assigneeIndex: "|node1|",
				targetIndex: "|target:1234|",
				actionIndex: "|read|"
			});
		}
		for (let i = 5; i < 10; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				type: OdrlTypes.Policy,
				id: `policy${i + 1}`,
				assignee: "node1",
				target: undefined,
				action: "write",
				assignerIndex: "||",
				assigneeIndex: "|node1|",
				targetIndex: "||",
				actionIndex: "|write|"
			});
		}
		// Wildcard target means target is undefined
		const result = await policyManagementPoint.retrieve({ action: "read", assignee: "node1" });
		expect(result.policies).toHaveLength(5);
		expect(result.policies.every(p => p.action === "read")).toBe(true);
		expect(result.cursor).toBeUndefined();
	});

	test("can query the service when there are lots of entries", async () => {
		const policyManagementPoint = new PolicyManagementPointService();

		for (let i = 0; i < 100; i++) {
			await odrlPolicyMemoryEntityStorage.set({
				type: OdrlTypes.Policy,
				id: `policy${i + 1}`,
				assignee: "node1",
				target: "target:1234",
				action: "read",
				assignerIndex: "||",
				assigneeIndex: "|node1|",
				targetIndex: "|target:1234|",
				actionIndex: "|read|"
			});
		}

		const result = await policyManagementPoint.retrieve({
			target: "target:1234",
			action: "read",
			assignee: "node1"
		});
		expect(result.policies).toHaveLength(40);
		expect(result.cursor).toBeDefined();
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
		await odrlPolicyMemoryEntityStorage.set({
			type: OdrlTypes.Policy,
			id: "policy-undef-assignee",
			target: "target:1234",
			action: "read",
			// assignee is undefined
			assignerIndex: "||",
			assigneeIndex: "||",
			targetIndex: "|target:1234|",
			actionIndex: "|read|"
		});
		const result = await policyManagementPoint.retrieve({
			target: "target:1234",
			action: "read"
		});
		expect(result.policies).toHaveLength(1);
		expect(result.policies[0].assignee).toBeUndefined();
	});

	test("can retrieve policies with undefined target using wildcard", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await odrlPolicyMemoryEntityStorage.set({
			type: OdrlTypes.Policy,
			id: "policy-undef-target",
			assignee: "node1",
			action: "read",
			// target is undefined
			assignerIndex: "||",
			assigneeIndex: "|node1|",
			targetIndex: "||",
			actionIndex: "|read|"
		});
		const result = await policyManagementPoint.retrieve({ action: "read", assignee: "node1" });
		expect(result.policies).toHaveLength(1);
		expect(result.policies[0].target).toBeUndefined();
	});

	test("can retrieve policies with undefined action using wildcard", async () => {
		const policyManagementPoint = new PolicyManagementPointService();
		await odrlPolicyMemoryEntityStorage.set({
			type: OdrlTypes.Policy,
			id: "policy-undef-action",
			assignee: "node1",
			target: "target:1234",
			// action is undefined
			assignerIndex: "||",
			assigneeIndex: "|node1|",
			targetIndex: "|target:1234|",
			actionIndex: "||"
		});
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
