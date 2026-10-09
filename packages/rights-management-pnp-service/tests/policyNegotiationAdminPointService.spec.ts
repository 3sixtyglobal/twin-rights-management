// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ContextIdStore } from "@3sixty/context";
import { ComponentFactory } from "@3sixty/core";
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
import { DataspaceProtocolContractNegotiationStateType } from "@3sixty/standards-dataspace-protocol";
import type { PolicyNegotiation } from "../src/entities/policyNegotiation.js";
import { PolicyNegotiationAdminPointService } from "../src/policyNegotiationAdminPointService.js";
import { initSchema } from "../src/schema.js";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let policyNegotiationMemoryEntityStorage: MemoryEntityStorageConnector<PolicyNegotiation>;

describe("PolicyNegotiationAdminPointService", () => {
	afterEach(async () => {
		vi.restoreAllMocks();
	});

	beforeEach(async () => {
		initSchemaLogging();
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>(),
			config: { storageKey: "log-entry" }
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());

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
			// offerFromProvider() calls get(message.consumerPid) - this is the lookup that must succeed
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
