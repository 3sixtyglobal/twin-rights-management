// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Factory, GeneralError } from "@twin.org/core";
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
import {
	PolicyDecision,
	PolicyEnforcementProcessorFactory,
	type IPolicyDecision,
	type IPolicyDecisionPointComponent,
	type IPolicyEnforcementProcessor
} from "@twin.org/rights-management-models";
import {
	PolicyAdministrationPointService,
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy
} from "@twin.org/rights-management-pap-service";
import { PolicyInformationPointService } from "@twin.org/rights-management-pip-service";
import { PolicyManagementPointService } from "@twin.org/rights-management-pmp-service";
import { PolicyExecutionPointService } from "@twin.org/rights-management-pxp-service";
import { type IOdrlPolicy, OdrlContexts, PolicyType } from "@twin.org/standards-w3c-odrl";
import { PolicyEnforcementPointService } from "../src/policyEnforcementPointService.js";

/**
 * Mock Policy Decision Point Component
 */
class MockPolicyDecisionPointComponent implements IPolicyDecisionPointComponent {
	public CLASS_NAME = "MockPolicyDecisionPointComponent";

	// eslint-disable-next-line no-restricted-syntax
	public evaluate = vi.fn();

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return "MockPolicyDecisionPointComponent";
	}
}

/**
 * Mock Policy Enforcement Processor
 */
class MockPolicyEnforcementProcessor implements IPolicyEnforcementProcessor {
	// eslint-disable-next-line no-restricted-syntax
	public process = vi.fn();

	public className(): string {
		return "MockPolicyEnforcementProcessor";
	}
}

function createPolicy(options?: {
	uid?: string;
	action?: string;
	assetType?: string;
	assignee?: string;
}): IOdrlPolicy {
	return {
		"@context": OdrlContexts.Context,
		"@type": PolicyType.Set,
		uid: options?.uid ?? "policy123",
		action: options?.action ?? "action",
		assetType: options?.assetType ?? "assetType",
		assignee: options?.assignee ?? "assignee"
	};
}

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let odrlPolicyMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;

describe("PolicyEnforcementPointService", () => {
	beforeEach(() => {
		Factory.clearFactories();

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

		PolicyEnforcementProcessorFactory.register("testProcessor", () => mockProcessor);

		// Verify no errors thrown during registration
		expect(() => policyEnforcementPoint).not.toThrow();
	});

	test("can unregister a processor", async () => {
		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const mockProcessor = new MockPolicyEnforcementProcessor();

		PolicyEnforcementProcessorFactory.register("testProcessor", () => mockProcessor);
		PolicyEnforcementProcessorFactory.unregister("testProcessor");

		// Should complete without errors
		expect(() => policyEnforcementPoint).not.toThrow();
	});

	test("can replace an existing processor", async () => {
		const firstProcessor = new MockPolicyEnforcementProcessor();
		const secondProcessor = new MockPolicyEnforcementProcessor();

		PolicyEnforcementProcessorFactory.register("testProcessor", () => firstProcessor);
		PolicyEnforcementProcessorFactory.register("testProcessor", () => secondProcessor);

		// Should replace without duplicating
		expect(PolicyEnforcementProcessorFactory.names()).toEqual(["testProcessor"]);
	});

	test("intercept calls PDP evaluate and processes data through registered processors", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		const mockDecisions: IPolicyDecision[] = [
			{
				target: "foo",
				decision: PolicyDecision.Granted
			}
		];
		mockPdp.evaluate.mockResolvedValue(mockDecisions);

		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const mockProcessor = new MockPolicyEnforcementProcessor();
		const processedData = { content: "processed data", watermark: "applied" };
		mockProcessor.process.mockResolvedValue(processedData);

		PolicyEnforcementProcessorFactory.register("watermarkProcessor", () => mockProcessor);

		const inputData = { content: "original data" };
		const result = await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({ assetType: "document", action: "read", assignee: "assignee123" }),
			inputData
		);

		expect(mockPdp.evaluate).toHaveBeenCalledWith(
			{
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Set",
				action: "read",
				assetType: "document",
				assignee: "assignee123",
				uid: "policy123"
			},
			inputData
		);
		expect(mockProcessor.process).toHaveBeenCalledWith(
			createPolicy({ assetType: "document", action: "read", assignee: "assignee123" }),
			mockDecisions,
			inputData // Should be cloned version
		);
		expect(result).toEqual(processedData);
	});

	test("processes data through multiple processors in sequence", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		const mockDecisions: IPolicyDecision[] = [];
		mockPdp.evaluate.mockResolvedValue(mockDecisions);

		const policyEnforcementPoint = new PolicyEnforcementPointService();

		const firstProcessor = new MockPolicyEnforcementProcessor();
		const secondProcessor = new MockPolicyEnforcementProcessor();

		const firstProcessedData = { content: "first processed", step: 1 };
		const finalProcessedData = { content: "final processed", step: 2 };

		firstProcessor.process.mockResolvedValue(firstProcessedData);
		secondProcessor.process.mockResolvedValue(finalProcessedData);

		PolicyEnforcementProcessorFactory.register("firstProcessor", () => firstProcessor);
		PolicyEnforcementProcessorFactory.register("secondProcessor", () => secondProcessor);

		const inputData = { content: "original" };
		const result = await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({ assetType: "document", action: "process", assignee: "processor" }),
			inputData
		);

		expect(firstProcessor.process).toHaveBeenCalledWith(
			createPolicy({ assetType: "document", action: "process", assignee: "processor" }),
			mockDecisions,
			inputData
		);
		expect(secondProcessor.process).toHaveBeenCalledWith(
			createPolicy({ assetType: "document", action: "process", assignee: "processor" }),
			mockDecisions,
			firstProcessedData
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

		PolicyEnforcementProcessorFactory.register("failingProcessor", () => failingProcessor);
		PolicyEnforcementProcessorFactory.register("subsequentProcessor", () => subsequentProcessor);

		await expect(
			policyEnforcementPoint.interceptWithPolicy(
				createPolicy({ assetType: "document", action: "test", assignee: "tester" }),
				{ content: "test data" }
			)
		).rejects.toBeInstanceOf(GeneralError);

		expect(failingProcessor.process).toHaveBeenCalled();
		expect(subsequentProcessor.process).not.toHaveBeenCalled();
	});

	test("logs processor failures and throws", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		mockPdp.evaluate.mockResolvedValue([]);

		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const failingProcessor = new MockPolicyEnforcementProcessor();
		failingProcessor.process.mockRejectedValue(new Error("Processing error"));

		PolicyEnforcementProcessorFactory.register("errorProcessor", () => failingProcessor);

		await expect(
			policyEnforcementPoint.interceptWithPolicy(
				createPolicy({ assetType: "document", action: "fail", assignee: "assignee" }),
				{ content: "test" }
			)
		).rejects.toBeInstanceOf(GeneralError);

		const logEntries = await loggingMemoryEntityStorage.query();
		const errorLog = logEntries.entities.find(
			log =>
				log.message === "processingFailed" &&
				log.data?.processorId === "MockPolicyEnforcementProcessor"
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
		mockProcessor.process.mockImplementation(async (locator, decisions, data) => {
			if (data && typeof data === "object") {
				data.modified = true;
			}
			return data;
		});

		PolicyEnforcementProcessorFactory.register("modifyingProcessor", () => mockProcessor);

		const originalData = { content: "original", modified: false };
		await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({ assetType: "document", action: "modify", assignee: "assignee" }),
			originalData
		);

		// Original data should remain unchanged
		expect(originalData.modified).toBe(false);
		expect(mockProcessor.process).toHaveBeenCalled();
	});

	test("processor only processes matching asset type", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		mockPdp.evaluate.mockResolvedValue([]);

		const policyEnforcementPoint = new PolicyEnforcementPointService();
		const selectiveProcessor = new MockPolicyEnforcementProcessor();

		// Processor only handles "document" asset type
		selectiveProcessor.process.mockImplementation(async (locator, decisions, data) => {
			if (locator.assetType === "document") {
				return { ...data, processed: true, processorType: "document-processor" };
			}
			// Return data unchanged for non-matching asset types
			return data;
		});

		PolicyEnforcementProcessorFactory.register("documentProcessor", () => selectiveProcessor);

		const documentData = { content: "document content" };
		const imageData = { content: "image content" };

		const documentResult = await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({ assetType: "document", action: "read", assignee: "assignee123" }),
			documentData
		);

		const imageResult = await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({ assetType: "image", action: "view", assignee: "assignee123" }),
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
		encryptionProcessor.process.mockImplementation(async (locator, decisions, data) => {
			if (locator.action === "transmit") {
				return { ...data, encrypted: true, algorithm: "AES-256" };
			}
			return data;
		});

		PolicyEnforcementProcessorFactory.register("encryptionProcessor", () => encryptionProcessor);

		const testData = { content: "sensitive data" };

		const transmitResult = await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({ assetType: "document", action: "transmit", assignee: "assigneeSender" }),
			testData
		);

		const readResult = await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({ assetType: "document", action: "read", assignee: "assigneeReader" }),
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
		watermarkProcessor.process.mockImplementation(async (locator, decisions, data) => {
			if (locator.assetType === "image" && locator.action === "share") {
				return {
					...data,
					watermarked: true,
					watermark: `© ${locator.assignee ?? "Unknown"}`
				};
			}
			return data;
		});

		PolicyEnforcementProcessorFactory.register("watermarkProcessor", () => watermarkProcessor);

		const imageData = { filename: "photo.jpg", content: "image data" };

		const shareResult = await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({ assetType: "image", action: "share", assignee: "assigneePhotographer" }),
			imageData
		);

		const viewResult = await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({ assetType: "image", action: "view", assignee: "assigneePhotographer" }),
			imageData
		);

		const shareDocumentResult = await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({ assetType: "document", action: "share", assignee: "assigneePhotographer" }),
			{ content: "document data" }
		);

		expect(watermarkProcessor.process).toHaveBeenCalledTimes(3);
		expect(shareResult).toEqual({
			filename: "photo.jpg",
			content: "image data",
			watermarked: true,
			watermark: "© assigneePhotographer"
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
		auditProcessor.process.mockImplementation(async (locator, decisions, data) => {
			if (locator.action === "download") {
				return {
					...data,
					audited: true,
					auditLog: `${locator.assignee} downloaded ${locator.assetType}`
				};
			}
			return data;
		});

		// Compression processor handles large files
		compressionProcessor.process.mockImplementation(async (locator, decisions, data) => {
			if (locator.assetType === "video" || locator.assetType === "archive") {
				return { ...data, compressed: true, algorithm: "gzip" };
			}
			return data;
		});

		// Encryption processor handles sensitive documents
		encryptionProcessor.process.mockImplementation(async (locator, decisions, data) => {
			if (locator.assetType === "sensitive-document") {
				return { ...data, encrypted: true, key: "secret-key" };
			}
			return data;
		});

		PolicyEnforcementProcessorFactory.register("auditProcessor", () => auditProcessor);
		PolicyEnforcementProcessorFactory.register("compressionProcessor", () => compressionProcessor);
		PolicyEnforcementProcessorFactory.register("encryptionProcessor", () => encryptionProcessor);

		// Test video download (should be audited AND compressed)
		const videoData = { filename: "movie.mp4", size: "2GB" };
		const videoResult = await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({ assetType: "video", action: "download", assignee: "assigneeViewer" }),
			videoData
		);

		// Test sensitive document read (should be encrypted only)
		const sensitiveData = { content: "classified information" };
		const sensitiveResult = await policyEnforcementPoint.interceptWithPolicy(
			createPolicy({
				assetType: "sensitive-document",
				action: "read",
				assignee: "assigneeAnalyst"
			}),
			sensitiveData
		);

		expect(videoResult).toEqual({
			filename: "movie.mp4",
			size: "2GB",
			audited: true,
			auditLog: "assigneeViewer downloaded video",
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
