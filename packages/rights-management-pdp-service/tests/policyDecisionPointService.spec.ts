// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@3sixty/core";
import type { IJsonLdNodeObject } from "@3sixty/data-json-ld";
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
import { PolicyArbiterFactory, PolicyDecision } from "@3sixty/rights-management-models";
import {
	PolicyAdministrationPointService,
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy,
	type OdrlPolicyIndex
} from "@3sixty/rights-management-pap-service";
import { PolicyInformationPointService } from "@3sixty/rights-management-pip-service";
import { PolicyManagementPointService } from "@3sixty/rights-management-pmp-service";
import { PolicyExecutionPointService } from "@3sixty/rights-management-pxp-service";
import type { IDataspaceProtocolAgreement } from "@3sixty/standards-dataspace-protocol";
import { OdrlContexts, OdrlPolicyType } from "@3sixty/standards-w3c-odrl";
import { PolicyDecisionPointService } from "../src/policyDecisionPointService.js";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let odrlPolicyMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;
let odrlPolicyIndexMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicyIndex>;

function createPolicy(options?: {
	uid?: string;
	action?: string;
	target?: string;
	assignee?: string;
}): IDataspaceProtocolAgreement {
	return {
		"@context": OdrlContexts.Context,
		"@type": OdrlPolicyType.Agreement,
		assigner: "assigner",
		"@id": options?.uid ?? "policy123",
		action: options?.action ?? "action",
		target: options?.target ?? "target",
		assignee: options?.assignee ?? "assignee"
	};
}

describe("PolicyDecisionPointService", () => {
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

	test("evaluate returns empty array if no arbiters registered", async () => {
		const pdp = new PolicyDecisionPointService();
		const policy = createPolicy({ target: "asset:1234", action: "read", assignee: "node1" });
		await expect(pdp.evaluate(policy)).rejects.toThrow("noArbiters");
	});

	test("evaluate returns decisions from registered arbiter", async () => {
		const pdp = new PolicyDecisionPointService();
		const mockArbiter = {
			className: () => "arbiter1",
			supportedPolicies: () => [],
			decide: async () => [{ decision: PolicyDecision.Granted, target: "asset:1234" }]
		};
		PolicyArbiterFactory.register("arbiter1", () => mockArbiter);
		const policy = createPolicy({ target: "asset:1234", action: "read", assignee: "node1" });
		const result = await pdp.evaluate(policy);
		expect(result).toHaveLength(1);
		expect(result[0].decision).toBe(PolicyDecision.Granted);
		expect(result[0].target).toBe("asset:1234");
	});

	test("evaluate throws and logs if arbiter throws", async () => {
		const pdp = new PolicyDecisionPointService();
		const mockArbiter = {
			className: () => "arbiter1",
			supportedPolicies: () => [],
			decide: async () => {
				throw new Error("fail");
			}
		};
		PolicyArbiterFactory.register("arbiter1", () => mockArbiter);
		const policy = createPolicy({ target: "asset:1234", action: "read", assignee: "node1" });
		await expect(pdp.evaluate(policy)).rejects.toThrow("decidingFailed");
	});

	test("evaluate merges trustData into information passed to arbiter decide", async () => {
		const pdp = new PolicyDecisionPointService();
		const decideSpy = vi.fn().mockResolvedValue([]);
		PolicyArbiterFactory.register("arbiter1", () => ({
			className: () => "arbiter1",
			supportedPolicies: () => [],
			decide: decideSpy
		}));
		const policy = createPolicy({ target: "asset:1234", action: "read" });
		const trustData: { [key: string]: IJsonLdNodeObject } = {
			"did:example:identity": { "@type": "VerifiedIdentity" }
		};
		await pdp.evaluate(policy, undefined, undefined, trustData);
		expect(decideSpy).toHaveBeenCalledWith(
			policy,
			expect.objectContaining({ "did:example:identity": { "@type": "VerifiedIdentity" } }),
			undefined,
			undefined
		);
	});

	test("evaluate passes only pip information to arbiter when trustData is omitted", async () => {
		const pdp = new PolicyDecisionPointService();
		const decideSpy = vi.fn().mockResolvedValue([]);
		PolicyArbiterFactory.register("arbiter1", () => ({
			className: () => "arbiter1",
			supportedPolicies: () => [],
			decide: decideSpy
		}));
		const policy = createPolicy({ target: "asset:1234", action: "read" });
		await pdp.evaluate(policy);
		expect(decideSpy).toHaveBeenCalledWith(policy, {}, undefined, undefined);
	});
});
