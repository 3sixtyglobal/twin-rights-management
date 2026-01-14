// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Factory, GeneralError } from "@twin.org/core";
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
	PolicyDecision,
	PolicyDecisionStage,
	PolicyExecutionActionFactory
} from "@twin.org/rights-management-models";
import { type IOdrlPolicy, OdrlContexts, PolicyType } from "@twin.org/standards-w3c-odrl";
import { PolicyExecutionPointService } from "../src/policyExecutionPointService.js";

/**
 * Mock class
 */
class MockPolicyExecutionAction {
	public throwError: boolean;

	public supportedStages: (stage?: PolicyDecisionStage) => PolicyDecisionStage[];

	// eslint-disable-next-line no-restricted-syntax
	public execute = vi.fn();

	private readonly _supportedStages: PolicyDecisionStage[];

	constructor(
		supportedStages: PolicyDecisionStage[] = [PolicyDecisionStage.Before, PolicyDecisionStage.After]
	) {
		this._supportedStages = supportedStages;
		this.throwError = false;
		this.supportedStages = vi.fn().mockReturnValue(this._supportedStages);
		this.execute = vi.fn(async (stage, context, policies, decisions, data) => {
			if (this.throwError) {
				throw new Error("Test error");
			}
			// Simulate logging as LoggingPolicyExecutionAction would
			await loggingMemoryEntityStorage.set({
				message: "executingActions",
				id: "",
				level: "error",
				source: "",
				ts: 0
			});
			await loggingMemoryEntityStorage.set({
				message: "executingAction",
				id: "",
				level: "error",
				source: "",
				ts: 0
			});
			if (stage === PolicyDecisionStage.Before) {
				await loggingMemoryEntityStorage.set({
					message: "policyActionExecutedBefore",
					data: {
						locator: `Assignee: ${context.assignee}, Action: ${context.action}, Asset Type: ${context.assetType}`,
						stage,
						data: data === null ? undefined : "{...}",
						decisions: decisions?.length ? decisions : "[...]",
						policies: policies?.length ? policies : "[...]"
					},
					id: "",
					level: "error",
					source: "",
					ts: 0
				});
			} else if (stage === PolicyDecisionStage.After) {
				await loggingMemoryEntityStorage.set({
					message: "policyActionExecutedAfter",
					data: {
						locator: `Assignee: ${context.assignee}, Action: ${context.action}, Asset Type: ${context.assetType}`,
						stage,
						data: data === null ? undefined : "{...}",
						decisions: decisions?.length ? decisions : "[...]",
						policies: policies?.length ? policies : "[...]"
					},
					id: "",
					level: "error",
					source: "",
					ts: 0
				});
			}
		});
	}

	public className(): string {
		return "MockPolicyExecutionAction";
	}
}

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;

describe("PolicyExecutionPointService", () => {
	beforeEach(() => {
		Factory.clearFactories();
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());
	});

	test("can create the service", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		expect(policyExecutionPoint).toBeInstanceOf(PolicyExecutionPointService);
	});

	test("can register an action and expect it to be called when executed before", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockAction = new MockPolicyExecutionAction();
		PolicyExecutionActionFactory.register("testAction", () => mockAction);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			{ assetType: "assetType", action: "action", assignee: "assignee" },
			[],
			[],
			{}
		);
		expect(mockAction.execute).toHaveBeenCalledWith(
			PolicyDecisionStage.Before,
			{ assetType: "assetType", action: "action", assignee: "assignee" },
			[],
			[],
			{}
		);
	});

	test("can register an action and expect it to be called when executed after", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockAction = new MockPolicyExecutionAction();
		PolicyExecutionActionFactory.register("testAction", () => mockAction);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.After,
			{ assetType: "assetType", action: "action", assignee: "assignee" },
			[],
			[],
			{}
		);
		expect(mockAction.execute).toHaveBeenCalledWith(
			PolicyDecisionStage.After,
			{ assetType: "assetType", action: "action", assignee: "assignee" },
			[],
			[],
			{}
		);
	});

	test("can register multiple actions and all are executed", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();

		const mockLoggingAction = new MockPolicyExecutionAction();

		const mockAction1 = new MockPolicyExecutionAction();
		const mockAction2 = new MockPolicyExecutionAction();
		PolicyExecutionActionFactory.register("loggingAction", () => mockLoggingAction);
		PolicyExecutionActionFactory.register("testAction1", () => mockAction1);
		PolicyExecutionActionFactory.register("testAction2", () => mockAction2);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			{ assetType: "assetType", action: "action", assignee: "assignee" },
			[],
			[],
			{}
		);

		expect(mockAction1.execute).toHaveBeenCalledOnce();
		expect(mockAction2.execute).toHaveBeenCalledOnce();
	});

	test("can unregister an action", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockAction = new MockPolicyExecutionAction();

		PolicyExecutionActionFactory.register("testAction", () => mockAction);
		PolicyExecutionActionFactory.unregister("testAction");
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			{ assetType: "assetType", action: "action", assignee: "assignee" },
			[],
			[],
			{}
		);

		expect(mockAction.execute).not.toHaveBeenCalled();
	});

	test("can register action with same id to replace existing action", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockAction1 = new MockPolicyExecutionAction();
		const mockAction2 = new MockPolicyExecutionAction();

		PolicyExecutionActionFactory.register("testAction", () => mockAction1);
		PolicyExecutionActionFactory.register("testAction", () => mockAction2);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			{ assetType: "assetType", action: "action", assignee: "assignee" },
			[],
			[],
			{}
		);

		expect(mockAction1.execute).not.toHaveBeenCalled();
		expect(mockAction2.execute).toHaveBeenCalledOnce();
	});

	test("throws error and stops executing subsequent actions when one throws error", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const errorAction = new MockPolicyExecutionAction();
		errorAction.throwError = true;
		const successAction = new MockPolicyExecutionAction();

		PolicyExecutionActionFactory.register("errorAction", () => errorAction);
		PolicyExecutionActionFactory.register("successAction", () => successAction);

		await expect(
			policyExecutionPoint.executeActions(
				PolicyDecisionStage.Before,
				{ assetType: "assetType", action: "action", assignee: "assignee" },
				[],
				[],
				{}
			)
		).rejects.toBeInstanceOf(GeneralError);

		expect(errorAction.execute).toHaveBeenCalledOnce();
		expect(successAction.execute).not.toHaveBeenCalled();
	});

	test("logs error when action execution fails", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const errorAction = new MockPolicyExecutionAction();

		errorAction.execute.mockRejectedValue(new Error("Test error"));

		PolicyExecutionActionFactory.register("errorAction", () => errorAction);
		await expect(
			policyExecutionPoint.executeActions(
				PolicyDecisionStage.Before,
				{ assetType: "assetType", action: "action", assignee: "assignee" },
				[],
				[],
				{}
			)
		).rejects.toBeInstanceOf(GeneralError);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const messages = logEntries.map(l => l.message);
		expect(messages).toContain("executingActions");
		expect(messages).toContain("executingAction");
		expect(messages).toContain("actionExecutionFailed");
	});

	test("executes actions with correct parameters including data", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockAction = new MockPolicyExecutionAction();
		const testData = { key: "value" };
		const testPolicies = [
			{ "@context": OdrlContexts.JsonLdContext, "@type": PolicyType.Agreement, uid: "policy1" }
		];
		const testDecisions = [{ target: "asset1", decision: PolicyDecision.Granted }];

		PolicyExecutionActionFactory.register("testAction", () => mockAction);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			{ assetType: "assetType", action: "action", assignee: "assignee" },
			testPolicies,
			testDecisions,
			testData
		);

		expect(mockAction.execute).toHaveBeenCalledWith(
			PolicyDecisionStage.Before,
			{ assetType: "assetType", action: "action", assignee: "assignee" },
			testPolicies,
			testDecisions,
			testData
		);
	});

	test("loggingPolicyAction combined with other actions", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();

		const testPolicies = [
			{ "@context": OdrlContexts.JsonLdContext, "@type": PolicyType.Agreement, uid: "policy1" }
		];
		const testDecisions = [{ target: "asset1", decision: PolicyDecision.Granted }];

		const mockLoggingAction = new MockPolicyExecutionAction([PolicyDecisionStage.Before]);
		const mockLoggingAction2 = new MockPolicyExecutionAction([PolicyDecisionStage.Before]);

		PolicyExecutionActionFactory.register("action1", () => mockLoggingAction);
		PolicyExecutionActionFactory.register("action2", () => mockLoggingAction2);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			{ assetType: "api", action: "call", assignee: "apiNode" },
			testPolicies,
			testDecisions,
			{ endpoint: "/users" }
		);

		// Check both custom action was called and logging occurred
		expect(mockLoggingAction.execute).toHaveBeenCalledOnce();
		expect(mockLoggingAction2.execute).toHaveBeenCalledOnce();
		const logEntries = loggingMemoryEntityStorage.getStore();
		const messages = logEntries.map(l => l.message);
		expect(messages).toContain("executingActions");
		expect(messages.filter(m => m === "executingAction").length).toBe(2);
		expect(messages).toContain("policyActionExecutedBefore");
	});

	test("loggingPolicyAction logs policy execution details", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const testData = { sensitiveInfo: "secret" };
		const testPolicies: IOdrlPolicy[] = [
			{
				"@context": OdrlContexts.JsonLdContext,
				"@type": PolicyType.Agreement,
				uid: "policy1",
				permission: [
					{
						target: "asset1",
						action: "read"
					}
				]
			}
		];
		const testDecisions = [{ target: "asset1", decision: PolicyDecision.Granted }];

		const mockLoggingAction = new MockPolicyExecutionAction();

		PolicyExecutionActionFactory.register("loggingAction", () => mockLoggingAction);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			{ assetType: "document", action: "read", assignee: "node456" },
			testPolicies,
			testDecisions,
			testData
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const messages = logEntries.map(l => l.message);
		expect(messages).toContain("executingActions");
		expect(messages).toContain("executingAction");
		expect(messages).toContain("policyActionExecutedBefore");
		const policyLog = logEntries.find(l => l.message === "policyActionExecutedBefore");
		expect(policyLog?.data).toEqual({
			locator: "Assignee: node456, Action: read, Asset Type: document",
			stage: PolicyDecisionStage.Before,
			data: "{...}",
			decisions: [
				{
					decision: "Granted",
					target: "asset1"
				}
			],
			policies: [
				{
					"@context": "http://www.w3.org/ns/odrl.jsonld",
					"@type": "Agreement",
					permission: [
						{
							action: "read",
							target: "asset1"
						}
					],
					uid: "policy1"
				}
			]
		});
	});

	test("loggingPolicyAction handles undefined assignee", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const testPolicies: IOdrlPolicy[] = [
			{ "@context": OdrlContexts.JsonLdContext, "@type": PolicyType.Agreement, uid: "policy2" }
		];
		const testDecisions = [{ target: "asset1", decision: PolicyDecision.Granted }];

		const mockLoggingAction = new MockPolicyExecutionAction();

		PolicyExecutionActionFactory.register("loggingAction", () => mockLoggingAction);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.After,
			{ assetType: "image", action: "write", assignee: "node456" },
			testPolicies,
			testDecisions,
			null
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const policyLog = logEntries.find(l => l.message === "policyActionExecutedAfter");
		expect(policyLog?.data).toEqual({
			data: undefined,
			decisions: [
				{
					decision: "Granted",
					target: "asset1"
				}
			],
			locator: "Assignee: node456, Action: write, Asset Type: image",
			stage: PolicyDecisionStage.After,
			policies: [
				{
					"@context": "http://www.w3.org/ns/odrl.jsonld",
					"@type": "Agreement",
					uid: "policy2"
				}
			]
		});
	});

	test("loggingPolicyAction logs when no policies are provided", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();

		const mockLoggingAction = new MockPolicyExecutionAction();

		PolicyExecutionActionFactory.register("loggingAction", () => mockLoggingAction);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			{ assetType: "video", action: "delete", assignee: "mainNode" },
			[],
			[],
			{}
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const policyLog = logEntries.find(l => l.message === "policyActionExecutedBefore");
		expect(policyLog?.data).toEqual({
			decisions: "[...]",
			locator: "Assignee: mainNode, Action: delete, Asset Type: video",
			data: "{...}",
			stage: PolicyDecisionStage.Before,
			policies: "[...]"
		});
	});

	test("loggingPolicyAction works with multiple policies", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const multiplePolicies = [
			{ "@context": OdrlContexts.JsonLdContext, "@type": PolicyType.Agreement, uid: "policy1" },
			{ "@context": OdrlContexts.JsonLdContext, "@type": PolicyType.Set, uid: "policy2" },
			{ "@context": OdrlContexts.JsonLdContext, "@type": PolicyType.Offer, uid: "policy3" }
		];
		const testDecisions = [{ target: "asset1", decision: PolicyDecision.Granted }];
		const mockLoggingAction = new MockPolicyExecutionAction();

		PolicyExecutionActionFactory.register("loggingAction", () => mockLoggingAction);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			{ assetType: "database", action: "query", assignee: "dbNode" },
			multiplePolicies,
			testDecisions,
			{ table: "users" }
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const policyLog = logEntries.find(l => l.message === "policyActionExecutedBefore");
		expect((policyLog?.data?.policies as IOdrlPolicy[])?.length).toBe(3);
	});

	test("multiple loggingPolicyActions create separate log entries", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const testPolicies = [
			{ "@context": OdrlContexts.JsonLdContext, "@type": PolicyType.Agreement, uid: "policy1" }
		];
		const testDecisions = [{ target: "asset1", decision: PolicyDecision.Granted }];

		const mockBeforeLoggingAction = new MockPolicyExecutionAction([PolicyDecisionStage.Before]);
		const mockAfterLoggingAction = new MockPolicyExecutionAction([PolicyDecisionStage.After]);
		PolicyExecutionActionFactory.register("beforeLogging", () => mockBeforeLoggingAction);
		PolicyExecutionActionFactory.register("afterLogging", () => mockAfterLoggingAction);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			{ assetType: "file", action: "upload", assignee: "fileNode" },
			testPolicies,
			testDecisions,
			{ size: 1024 }
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.After,
			{ assetType: "file", action: "upload", assignee: "fileNode" },
			testPolicies,
			testDecisions,
			{ size: 1024 }
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		console.log(logEntries);
		const beforeLog = logEntries.find(
			l => l.message === "executingAction" && l.data?.stage === PolicyDecisionStage.Before
		);
		const afterLog = logEntries.find(
			l => l.message === "executingAction" && l.data?.stage === PolicyDecisionStage.After
		);
		expect(beforeLog).toBeDefined();
		expect(afterLog).toBeDefined();
	});

	test("loggingPolicyAction does not log sensitive data content", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const sensitiveData = {
			password: "secret123",
			creditCard: "1234-5678-9012-3456",
			personalInfo: { ssn: "123-45-6789" }
		};
		const testPolicies = [
			{ "@context": OdrlContexts.JsonLdContext, "@type": PolicyType.Agreement, uid: "policy1" }
		];
		const testDecisions = [{ target: "asset1", decision: PolicyDecision.Granted }];

		const mockLoggingAction = new MockPolicyExecutionAction();

		PolicyExecutionActionFactory.register("loggingAction", () => mockLoggingAction);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			{ assetType: "userProfile", action: "update", assignee: "profileNode" },
			testPolicies,
			testDecisions,
			sensitiveData
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const policyLog = logEntries.find(l => l.message === "policyActionExecutedBefore");
		// Verify that sensitive data is not logged
		expect(JSON.stringify(policyLog)).not.toContain("secret123");
		expect(JSON.stringify(policyLog)).not.toContain("1234-5678-9012-3456");
		expect(JSON.stringify(policyLog)).not.toContain("123-45-6789");
	});
});
