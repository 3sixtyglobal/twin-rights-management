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
import {
	PolicyAdministrationPointService,
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy
} from "@twin.org/rights-management-pap-service";
import { PolicyInformationPointService } from "@twin.org/rights-management-pip-service";
import type { IProof } from "@twin.org/standards-w3c-did";
import {
	EntityStorageVaultConnector,
	initSchema as initSchemaVault,
	type VaultKey,
	type VaultSecret
} from "@twin.org/vault-connector-entity-storage";
import { VaultConnectorFactory } from "@twin.org/vault-models";
import type { PolicyNegotiation } from "../src/entities/policyNegotiation";
import { PolicyNegotiationAdminPointService } from "../src/policyNegotiationAdminPointService";
import { PolicyNegotiationPointService } from "../src/policyNegotiationPointService";
import { initSchema } from "../src/schema";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let odrlPolicyMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;
let policyNegotiationMemoryEntityStorage: MemoryEntityStorageConnector<PolicyNegotiation>;
let identityConnector: EntityStorageIdentityConnector;
let negotiationAdminPointComponent: PolicyNegotiationAdminPointService;
let adminPointComponent: PolicyAdministrationPointService;
let informationPointComponent: PolicyInformationPointService;

const validProof: IProof = {
	type: "DataIntegrityProof",
	cryptosuite: "eddsa-jcs-2022",
	proofPurpose: "assertionMethod",
	proofValue: "p"
};

describe("PolicyNegotiationPointService", () => {
	beforeEach(async () => {
		initSchemaLogging();
		initSchemaPolicyAdministrationPoint();
		initSchemaVault();
		initSchemaIdentity();
		initSchema();

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

		negotiationAdminPointComponent = new PolicyNegotiationAdminPointService();
		ComponentFactory.register(
			"policy-negotiation-admin-point",
			() => negotiationAdminPointComponent
		);

		adminPointComponent = new PolicyAdministrationPointService();
		ComponentFactory.register("policy-administration-point", () => adminPointComponent);

		informationPointComponent = new PolicyInformationPointService();
		ComponentFactory.register("policy-information-point", () => informationPointComponent);
	});

	test("can create the service", async () => {
		const policyNegotiationPoint = new PolicyNegotiationPointService();
		expect(policyNegotiationPoint).toBeInstanceOf(PolicyNegotiationPointService);
	});

	test("can register and unregister a negotiator", async () => {
		const service = new PolicyNegotiationPointService();
		const negotiator = {
			canNegotiate: () => true,
			negotiate: vi.fn().mockResolvedValue({ state: { status: "pending" } })
		};
		await service.registerNegotiator("neg1", negotiator);
		await service.registerNegotiator("neg1", negotiator);
		await service.unregisterNegotiator("neg1");
	});

	test("negotiate throws if no negotiator found", async () => {
		const service = new PolicyNegotiationPointService();
		await expect(
			service.negotiate("asset", "action", "resId", { nodeIdentity: "node" }, {}, validProof)
		).rejects.toThrow();
	});

	test("negotiate stores state if not approved", async () => {
		const service = new PolicyNegotiationPointService();
		const negotiator = {
			canNegotiate: () => true,
			negotiate: vi.fn().mockResolvedValue({ state: { status: "pending", reason: "waiting" } })
		};
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(true);

		await service.registerNegotiator("neg1", negotiator);
		const state = await service.negotiate(
			"asset",
			"action",
			"resId",
			{ nodeIdentity: "node" },
			{},
			validProof
		);
		expect(state.status).toBe("pending");
	});

	test("negotiationState throws if proof is missing", async () => {
		const service = new PolicyNegotiationPointService();
		await expect(
			service.negotiationState("pid", "nid", undefined as unknown as IProof)
		).rejects.toThrow();
	});

	test("negotiationState returns approved if policy exists", async () => {
		const service = new PolicyNegotiationPointService();
		await policyNegotiationMemoryEntityStorage.set({
			id: "pid",
			dateCreated: new Date().toISOString(),
			assetType: "asset",
			action: "action",
			context: { nodeIdentity: "nid" },
			status: "approved"
		});
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(true);
		const state = await service.negotiationState("pid", "nid", validProof);
		expect(state.status).toBe("approved");
	});

	test("negotiationState throws NotFoundError if no policy or negotiation exists", async () => {
		const service = new PolicyNegotiationPointService();
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(true);
		vi.spyOn(adminPointComponent, "get").mockRejectedValue({ name: "NotFoundError" });
		vi.spyOn(negotiationAdminPointComponent, "get").mockResolvedValue(
			null as unknown as PolicyNegotiation
		);
		await expect(service.negotiationState("pid", "nid", validProof)).rejects.toMatchObject({
			cause: { message: expect.stringMatching(/policyNotFound/) }
		});
	});

	test("negotiationState throws GeneralError if PAP retrieve fails with other error", async () => {
		const service = new PolicyNegotiationPointService();
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(true);
		vi.spyOn(adminPointComponent, "get").mockRejectedValue(new Error("fail"));
		await expect(service.negotiationState("pid", "nid", validProof)).rejects.toMatchObject({
			message: expect.stringMatching(/policyFailed/)
		});
	});

	test("negotiationCancel calls remove", async () => {
		const service = new PolicyNegotiationPointService();
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(true);
		const removeMock = vi
			.spyOn(negotiationAdminPointComponent, "remove")
			.mockResolvedValue(undefined);
		await service.negotiationCancel("pid", "nid", validProof);
		expect(removeMock).toHaveBeenCalledWith("pid");
	});

	test("negotiationCancel resolves if negotiation does not exist", async () => {
		const service = new PolicyNegotiationPointService();
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(true);
		vi.spyOn(negotiationAdminPointComponent, "get").mockResolvedValue(
			null as unknown as PolicyNegotiation
		);
		await expect(service.negotiationCancel("pid", "nid", validProof)).resolves.toBeUndefined();
	});

	test("negotiationCancel throws if proof is invalid", async () => {
		const service = new PolicyNegotiationPointService();
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(false);
		await expect(service.negotiationCancel("pid", "nid", validProof)).rejects.toMatchObject({
			message: expect.stringMatching(/proofPolicyIdFailed/)
		});
	});

	test("registerNegotiator overwrites existing negotiator", async () => {
		const service = new PolicyNegotiationPointService();
		const negotiator1 = { canNegotiate: () => true, negotiate: vi.fn() };
		const negotiator2 = { canNegotiate: () => false, negotiate: vi.fn() };
		await service.registerNegotiator("neg1", negotiator1);
		await service.registerNegotiator("neg1", negotiator2);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((service as any)._negotiators[0].negotiator).toBe(negotiator2);
	});

	test("registerNegotiator throws if negotiatorId is empty", async () => {
		const service = new PolicyNegotiationPointService();
		await expect(
			service.registerNegotiator("", { canNegotiate: () => true, negotiate: vi.fn() })
		).rejects.toThrow();
	});

	test("unregisterNegotiator does nothing if id not found", async () => {
		const service = new PolicyNegotiationPointService();
		await expect(service.unregisterNegotiator("notfound")).resolves.toBeUndefined();
	});

	test("unregisterNegotiator throws if negotiatorId is empty", async () => {
		const service = new PolicyNegotiationPointService();
		await expect(service.unregisterNegotiator("")).rejects.toThrow();
	});

	test("can create the service", async () => {
		const policyNegotiationPoint = new PolicyNegotiationPointService();
		expect(policyNegotiationPoint).toBeInstanceOf(PolicyNegotiationPointService);
	});

	test("can register and unregister a negotiator", async () => {
		const service = new PolicyNegotiationPointService();
		const negotiator = {
			canNegotiate: () => true,
			negotiate: vi.fn().mockResolvedValue({ state: { status: "pending" } })
		};
		await service.registerNegotiator("neg1", negotiator);
		// Registering again should update
		await service.registerNegotiator("neg1", negotiator);
		await service.unregisterNegotiator("neg1");
	});

	test("negotiate throws if no negotiator found", async () => {
		const service = new PolicyNegotiationPointService();
		await expect(
			service.negotiate("asset", "action", "resId", { nodeIdentity: "node" }, {}, validProof)
		).rejects.toThrow();
	});

	test("negotiate stores state if not approved", async () => {
		const service = new PolicyNegotiationPointService();
		const negotiator = {
			canNegotiate: () => true,
			negotiate: vi.fn().mockResolvedValue({ state: { status: "pending", reason: "waiting" } })
		};
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(true);

		await service.registerNegotiator("neg1", negotiator);
		const state = await service.negotiate(
			"asset",
			"action",
			"resId",
			{ nodeIdentity: "node" },
			{},
			validProof
		);
		expect(state.status).toBe("pending");
	});

	test("negotiationState returns approved if policy exists", async () => {
		const service = new PolicyNegotiationPointService();
		await policyNegotiationMemoryEntityStorage.set({
			id: "pid",
			dateCreated: new Date().toISOString(),
			assetType: "asset",
			action: "action",
			context: { nodeIdentity: "nid" },
			status: "approved"
		});
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(true);
		const state = await service.negotiationState("pid", "nid", validProof);
		expect(state.status).toBe("approved");
	});

	test("negotiationCancel calls remove", async () => {
		const service = new PolicyNegotiationPointService();
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(true);
		const removeMock = vi
			.spyOn(negotiationAdminPointComponent, "remove")
			.mockResolvedValue(undefined);
		await service.negotiationCancel("pid", "nid", validProof);
		expect(removeMock).toHaveBeenCalledWith("pid");
	});

	test("negotiationState throws NotFoundError if no policy or negotiation exists", async () => {
		const service = new PolicyNegotiationPointService();
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(true);
		vi.spyOn(adminPointComponent, "get").mockRejectedValue({ name: "NotFoundError" });
		vi.spyOn(negotiationAdminPointComponent, "get").mockResolvedValue(
			null as unknown as PolicyNegotiation
		);
		await expect(service.negotiationState("pid", "nid", validProof)).rejects.toMatchObject({
			cause: { message: expect.stringMatching(/policyNotFound/) }
		});
	});

	test("negotiationState throws GeneralError if PAP retrieve fails with other error", async () => {
		const service = new PolicyNegotiationPointService();
		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(true);
		vi.spyOn(adminPointComponent, "get").mockRejectedValue(new Error("fail"));
		await expect(service.negotiationState("pid", "nid", validProof)).rejects.toMatchObject({
			message: expect.stringMatching(/policyFailed/)
		});
	});

	test("negotiationCancel throws if proof is invalid", async () => {
		const service = new PolicyNegotiationPointService();

		vi.spyOn(identityConnector, "verifyProof").mockResolvedValue(false);
		await expect(service.negotiationCancel("pid", "nid", validProof)).rejects.toMatchObject({
			message: expect.stringMatching(/proofPolicyIdFailed/)
		});
	});

	test("registerNegotiator throws if negotiatorId is empty", async () => {
		const service = new PolicyNegotiationPointService();
		await expect(
			service.registerNegotiator("", { canNegotiate: () => true, negotiate: vi.fn() })
		).rejects.toThrow();
	});

	test("unregisterNegotiator throws if negotiatorId is empty", async () => {
		const service = new PolicyNegotiationPointService();
		await expect(service.unregisterNegotiator("")).rejects.toThrow();
	});
});
