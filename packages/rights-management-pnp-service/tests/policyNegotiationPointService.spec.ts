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
	type IPolicyNegotiationRequest,
	type IPolicyRequest,
	RightsManagementContexts,
	RightsManagementTokenHelper,
	RightsManagementTypes,
	type IPolicyLocator
} from "@twin.org/rights-management-models";
import {
	PolicyAdministrationPointService,
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy
} from "@twin.org/rights-management-pap-service";
import { PolicyInformationPointService } from "@twin.org/rights-management-pip-service";
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
let testIdentity: string;
let validTokenPolicy: string;
let validTokenRequest: string;
let testLocator: IPolicyLocator;

describe("PolicyNegotiationPointService", () => {
	beforeAll(async () => {
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

		const doc = await identityConnector.createDocument("test-controller");
		testIdentity = doc.id;
		await identityConnector.addVerificationMethod(
			"test-controller",
			doc.id,
			"verificationMethod",
			"key-1"
		);

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

		testLocator = {
			assetType: "asset",
			action: "action",
			resourceId: "resId",
			assignee: testIdentity
		};

		const policyNegotiationRequest: IPolicyNegotiationRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.PolicyNegotiationRequest,
			...testLocator
		};

		validTokenPolicy = await RightsManagementTokenHelper.createToken(
			identityConnector,
			`${testIdentity}#key-1`,
			policyNegotiationRequest,
			60
		);

		const policyRequest: IPolicyRequest = {
			"@context": RightsManagementContexts.ContextRoot,
			type: RightsManagementTypes.PolicyRequest,
			id: "pid"
		};

		validTokenRequest = await RightsManagementTokenHelper.createToken(
			identityConnector,
			`${testIdentity}#key-1`,
			policyRequest,
			60
		);
	});

	test("can create the service", async () => {
		const policyNegotiationPoint = new PolicyNegotiationPointService();
		expect(policyNegotiationPoint).toBeInstanceOf(PolicyNegotiationPointService);
	});

	test("can register and unregister a negotiator", async () => {
		const service = new PolicyNegotiationPointService();
		const negotiator = {
			supportedPolicies: () => [],
			negotiate: vi.fn().mockResolvedValue({ state: { status: "pending" } })
		};
		await service.registerNegotiator("neg1", negotiator);
		await service.registerNegotiator("neg1", negotiator);
		await service.unregisterNegotiator("neg1");
	});

	test("negotiate throws if no negotiator found", async () => {
		const service = new PolicyNegotiationPointService();

		await expect(service.negotiate(testLocator, {}, validTokenPolicy)).rejects.toThrow();
	});

	test("negotiate stores state if not approved", async () => {
		const service = new PolicyNegotiationPointService();
		const negotiator = {
			supportedPolicies: () => [],
			negotiate: vi.fn().mockResolvedValue({ state: { status: "pending", reason: "waiting" } })
		};

		await service.registerNegotiator("neg1", negotiator);
		const state = await service.negotiate(testLocator, {}, validTokenPolicy);
		expect(state.status).toBe("pending");
	});

	test("negotiationState throws if proof is missing", async () => {
		const service = new PolicyNegotiationPointService();
		await expect(service.negotiationState("pid", undefined as unknown as string)).rejects.toThrow();
	});

	test("negotiationState returns approved if policy exists", async () => {
		const service = new PolicyNegotiationPointService();
		await policyNegotiationMemoryEntityStorage.set({
			id: "pid",
			dateCreated: new Date().toISOString(),
			assetType: "asset",
			action: "action",
			assignee: testIdentity,
			status: "approved"
		});
		const state = await service.negotiationState("pid", validTokenRequest);
		expect(state.status).toBe("approved");
	});

	test("negotiationState throws NotFoundError if no policy or negotiation exists", async () => {
		const service = new PolicyNegotiationPointService();
		vi.spyOn(adminPointComponent, "get").mockRejectedValue({ name: "NotFoundError" });
		vi.spyOn(negotiationAdminPointComponent, "get").mockResolvedValue(
			null as unknown as PolicyNegotiation
		);
		await expect(service.negotiationState("pid", validTokenRequest)).rejects.toMatchObject({
			cause: { message: expect.stringMatching(/policyNotFound/) }
		});
	});

	test("negotiationState throws GeneralError if PAP retrieve fails with other error", async () => {
		const service = new PolicyNegotiationPointService();
		const spy = vi.spyOn(adminPointComponent, "get").mockRejectedValue(new Error("fail"));
		await expect(service.negotiationState("pid", validTokenRequest)).rejects.toMatchObject({
			message: expect.stringMatching(/policyFailed/)
		});
		spy.mockClear();
	});

	test("negotiationCancel calls remove", async () => {
		const service = new PolicyNegotiationPointService();
		const removeMock = vi
			.spyOn(negotiationAdminPointComponent, "remove")
			.mockResolvedValue(undefined);
		await service.negotiationCancel("pid", validTokenRequest);
		expect(removeMock).toHaveBeenCalledWith("pid");
	});

	test("negotiationCancel resolves if negotiation does not exist", async () => {
		const service = new PolicyNegotiationPointService();
		vi.spyOn(negotiationAdminPointComponent, "get").mockResolvedValue(
			null as unknown as PolicyNegotiation
		);
		await expect(service.negotiationCancel("pid", validTokenRequest)).resolves.toBeUndefined();
	});

	test("negotiationCancel throws if proof is invalid", async () => {
		const service = new PolicyNegotiationPointService();
		await expect(service.negotiationCancel("pid", "aaa")).rejects.toMatchObject({
			message: expect.stringMatching(/tokenFailed/)
		});
	});

	test("registerNegotiator overwrites existing negotiator", async () => {
		const service = new PolicyNegotiationPointService();
		const negotiator1 = { supportedPolicies: () => [], negotiate: vi.fn() };
		const negotiator2 = { supportedPolicies: () => [], negotiate: vi.fn() };
		await service.registerNegotiator("neg1", negotiator1);
		await service.registerNegotiator("neg1", negotiator2);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((service as any)._negotiators[0].negotiator).toBe(negotiator2);
	});

	test("registerNegotiator throws if negotiatorId is empty", async () => {
		const service = new PolicyNegotiationPointService();
		await expect(
			service.registerNegotiator("", { supportedPolicies: () => [], negotiate: vi.fn() })
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
});
