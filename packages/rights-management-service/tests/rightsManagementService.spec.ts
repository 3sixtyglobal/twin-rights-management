// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { TaskSchedulerService } from "@twin.org/background-task-scheduler";
import { ComponentFactory } from "@twin.org/core";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageIdentityConnector,
	type IdentityDocument,
	initSchema as initSchemaIdentity
} from "@twin.org/identity-connector-entity-storage";
import { IdentityConnectorFactory } from "@twin.org/identity-models";
import {
	EntityStorageLoggingConnector,
	initSchema as initSchemaLogging,
	type LogEntry
} from "@twin.org/logging-connector-entity-storage";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import { LoggingService } from "@twin.org/logging-service";
import { nameof } from "@twin.org/nameof";
import {
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy,
	PolicyAdministrationPointService
} from "@twin.org/rights-management-pap-service";
import { PolicyDecisionPointService } from "@twin.org/rights-management-pdp-service";
import { PolicyEnforcementPointService } from "@twin.org/rights-management-pep-service";
import { PolicyInformationPointService } from "@twin.org/rights-management-pip-service";
import { PolicyManagementPointService } from "@twin.org/rights-management-pmp-service";
import {
	initSchema as initSchemaPolicyNegotiationPoint,
	type PolicyNegotiation,
	PolicyNegotiationAdminPointService,
	PolicyNegotiationPointService
} from "@twin.org/rights-management-pnp-service";
import { PolicyExecutionPointService } from "@twin.org/rights-management-pxp-service";
import {
	EntityStorageVaultConnector,
	initSchema as initSchemaVault,
	type VaultKey,
	type VaultSecret
} from "@twin.org/vault-connector-entity-storage";
import { VaultConnectorFactory } from "@twin.org/vault-models";
import { RightsManagementService } from "../src/rightsManagementService";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let odrlPolicyMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;
let policyNegotiationMemoryEntityStorage: MemoryEntityStorageConnector<PolicyNegotiation>;

describe("RightsManagementService", () => {
	beforeEach(() => {
		initSchemaLogging();
		initSchemaVault();
		initSchemaIdentity();
		initSchemaPolicyAdministrationPoint();
		initSchemaPolicyNegotiationPoint();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());

		const taskSchedulerComponent = new TaskSchedulerService({ config: { overrideInterval: 0.5 } });
		ComponentFactory.register("task-scheduler", () => taskSchedulerComponent);

		EntityStorageConnectorFactory.register(
			"vault-key",
			() =>
				new MemoryEntityStorageConnector<VaultKey>({
					entitySchema: nameof<VaultKey>()
				})
		);
		const secretEntityStorage = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>()
		});
		EntityStorageConnectorFactory.register("vault-secret", () => secretEntityStorage);

		const vaultConnector = new EntityStorageVaultConnector();
		VaultConnectorFactory.register("vault", () => vaultConnector);

		const identityDocumentEntityStorage = new MemoryEntityStorageConnector<IdentityDocument>({
			entitySchema: nameof<IdentityDocument>()
		});
		EntityStorageConnectorFactory.register(
			"identity-document",
			() => identityDocumentEntityStorage
		);

		const identityConnector = new EntityStorageIdentityConnector();
		IdentityConnectorFactory.register("identity", () => identityConnector);

		odrlPolicyMemoryEntityStorage = new MemoryEntityStorageConnector<OdrlPolicy>({
			entitySchema: nameof<OdrlPolicy>()
		});
		EntityStorageConnectorFactory.register("odrl-policy", () => odrlPolicyMemoryEntityStorage);

		policyNegotiationMemoryEntityStorage = new MemoryEntityStorageConnector<PolicyNegotiation>({
			entitySchema: nameof<PolicyNegotiation>()
		});
		EntityStorageConnectorFactory.register(
			"policy-negotiation",
			() => policyNegotiationMemoryEntityStorage
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
		ComponentFactory.register("policy-decision-point", () => new PolicyDecisionPointService());
		ComponentFactory.register(
			"policy-enforcement-point",
			() => new PolicyEnforcementPointService()
		);
		ComponentFactory.register(
			"policy-negotiation-admin-point",
			() => new PolicyNegotiationAdminPointService()
		);
		ComponentFactory.register(
			"policy-negotiation-point",
			() => new PolicyNegotiationPointService()
		);
	});

	test("can create the service", async () => {
		const rightsManagementService = new RightsManagementService();
		expect(rightsManagementService).toBeInstanceOf(RightsManagementService);
	});
});
