// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Factory } from "@3sixty/core";
import { MemoryEntityStorageConnector } from "@3sixty/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@3sixty/entity-storage-models";
import {
	EntityStorageLoggingConnector,
	initSchema,
	type LogEntry
} from "@3sixty/logging-connector-entity-storage";
import { LoggingConnectorFactory } from "@3sixty/logging-models";
import { LoggingService } from "@3sixty/logging-service";
import { nameof } from "@3sixty/nameof";
import {
	PolicyInformationAccessMode,
	PolicyInformationSourceFactory,
	type IPolicyInformationSource,
	type IRightsManagementInformation
} from "@3sixty/rights-management-models";
import { OdrlContexts } from "@3sixty/standards-w3c-odrl";
import { PolicyInformationPointService } from "../src/policyInformationPointService.js";

/**
 * Mock Policy Information Source class
 */
class MockPolicyInformationSource implements IPolicyInformationSource {
	// eslint-disable-next-line no-restricted-syntax
	public retrieve = vi.fn();

	private readonly _className: string;

	constructor(className: string) {
		this._className = className;
	}

	// eslint-disable-next-line no-restricted-syntax
	public className = (): string => this._className;
}

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;

describe("PolicyInformationPointService", () => {
	beforeEach(() => {
		Factory.clearFactories();

		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>(),
			config: { storageKey: "log-entry" }
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register(
			"logging",
			// Disable batching (default in logging-connector-entity-storage >= next.6) so log
			// entries are written synchronously and assertions on the store are deterministic.
			() => new EntityStorageLoggingConnector({ config: { batchSize: 1, batchIntervalMs: 0 } })
		);
		ComponentFactory.register("logging", () => new LoggingService());
		ComponentFactory.register("platform", () => ({
			className: () => "MockPlatformComponent",
			isMultiTenant: () => false,
			execute: async (method: () => Promise<void>) => method(),
			getLocalOriginContext: async () => undefined
		}));
	});

	afterEach(async () => {
		await loggingMemoryEntityStorage?.teardown();
	});

	test("can create the service", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		expect(policyInformationPoint).toBeInstanceOf(PolicyInformationPointService);
	});

	test("can register an information source", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		const mockSource = new MockPolicyInformationSource("testSource");

		PolicyInformationSourceFactory.register("testSource", () => mockSource);

		// Verify no errors thrown during registration
		expect(() => policyInformationPoint).not.toThrow();
	});

	test("can retrieve information from a registered source", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		const mockInformation: IRightsManagementInformation = {
			mock: {
				"@context": "http://www.w3.org/ns/did/v1",
				"@type": "VerifiableCredential",
				"@id": "did:example:user123",
				credentialSubject: {
					"@id": "did:example:user123",
					role: "admin"
				}
			}
		};

		const mockSource = new MockPolicyInformationSource("identitySource");
		mockSource.retrieve.mockResolvedValue(mockInformation);

		PolicyInformationSourceFactory.register("identitySource", () => mockSource);
		const information = await policyInformationPoint.retrieve(
			{
				"@context": OdrlContexts.Context,
				"@type": "Set",
				"@id": "policy123",
				target: "document",
				action: "read",
				assignee: "node456"
			},
			PolicyInformationAccessMode.Any,
			{ foo: "bar" }
		);

		expect(mockSource.retrieve).toHaveBeenCalledWith(
			{
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Set",
				"@id": "policy123",
				target: "document",
				action: "read",
				assignee: "node456"
			},
			PolicyInformationAccessMode.Any,
			{ foo: "bar" },
			undefined
		);
		expect(information).toEqual(mockInformation);
	});

	test("can retrieve information from multiple sources", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		const identityInfo: IRightsManagementInformation = {
			identity: { "@type": "Identity", "@id": "user123", role: "admin" }
		};
		const contextInfo: IRightsManagementInformation = {
			context: { "@type": "Context", "@id": "context1", location: "EU", timeZone: "UTC+1" }
		};
		const identitySource = new MockPolicyInformationSource("identity");
		const contextSource = new MockPolicyInformationSource("context");
		identitySource.retrieve.mockResolvedValue(identityInfo);
		contextSource.retrieve.mockResolvedValue(contextInfo);

		PolicyInformationSourceFactory.register("identity", () => identitySource);
		PolicyInformationSourceFactory.register("context", () => contextSource);

		const information = await policyInformationPoint.retrieve(
			{
				"@context": OdrlContexts.Context,
				"@type": "Set",
				"@id": "policy123",
				target: "image",
				action: "edit",
				assignee: "node456"
			},
			PolicyInformationAccessMode.Any,
			{ foo: "bar" }
		);

		expect(identitySource.retrieve).toHaveBeenCalledWith(
			{
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Set",
				"@id": "policy123",
				target: "image",
				action: "edit",
				assignee: "node456"
			},
			PolicyInformationAccessMode.Any,
			{ foo: "bar" },
			undefined
		);
		expect(contextSource.retrieve).toHaveBeenCalledWith(
			{
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Set",
				"@id": "policy123",
				target: "image",
				action: "edit",
				assignee: "node456"
			},
			PolicyInformationAccessMode.Any,
			{ foo: "bar" },
			undefined
		);
		expect(information).toEqual({ ...contextInfo, ...identityInfo });
	});

	test("handles source returning undefined", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		const mockSource = new MockPolicyInformationSource("emptySource");
		mockSource.retrieve.mockResolvedValue(undefined);

		PolicyInformationSourceFactory.register("emptySource", () => mockSource);
		const information = await policyInformationPoint.retrieve(
			{
				"@context": OdrlContexts.Context,
				"@type": "Set",
				"@id": "policy123",
				target: "test",
				action: "action",
				assignee: "node456"
			},
			PolicyInformationAccessMode.Any,
			{ foo: "bar" }
		);

		expect(information).toEqual({});
	});

	test("continues retrieving from other sources when one fails", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		const workingSource = new MockPolicyInformationSource("working");
		const failingSource = new MockPolicyInformationSource("failing");

		const workingInfo: IRightsManagementInformation = {
			working: { "@id": "working-info", "@type": "Info" }
		};
		workingSource.retrieve.mockResolvedValue(workingInfo);
		failingSource.retrieve.mockRejectedValue(new Error("Source error"));

		PolicyInformationSourceFactory.register("working", () => workingSource);
		PolicyInformationSourceFactory.register("failing", () => failingSource);

		const information = await policyInformationPoint.retrieve(
			{
				"@context": OdrlContexts.Context,
				"@type": "Set",
				"@id": "policy123",
				target: "database",
				action: "query",
				assignee: "node456"
			},
			PolicyInformationAccessMode.Any,
			{ foo: "bar" }
		);

		expect(workingSource.retrieve).toHaveBeenCalled();
		expect(failingSource.retrieve).toHaveBeenCalled();
		expect(information).toEqual({ ...workingInfo });
	});

	test("logs error when information source fails", async () => {
		const policyInformationPoint = new PolicyInformationPointService({
			loggingComponentType: "logging"
		});
		const failingSource = new MockPolicyInformationSource("failing");
		failingSource.retrieve.mockRejectedValue(new Error("Identity resolution failed"));

		PolicyInformationSourceFactory.register("failing", () => failingSource);
		await policyInformationPoint.retrieve(
			{
				"@context": OdrlContexts.Context,
				"@type": "Set",
				"@id": "policy123",
				target: "file",
				action: "upload",
				assignee: "node456"
			},
			PolicyInformationAccessMode.Any,
			{ foo: "bar" }
		);

		const logEntries = await loggingMemoryEntityStorage.getStore();
		expect(logEntries.length).toBe(1);
		expect(logEntries[0].level).toBe("error");
		expect(logEntries[0].message).toBe("sourceRetrieveFailed");
		expect(logEntries[0].data).toEqual({
			sourceId: "failing",
			policyId: "policy123"
		});
	});
});
