// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Factory } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
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
	PolicyArbiterFactory,
	PolicyEnforcementProcessorFactory,
	PolicyExecutionActionFactory,
	PolicyInformationAccessMode,
	PolicyInformationSourceFactory
} from "@twin.org/rights-management-models";
import {
	PolicyAdministrationPointService,
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy
} from "@twin.org/rights-management-pap-service";
import { PolicyDecisionPointService } from "@twin.org/rights-management-pdp-service";
import { PolicyEnforcementPointService } from "@twin.org/rights-management-pep-service";
import { PolicyInformationPointService } from "@twin.org/rights-management-pip-service";
import { PolicyManagementPointService } from "@twin.org/rights-management-pmp-service";
import { PolicyExecutionPointService } from "@twin.org/rights-management-pxp-service";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import { OdrlContexts, PolicyType } from "@twin.org/standards-w3c-odrl";
import { PassThroughPolicyArbiter } from "../src/policyArbiters/passThroughPolicyArbiter.js";
import { PassThroughPolicyEnforcementProcessor } from "../src/policyEnforcementProcessor/passThroughPolicyEnforcementProcessor.js";
import { LoggingPolicyExecutionAction } from "../src/policyExecutionActions/loggingPolicyExecutionAction.js";
import { StaticPolicyInformationSource } from "../src/policyInformationSources/staticPolicyInformationSource.js";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let odrlPolicyMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;
let policyAdministrationPointService: PolicyAdministrationPointService;

describe("RightsManagementService", () => {
	beforeEach(() => {
		Factory.clearFactories();

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

		PolicyArbiterFactory.register("pass-through-arbiter", () => new PassThroughPolicyArbiter());

		PolicyExecutionActionFactory.register(
			"logging-execution-action",
			() => new LoggingPolicyExecutionAction()
		);

		PolicyInformationSourceFactory.register(
			"static-information-source",
			() =>
				new StaticPolicyInformationSource({
					config: {
						information: [
							{
								accessMode: PolicyInformationAccessMode.Public,
								objects: {
									"info:org-address": {
										"@context": "https://schema.org/",
										"@type": "Organization",
										address: {
											"@type": "PostalAddress",
											addressCountry: "KE"
										}
									}
								}
							}
						]
					}
				})
		);

		PolicyEnforcementProcessorFactory.register(
			"pass-through-enforcement-processor",
			() => new PassThroughPolicyEnforcementProcessor()
		);
	});

	test("can perform a full workflow", async () => {
		const testPolicy: IDataspaceProtocolPolicy = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			"@id": "policy:test-policy-uid",
			assigner: "did:example:assigner",
			assignee: "did:example:assignee"
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

		expect(loggingMemoryEntityStorage.getStore().map(l => `${l.source}:${l.message}`)).toEqual([
			"PolicyEnforcementPointService:intercepting",
			"PolicyExecutionPointService:executingActions",
			"PolicyExecutionPointService:executingAction",
			"LoggingPolicyExecutionAction:policyActionExecutedBefore",
			"StaticPolicyInformationSource:staticRetrieving",
			"StaticPolicyInformationSource:staticRetrieved",
			"PassThroughPolicyArbiter:decidingPolicy",
			"PolicyExecutionPointService:executingActions",
			"PolicyExecutionPointService:executingAction",
			"LoggingPolicyExecutionAction:policyActionExecutedAfter",
			"PolicyEnforcementPointService:processing",
			"PassThroughPolicyEnforcementProcessor:processingPolicy"
		]);
	});
});
