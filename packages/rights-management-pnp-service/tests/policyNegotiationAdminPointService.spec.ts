// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { TaskSchedulerService } from "@twin.org/background-task-scheduler";
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
import { IdsContractNegotiationStateType } from "@twin.org/standards-ids-contract-negotiation";
import type { PolicyNegotiation } from "../src/entities/policyNegotiation";
import { PolicyNegotiationAdminPointService } from "../src/policyNegotiationAdminPointService";
import { initSchema } from "../src/schema";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let policyNegotiationMemoryEntityStorage: MemoryEntityStorageConnector<PolicyNegotiation>;

describe("PolicyNegotiationAdminPointService", () => {
	beforeEach(async () => {
		initSchemaLogging();
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());

		const taskSchedulerComponent = new TaskSchedulerService({ config: { overrideInterval: 0.5 } });
		ComponentFactory.register("task-scheduler", () => taskSchedulerComponent);
		policyNegotiationMemoryEntityStorage = new MemoryEntityStorageConnector<PolicyNegotiation>({
			entitySchema: nameof<PolicyNegotiation>()
		});
		EntityStorageConnectorFactory.register(
			"policy-negotiation",
			() => policyNegotiationMemoryEntityStorage
		);
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
			state: IdsContractNegotiationStateType.REQUESTED
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
			state: IdsContractNegotiationStateType.REQUESTED,
			interventionRequired: true
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
			state: IdsContractNegotiationStateType.REQUESTED
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
			state: IdsContractNegotiationStateType.REQUESTED
		};

		Date.now = vi.fn().mockImplementation(() => now - msInDay);
		await service.set(negotiation);

		const negotiation2: PolicyNegotiation = {
			id: "pid2",
			correlationId: "cid2",
			dateCreated: new Date().toISOString(),
			state: IdsContractNegotiationStateType.REQUESTED
		};

		Date.now = vi.fn().mockImplementation(() => now + msInDay);
		await service.set(negotiation2);

		vi.clearAllMocks();
		await service.start("nid", undefined);

		await expect(service.get("pid")).rejects.toMatchObject({
			name: expect.stringMatching("NotFoundError")
		});
		const pid2 = await service.get("pid2");
		expect(pid2).toBeDefined();
	});
});
