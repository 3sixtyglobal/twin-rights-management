// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPlatformComponent } from "@twin.org/api-models";
import {
	TaskSchedulerService,
	initSchema as initSchemaScheduler,
	type ScheduledTask
} from "@twin.org/background-task-scheduler";
import { ContextIdStore } from "@twin.org/context";
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
import { DataspaceProtocolContractNegotiationStateType } from "@twin.org/standards-dataspace-protocol";
import type { PolicyNegotiation } from "../src/entities/policyNegotiation.js";
import { PolicyNegotiationAdminPointService } from "../src/policyNegotiationAdminPointService.js";
import { initSchema } from "../src/schema.js";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let policyNegotiationMemoryEntityStorage: MemoryEntityStorageConnector<PolicyNegotiation>;
let taskSchedulerComponent: TaskSchedulerService;

describe("PolicyNegotiationAdminPointService", () => {
	afterEach(async () => {
		await taskSchedulerComponent.stop();
		vi.restoreAllMocks();
	});

	beforeEach(async () => {
		initSchemaLogging();
		initSchemaScheduler();
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>(),
			config: { storageKey: "log-entry" }
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());

		EntityStorageConnectorFactory.register(
			"scheduled-task",
			() =>
				new MemoryEntityStorageConnector<ScheduledTask>({
					entitySchema: nameof<ScheduledTask>(),
					config: { storageKey: "scheduled-task" }
				})
		);

		taskSchedulerComponent = new TaskSchedulerService({ config: { intervalMs: 500 } });
		ComponentFactory.register("task-scheduler", () => taskSchedulerComponent);
		// The engine normally calls start() on every registered IComponent during bootstrap;
		// tests don't run a full engine bootstrap, so the scheduler must be started explicitly
		// or addTask() will register tasks that never actually trigger.
		await taskSchedulerComponent.start();
		policyNegotiationMemoryEntityStorage = new MemoryEntityStorageConnector<PolicyNegotiation>({
			entitySchema: nameof<PolicyNegotiation>(),
			config: { storageKey: "policy-negotiation" }
		});
		EntityStorageConnectorFactory.register(
			"policy-negotiation",
			() => policyNegotiationMemoryEntityStorage
		);
		ContextIdStore.getContextIds = vi.fn().mockImplementation(() => ({
			organization: "org"
		}));

		ComponentFactory.register("platform", () => ({
			className: () => "MockPlatformComponent",
			isMultiTenant: () => false,
			execute: async (method: () => Promise<void>) => method(),
			getLocalOriginContext: async () => undefined
		}));
	});

	test("can create the service", async () => {
		const policyNegotiationAdminPoint = new PolicyNegotiationAdminPointService();
		expect(policyNegotiationAdminPoint).toBeInstanceOf(PolicyNegotiationAdminPointService);
	});

	test("can set and get a negotiation", async () => {
		const service = new PolicyNegotiationAdminPointService();
		const negotiation: PolicyNegotiation = {
			id: "pid",
			correlationId: "cid",
			dateCreated: new Date().toISOString(),
			state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
			organizationIdentity: "identity",
			trustVerificationInfo: {
				identity: "identity"
			}
		};
		await service.set(negotiation);
		const result = await service.get("pid");
		expect(result).toMatchObject(negotiation);
		expect(result.expires).toBeDefined();
	});

	test("set negotiation with interventionRequired set", async () => {
		const service = new PolicyNegotiationAdminPointService();
		const negotiation: PolicyNegotiation = {
			id: "pid",
			correlationId: "cid",
			dateCreated: new Date().toISOString(),
			state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
			interventionRequired: true,
			organizationIdentity: "identity",
			trustVerificationInfo: {
				identity: "identity"
			}
		};
		await service.set(negotiation);
		const result = await service.get("pid");
		expect(result).toMatchObject(negotiation);
		expect(result.expires).toBeUndefined();
	});

	test("get returns undefined for missing negotiation", async () => {
		const service = new PolicyNegotiationAdminPointService();
		await expect(service.get("missing")).rejects.toMatchObject({
			name: expect.stringMatching("NotFoundError")
		});
	});

	test("can remove a negotiation", async () => {
		const service = new PolicyNegotiationAdminPointService();
		const negotiation: PolicyNegotiation = {
			id: "pid",
			correlationId: "cid",
			dateCreated: new Date().toISOString(),
			state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
			organizationIdentity: "identity",
			trustVerificationInfo: {
				identity: "identity"
			}
		};
		await service.set(negotiation);
		await service.remove("pid");

		await expect(service.get("pid")).rejects.toMatchObject({
			name: expect.stringMatching("NotFoundError")
		});
	});

	test("can cleanup old requests", async () => {
		const service = new PolicyNegotiationAdminPointService();

		const now = Date.now();
		const msInDay = 1440 * 60 * 1000;
		const negotiation: PolicyNegotiation = {
			id: "pid",
			correlationId: "cid",
			dateCreated: new Date().toISOString(),
			state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
			organizationIdentity: "identity",
			trustVerificationInfo: {
				identity: "identity"
			}
		};

		Date.now = vi.fn().mockImplementation(() => now - msInDay);
		await service.set(negotiation);

		const negotiation2: PolicyNegotiation = {
			id: "pid2",
			correlationId: "cid2",
			dateCreated: new Date().toISOString(),
			state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
			organizationIdentity: "identity",
			trustVerificationInfo: {
				identity: "identity"
			}
		};

		Date.now = vi.fn().mockImplementation(() => now + msInDay);
		await service.set(negotiation2);

		vi.clearAllMocks();
		await service.start();

		await expect(service.get("pid")).rejects.toMatchObject({
			name: expect.stringMatching("NotFoundError")
		});
		const pid2 = await service.get("pid2");
		expect(pid2).toBeDefined();
	});

	test("expired cleanup removes expired negotiation and leaves interventionRequired", async () => {
		const service = new PolicyNegotiationAdminPointService({
			config: { negotiationStateTtlMinutes: 1440 }
		});

		const now = Date.now();
		const msInDay = 1440 * 60 * 1000;
		const hoursInMs = 60 * 1000;
		// First negotiation: set while "in the past" so its expires will be in the past once we advance time
		Date.now = vi.fn().mockImplementation(() => now - msInDay - hoursInMs);
		const expired: PolicyNegotiation = {
			id: "expired-pid",
			correlationId: "expired-cid",
			dateCreated: new Date().toISOString(),
			state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
			organizationIdentity: "identity",
			trustVerificationInfo: { identity: "identity" }
		};
		await service.set(expired);

		// Second: manual intervention (expires stays undefined)
		Date.now = vi.fn().mockImplementation(() => now);
		const manual: PolicyNegotiation = {
			id: "manual-pid",
			correlationId: "manual-cid",
			dateCreated: new Date().toISOString(),
			state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
			interventionRequired: true,
			organizationIdentity: "identity",
			trustVerificationInfo: { identity: "identity" }
		};
		await service.set(manual);

		// Advance time so expired's expires is in the past; run expired cleanup directly
		Date.now = vi.fn().mockImplementation(() => now + msInDay);
		await (
			service as unknown as { cleanupOldStatesPartition(): Promise<void> }
		).cleanupOldStatesPartition();

		await expect(service.get("expired-pid")).rejects.toMatchObject({
			name: expect.stringMatching("NotFoundError")
		});
		const manualResult = await service.get("manual-pid");
		expect(manualResult).toBeDefined();
		expect(manualResult.state).toBe(DataspaceProtocolContractNegotiationStateType.REQUESTED);
	});

	test("partitioned cleanup iterates tenants via per tenant execution", async () => {
		const executeSpy = vi.fn().mockImplementation(async (method: () => Promise<void>) => {
			await method();
			await method();
		});
		const platformComponent = {
			className: () => "platform",
			execute: executeSpy
		};
		ComponentFactory.register("platform", () => platformComponent);

		const service = new PolicyNegotiationAdminPointService();

		interface InternalService {
			cleanupOldStatesPartition(): Promise<void>;
		}
		const internalService = service as unknown as InternalService;
		const cleanupPartitionSpy = vi
			.spyOn(internalService, "cleanupOldStatesPartition")
			.mockResolvedValue(undefined);

		await service.start();

		expect(executeSpy).toHaveBeenCalledTimes(1);
		expect(cleanupPartitionSpy).toHaveBeenCalledTimes(2);
	});

	test("single-tenant cleanup runs partition method once via platform execute", async () => {
		const executeSpy = vi.fn().mockImplementation(async (method: () => Promise<void>) => method());
		const platformComponent = {
			className: () => "platform",
			execute: executeSpy
		} as unknown as IPlatformComponent;
		ComponentFactory.register("platform", () => platformComponent);

		const service = new PolicyNegotiationAdminPointService();

		interface InternalService {
			cleanupOldStatesPartition(): Promise<void>;
		}
		const internalService = service as unknown as InternalService;
		const cleanupPartitionSpy = vi
			.spyOn(internalService, "cleanupOldStatesPartition")
			.mockResolvedValue(undefined);

		await service.start();

		expect(executeSpy).toHaveBeenCalledTimes(1);
		expect(cleanupPartitionSpy).toHaveBeenCalledTimes(1);
	});

	describe("create", () => {
		test("returns the caller-supplied id and persists entry as primary key", async () => {
			const service = new PolicyNegotiationAdminPointService();
			const consumerPid = "urn:uuid:consumer-pid-1";
			const id = await service.create(consumerPid);

			expect(id).toEqual(consumerPid);
			const retrieved = await service.get(consumerPid);
			expect(retrieved.id).toEqual(consumerPid);
			expect(retrieved.correlationId).toEqual("");
			expect(retrieved.state).toEqual(DataspaceProtocolContractNegotiationStateType.REQUESTED);
			expect(retrieved.dateCreated).toBeDefined();
			expect(retrieved.organizationIdentity).toEqual("org");
		});

		test("entry is retrievable via the consumerPid (primary key)", async () => {
			const service = new PolicyNegotiationAdminPointService();
			const consumerPid = "urn:uuid:consumer-pid-f3";
			await service.create(consumerPid);
			// offerFromProvider() calls get(message.consumerPid) — this is the lookup that must succeed
			const retrieved = await service.get(consumerPid);
			expect(retrieved.id).toEqual(consumerPid);
		});

		test("throws GuardError when id is empty", async () => {
			const service = new PolicyNegotiationAdminPointService();
			await expect(service.create("")).rejects.toMatchObject({
				name: expect.stringMatching("GuardError")
			});
		});

		test("throws AlreadyExistsError when id is already registered", async () => {
			const service = new PolicyNegotiationAdminPointService();
			await service.create("urn:uuid:dup");
			await expect(service.create("urn:uuid:dup")).rejects.toMatchObject({
				name: expect.stringMatching("AlreadyExistsError")
			});
		});

		test("sets expires on the persisted entry", async () => {
			const service = new PolicyNegotiationAdminPointService();
			const before = Date.now();
			const id = await service.create("urn:uuid:consumer-pid-3");
			const retrieved = await service.get(id);
			expect(retrieved.expires).toBeGreaterThan(before);
		});

		test("throws GeneralError when organization context is not set", async () => {
			ContextIdStore.getContextIds = vi.fn().mockImplementation(() => ({}));
			const service = new PolicyNegotiationAdminPointService();
			await expect(service.create("urn:uuid:no-org")).rejects.toMatchObject({
				name: "GeneralError"
			});
		});

		test("concurrent creates with same id: exactly one succeeds", async () => {
			const service = new PolicyNegotiationAdminPointService();
			const results = await Promise.allSettled([
				service.create("urn:uuid:race"),
				service.create("urn:uuid:race")
			]);
			const fulfilled = results.filter(
				(r): r is PromiseFulfilledResult<string> => r.status === "fulfilled"
			);
			const rejected = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
			expect(fulfilled).toHaveLength(1);
			expect(rejected).toHaveLength(1);
			expect(rejected[0].reason).toMatchObject({
				name: expect.stringMatching("AlreadyExistsError")
			});
		});

		test("concurrent creates with different ids: both succeed", async () => {
			const service = new PolicyNegotiationAdminPointService();
			const results = await Promise.allSettled([
				service.create("urn:uuid:concurrent-a"),
				service.create("urn:uuid:concurrent-b")
			]);
			expect(results.every(r => r.status === "fulfilled")).toBe(true);
		});
	});
});
