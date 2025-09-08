// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageLoggingConnector,
	initSchema,
	type LogEntry
} from "@twin.org/logging-connector-entity-storage";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import { LoggingService } from "@twin.org/logging-service";
import { nameof } from "@twin.org/nameof";
import {
	PolicyInformationAccessMode,
	type IPolicyInformationSource
} from "@twin.org/rights-management-models";
import { PolicyInformationPointService } from "../src/policyInformationPointService";

/**
 * Mock Policy Information Source class
 */
class MockPolicyInformationSource implements IPolicyInformationSource {
	// eslint-disable-next-line no-restricted-syntax
	public retrieve = vi.fn();
}

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;

describe("PolicyInformationPointService", () => {
	beforeEach(() => {
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());
	});

	test("can create the service", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		expect(policyInformationPoint).toBeInstanceOf(PolicyInformationPointService);
	});

	test("can register an information source", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		const mockSource = new MockPolicyInformationSource();

		await policyInformationPoint.registerSource("testSource", mockSource);

		// Verify no errors thrown during registration
		expect(() => policyInformationPoint).not.toThrow();
	});

	test("can retrieve information from a registered source", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		const mockInformation: IJsonLdNodeObject[] = [
			{
				"@context": "https://www.w3.org/ns/did/v1",
				"@type": "VerifiableCredential",
				"@id": "did:example:user123",
				credentialSubject: {
					"@id": "did:example:user123",
					role: "admin"
				}
			}
		];

		const mockSource = new MockPolicyInformationSource();
		mockSource.retrieve.mockResolvedValue(mockInformation);

		await policyInformationPoint.registerSource("identitySource", mockSource);
		const information = await policyInformationPoint.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Any,
			"node456",
			{ foo: "bar" },
			[]
		);

		expect(mockSource.retrieve).toHaveBeenCalledWith(
			"document",
			"read",
			PolicyInformationAccessMode.Any,
			"node456",
			{ foo: "bar" },
			[]
		);
		expect(information).toEqual({
			identitySource: mockInformation
		});
	});

	test("can retrieve information from multiple sources", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		const identityInfo: IJsonLdNodeObject[] = [
			{ "@type": "Identity", "@id": "user123", role: "admin" }
		];
		const contextInfo: IJsonLdNodeObject[] = [
			{ "@type": "Context", "@id": "context1", location: "EU", timeZone: "UTC+1" }
		];

		const identitySource = new MockPolicyInformationSource();
		const contextSource = new MockPolicyInformationSource();
		identitySource.retrieve.mockResolvedValue(identityInfo);
		contextSource.retrieve.mockResolvedValue(contextInfo);

		await policyInformationPoint.registerSource("identity", identitySource);
		await policyInformationPoint.registerSource("context", contextSource);

		const information = await policyInformationPoint.retrieve(
			"image",
			"edit",
			PolicyInformationAccessMode.Any,
			"node456",
			{ foo: "bar" },
			[]
		);

		expect(identitySource.retrieve).toHaveBeenCalledWith(
			"image",
			"edit",
			PolicyInformationAccessMode.Any,
			"node456",
			{ foo: "bar" },
			[]
		);
		expect(contextSource.retrieve).toHaveBeenCalledWith(
			"image",
			"edit",
			PolicyInformationAccessMode.Any,
			"node456",
			{ foo: "bar" },
			[]
		);
		expect(information).toEqual({ context: contextInfo, identity: identityInfo });
	});

	test("handles source returning undefined", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		const mockSource = new MockPolicyInformationSource();
		mockSource.retrieve.mockResolvedValue(undefined);

		await policyInformationPoint.registerSource("emptySource", mockSource);
		const information = await policyInformationPoint.retrieve(
			"test",
			"action",
			PolicyInformationAccessMode.Any,
			"node456",
			{ foo: "bar" },
			[]
		);

		expect(information).toEqual({});
	});

	test("continues retrieving from other sources when one fails", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		const workingSource = new MockPolicyInformationSource();
		const failingSource = new MockPolicyInformationSource();

		const workingInfo: IJsonLdNodeObject[] = [{ "@id": "working-info", "@type": "Info" }];
		workingSource.retrieve.mockResolvedValue(workingInfo);
		failingSource.retrieve.mockRejectedValue(new Error("Source error"));

		await policyInformationPoint.registerSource("working", workingSource);
		await policyInformationPoint.registerSource("failing", failingSource);

		const information = await policyInformationPoint.retrieve(
			"database",
			"query",
			PolicyInformationAccessMode.Any,
			"node456",
			{ foo: "bar" },
			[]
		);

		expect(workingSource.retrieve).toHaveBeenCalled();
		expect(failingSource.retrieve).toHaveBeenCalled();
		expect(information).toEqual({ working: workingInfo });
	});

	test("logs error when information source fails", async () => {
		const policyInformationPoint = new PolicyInformationPointService();
		const failingSource = new MockPolicyInformationSource();
		failingSource.retrieve.mockRejectedValue(new Error("Identity resolution failed"));

		await policyInformationPoint.registerSource("failing", failingSource);
		await policyInformationPoint.retrieve(
			"file",
			"upload",
			PolicyInformationAccessMode.Any,
			"node456",
			"fileNode",
			[]
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		expect(logEntries.length).toBe(2);
		expect(logEntries[0].level).toBe("info");
		expect(logEntries[0].message).toBe("registeredSource");
		expect(logEntries[1].level).toBe("error");
		expect(logEntries[1].message).toBe("sourceRetrieveFailed");
		expect(logEntries[1].data).toEqual({
			sourceId: "failing",
			assetType: "file",
			action: "upload"
		});
	});
});
