// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
/* eslint-disable max-classes-per-file */
import { ComponentFactory, GeneralError } from "@twin.org/core";
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
import type {
	IPolicyDecisionPointComponent,
	IPolicyEnforcementProcessor
} from "@twin.org/rights-management-models";
import {
	PolicyAdministrationPointService,
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy
} from "@twin.org/rights-management-pap-service";
import { PolicyDecisionPointService } from "@twin.org/rights-management-pdp-service";
import { PolicyInformationPointService } from "@twin.org/rights-management-pip-service";
import { PolicyManagementPointService } from "@twin.org/rights-management-pmp-service";
import { PolicyExecutionPointService } from "@twin.org/rights-management-pxp-service";
import { OdrlContexts, type IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import { PolicyEnforcementPointService } from "../src/policyEnforcementPointService";

/**
 * Mock Policy Decision Point Component
 */
class MockPolicyDecisionPointComponent implements IPolicyDecisionPointComponent {
	public CLASS_NAME = "MockPolicyDecisionPointComponent";

	// eslint-disable-next-line no-restricted-syntax
	public evaluate = vi.fn();
}

/**
 * Mock Policy Enforcement Processor
 */
class MockPolicyEnforcementProcessor implements IPolicyEnforcementProcessor {
	// eslint-disable-next-line no-restricted-syntax
	public process = vi.fn();
}

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let odrlPolicyMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;

describe("PolicyEnforcementPointService", () => {
	beforeEach(() => {
		initSchemaLogging();
		initSchemaPolicyAdministrationPoint();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());

		odrlPolicyMemoryEntityStorage = new MemoryEntityStorageConnector<OdrlPolicy>({
			entitySchema: nameof<OdrlPolicy>()
		});
		EntityStorageConnectorFactory.register("odrl-policy", () => odrlPolicyMemoryEntityStorage);

		ComponentFactory.register(
			"policy-administration-point",
			() => new PolicyAdministrationPointService()
		);
		ComponentFactory.register("policy-management-point", () => new PolicyManagementPointService());
		ComponentFactory.register(
			"policy-information-point",
			() => new PolicyInformationPointService()
		);
		ComponentFactory.register("policy-execution-point", () => new PolicyExecutionPointService());
		ComponentFactory.register("policy-decision-point", () => new PolicyDecisionPointService());

		ComponentFactory.register(
			"policy-decision-point",
			() => new MockPolicyDecisionPointComponent()
		);
	});

	test("can create the service", async () => {
		const policyEnforcementPoint = new PolicyEnforcementPointService();
		expect(policyEnforcementPoint).toBeInstanceOf(PolicyEnforcementPointService);
	});

	test("can register a processor", async () => {
		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const mockProcessor = new MockPolicyEnforcementProcessor();

		await policyEnforcementPoint.registerProcessor("testProcessor", mockProcessor);

		// Verify no errors thrown during registration
		expect(() => policyEnforcementPoint).not.toThrow();
	});

	test("can unregister a processor", async () => {
		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const mockProcessor = new MockPolicyEnforcementProcessor();

		await policyEnforcementPoint.registerProcessor("testProcessor", mockProcessor);
		await policyEnforcementPoint.unregisterProcessor("testProcessor");

		// Should complete without errors
		expect(() => policyEnforcementPoint).not.toThrow();
	});

	test("can replace an existing processor", async () => {
		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const firstProcessor = new MockPolicyEnforcementProcessor();
		const secondProcessor = new MockPolicyEnforcementProcessor();

		await policyEnforcementPoint.registerProcessor("testProcessor", firstProcessor);
		await policyEnforcementPoint.registerProcessor("testProcessor", secondProcessor);

		// Should replace without duplicating
		expect(() => policyEnforcementPoint).not.toThrow();
	});

	test("intercept calls PDP evaluate and processes data through registered processors", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		const mockPolicies: IOdrlPolicy[] = [
			{
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read"
					}
				]
			}
		];
		mockPdp.evaluate.mockResolvedValue(mockPolicies);

		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const mockProcessor = new MockPolicyEnforcementProcessor();
		const processedData = { content: "processed data", watermark: "applied" };
		mockProcessor.process.mockResolvedValue(processedData);

		await policyEnforcementPoint.registerProcessor("watermarkProcessor", mockProcessor);

		const inputData = { content: "original data" };
		const result = await policyEnforcementPoint.intercept(
			"document",
			"read",
			"nodeIdentity123",
			inputData
		);

		expect(mockPdp.evaluate).toHaveBeenCalledWith("document", "read", "nodeIdentity123", inputData);
		expect(mockProcessor.process).toHaveBeenCalledWith(
			"document",
			"read",
			"nodeIdentity123",
			inputData, // Should be cloned version
			mockPolicies
		);
		expect(result).toEqual(processedData);
	});

	test("processes data through multiple processors in sequence", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		const mockPolicies: IOdrlPolicy[] = [];
		mockPdp.evaluate.mockResolvedValue(mockPolicies);

		const policyEnforcementPoint = new PolicyEnforcementPointService();

		const firstProcessor = new MockPolicyEnforcementProcessor();
		const secondProcessor = new MockPolicyEnforcementProcessor();

		const firstProcessedData = { content: "first processed", step: 1 };
		const finalProcessedData = { content: "final processed", step: 2 };

		firstProcessor.process.mockResolvedValue(firstProcessedData);
		secondProcessor.process.mockResolvedValue(finalProcessedData);

		await policyEnforcementPoint.registerProcessor("firstProcessor", firstProcessor);
		await policyEnforcementPoint.registerProcessor("secondProcessor", secondProcessor);

		const inputData = { content: "original" };
		const result = await policyEnforcementPoint.intercept(
			"document",
			"process",
			"processor",
			inputData
		);

		expect(firstProcessor.process).toHaveBeenCalledWith(
			"document",
			"process",
			"processor",
			inputData,
			mockPolicies
		);
		expect(secondProcessor.process).toHaveBeenCalledWith(
			"document",
			"process",
			"processor",
			firstProcessedData,
			mockPolicies
		);
		expect(result).toEqual(finalProcessedData);
	});

	test("throws error and stops processing when a processor fails", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		mockPdp.evaluate.mockResolvedValue([]);

		const policyEnforcementPoint = new PolicyEnforcementPointService();

		const failingProcessor = new MockPolicyEnforcementProcessor();
		const subsequentProcessor = new MockPolicyEnforcementProcessor();

		failingProcessor.process.mockRejectedValue(new Error("Processor failed"));
		subsequentProcessor.process.mockResolvedValue({ content: "should not be called" });

		await policyEnforcementPoint.registerProcessor("failingProcessor", failingProcessor);
		await policyEnforcementPoint.registerProcessor("subsequentProcessor", subsequentProcessor);

		await expect(
			policyEnforcementPoint.intercept("document", "test", "tester", { content: "test data" })
		).rejects.toBeInstanceOf(GeneralError);

		expect(failingProcessor.process).toHaveBeenCalled();
		expect(subsequentProcessor.process).not.toHaveBeenCalled();
	});

	test("logs processor registration", async () => {
		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const mockProcessor = new MockPolicyEnforcementProcessor();

		await policyEnforcementPoint.registerProcessor("logTestProcessor", mockProcessor);

		const logEntries = await loggingMemoryEntityStorage.query();
		const registrationLog = logEntries.entities.find(
			log => log.message === "registeredProcessor" && log.data?.processorId === "logTestProcessor"
		);

		expect(registrationLog).toBeDefined();
		expect(registrationLog?.level).toBe("info");
	});

	test("logs processor unregistration", async () => {
		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const mockProcessor = new MockPolicyEnforcementProcessor();

		await policyEnforcementPoint.registerProcessor("unregisterTestProcessor", mockProcessor);
		await policyEnforcementPoint.unregisterProcessor("unregisterTestProcessor");

		const logEntries = await loggingMemoryEntityStorage.query();
		const unregistrationLog = logEntries.entities.find(
			log =>
				log.message === "unregisteredProcessor" &&
				log.data?.processorId === "unregisterTestProcessor"
		);

		expect(unregistrationLog).toBeDefined();
		expect(unregistrationLog?.level).toBe("info");
	});

	test("logs processor failures and throws", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		mockPdp.evaluate.mockResolvedValue([]);

		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const failingProcessor = new MockPolicyEnforcementProcessor();
		failingProcessor.process.mockRejectedValue(new Error("Processing error"));

		await policyEnforcementPoint.registerProcessor("errorProcessor", failingProcessor);

		await expect(
			policyEnforcementPoint.intercept("document", "fail", "nodeIdentity", { content: "test" })
		).rejects.toBeInstanceOf(GeneralError);

		const logEntries = await loggingMemoryEntityStorage.query();
		const errorLog = logEntries.entities.find(
			log => log.message === "processingFailed" && log.data?.processorId === "errorProcessor"
		);

		expect(errorLog).toBeDefined();
		expect(errorLog?.level).toBe("error");
	});

	test("clones input data before processing", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		mockPdp.evaluate.mockResolvedValue([]);

		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const mockProcessor = new MockPolicyEnforcementProcessor();

		// Processor modifies the data it receives
		mockProcessor.process.mockImplementation(async (assetType, action, nodeIdentity, data) => {
			if (data && typeof data === "object") {
				data.modified = true;
			}
			return data;
		});

		await policyEnforcementPoint.registerProcessor("modifyingProcessor", mockProcessor);

		const originalData = { content: "original", modified: false };
		await policyEnforcementPoint.intercept("document", "modify", "nodeIdentity", originalData);

		// Original data should remain unchanged
		expect(originalData.modified).toBe(false);
		expect(mockProcessor.process).toHaveBeenCalled();
	});

	test("validates processor registration parameters", async () => {
		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const mockProcessor = new MockPolicyEnforcementProcessor();

		await expect(policyEnforcementPoint.registerProcessor("", mockProcessor)).rejects.toThrow();

		await expect(
			policyEnforcementPoint.registerProcessor(
				"validId",
				undefined as unknown as IPolicyEnforcementProcessor
			)
		).rejects.toThrow();
	});

	test("validates processor unregistration parameters", async () => {
		const policyEnforcementPoint = new PolicyEnforcementPointService();

		await expect(policyEnforcementPoint.unregisterProcessor("")).rejects.toThrow();
	});

	test("processor only processes matching asset type", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		mockPdp.evaluate.mockResolvedValue([]);

		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const selectiveProcessor = new MockPolicyEnforcementProcessor();

		// Processor only handles "document" asset type
		selectiveProcessor.process.mockImplementation(async (assetType, action, nodeIdentity, data) => {
			if (assetType === "document") {
				return { ...data, processed: true, processorType: "document-processor" };
			}
			// Return data unchanged for non-matching asset types
			return data;
		});

		await policyEnforcementPoint.registerProcessor("documentProcessor", selectiveProcessor);

		const documentData = { content: "document content" };
		const imageData = { content: "image content" };

		const documentResult = await policyEnforcementPoint.intercept(
			"document",
			"read",
			"nodeIdentity123",
			documentData
		);

		const imageResult = await policyEnforcementPoint.intercept(
			"image",
			"view",
			"nodeIdentity123",
			imageData
		);

		expect(selectiveProcessor.process).toHaveBeenCalledTimes(2);
		expect(documentResult).toEqual({
			content: "document content",
			processed: true,
			processorType: "document-processor"
		});
		expect(imageResult).toEqual({ content: "image content" }); // Unchanged
	});

	test("processor only processes matching action", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		mockPdp.evaluate.mockResolvedValue([]);

		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const encryptionProcessor = new MockPolicyEnforcementProcessor();

		// Processor only handles "transmit" action
		encryptionProcessor.process.mockImplementation(
			async (assetType, action, nodeIdentity, data) => {
				if (action === "transmit") {
					return { ...data, encrypted: true, algorithm: "AES-256" };
				}
				return data;
			}
		);

		await policyEnforcementPoint.registerProcessor("encryptionProcessor", encryptionProcessor);

		const testData = { content: "sensitive data" };

		const transmitResult = await policyEnforcementPoint.intercept(
			"document",
			"transmit",
			"nodeIdentitySender",
			testData
		);

		const readResult = await policyEnforcementPoint.intercept(
			"document",
			"read",
			"nodeIdentityReader",
			testData
		);

		expect(encryptionProcessor.process).toHaveBeenCalledTimes(2);
		expect(transmitResult).toEqual({
			content: "sensitive data",
			encrypted: true,
			algorithm: "AES-256"
		});
		expect(readResult).toEqual({ content: "sensitive data" }); // Unchanged
	});

	test("processor matches specific asset type and action combination", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		mockPdp.evaluate.mockResolvedValue([]);

		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const watermarkProcessor = new MockPolicyEnforcementProcessor();

		// Processor only handles "image" + "share" combination
		watermarkProcessor.process.mockImplementation(async (assetType, action, nodeIdentity, data) => {
			if (assetType === "image" && action === "share") {
				return {
					...data,
					watermarked: true,
					watermark: `© ${nodeIdentity ?? "Unknown"}`
				};
			}
			return data;
		});

		await policyEnforcementPoint.registerProcessor("watermarkProcessor", watermarkProcessor);

		const imageData = { filename: "photo.jpg", content: "image data" };

		const shareResult = await policyEnforcementPoint.intercept(
			"image",
			"share",
			"nodeIdentityPhotographer",
			imageData
		);

		const viewResult = await policyEnforcementPoint.intercept(
			"image",
			"view",
			"nodeIdentityPhotographer",
			imageData
		);

		const shareDocumentResult = await policyEnforcementPoint.intercept(
			"document",
			"share",
			"nodeIdentityPhotographer",
			{ content: "document data" }
		);

		expect(watermarkProcessor.process).toHaveBeenCalledTimes(3);
		expect(shareResult).toEqual({
			filename: "photo.jpg",
			content: "image data",
			watermarked: true,
			watermark: "© nodeIdentityPhotographer"
		});
		expect(viewResult).toEqual(imageData); // Unchanged
		expect(shareDocumentResult).toEqual({ content: "document data" }); // Unchanged
	});

	test("multiple processors with different matching criteria", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		mockPdp.evaluate.mockResolvedValue([]);

		const policyEnforcementPoint = new PolicyEnforcementPointService();

		const auditProcessor = new MockPolicyEnforcementProcessor();
		const compressionProcessor = new MockPolicyEnforcementProcessor();
		const encryptionProcessor = new MockPolicyEnforcementProcessor();

		// Audit processor logs all "download" actions
		auditProcessor.process.mockImplementation(async (assetType, action, nodeIdentity, data) => {
			if (action === "download") {
				return {
					...data,
					audited: true,
					auditLog: `${nodeIdentity} downloaded ${assetType}`
				};
			}
			return data;
		});

		// Compression processor handles large files
		compressionProcessor.process.mockImplementation(
			async (assetType, action, nodeIdentity, data) => {
				if (assetType === "video" || assetType === "archive") {
					return { ...data, compressed: true, algorithm: "gzip" };
				}
				return data;
			}
		);

		// Encryption processor handles sensitive documents
		encryptionProcessor.process.mockImplementation(
			async (assetType, action, nodeIdentity, data) => {
				if (assetType === "sensitive-document") {
					return { ...data, encrypted: true, key: "secret-key" };
				}
				return data;
			}
		);

		await policyEnforcementPoint.registerProcessor("auditProcessor", auditProcessor);
		await policyEnforcementPoint.registerProcessor("compressionProcessor", compressionProcessor);
		await policyEnforcementPoint.registerProcessor("encryptionProcessor", encryptionProcessor);

		// Test video download (should be audited AND compressed)
		const videoData = { filename: "movie.mp4", size: "2GB" };
		const videoResult = await policyEnforcementPoint.intercept(
			"video",
			"download",
			"nodeIdentityViewer",
			videoData
		);

		// Test sensitive document read (should be encrypted only)
		const sensitiveData = { content: "classified information" };
		const sensitiveResult = await policyEnforcementPoint.intercept(
			"sensitive-document",
			"read",
			"nodeIdentityAnalyst",
			sensitiveData
		);

		expect(videoResult).toEqual({
			filename: "movie.mp4",
			size: "2GB",
			audited: true,
			auditLog: "nodeIdentityViewer downloaded video",
			compressed: true,
			algorithm: "gzip"
		});

		expect(sensitiveResult).toEqual({
			content: "classified information",
			encrypted: true,
			key: "secret-key"
		});
	});
});
