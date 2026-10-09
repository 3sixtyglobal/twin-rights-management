// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@3sixty/core";
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
	type IRightsManagementInformation,
	PolicyInformationAccessMode
} from "@3sixty/rights-management-models";
import type { IDataspaceProtocolPolicy } from "@3sixty/standards-dataspace-protocol";
import { OdrlContexts, OdrlPolicyType } from "@3sixty/standards-w3c-odrl";
import { StaticPolicyInformationSource } from "../src/policyInformationSources/staticPolicyInformationSource.js";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;

function createPolicy(options?: {
	uid?: string;
	action?: string;
	target?: string;
	assignee?: string;
}): IDataspaceProtocolPolicy {
	return {
		"@context": OdrlContexts.Context,
		"@type": OdrlPolicyType.Set,
		"@id": options?.uid ?? "policy123",
		action: options?.action ?? "action",
		target: options?.target ?? "target",
		assignee: options?.assignee ?? "assignee"
	};
}

describe("StaticPolicyInformationSource", () => {
	beforeEach(() => {
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>(),
			config: { storageKey: "log-entry" }
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());
	});

	test("can create the source", async () => {
		const policyInformationSource = new StaticPolicyInformationSource();
		expect(policyInformationSource).toBeInstanceOf(StaticPolicyInformationSource);
		expect(policyInformationSource.className()).toBe(StaticPolicyInformationSource.CLASS_NAME);
	});

	test("returns undefined when no information is configured", async () => {
		const policyInformationSource = new StaticPolicyInformationSource({
			config: { information: [] }
		});

		const result = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		expect(result).toBeUndefined();
	});

	test.each([
		[
			"Public",
			PolicyInformationAccessMode.Public,
			{ public1: { "@id": "public1", "@type": "PublicInfo", visibility: "public" } },
			{ private1: { "@id": "private1", "@type": "PrivateInfo", visibility: "private" } },
			{ any1: { "@id": "any1", "@type": "AnyInfo", visibility: "any" } },
			{
				public1: { "@id": "public1", "@type": "PublicInfo", visibility: "public" },
				any1: { "@id": "any1", "@type": "AnyInfo", visibility: "any" }
			}
		],
		[
			"Private",
			PolicyInformationAccessMode.Private,
			{ public1: { "@id": "public1", "@type": "PublicInfo", visibility: "public" } },
			{ private1: { "@id": "private1", "@type": "PrivateInfo", visibility: "private" } },
			{ any1: { "@id": "any1", "@type": "AnyInfo", visibility: "any" } },
			{
				private1: { "@id": "private1", "@type": "PrivateInfo", visibility: "private" },
				any1: { "@id": "any1", "@type": "AnyInfo", visibility: "any" }
			}
		],
		[
			"Any",
			PolicyInformationAccessMode.Any,
			{ public1: { "@id": "public1", "@type": "PublicInfo", visibility: "public" } },
			{ private1: { "@id": "private1", "@type": "PrivateInfo", visibility: "private" } },
			{ any1: { "@id": "any1", "@type": "AnyInfo", visibility: "any" } },
			{
				public1: { "@id": "public1", "@type": "PublicInfo", visibility: "public" },
				private1: { "@id": "private1", "@type": "PrivateInfo", visibility: "private" },
				any1: { "@id": "any1", "@type": "AnyInfo", visibility: "any" }
			}
		]
	])(
		"returns merged information for accessMode %s",
		async (accessModeName, accessMode, publicMap, privateMap, anyMap, expected) => {
			const policyInformationSource = new StaticPolicyInformationSource({
				config: {
					information: [
						{ accessMode: PolicyInformationAccessMode.Public, objects: publicMap },
						{ accessMode: PolicyInformationAccessMode.Private, objects: privateMap },
						{ accessMode: PolicyInformationAccessMode.Any, objects: anyMap }
					]
				}
			});

			const result = await policyInformationSource.retrieve(
				createPolicy({ target: "document", action: "read", assignee: "node123" }),
				accessMode,
				{ content: "test" }
			);

			expect(result).toEqual(expected);
		}
	);

	test.each([
		["Public", PolicyInformationAccessMode.Public],
		["Private", PolicyInformationAccessMode.Private]
	])("falls back to Any when only Any configured (%s)", async (name, accessMode) => {
		const anyInfo: IRightsManagementInformation = {
			any1: { "@id": "any1", "@type": "AnyInfo", visibility: "any" }
		};

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [{ accessMode: PolicyInformationAccessMode.Any, objects: anyInfo }]
			}
		});

		const result = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			accessMode,
			{ content: "test" }
		);

		expect(result).toEqual(anyInfo);
	});

	test.each([
		["Public", PolicyInformationAccessMode.Public],
		["Private", PolicyInformationAccessMode.Private]
	])(
		"returns undefined when no accessMode match and no Any configured (%s)",
		async (name, accessMode) => {
			const policyInformationSource = new StaticPolicyInformationSource({
				config: {
					information: [
						{
							accessMode:
								accessMode === PolicyInformationAccessMode.Public
									? PolicyInformationAccessMode.Private
									: PolicyInformationAccessMode.Public,
							objects: {
								other1: { "@id": "other1", "@type": "OtherInfo", value: "other" }
							}
						}
					]
				}
			});

			const result = await policyInformationSource.retrieve(
				createPolicy({ target: "document", action: "read", assignee: "node123" }),
				accessMode,
				{ content: "test" }
			);

			expect(result).toBeUndefined();
		}
	);

	test("later entries override earlier when ids collide", async () => {
		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						objects: {
							overlap: { "@id": "overlap", "@type": "AnyInfo", value: "any" }
						}
					},
					{
						accessMode: PolicyInformationAccessMode.Public,
						objects: {
							overlap: { "@id": "overlap", "@type": "PublicInfo", value: "public" }
						}
					}
				]
			}
		});

		const result = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Public,
			{ content: "test" }
		);

		expect(result).toEqual({
			overlap: { "@id": "overlap", "@type": "PublicInfo", value: "public" }
		});
	});

	test("returns information when matchLocators is undefined (matches all)", async () => {
		const allMap: IRightsManagementInformation = {
			all1: { "@id": "all1", "@type": "AllInfo", data: "matches everything" }
		};

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						matchLocators: undefined,
						objects: allMap
					}
				]
			}
		});

		const result1 = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		const result2 = await policyInformationSource.retrieve(
			createPolicy({ target: "image", action: "write", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		expect(result1).toEqual(allMap);
		expect(result2).toEqual(allMap);
	});

	test("returns information for specific target and action combination", async () => {
		const specificMap: IRightsManagementInformation = {
			specific1: { "@id": "specific1", "@type": "SpecificInfo", data: "document-read only" }
		};

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						matchLocators: [{ target: "document", action: "read" }],
						objects: specificMap
					}
				]
			}
		});

		const matchingResult = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		const nonMatchingResult = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "write", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		expect(matchingResult).toEqual(specificMap);
		expect(nonMatchingResult).toBeUndefined();
	});

	test("returns information when target is undefined (matches all targets)", async () => {
		const readInfo: IRightsManagementInformation = {
			read1: { "@id": "read1", "@type": "ReadInfo", data: "all targets read action" }
		};

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						matchLocators: [{ action: "read" }],
						objects: readInfo
					}
				]
			}
		});

		const documentReadResult = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		const imageReadResult = await policyInformationSource.retrieve(
			createPolicy({ target: "image", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		const documentWriteResult = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "write", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		expect(documentReadResult).toEqual(readInfo);
		expect(imageReadResult).toEqual(readInfo);
		expect(documentWriteResult).toBeUndefined();
	});

	test("returns information when action is undefined (matches all actions)", async () => {
		const documentMap: IRightsManagementInformation = {
			doc1: { "@id": "doc1", "@type": "DocumentInfo", data: "all document actions" }
		};

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						matchLocators: [{ target: "document" }],
						objects: documentMap
					}
				]
			}
		});

		const documentReadResult = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		const documentWriteResult = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "write", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		const imageReadResult = await policyInformationSource.retrieve(
			createPolicy({ target: "image", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		expect(documentReadResult).toEqual(documentMap);
		expect(documentWriteResult).toEqual(documentMap);
		expect(imageReadResult).toBeUndefined();
	});

	test("returns information when both target and action are undefined (matches all)", async () => {
		const universalMap: IRightsManagementInformation = {
			universal1: { "@id": "universal1", "@type": "UniversalInfo", data: "matches everything" }
		};

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						matchLocators: [{}],
						objects: universalMap
					}
				]
			}
		});

		const result1 = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		const result2 = await policyInformationSource.retrieve(
			createPolicy({ target: "image", action: "write", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		expect(result1).toEqual(universalMap);
		expect(result2).toEqual(universalMap);
	});

	test("handles multiple matchLocators combinations", async () => {
		const multiMap: IRightsManagementInformation = {
			multi1: { "@id": "multi1", "@type": "MultiInfo", data: "multiple combinations" }
		};

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						matchLocators: [
							{ action: "read" },
							{ target: "image", action: "write" },
							{ target: "video" }
						],
						objects: multiMap
					}
				]
			}
		});

		const documentReadResult = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		const imageWriteResult = await policyInformationSource.retrieve(
			createPolicy({ target: "image", action: "write", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		const videoAnyResult = await policyInformationSource.retrieve(
			createPolicy({ target: "video", action: "stream", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		const documentWriteResult = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "write", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		expect(documentReadResult).toEqual(multiMap);
		expect(imageWriteResult).toEqual(multiMap);
		expect(videoAnyResult).toEqual(multiMap);
		expect(documentWriteResult).toBeUndefined();
	});

	test("combines accessMode and matchLocators filtering", async () => {
		const publicDocMap: IRightsManagementInformation = {
			pubdoc1: { "@id": "pubdoc1", "@type": "PublicDocInfo", data: "public document read" }
		};
		const privateImageMap: IRightsManagementInformation = {
			privimg1: { "@id": "privimg1", "@type": "PrivateImageInfo", data: "private image write" }
		};

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Public,
						matchLocators: [{ action: "read" }],
						objects: publicDocMap
					},
					{
						accessMode: PolicyInformationAccessMode.Private,
						matchLocators: [{ action: "write" }],
						objects: privateImageMap
					}
				]
			}
		});

		const publicDocResult = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Public,
			{ content: "test" }
		);

		const privateImageResult = await policyInformationSource.retrieve(
			createPolicy({ target: "image", action: "write", assignee: "node123" }),
			PolicyInformationAccessMode.Private,
			{ content: "test" }
		);

		const wrongAccessModeResult = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Private,
			{ content: "test" }
		);

		const wrongTargetResult = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "write", assignee: "node123" }),
			PolicyInformationAccessMode.Public,
			{ content: "test" }
		);

		expect(publicDocResult).toEqual(publicDocMap);
		expect(privateImageResult).toEqual(privateImageMap);
		expect(wrongAccessModeResult).toBeUndefined();
		expect(wrongTargetResult).toBeUndefined();
	});

	test("returns all entries when matchLocators array is empty", async () => {
		const emptyMatchMap: IRightsManagementInformation = {
			empty1: { "@id": "empty1", "@type": "EmptyMatchInfo", data: "should never match" }
		};

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						matchLocators: [],
						objects: emptyMatchMap
					}
				]
			}
		});

		const result = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		expect(result).toEqual(emptyMatchMap);
	});

	test("can add information dynamically", async () => {
		const policyInformationSource = new StaticPolicyInformationSource({
			config: { information: [] }
		});
		const dynamicInfo: IRightsManagementInformation = {
			dyn1: { "@id": "dyn1", "@type": "DynamicInfo", value: "dynamic" }
		};

		policyInformationSource.addInformation({
			accessMode: PolicyInformationAccessMode.Any,
			objects: dynamicInfo
		});

		const result = await policyInformationSource.retrieve(
			createPolicy({ target: "document", action: "read", assignee: "node123" }),
			PolicyInformationAccessMode.Any,
			{ content: "test" }
		);

		expect(result).toEqual(dynamicInfo);
	});

	test("throws when retrieve accessMode is invalid", async () => {
		const policyInformationSource = new StaticPolicyInformationSource();
		const invalidAccessMode = "invalid" as unknown as PolicyInformationAccessMode;
		await expect(
			policyInformationSource.retrieve(
				createPolicy({ target: "document", action: "read", assignee: "node123" }),
				invalidAccessMode,
				{ content: "test" }
			)
		).rejects.toThrow();
	});

	test("throws when addInformation arguments are invalid", async () => {
		const policyInformationSource = new StaticPolicyInformationSource();
		const invalidAccessMode = "invalid" as unknown as PolicyInformationAccessMode;
		expect(() =>
			policyInformationSource.addInformation({
				accessMode: invalidAccessMode,
				objects: {
					bad: { "@id": "bad", "@type": "BadInfo" }
				}
			})
		).toThrow();

		expect(() =>
			policyInformationSource.addInformation({
				accessMode: PolicyInformationAccessMode.Any,
				objects: [] as unknown as IRightsManagementInformation
			})
		).toThrow();
	});
});
