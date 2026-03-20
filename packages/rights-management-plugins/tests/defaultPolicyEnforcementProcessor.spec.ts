// Copyright 2025 IOTA Stiftung.
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
import { PolicyDecision, type IPolicyDecision } from "@twin.org/rights-management-models";
import type { IDataspaceProtocolAgreement } from "@twin.org/standards-dataspace-protocol";
import { OdrlContexts, OdrlPolicyType } from "@twin.org/standards-w3c-odrl";
import { DefaultPolicyEnforcementProcessor } from "../src/policyEnforcementProcessor/defaultPolicyEnforcementProcessor.js";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;

describe("DefaultPolicyEnforcementProcessor", () => {
	function createAgreement(uid: string = "policy123"): IDataspaceProtocolAgreement {
		return {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			"@id": uid,
			assigner: "did:example:assigner",
			assignee: "did:example:assignee"
		};
	}

	const createPolicy = createAgreement;

	beforeEach(() => {
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());
	});

	test("can create the source", async () => {
		const policyInformationSource = new DefaultPolicyEnforcementProcessor();
		expect(policyInformationSource).toBeInstanceOf(DefaultPolicyEnforcementProcessor);
		expect(policyInformationSource.className()).toBe(DefaultPolicyEnforcementProcessor.CLASS_NAME);
	});

	test("logs processingPolicy with the agreement id", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();

		await processor.process(createAgreement("policy:abc"), [], { a: 1 });

		const logs = loggingMemoryEntityStorage.getStore();
		expect(logs).toHaveLength(1);
		expect(logs[0]).toMatchObject({
			level: "info",
			source: DefaultPolicyEnforcementProcessor.CLASS_NAME,
			message: "processingPolicy",
			data: {
				policyId: "policy:abc"
			}
		});
	});

	test("returns an empty object when decisions is undefined", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();
		const result = await processor.process(
			createAgreement(),
			undefined as unknown as IPolicyDecision[],
			{ a: 1 }
		);
		expect(result).toEqual({});
	});

	test("returns true for a single Granted decision with no data", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();

		const result = await processor.process<undefined, boolean>(createAgreement(), [
			{ decision: PolicyDecision.Granted, target: "$" }
		] as IPolicyDecision[]);

		expect(result).toBe(true);
	});

	test("returns false for a single Denied decision with no data", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();

		const result = await processor.process<undefined, boolean>(createAgreement(), [
			{ decision: PolicyDecision.Denied, target: "$" }
		] as IPolicyDecision[]);

		expect(result).toBe(false);
	});

	test("grants all properties when target is '$'", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();
		const data = { name: "Alice", email: "alice@example.com" };

		const result = await processor.process(
			createPolicy(),
			[{ decision: PolicyDecision.Granted, target: "$" }] as IPolicyDecision[],
			data
		);

		expect(result).toEqual(data);
	});

	test("denies all properties when target is '$' after a grant", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();
		const data = { name: "Alice", email: "alice@example.com" };

		const result = await processor.process(
			createPolicy(),
			[
				{ decision: PolicyDecision.Granted, target: "$" },
				{ decision: PolicyDecision.Denied, target: "$" }
			] as IPolicyDecision[],
			data
		);

		expect(result).toEqual({});
	});

	test("applies decisions in order (Denied before Granted)", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();
		const data = { name: "Alice", email: "alice@example.com" };

		const result = await processor.process(
			createPolicy(),
			[
				{ decision: PolicyDecision.Denied, target: "$.name" },
				{ decision: PolicyDecision.Granted, target: "$" }
			] as IPolicyDecision[],
			data
		);

		expect(result).toEqual(data);
	});

	test("grants only the specific target when provided", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();
		const data = {
			name: "Alice",
			profile: {
				email: "alice@example.com",
				phone: "123"
			}
		};

		const result = await processor.process(
			createPolicy(),
			[{ decision: PolicyDecision.Granted, target: "$.profile.email" }] as IPolicyDecision[],
			data
		);

		expect(result).toEqual({
			profile: {
				email: "alice@example.com"
			}
		});
	});

	test("grants all matching values for an array JSONPath", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();
		const data = {
			items: [
				{ email: "a@example.com", phone: "111" },
				{ email: "b@example.com", phone: "222" }
			]
		};

		const result = await processor.process(
			createPolicy(),
			[{ decision: PolicyDecision.Granted, target: "$.items[*].email" }] as IPolicyDecision[],
			data
		);

		expect(result).toEqual({
			items: [{ email: "a@example.com" }, { email: "b@example.com" }]
		});
	});

	test("denied target removes properties from output", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();
		const data = { name: "Alice", email: "alice@example.com" };

		const result = await processor.process(
			createPolicy(),
			[
				{ decision: PolicyDecision.Granted, target: "$" },
				{ decision: PolicyDecision.Denied, target: "$.name" }
			] as IPolicyDecision[],
			data
		);

		expect(result).toEqual({ email: "alice@example.com" });
	});

	test("replaces only the specific target when provided", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();
		const data = { name: "Alice", email: "alice@example.com" };

		const result = await processor.process(
			createPolicy(),
			[
				{
					decision: PolicyDecision.Replace,
					target: "$.name",
					replaceValue: "REDACTED"
				}
			] as IPolicyDecision[],
			data
		);

		expect(result).toEqual({ name: "REDACTED" });
	});

	test("replaces a target after granting all", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();
		const data = { name: "Alice", email: "alice@example.com" };

		const result = await processor.process(
			createPolicy(),
			[
				{ decision: PolicyDecision.Granted, target: "$" },
				{
					decision: PolicyDecision.Replace,
					target: "$.name",
					replaceValue: "REDACTED"
				}
			] as IPolicyDecision[],
			data
		);

		expect(result).toEqual({ name: "REDACTED", email: "alice@example.com" });
	});

	test("replaces all matching values for an array JSONPath", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();
		const data = {
			items: [
				{ email: "a@example.com", phone: "111" },
				{ email: "b@example.com", phone: "222" }
			]
		};

		const result = await processor.process(
			createPolicy(),
			[
				{
					decision: PolicyDecision.Replace,
					target: "$.items[*].email",
					replaceValue: "REDACTED"
				}
			] as IPolicyDecision[],
			data
		);

		expect(result).toEqual({
			items: [{ email: "REDACTED" }, { email: "REDACTED" }]
		});
	});

	test("allows falsy replaceValue values", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();

		await expect(
			processor.process(
				createPolicy(),
				[
					{ decision: PolicyDecision.Replace, target: "$.count", replaceValue: 0 },
					{ decision: PolicyDecision.Replace, target: "$.enabled", replaceValue: false },
					{ decision: PolicyDecision.Replace, target: "$.note", replaceValue: "" },
					{ decision: PolicyDecision.Replace, target: "$.maybe", replaceValue: null }
				] as IPolicyDecision[],
				{ count: 1, enabled: true, note: "x", maybe: "y" }
			)
		).resolves.toEqual({ count: 0, enabled: false, note: "", maybe: null });
	});

	test("throws when replaceValue is missing for Replace", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();

		await expect(
			processor.process(
				createPolicy(),
				[{ decision: PolicyDecision.Replace, target: "$.name" }] as IPolicyDecision[],
				{ name: "Alice" }
			)
		).rejects.toThrow();
	});

	test("throws when decision target is not a string", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();

		await expect(
			processor.process(
				createPolicy(),
				[
					{
						decision: PolicyDecision.Granted,
						target: 123 as unknown as string
					}
				] as IPolicyDecision[],
				{ a: 1 }
			)
		).rejects.toThrow();
	});

	test("throws when target is not a valid JSONPath", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();

		await expect(
			processor.process(
				createPolicy(),
				[{ decision: PolicyDecision.Granted, target: "$." }] as IPolicyDecision[],
				{ a: 1 }
			)
		).rejects.toThrow();
	});

	test("throws when policy is not an object", async () => {
		const processor = new DefaultPolicyEnforcementProcessor();

		await expect(
			processor.process(undefined as unknown as IDataspaceProtocolAgreement, [], { a: 1 })
		).rejects.toThrow();
	});
});
