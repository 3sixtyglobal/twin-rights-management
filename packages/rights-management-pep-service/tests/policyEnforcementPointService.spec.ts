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
import type { IDataspaceProtocolAgreement } from "@twin.org/standards-dataspace-protocol";
import { OdrlContexts, OdrlPolicyType } from "@twin.org/standards-w3c-odrl";
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

/**
 * Extended policy type for testing that includes custom properties.
 * @param options The options.
 * @param options.uid The UID of the policy.
 * @param options.action The action of the policy.
 * @param options.target The target of the policy.
 * @param options.assignee The assignee of the policy.
 * @returns The test policy object.
 */
function createPolicy(options?: {
	uid?: string;
	action?: string;
	target?: string;
	assignee?: string;
}): IDataspaceProtocolAgreement {
	return {
		"@context": OdrlContexts.Context,
		"@type": OdrlPolicyType.Agreement,
		"@id": options?.uid ?? "policy123",
		assigner: "assigner",
		action: options?.action ?? "action",
		target: options?.target ?? "target",
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
			execute: async (method: () => Promise<void>) => method()
		}));

		odrlPolicyMemoryEntityStorage = new MemoryEntityStorageConnector<OdrlPolicy>({
			entitySchema: nameof<OdrlPolicy>(),
			config: { storageKey: "odrl-policy" }
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
		const policy = createPolicy({ target: "document", action: "read", assignee: "assignee123" });
		const result = await policyEnforcementPoint.interceptWithPolicy(policy, inputData);

		expect(mockPdp.evaluate).toHaveBeenCalledWith(policy, inputData, undefined);
		expect(mockProcessor.process).toHaveBeenCalledWith(
			policy,
			mockDecisions,
			inputData, // Should be cloned version
			undefined
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
		const policy = createPolicy({
			target: "document",
			action: "process",
			assignee: "processor"
		});
		const result = await policyEnforcementPoint.interceptWithPolicy(policy, inputData);

		expect(firstProcessor.process).toHaveBeenCalledWith(
			policy,
			mockDecisions,
			inputData,
			undefined
		);
		expect(secondProcessor.process).toHaveBeenCalledWith(
			policy,
			mockDecisions,
			firstProcessedData,
			undefined
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
				createPolicy({ target: "document", action: "test", assignee: "tester" }),
				{ content: "test data" }
			)
		).rejects.toBeInstanceOf(GeneralError);

		expect(failingProcessor.process).toHaveBeenCalled();
		expect(subsequentProcessor.process).not.toHaveBeenCalled();
	});

	test("logs processor failures and throws", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		mockPdp.evaluate.mockResolvedValue([]);

		const policyEnforcementPoint = new PolicyEnforcementPointService({
			loggingComponentType: "logging"
		});
		const failingProcessor = new MockPolicyEnforcementProcessor();
		failingProcessor.process.mockRejectedValue(new Error("Processing error"));

		PolicyEnforcementProcessorFactory.register("errorProcessor", () => failingProcessor);

		await expect(
			policyEnforcementPoint.interceptWithPolicy(
				createPolicy({ target: "document", action: "fail", assignee: "assignee" }),
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
		mockProcessor.process.mockImplementation(async (agreement, decisions, data: unknown) => {
			if (data && typeof data === "object") {
				(data as { [key: string]: unknown }).modified = true;
			}
			return data;
		});

		PolicyEnforcementProcessorFactory.register("modifyingProcessor", () => mockProcessor);

		const originalData: { [key: string]: unknown } = { content: "original", modified: false };
		const policy = createPolicy({ target: "document", action: "modify", assignee: "assignee" });
		await policyEnforcementPoint.interceptWithPolicy(policy, originalData);

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
		selectiveProcessor.process.mockImplementation(
			async (agreement: IDataspaceProtocolAgreement, decisions, data: unknown) => {
				if (agreement.target === "document") {
					return {
						...(data as { [key: string]: unknown }),
						processed: true,
						processorType: "document-processor"
					};
				}
				// Return data unchanged for non-matching asset types
				return data;
			}
		);

		PolicyEnforcementProcessorFactory.register("documentProcessor", () => selectiveProcessor);

		const documentData: { [key: string]: unknown } = { content: "document content" };
		const imageData: { [key: string]: unknown } = { content: "image content" };

		const documentPolicy = createPolicy({
			target: "document",
			action: "read",
			assignee: "assignee123"
		});
		const imagePolicy = createPolicy({
			target: "image",
			action: "view",
			assignee: "assignee123"
		});

		const documentResult = await policyEnforcementPoint.interceptWithPolicy(
			documentPolicy,
			documentData
		);
		const imageResult = await policyEnforcementPoint.interceptWithPolicy(imagePolicy, imageData);

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
			async (agreement: IDataspaceProtocolAgreement, decisions, data: unknown) => {
				if (agreement.action === "transmit") {
					return { ...(data as { [key: string]: unknown }), encrypted: true, algorithm: "AES-256" };
				}
				return data;
			}
		);

		PolicyEnforcementProcessorFactory.register("encryptionProcessor", () => encryptionProcessor);

		const testData = { content: "sensitive data" };

		const transmitPolicy = createPolicy({
			target: "document",
			action: "transmit",
			assignee: "assigneeSender"
		});
		const readPolicy = createPolicy({
			target: "document",
			action: "read",
			assignee: "assigneeReader"
		});

		const transmitResult = await policyEnforcementPoint.interceptWithPolicy(
			transmitPolicy,
			testData
		);
		const readResult = await policyEnforcementPoint.interceptWithPolicy(readPolicy, testData);

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
		watermarkProcessor.process.mockImplementation(
			async (agreement: IDataspaceProtocolAgreement, decisions, data: unknown) => {
				if (agreement.target === "image" && agreement.action === "share") {
					const assigneeStr =
						typeof agreement.assignee === "string" ? agreement.assignee : "Unknown";
					return {
						...(data as { [key: string]: unknown }),
						watermarked: true,
						watermark: `© ${assigneeStr}`
					};
				}
				return data;
			}
		);

		PolicyEnforcementProcessorFactory.register("watermarkProcessor", () => watermarkProcessor);

		const imageData = { filename: "photo.jpg", content: "image data" };

		const sharePolicy = createPolicy({
			target: "image",
			action: "share",
			assignee: "assigneePhotographer"
		});
		const viewPolicy = createPolicy({
			target: "image",
			action: "view",
			assignee: "assigneePhotographer"
		});
		const shareDocPolicy = createPolicy({
			target: "document",
			action: "share",
			assignee: "assigneePhotographer"
		});

		const shareResult = await policyEnforcementPoint.interceptWithPolicy(sharePolicy, imageData);
		const viewResult = await policyEnforcementPoint.interceptWithPolicy(viewPolicy, imageData);
		const shareDocResult = await policyEnforcementPoint.interceptWithPolicy(shareDocPolicy, {
			content: "document data"
		});

		expect(watermarkProcessor.process).toHaveBeenCalledTimes(3);
		expect(shareResult).toEqual({
			filename: "photo.jpg",
			content: "image data",
			watermarked: true,
			watermark: "© assigneePhotographer"
		});
		expect(viewResult).toEqual(imageData); // Unchanged
		expect(shareDocResult).toEqual({ content: "document data" }); // Unchanged
	});

	test("multiple processors with different matching criteria", async () => {
		const mockPdp = ComponentFactory.get<MockPolicyDecisionPointComponent>("policy-decision-point");
		mockPdp.evaluate.mockResolvedValue([]);

		const policyEnforcementPoint = new PolicyEnforcementPointService();

		const auditProcessor = new MockPolicyEnforcementProcessor();
		const compressionProcessor = new MockPolicyEnforcementProcessor();
		const encryptionProcessor = new MockPolicyEnforcementProcessor();

		// Audit processor logs all "download" actions
		auditProcessor.process.mockImplementation(
			async (agreement: IDataspaceProtocolAgreement, decisions, data: unknown) => {
				if (agreement.action === "download") {
					const assigneeStr =
						typeof agreement.assignee === "string" ? agreement.assignee : "Unknown";
					return {
						...(data as { [key: string]: unknown }),
						audited: true,
						auditLog: `${assigneeStr} downloaded ${JSON.stringify(agreement.target)}`
					};
				}
				return data;
			}
		);

		// Compression processor handles large files
		compressionProcessor.process.mockImplementation(
			async (agreement: IDataspaceProtocolAgreement, decisions, data: unknown) => {
				if (agreement.target === "video" || agreement.target === "archive") {
					return { ...(data as { [key: string]: unknown }), compressed: true, algorithm: "gzip" };
				}
				return data;
			}
		);

		// Encryption processor handles sensitive documents
		encryptionProcessor.process.mockImplementation(
			async (agreement: IDataspaceProtocolAgreement, decisions, data: unknown) => {
				if (agreement.target === "sensitive-document") {
					return { ...(data as { [key: string]: unknown }), encrypted: true, key: "secret-key" };
				}
				return data;
			}
		);

		PolicyEnforcementProcessorFactory.register("auditProcessor", () => auditProcessor);
		PolicyEnforcementProcessorFactory.register("compressionProcessor", () => compressionProcessor);
		PolicyEnforcementProcessorFactory.register("encryptionProcessor", () => encryptionProcessor);

		// Test video download (should be audited AND compressed)
		const videoData = { filename: "movie.mp4", size: "2GB" };
		const videoPolicy = createPolicy({
			target: "video",
			action: "download",
			assignee: "assigneeViewer"
		});
		const videoResult = await policyEnforcementPoint.interceptWithPolicy(videoPolicy, videoData);

		// Test sensitive document read (should be encrypted only)
		const sensitiveData = { content: "classified information" };
		const sensitivePolicy = createPolicy({
			target: "sensitive-document",
			action: "read",
			assignee: "assigneeAnalyst"
		});
		const sensitiveResult = await policyEnforcementPoint.interceptWithPolicy(
			sensitivePolicy,
			sensitiveData
		);

		expect(videoResult).toEqual({
			filename: "movie.mp4",
			size: "2GB",
			audited: true,
			auditLog: 'assigneeViewer downloaded "video"',
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
