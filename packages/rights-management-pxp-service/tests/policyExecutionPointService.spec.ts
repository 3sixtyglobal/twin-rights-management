// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, GeneralError } from "@twin.org/core";
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
import { PolicyDecisionStage } from "@twin.org/rights-management-models";
import { type IOdrlPolicy, OdrlContexts, PolicyType } from "@twin.org/standards-w3c-odrl";
import { LoggingPolicyExecutionAction } from "../src/policyExecutionActions/loggingPolicyExecutionAction";
import { PolicyExecutionPointService } from "../src/policyExecutionPointService";

/**
 * Mock class
 */
class MockPolicyExecutionAction {
	// eslint-disable-next-line no-restricted-syntax
	public execute = vi.fn();
}

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;

describe("rights-management-pxp", () => {
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
		const policyExecutionPoint = new PolicyExecutionPointService();
		expect(policyExecutionPoint).toBeInstanceOf(PolicyExecutionPointService);
	});

	test("can register an action and expect it to be called when executed before", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockAction = new MockPolicyExecutionAction();
		await policyExecutionPoint.registerAction("testAction", PolicyDecisionStage.Before, mockAction);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{ userIdentity: "userIdentity", nodeIdentity: "nodeIdentity" },
			{},
			[]
		);
		expect(mockAction.execute).toHaveBeenCalledWith(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{ userIdentity: "userIdentity", nodeIdentity: "nodeIdentity" },
			{},
			[]
		);
	});

	test("can register an action and expect it to be called when executed after", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockAction = new MockPolicyExecutionAction();
		await policyExecutionPoint.registerAction("testAction", PolicyDecisionStage.After, mockAction);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.After,
			"assetType",
			"action",
			{ userIdentity: "userIdentity", nodeIdentity: "nodeIdentity" },
			{},
			[]
		);
		expect(mockAction.execute).toHaveBeenCalledWith(
			PolicyDecisionStage.After,
			"assetType",
			"action",
			{ userIdentity: "userIdentity", nodeIdentity: "nodeIdentity" },
			{},
			[]
		);
	});

	test("can register multiple actions and all are executed", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockAction1 = new MockPolicyExecutionAction();
		const mockAction2 = new MockPolicyExecutionAction();

		await policyExecutionPoint.registerAction(
			"testAction1",
			PolicyDecisionStage.Before,
			mockAction1
		);
		await policyExecutionPoint.registerAction(
			"testAction2",
			PolicyDecisionStage.Before,
			mockAction2
		);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{ userIdentity: "userIdentity", nodeIdentity: "nodeIdentity" },
			{},
			[]
		);

		expect(mockAction1.execute).toHaveBeenCalledOnce();
		expect(mockAction2.execute).toHaveBeenCalledOnce();
	});

	test("can unregister an action", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockAction = new MockPolicyExecutionAction();

		await policyExecutionPoint.registerAction("testAction", PolicyDecisionStage.Before, mockAction);
		await policyExecutionPoint.unregisterAction("testAction", PolicyDecisionStage.Before);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{ userIdentity: "userIdentity", nodeIdentity: "nodeIdentity" },
			{},
			[]
		);

		expect(mockAction.execute).not.toHaveBeenCalled();
	});

	test("can register action with same id to replace existing action", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockAction1 = new MockPolicyExecutionAction();
		const mockAction2 = new MockPolicyExecutionAction();

		await policyExecutionPoint.registerAction(
			"testAction",
			PolicyDecisionStage.Before,
			mockAction1
		);
		await policyExecutionPoint.registerAction(
			"testAction",
			PolicyDecisionStage.Before,
			mockAction2
		);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{ userIdentity: "userIdentity", nodeIdentity: "nodeIdentity" },
			{},
			[]
		);

		expect(mockAction1.execute).not.toHaveBeenCalled();
		expect(mockAction2.execute).toHaveBeenCalledOnce();
	});

	test("unregistering non-existent action does not throw error", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();

		await expect(
			policyExecutionPoint.unregisterAction("nonExistentAction", PolicyDecisionStage.Before)
		).resolves.not.toThrow();
	});

	test("throws error and stops executing subsequent actions when one throws error", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const errorAction = new MockPolicyExecutionAction();
		const successAction = new MockPolicyExecutionAction();

		// eslint-disable-next-line no-restricted-syntax
		errorAction.execute.mockRejectedValue(new Error("Test error"));

		await policyExecutionPoint.registerAction(
			"errorAction",
			PolicyDecisionStage.Before,
			errorAction
		);
		await policyExecutionPoint.registerAction(
			"successAction",
			PolicyDecisionStage.Before,
			successAction
		);

		await expect(
			policyExecutionPoint.executeActions(
				PolicyDecisionStage.Before,
				"assetType",
				"action",
				{ userIdentity: "userIdentity", nodeIdentity: "nodeIdentity" },
				{},
				[]
			)
		).rejects.toBeInstanceOf(GeneralError);

		expect(errorAction.execute).toHaveBeenCalledOnce();
		expect(successAction.execute).not.toHaveBeenCalled();
	});

	test("logs error when action execution fails", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const errorAction = new MockPolicyExecutionAction();

		// eslint-disable-next-line no-restricted-syntax
		errorAction.execute.mockRejectedValue(new Error("Test error"));

		await policyExecutionPoint.registerAction(
			"errorAction",
			PolicyDecisionStage.Before,
			errorAction
		);
		await expect(
			policyExecutionPoint.executeActions(
				PolicyDecisionStage.Before,
				"assetType",
				"action",
				{ userIdentity: "userIdentity", nodeIdentity: "nodeIdentity" },
				{},
				[]
			)
		).rejects.toBeInstanceOf(GeneralError);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const messages = logEntries.map(l => l.message);
		expect(messages).toContain("registeredAction");
		expect(messages).toContain("executingActions");
		expect(messages).toContain("executingAction");
		expect(messages).toContain("actionExecutionFailed");
	});

	test("executes actions with correct parameters including data", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockAction = new MockPolicyExecutionAction();
		const testData = { key: "value" };
		const testPolicies = [
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Agreement, uid: "policy1" }
		];

		await policyExecutionPoint.registerAction("testAction", PolicyDecisionStage.Before, mockAction);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{ userIdentity: "userIdentity", nodeIdentity: "nodeIdentity" },
			testData,
			testPolicies
		);

		expect(mockAction.execute).toHaveBeenCalledWith(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{ userIdentity: "userIdentity", nodeIdentity: "nodeIdentity" },
			testData,
			testPolicies
		);
	});

	test("loggingPolicyAction combined with other actions", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const customAction = new MockPolicyExecutionAction();
		const testPolicies = [
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Agreement, uid: "policy1" }
		];

		await policyExecutionPoint.registerAction(
			"customAction",
			PolicyDecisionStage.Before,
			customAction
		);
		await policyExecutionPoint.registerAction(
			"loggingAction",
			PolicyDecisionStage.Before,
			new LoggingPolicyExecutionAction()
		);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"api",
			"call",
			{ userIdentity: "apiUser", nodeIdentity: "apiNode" },
			{ endpoint: "/users" },
			testPolicies
		);

		// Check both custom action was called and logging occurred
		expect(customAction.execute).toHaveBeenCalledOnce();
		const logEntries = loggingMemoryEntityStorage.getStore();
		const messages = logEntries.map(l => l.message);
		expect(messages.filter(m => m === "registeredAction").length).toBe(2);
		expect(messages).toContain("executingActions");
		expect(messages.filter(m => m === "executingAction").length).toBe(2);
		expect(messages).toContain("policyActionExecuted");
	});

	test("loggingPolicyAction logs policy execution details", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const testData = { sensitiveInfo: "secret" };
		const testPolicies: IOdrlPolicy[] = [
			{
				"@context": OdrlContexts.ContextRoot,
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

		await policyExecutionPoint.registerAction(
			"loggingAction",
			PolicyDecisionStage.Before,
			new LoggingPolicyExecutionAction()
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"document",
			"read",
			{ userIdentity: "user123", nodeIdentity: "node456" },
			testData,
			testPolicies
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const messages = logEntries.map(l => l.message);
		expect(messages[0]).toBe("registeredAction");
		expect(messages).toContain("executingActions");
		expect(messages).toContain("executingAction");
		expect(messages).toContain("policyActionExecuted");
		const policyLog = logEntries.find(l => l.message === "policyActionExecuted");
		expect(policyLog?.data).toEqual({
			assetType: "document",
			action: "read",
			userIdentity: "user123",
			nodeIdentity: "node456",
			data: "{...}",
			stage: PolicyDecisionStage.Before,
			policies: "[...]"
		});
	});

	test("loggingPolicyAction handles undefined userIdentity and nodeIdentity", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const testPolicies: IOdrlPolicy[] = [
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Agreement, uid: "policy2" }
		];

		await policyExecutionPoint.registerAction(
			"loggingAction",
			PolicyDecisionStage.After,
			new LoggingPolicyExecutionAction()
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.After,
			"image",
			"write",
			{},
			null,
			testPolicies
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const policyLog = logEntries.find(l => l.message === "policyActionExecuted");
		expect(policyLog?.data).toEqual({
			assetType: "image",
			action: "write",
			userIdentity: "",
			nodeIdentity: "",
			stage: PolicyDecisionStage.After,
			policies: "[...]"
		});
	});

	test("loggingPolicyAction logs when no policies are provided", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();

		await policyExecutionPoint.registerAction(
			"loggingAction",
			PolicyDecisionStage.Before,
			new LoggingPolicyExecutionAction()
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"video",
			"delete",
			{ userIdentity: "admin", nodeIdentity: "mainNode" },
			{},
			[]
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const policyLog = logEntries.find(l => l.message === "policyActionExecuted");
		expect(policyLog?.data).toEqual({
			assetType: "video",
			action: "delete",
			userIdentity: "admin",
			nodeIdentity: "mainNode",
			data: "{...}",
			stage: PolicyDecisionStage.Before,
			policies: "[...]"
		});
	});

	test("loggingPolicyAction works with multiple policies", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const multiplePolicies = [
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Agreement, uid: "policy1" },
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Set, uid: "policy2" },
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Offer, uid: "policy3" }
		];

		await policyExecutionPoint.registerAction(
			"loggingAction",
			PolicyDecisionStage.Before,
			new LoggingPolicyExecutionAction({ config: { includeData: true, includePolicies: true } })
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"database",
			"query",
			{ userIdentity: "dbUser", nodeIdentity: "dbNode" },
			{ table: "users" },
			multiplePolicies
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const policyLog = logEntries.find(l => l.message === "policyActionExecuted");
		expect((policyLog?.data?.policies as IOdrlPolicy[])?.length).toBe(3);
	});

	test("multiple loggingPolicyActions create separate log entries", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const testPolicies = [
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Agreement, uid: "policy1" }
		];

		await policyExecutionPoint.registerAction(
			"beforeLogging",
			PolicyDecisionStage.Before,
			new LoggingPolicyExecutionAction()
		);
		await policyExecutionPoint.registerAction(
			"afterLogging",
			PolicyDecisionStage.After,
			new LoggingPolicyExecutionAction()
		);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"file",
			"upload",
			{ userIdentity: "uploader", nodeIdentity: "fileNode" },
			{ size: 1024 },
			testPolicies
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.After,
			"file",
			"upload",
			{ userIdentity: "uploader", nodeIdentity: "fileNode" },
			{ size: 1024 },
			testPolicies
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const beforeLog = logEntries.find(
			l => l.message === "policyActionExecuted" && l.data?.stage === PolicyDecisionStage.Before
		);
		const afterLog = logEntries.find(
			l => l.message === "policyActionExecuted" && l.data?.stage === PolicyDecisionStage.After
		);
		expect(beforeLog).toBeDefined();
		expect(afterLog).toBeDefined();
	});

	test("loggingPolicyAction logs different asset types and actions", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const testPolicies = [
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Agreement, uid: "policy1" }
		];

		await policyExecutionPoint.registerAction(
			"loggingAction",
			PolicyDecisionStage.Before,
			new LoggingPolicyExecutionAction()
		);

		// Execute different combinations
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"document",
			"read",
			{ userIdentity: "reader", nodeIdentity: "docNode" },
			{},
			testPolicies
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"image",
			"edit",
			{ userIdentity: "editor", nodeIdentity: "imgNode" },
			{},
			testPolicies
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"video",
			"stream",
			{ userIdentity: "viewer", nodeIdentity: "streamNode" },
			{},
			testPolicies
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const executedLogs = logEntries.filter(l => l.message === "policyActionExecuted");
		expect(executedLogs.length).toBe(3);
		const assetTypes = executedLogs.map(entry => entry.data?.assetType);
		const actions = executedLogs.map(entry => entry.data?.action);
		expect(new Set(assetTypes)).toEqual(new Set(["document", "image", "video"]));
		expect(new Set(actions)).toEqual(new Set(["read", "edit", "stream"]));
	});

	test("loggingPolicyAction does not log sensitive data content", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const sensitiveData = {
			password: "secret123",
			creditCard: "1234-5678-9012-3456",
			personalInfo: { ssn: "123-45-6789" }
		};
		const testPolicies = [
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Agreement, uid: "policy1" }
		];

		await policyExecutionPoint.registerAction(
			"loggingAction",
			PolicyDecisionStage.Before,
			new LoggingPolicyExecutionAction()
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"userProfile",
			"update",
			{ userIdentity: "user123", nodeIdentity: "profileNode" },
			sensitiveData,
			testPolicies
		);

		const logEntries = loggingMemoryEntityStorage.getStore();
		const policyLog = logEntries.find(l => l.message === "policyActionExecuted");
		// Verify that sensitive data is not logged
		expect(JSON.stringify(policyLog)).not.toContain("secret123");
		expect(JSON.stringify(policyLog)).not.toContain("1234-5678-9012-3456");
		expect(JSON.stringify(policyLog)).not.toContain("123-45-6789");
		// But metadata should be present
		expect(policyLog?.data?.assetType).toBe("userProfile");
		expect(policyLog?.data?.action).toBe("update");
	});
});
