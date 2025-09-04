// Copyright 2024 IOTA Stiftung.
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
import type { IPolicyNegotiationPointComponent } from "@twin.org/rights-management-models";
import { PolicyInformationPointService } from "@twin.org/rights-management-pip-service";
import type { IProof } from "@twin.org/standards-w3c-did";
import {
	EntityStorageVaultConnector,
	initSchema as initSchemaVault,
	type VaultKey,
	type VaultSecret
} from "@twin.org/vault-connector-entity-storage";
import { VaultConnectorFactory } from "@twin.org/vault-models";
import { PolicyNegotiationRequestPointService } from "../src/policyNegotiationRequestPointService";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let identityConnector: EntityStorageIdentityConnector;
let informationPointComponent: PolicyInformationPointService;
let mockNegotiationComponent: IPolicyNegotiationPointComponent;

const validProof: IProof = {
	type: "DataIntegrityProof",
	cryptosuite: "eddsa-jcs-2022",
	proofPurpose: "assertionMethod",
	proofValue: "p"
};

describe("PolicyNegotiationRequestPointService", () => {
	beforeEach(async () => {
		initSchemaLogging();
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

		informationPointComponent = new PolicyInformationPointService();
		ComponentFactory.register("policy-information-point", () => informationPointComponent);

		mockNegotiationComponent = {
			negotiate: vi.fn(),
			negotiationState: vi.fn(),
			negotiationCancel: vi.fn()
		} as unknown as IPolicyNegotiationPointComponent;
	});

	test("can create the service", async () => {
		const policyNegotiationRequestPoint = new PolicyNegotiationRequestPointService({
			config: {
				negotiationComponentCreator: async () => Promise.resolve(mockNegotiationComponent)
			}
		});
		expect(policyNegotiationRequestPoint).toBeInstanceOf(PolicyNegotiationRequestPointService);
	});

	test("calls negotiationComponentCreator and negotiates successfully", async () => {
		const negotiateMock = vi.fn().mockResolvedValue({ status: "approved" });
		mockNegotiationComponent.negotiate = negotiateMock;
		const service = new PolicyNegotiationRequestPointService({
			config: {
				negotiationComponentCreator: async () => mockNegotiationComponent
			}
		});
		await service.start("node1", undefined);

		informationPointComponent.retrieve = vi.fn().mockResolvedValue({ info: true });
		identityConnector.createProof = vi.fn().mockResolvedValue({ proof: validProof });
		const result = await service.negotiate("url1", "assetA", "read", "res1");
		expect(negotiateMock).toHaveBeenCalledWith(
			"assetA",
			"read",
			"res1",
			{ nodeIdentity: "node1" },
			{ info: true },
			{ proof: validProof }
		);
		expect(result.status).toBe("approved");
	});

	test("propagates errors from negotiation component negotiate method", async () => {
		const negotiateMock = vi.fn().mockRejectedValue(new Error("fail"));
		mockNegotiationComponent.negotiate = negotiateMock;
		const service = new PolicyNegotiationRequestPointService({
			config: {
				negotiationComponentCreator: async () => mockNegotiationComponent
			}
		});
		await service.start("node1", undefined);
		informationPointComponent.retrieve = vi.fn().mockResolvedValue({ info: true });
		identityConnector.createProof = vi.fn().mockResolvedValue({ proof: validProof });
		await expect(service.negotiate("url1", "assetA", "read", "res1")).rejects.toThrow("fail");
	});

	test("calls negotiationComponentCreator and retrieves negotiation state successfully", async () => {
		const negotiationStateMock = vi.fn().mockResolvedValue({ status: "approved" });
		mockNegotiationComponent.negotiationState = negotiationStateMock;
		const service = new PolicyNegotiationRequestPointService({
			config: {
				negotiationComponentCreator: async () => mockNegotiationComponent
			}
		});
		await service.start("node1", undefined);
		identityConnector.createProof = vi.fn().mockResolvedValue({ proof: true });
		const result = await service.negotiationState("url1", "pid1");
		expect(negotiationStateMock).toHaveBeenCalledWith("pid1", "node1", { proof: true });
		expect(result.status).toBe("approved");
	});

	test("propagates errors from negotiation component negotiationState method", async () => {
		const negotiationStateMock = vi.fn().mockRejectedValue(new Error("fail"));
		mockNegotiationComponent.negotiationState = negotiationStateMock;
		const service = new PolicyNegotiationRequestPointService({
			config: {
				negotiationComponentCreator: async () => mockNegotiationComponent
			}
		});
		await service.start("node1", undefined);
		identityConnector.createProof = vi.fn().mockResolvedValue({ proof: true });
		await expect(service.negotiationState("url1", "pid1")).rejects.toThrow("fail");
	});

	test("calls negotiationComponentCreator and retrieves negotiation cancel successfully", async () => {
		const negotiationCancelMock = vi.fn().mockResolvedValue({ status: "approved" });
		mockNegotiationComponent.negotiationCancel = negotiationCancelMock;
		const service = new PolicyNegotiationRequestPointService({
			config: {
				negotiationComponentCreator: async () => mockNegotiationComponent
			}
		});
		await service.start("node1", undefined);
		identityConnector.createProof = vi.fn().mockResolvedValue({ proof: true });
		await service.negotiationCancel("url1", "pid1");
		expect(negotiationCancelMock).toHaveBeenCalledWith("pid1", "node1", { proof: true });
	});

	test("propagates errors from negotiation component negotiationCancel method", async () => {
		const negotiationCancelMock = vi.fn().mockRejectedValue(new Error("fail"));
		mockNegotiationComponent.negotiationCancel = negotiationCancelMock;
		const service = new PolicyNegotiationRequestPointService({
			config: {
				negotiationComponentCreator: async () => mockNegotiationComponent
			}
		});
		await service.start("node1", undefined);
		identityConnector.createProof = vi.fn().mockResolvedValue({ proof: true });
		await expect(service.negotiationCancel("url1", "pid1")).rejects.toThrow("fail");
	});
});
