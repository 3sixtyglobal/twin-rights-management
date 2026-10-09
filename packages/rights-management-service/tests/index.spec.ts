// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Factory } from "@3sixty/core";
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
import {
	PolicyArbiterFactory,
	PolicyDecision,
	PolicyDecisionStage,
	PolicyEnforcementProcessorFactory,
	PolicyExecutionActionFactory,
	PolicyInformationSourceFactory,
	type IPolicyArbiter,
	type IPolicyDecision,
	type IPolicyEnforcementProcessor,
	type IPolicyExecutionAction,
	type IPolicyInformationSource,
	type PolicyInformationAccessMode
} from "@3sixty/rights-management-models";
import {
	PolicyAdministrationPointService,
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy,
	type OdrlPolicyIndex
} from "@3sixty/rights-management-pap-service";
import { PolicyDecisionPointService } from "@3sixty/rights-management-pdp-service";
import { PolicyEnforcementPointService } from "@3sixty/rights-management-pep-service";
import { PolicyInformationPointService } from "@3sixty/rights-management-pip-service";
import { PolicyManagementPointService } from "@3sixty/rights-management-pmp-service";
import { PolicyExecutionPointService } from "@3sixty/rights-management-pxp-service";
import type { IDataspaceProtocolPolicy } from "@3sixty/standards-dataspace-protocol";
import { OdrlContexts, OdrlPolicyType } from "@3sixty/standards-w3c-odrl";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let odrlPolicyMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;
let odrlPolicyIndexMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicyIndex>;
let policyAdministrationPointService: PolicyAdministrationPointService;

describe("RightsManagementService", () => {
	beforeEach(() => {
		Factory.clearFactories();

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

		policyAdministrationPointService = new PolicyAdministrationPointService();
		ComponentFactory.register(
			"policy-administration-point",
			() => policyAdministrationPointService
		);
		ComponentFactory.register("policy-management-point", () => new PolicyManagementPointService());
		ComponentFactory.register(
			"policy-information-point",
			() => new PolicyInformationPointService()
		);
		ComponentFactory.register("policy-execution-point", () => new PolicyExecutionPointService());

		ComponentFactory.register("policy-decision-point", () => new PolicyDecisionPointService());

		const mockArbiter: IPolicyArbiter = {
			className: () => "mock-arbiter",
			decide: async (): Promise<IPolicyDecision[]> => [
				{ target: "$", decision: PolicyDecision.Granted }
			]
		};
		PolicyArbiterFactory.register("mock-arbiter", () => mockArbiter);

		const mockExecutionAction: IPolicyExecutionAction = {
			className: () => "mock-execution-action",
			supportedStages: () => [PolicyDecisionStage.Before, PolicyDecisionStage.After],
			execute: async <D = unknown>(
				policy: IDataspaceProtocolPolicy,
				decisions: IPolicyDecision[],
				data: D | undefined,
				stage: PolicyDecisionStage
			): Promise<void> => {
				console.log(`Executing mock action at stage ${stage}`);
			}
		};
		PolicyExecutionActionFactory.register("mock-execution-action", () => mockExecutionAction);

		const mockInformationSource: IPolicyInformationSource = {
			className: () => "mock-information-source",
			retrieve: async <D = unknown>(
				policy: IDataspaceProtocolPolicy | undefined,
				accessMode: PolicyInformationAccessMode,
				data?: D
			): Promise<
				| {
						[id: string]: IJsonLdNodeObject;
				  }
				| undefined
			> => {
				console.debug(`Retrieving information with access mode ${accessMode}`);
				return {};
			}
		};
		PolicyInformationSourceFactory.register("mock-information-source", () => mockInformationSource);

		const mockEnforcementProcessor: IPolicyEnforcementProcessor = {
			className: () => "mock-enforcement-processor",
			process: async <D = unknown, R = D>(
				policy: IDataspaceProtocolPolicy,
				decisions: IPolicyDecision[],
				data?: D
			): Promise<R> => data as R
		};
		PolicyEnforcementProcessorFactory.register(
			"mock-enforcement-processor",
			() => mockEnforcementProcessor
		);
	});

	test("can perform a full workflow", async () => {
		const testPolicy: IDataspaceProtocolPolicy = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:assigner",
			assignee: "did:example:assignee",
			"@id": "policy:test-policy-uid"
		};

		await policyAdministrationPointService.create(testPolicy);

		const policyEnforcementPointService = new PolicyEnforcementPointService();

		const testData: IJsonLdNodeObject = {
			"@context": "https://schema.org/",
			"@type": "Person",
			name: "Alice",
			jobTitle: "CEO",
			url: "https://example.com/alice",
			email: "alice@example.com"
		};

		const response = await policyEnforcementPointService.interceptWithId(
			"policy:test-policy-uid",
			testData
		);

		expect(response).toEqual(testData);
	});
});
