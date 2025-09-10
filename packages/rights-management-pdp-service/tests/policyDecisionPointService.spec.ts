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
import { PolicyDecision } from "@twin.org/rights-management-models";
import type { IPolicyArbiter } from "@twin.org/rights-management-models";
import {
	PolicyAdministrationPointService,
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy
} from "@twin.org/rights-management-pap-service";
import { PolicyInformationPointService } from "@twin.org/rights-management-pip-service";
import { PolicyManagementPointService } from "@twin.org/rights-management-pmp-service";
import { PolicyExecutionPointService } from "@twin.org/rights-management-pxp-service";
import { PolicyDecisionPointService } from "../src/policyDecisionPointService";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let odrlPolicyMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;

describe("PolicyDecisionPointService", () => {
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
		ComponentFactory.register("policy-management-point", () => new PolicyManagementPointService());
		ComponentFactory.register(
			"policy-information-point",
			() => new PolicyInformationPointService()
		);
		ComponentFactory.register("policy-execution-point", () => new PolicyExecutionPointService());
	});

	test("can create the service", async () => {
		const policyDecisionPoint = new PolicyDecisionPointService();
		expect(policyDecisionPoint).toBeInstanceOf(PolicyDecisionPointService);
	});

	test("can register and unregister an arbiter", async () => {
		const pdp = new PolicyDecisionPointService();
		const mockArbiter = {
			supportedPolicies: () => [],
			decide: async () => [{ decision: PolicyDecision.Granted, target: "asset:1234" }]
		};
		await pdp.registerArbiter("arbiter1", mockArbiter);
		await pdp.unregisterArbiter("arbiter1");
	});

	test("throws error for invalid arbiterId argument in registerArbiter", async () => {
		const pdp = new PolicyDecisionPointService();
		const mockArbiter = { supportedPolicies: () => [], decide: async () => [] };
		await expect(
			pdp.registerArbiter(undefined as unknown as string, mockArbiter)
		).rejects.toThrow();
	});

	test("throws error for invalid arbiter argument in registerArbiter", async () => {
		const pdp = new PolicyDecisionPointService();
		await expect(
			pdp.registerArbiter("arbiter1", 123 as unknown as IPolicyArbiter)
		).rejects.toThrow();
	});

	test("throws error for invalid arbiterId argument in unregisterArbiter", async () => {
		const pdp = new PolicyDecisionPointService();
		await expect(pdp.unregisterArbiter(undefined as unknown as string)).rejects.toThrow();
	});

	test("evaluate returns empty array if no arbiters registered", async () => {
		const pdp = new PolicyDecisionPointService();
		const locator = { assetType: "asset:1234", action: "read", assignee: "node1" };
		await expect(pdp.evaluate(locator)).rejects.toThrow("noSupportedArbiters");
	});

	test("evaluate returns decisions from registered arbiter", async () => {
		const pdp = new PolicyDecisionPointService();
		const mockArbiter = {
			supportedPolicies: () => [],
			decide: async () => [{ decision: PolicyDecision.Granted, target: "asset:1234" }]
		};
		await pdp.registerArbiter("arbiter1", mockArbiter);
		const locator = { assetType: "asset:1234", action: "read", assignee: "node1" };
		const result = await pdp.evaluate(locator);
		expect(result).toHaveLength(1);
		expect(result[0].decision).toBe(PolicyDecision.Granted);
		expect(result[0].target).toBe("asset:1234");
	});

	test("evaluate throws and logs if arbiter throws", async () => {
		const pdp = new PolicyDecisionPointService();
		const mockArbiter = {
			supportedPolicies: () => [],
			decide: async () => {
				throw new Error("fail");
			}
		};
		await pdp.registerArbiter("arbiter1", mockArbiter);
		const locator = { assetType: "asset:1234", action: "read", assignee: "node1" };
		await expect(pdp.evaluate(locator)).rejects.toThrow("decidingFailed");
	});
});
