// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { TaskSchedulerService } from "@twin.org/background-task-scheduler";
import { ComponentFactory } from "@twin.org/core";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageIdentityConnector,
	initSchema as initSchemaIdentity,
	type IdentityDocument
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
import type { IPolicyEnforcementPointComponent } from "@twin.org/rights-management-models";
import { initSchema as initSchemaPolicyAdministrationPoint } from "@twin.org/rights-management-pap-service";
import type { ITrustComponent } from "@twin.org/trust-models";
import {
	EntityStorageVaultConnector,
	initSchema as initSchemaVault,
	type VaultKey,
	type VaultSecret
} from "@twin.org/vault-connector-entity-storage";
import { VaultConnectorFactory } from "@twin.org/vault-models";
import { DataAccessPointService } from "../src/dataAccessPointService.js";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let identityConnector: EntityStorageIdentityConnector;
let mockEnforcementPointComponent: IPolicyEnforcementPointComponent;
let mockTrustComponent: ITrustComponent;

describe("DataAccessPointService", () => {
	beforeEach(async () => {
		initSchemaLogging();
		initSchemaPolicyAdministrationPoint();
		initSchemaVault();
		initSchemaIdentity();

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

		identityConnector = new EntityStorageIdentityConnector();
		IdentityConnectorFactory.register("identity", () => identityConnector);

		mockEnforcementPointComponent = {
			intercept: vi.fn(),
			className: () => "MockPolicyEnforcementPointComponent"
		};

		ComponentFactory.register("policy-enforcement-point", () => mockEnforcementPointComponent);

		mockTrustComponent = {
			className: () => "MockTrustComponent",
			generate: vi.fn(
				async (identity: string, generatorType?: string, info?: { [key: string]: unknown }) =>
					`token:${identity}`
			),
			verify: vi.fn(async (payload: unknown, overrideVerifiers?: string[]) => ({
				verified: true,
				info: { identity: (payload as string).slice(6) }
			}))
		};

		ComponentFactory.register("trust", () => mockTrustComponent);
	});

	test("can create the service", async () => {
		const dataAccessPoint = new DataAccessPointService();
		expect(dataAccessPoint).toBeInstanceOf(DataAccessPointService);
	});
});
