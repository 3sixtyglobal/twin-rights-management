// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
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
import { createLoggingPolicyActionCallback } from "../src/policyActions/loggingPolicyActions";
import { PolicyExecutionPointService } from "../src/policyExecutionPointService";

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
		const mockCallback = vi.fn();
		await policyExecutionPoint.registerAction(
			"testAction",
			PolicyDecisionStage.Before,
			mockCallback
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{},
			"userIdentity",
			"nodeIdentity",
			[]
		);
		expect(mockCallback).toHaveBeenCalledWith(
			"assetType",
			"action",
			{},
			"userIdentity",
			"nodeIdentity",
			[],
			PolicyDecisionStage.Before
		);
	});

	test("can register an action and expect it to be called when executed after", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockCallback = vi.fn();
		await policyExecutionPoint.registerAction(
			"testAction",
			PolicyDecisionStage.After,
			mockCallback
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.After,
			"assetType",
			"action",
			{},
			"userIdentity",
			"nodeIdentity",
			[]
		);
		expect(mockCallback).toHaveBeenCalledWith(
			"assetType",
			"action",
			{},
			"userIdentity",
			"nodeIdentity",
			[],
			PolicyDecisionStage.After
		);
	});

	test("can register multiple actions and all are executed", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockCallback1 = vi.fn();
		const mockCallback2 = vi.fn();

		await policyExecutionPoint.registerAction(
			"testAction1",
			PolicyDecisionStage.Before,
			mockCallback1
		);
		await policyExecutionPoint.registerAction(
			"testAction2",
			PolicyDecisionStage.Before,
			mockCallback2
		);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{},
			"userIdentity",
			"nodeIdentity",
			[]
		);

		expect(mockCallback1).toHaveBeenCalledOnce();
		expect(mockCallback2).toHaveBeenCalledOnce();
	});

	test("can unregister an action", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockCallback = vi.fn();

		await policyExecutionPoint.registerAction(
			"testAction",
			PolicyDecisionStage.Before,
			mockCallback
		);
		await policyExecutionPoint.unregisterAction("testAction", PolicyDecisionStage.Before);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{},
			"userIdentity",
			"nodeIdentity",
			[]
		);

		expect(mockCallback).not.toHaveBeenCalled();
	});

	test("can register action with same id to replace existing action", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockCallback1 = vi.fn();
		const mockCallback2 = vi.fn();

		await policyExecutionPoint.registerAction(
			"testAction",
			PolicyDecisionStage.Before,
			mockCallback1
		);
		await policyExecutionPoint.registerAction(
			"testAction",
			PolicyDecisionStage.Before,
			mockCallback2
		);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{},
			"userIdentity",
			"nodeIdentity",
			[]
		);

		expect(mockCallback1).not.toHaveBeenCalled();
		expect(mockCallback2).toHaveBeenCalledOnce();
	});

	test("unregistering non-existent action does not throw error", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();

		await expect(
			policyExecutionPoint.unregisterAction("nonExistentAction", PolicyDecisionStage.Before)
		).resolves.not.toThrow();
	});

	test("continues executing other actions when one throws error", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		// eslint-disable-next-line no-restricted-syntax
		const errorCallback = vi.fn().mockRejectedValue(new Error("Test error"));
		const successCallback = vi.fn();

		await policyExecutionPoint.registerAction(
			"errorAction",
			PolicyDecisionStage.Before,
			errorCallback
		);
		await policyExecutionPoint.registerAction(
			"successAction",
			PolicyDecisionStage.Before,
			successCallback
		);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{},
			"userIdentity",
			"nodeIdentity",
			[]
		);

		expect(errorCallback).toHaveBeenCalledOnce();
		expect(successCallback).toHaveBeenCalledOnce();
	});

	test("logs error when action execution fails", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		// eslint-disable-next-line no-restricted-syntax
		const errorCallback = vi.fn().mockRejectedValue(new Error("Test error"));

		await policyExecutionPoint.registerAction(
			"errorAction",
			PolicyDecisionStage.Before,
			errorCallback
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			{},
			"userIdentity",
			"nodeIdentity",
			[]
		);

		const logEntries = await loggingMemoryEntityStorage.query();
		expect(logEntries.entities.length).toBe(1);
		expect(logEntries.entities[0].level).toBe("error");
		expect(logEntries.entities[0].message).toBe("actionExecutionFailed");
	});

	test("executes actions with correct parameters including data", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const mockCallback = vi.fn();
		const testData = { key: "value" };
		const testPolicies = [
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Agreement, uid: "policy1" }
		];

		await policyExecutionPoint.registerAction(
			"testAction",
			PolicyDecisionStage.Before,
			mockCallback
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"assetType",
			"action",
			testData,
			"userIdentity",
			"nodeIdentity",
			testPolicies
		);

		expect(mockCallback).toHaveBeenCalledWith(
			"assetType",
			"action",
			testData,
			"userIdentity",
			"nodeIdentity",
			testPolicies,
			PolicyDecisionStage.Before
		);
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
			createLoggingPolicyActionCallback("logging")
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"document",
			"read",
			testData,
			"user123",
			"node456",
			testPolicies
		);

		const logEntries = await loggingMemoryEntityStorage.query();
		expect(logEntries.entities.length).toBe(1);
		expect(logEntries.entities[0].level).toBe("info");
		expect(logEntries.entities[0].message).toBe("policyExecuted");
		expect(logEntries.entities[0].data).toEqual({
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
			createLoggingPolicyActionCallback("logging")
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.After,
			"image",
			"write",
			null,
			"",
			"",
			testPolicies
		);

		const logEntries = await loggingMemoryEntityStorage.query();
		expect(logEntries.entities.length).toBe(1);
		expect(logEntries.entities[0].data).toEqual({
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
			createLoggingPolicyActionCallback("logging")
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"video",
			"delete",
			{},
			"admin",
			"mainNode",
			[]
		);

		const logEntries = await loggingMemoryEntityStorage.query();
		expect(logEntries.entities.length).toBe(1);
		expect(logEntries.entities[0].data).toEqual({
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
			createLoggingPolicyActionCallback("logging", { includeData: true, includePolicies: true })
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"database",
			"query",
			{ table: "users" },
			"dbUser",
			"dbNode",
			multiplePolicies
		);

		const logEntries = await loggingMemoryEntityStorage.query();
		expect(logEntries.entities.length).toBe(1);
		expect((logEntries.entities[0]?.data?.policies as IOdrlPolicy[])?.length).toBe(3);
	});

	test("multiple loggingPolicyActions create separate log entries", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const testPolicies = [
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Agreement, uid: "policy1" }
		];

		await policyExecutionPoint.registerAction(
			"beforeLogging",
			PolicyDecisionStage.Before,
			createLoggingPolicyActionCallback("logging")
		);
		await policyExecutionPoint.registerAction(
			"afterLogging",
			PolicyDecisionStage.After,
			createLoggingPolicyActionCallback("logging")
		);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"file",
			"upload",
			{ size: 1024 },
			"uploader",
			"fileNode",
			testPolicies
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.After,
			"file",
			"upload",
			{ size: 1024 },
			"uploader",
			"fileNode",
			testPolicies
		);

		const logEntries = await loggingMemoryEntityStorage.query();
		expect(logEntries.entities.length).toBe(2);
		expect(logEntries.entities[0]?.data?.stage).toBe(PolicyDecisionStage.Before);
		expect(logEntries.entities[1]?.data?.stage).toBe(PolicyDecisionStage.After);
	});

	test("loggingPolicyAction combined with other actions", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const customAction = vi.fn();
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
			createLoggingPolicyActionCallback("logging")
		);

		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"api",
			"call",
			{ endpoint: "/users" },
			"apiUser",
			"apiNode",
			testPolicies
		);

		// Check both custom action was called and logging occurred
		expect(customAction).toHaveBeenCalledOnce();
		const logEntries = await loggingMemoryEntityStorage.query();
		expect(logEntries.entities.length).toBe(1);
		expect(logEntries.entities[0].message).toBe("policyExecuted");
	});

	test("loggingPolicyAction logs different asset types and actions", async () => {
		const policyExecutionPoint = new PolicyExecutionPointService();
		const testPolicies = [
			{ "@context": OdrlContexts.ContextRoot, "@type": PolicyType.Agreement, uid: "policy1" }
		];

		await policyExecutionPoint.registerAction(
			"loggingAction",
			PolicyDecisionStage.Before,
			createLoggingPolicyActionCallback("logging")
		);

		// Execute different combinations
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"document",
			"read",
			{},
			"reader",
			"docNode",
			testPolicies
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"image",
			"edit",
			{},
			"editor",
			"imgNode",
			testPolicies
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"video",
			"stream",
			{},
			"viewer",
			"streamNode",
			testPolicies
		);

		const logEntries = await loggingMemoryEntityStorage.query();
		expect(logEntries.entities.length).toBe(3);

		const assetTypes = logEntries.entities.map(entry => entry.data?.assetType);
		const actions = logEntries.entities.map(entry => entry.data?.action);

		expect(assetTypes).toContain("document");
		expect(assetTypes).toContain("image");
		expect(assetTypes).toContain("video");
		expect(actions).toContain("read");
		expect(actions).toContain("edit");
		expect(actions).toContain("stream");
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
			createLoggingPolicyActionCallback("logging")
		);
		await policyExecutionPoint.executeActions(
			PolicyDecisionStage.Before,
			"userProfile",
			"update",
			sensitiveData,
			"user123",
			"profileNode",
			testPolicies
		);

		const logEntries = await loggingMemoryEntityStorage.query();
		expect(logEntries.entities.length).toBe(1);

		// Verify that sensitive data is not logged
		const logEntry = logEntries.entities[0];
		expect(JSON.stringify(logEntry)).not.toContain("secret123");
		expect(JSON.stringify(logEntry)).not.toContain("1234-5678-9012-3456");
		expect(JSON.stringify(logEntry)).not.toContain("123-45-6789");

		// But metadata should be present
		expect(logEntry.data?.assetType).toBe("userProfile");
		expect(logEntry.data?.action).toBe("update");
	});
});
