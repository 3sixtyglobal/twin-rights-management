// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ITenantAdminComponent } from "@twin.org/api-models";
import {
	TaskSchedulerService,
	initSchema as initSchemaScheduler,
	type ScheduledTask
} from "@twin.org/background-task-scheduler";
import { ContextIdKeys, ContextIdStore } from "@twin.org/context";
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

describe("PolicyNegotiationAdminPointService", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	beforeEach(async () => {
		initSchemaLogging();
		initSchemaScheduler();
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());

		EntityStorageConnectorFactory.register(
			"scheduled-task",
			() =>
				new MemoryEntityStorageConnector<ScheduledTask>({
					entitySchema: nameof<ScheduledTask>()
				})
		);

		const taskSchedulerComponent = new TaskSchedulerService({ config: { intervalMs: 500 } });
		ComponentFactory.register("task-scheduler", () => taskSchedulerComponent);
		policyNegotiationMemoryEntityStorage = new MemoryEntityStorageConnector<PolicyNegotiation>({
			entitySchema: nameof<PolicyNegotiation>()
		});
		EntityStorageConnectorFactory.register(
			"policy-negotiation",
			() => policyNegotiationMemoryEntityStorage
		);
		ContextIdStore.getContextIds = vi.fn().mockImplementation(() => ({
			organization: "org"
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
			nodeIdentity: "node-identity",
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
			nodeIdentity: "node-identity",
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
			nodeIdentity: "node-identity",
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
			nodeIdentity: "node-identity",
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
			nodeIdentity: "node-identity",
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
			nodeIdentity: "node-identity",
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
			nodeIdentity: "node-identity",
			organizationIdentity: "identity",
			trustVerificationInfo: { identity: "identity" }
		};
		await service.set(manual);

		// Advance time so expired's expires is in the past; run expired cleanup directly
		Date.now = vi.fn().mockImplementation(() => now + msInDay);
		await (service as unknown as { cleanupOldStates(): Promise<void> }).cleanupOldStates();

		await expect(service.get("expired-pid")).rejects.toMatchObject({
			name: expect.stringMatching("NotFoundError")
		});
		const manualResult = await service.get("manual-pid");
		expect(manualResult).toBeDefined();
		expect(manualResult.state).toBe(DataspaceProtocolContractNegotiationStateType.REQUESTED);
	});

	test("partitioned cleanup iterates tenants from tenant admin", async () => {
		const tenantAdminQuery = vi.fn().mockResolvedValue({
			tenants: [{ id: "tenant-1" }, { id: "tenant-2" }],
			cursor: undefined
		});
		const tenantAdmin = {
			className: () => "tenant-admin",
			query: tenantAdminQuery
		} as unknown as ITenantAdminComponent;
		ComponentFactory.register("tenant-admin", () => tenantAdmin);

		const runSpy = vi
			.spyOn(ContextIdStore, "run")
			.mockImplementation(async (contextIds, action) => action());

		const service = new PolicyNegotiationAdminPointService({
			partitionContextIds: [ContextIdKeys.Tenant]
		});

		interface InternalService {
			cleanupOldStatesPartition(): Promise<void>;
			cleanupOldStates(): Promise<void>;
		}
		const internalService = service as unknown as InternalService;
		const cleanupPartitionSpy = vi
			.spyOn(internalService, "cleanupOldStatesPartition")
			.mockResolvedValue(undefined);

		await internalService.cleanupOldStates();

		expect(tenantAdminQuery).toHaveBeenCalledTimes(1);
		expect(runSpy).toHaveBeenCalledTimes(2);
		expect(cleanupPartitionSpy).toHaveBeenCalledTimes(2);
		expect(runSpy.mock.calls[0]?.[0][ContextIdKeys.Tenant]).toBe("tenant-1");
		expect(runSpy.mock.calls[1]?.[0][ContextIdKeys.Tenant]).toBe("tenant-2");
	});

	test("partitioned cleanup forwards cursor when paging tenants", async () => {
		const tenantAdminQuery = vi
			.fn()
			.mockResolvedValueOnce({
				tenants: [{ id: "tenant-1" }],
				cursor: "cursor-2"
			})
			.mockResolvedValueOnce({
				tenants: [{ id: "tenant-2" }],
				cursor: undefined
			});
		const tenantAdmin = {
			className: () => "tenant-admin",
			query: tenantAdminQuery
		} as unknown as ITenantAdminComponent;
		ComponentFactory.register("tenant-admin", () => tenantAdmin);

		vi.spyOn(ContextIdStore, "run").mockImplementation(async (contextIds, action) => action());

		const service = new PolicyNegotiationAdminPointService({
			partitionContextIds: [ContextIdKeys.Tenant]
		});

		interface InternalService {
			cleanupOldStatesPartition(): Promise<void>;
			cleanupOldStates(): Promise<void>;
		}
		const internalService = service as unknown as InternalService;
		vi.spyOn(internalService, "cleanupOldStatesPartition").mockResolvedValue(undefined);

		await internalService.cleanupOldStates();

		expect(tenantAdminQuery).toHaveBeenCalledTimes(2);
		expect(tenantAdminQuery).toHaveBeenNthCalledWith(1, undefined, undefined);
		expect(tenantAdminQuery).toHaveBeenNthCalledWith(2, undefined, "cursor-2");
	});
});
