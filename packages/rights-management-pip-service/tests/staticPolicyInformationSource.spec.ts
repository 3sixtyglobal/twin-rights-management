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
import { PolicyInformationAccessMode } from "@twin.org/rights-management-models";
import { StaticPolicyInformationSource } from "../src/policyInformationSources/staticPolicyInformationSource";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;

describe("StaticPolicyInformationSource", () => {
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
		const policyInformationSource = new StaticPolicyInformationSource();
		expect(policyInformationSource).toBeInstanceOf(StaticPolicyInformationSource);
	});

	test("can create the source with custom options", async () => {
		const staticInfo: IJsonLdNodeObject[] = [
			{ "@id": "info1", "@type": "StaticInfo", value: "data1" },
			{ "@id": "info2", "@type": "StaticInfo", value: "data2" }
		];

		const options = {
			loggingComponentType: "custom-logging",
			information: [{ accessMode: PolicyInformationAccessMode.Any, objects: staticInfo }]
		};
		const policyInformationSource = new StaticPolicyInformationSource(options);
		expect(policyInformationSource).toBeInstanceOf(StaticPolicyInformationSource);
	});

	test("returns static information when configured", async () => {
		const staticInfo: IJsonLdNodeObject[] = [
			{ "@id": "info1", "@type": "StaticInfo", value: "data1" },
			{ "@id": "info2", "@type": "StaticInfo", value: "data2" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [{ accessMode: PolicyInformationAccessMode.Any, objects: staticInfo }]
			}
		});

		const result = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(result).toEqual(staticInfo);
	});

	test("returns information matching Public access mode", async () => {
		const publicInfo: IJsonLdNodeObject[] = [
			{ "@id": "public1", "@type": "PublicInfo", visibility: "public" }
		];
		const privateInfo: IJsonLdNodeObject[] = [
			{ "@id": "private1", "@type": "PrivateInfo", visibility: "private" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{ accessMode: PolicyInformationAccessMode.Public, objects: publicInfo },
					{ accessMode: PolicyInformationAccessMode.Private, objects: privateInfo }
				]
			}
		});

		const result = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Public,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(result).toEqual(publicInfo);
	});

	test("returns information matching Private access mode", async () => {
		const publicInfo: IJsonLdNodeObject[] = [
			{ "@id": "public1", "@type": "PublicInfo", visibility: "public" }
		];
		const privateInfo: IJsonLdNodeObject[] = [
			{ "@id": "private1", "@type": "PrivateInfo", visibility: "private" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{ accessMode: PolicyInformationAccessMode.Public, objects: publicInfo },
					{ accessMode: PolicyInformationAccessMode.Private, objects: privateInfo }
				]
			}
		});

		const result = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Private,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(result).toEqual(privateInfo);
	});

	test("returns Any access mode information when specific Public/Private mode not found", async () => {
		const anyInfo: IJsonLdNodeObject[] = [{ "@id": "any1", "@type": "AnyInfo", visibility: "any" }];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [{ accessMode: PolicyInformationAccessMode.Any, objects: anyInfo }]
			}
		});

		const publicResult = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Public,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const privateResult = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Private,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(publicResult).toEqual(anyInfo);
		expect(privateResult).toEqual(anyInfo);
	});

	test("returns undefined when no matching Public access mode found", async () => {
		const privateInfo: IJsonLdNodeObject[] = [
			{ "@id": "private1", "@type": "PrivateInfo", visibility: "private" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [{ accessMode: PolicyInformationAccessMode.Private, objects: privateInfo }]
			}
		});

		const result = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Public,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(result).toBeUndefined();
	});

	test("returns undefined when no matching Private access mode found", async () => {
		const publicInfo: IJsonLdNodeObject[] = [
			{ "@id": "public1", "@type": "PublicInfo", visibility: "public" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [{ accessMode: PolicyInformationAccessMode.Public, objects: publicInfo }]
			}
		});

		const result = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Private,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(result).toBeUndefined();
	});

	test("handles multiple information objects with different access modes", async () => {
		const publicInfo: IJsonLdNodeObject[] = [
			{ "@id": "public1", "@type": "PublicInfo", data: "public data" }
		];
		const privateInfo: IJsonLdNodeObject[] = [
			{ "@id": "private1", "@type": "PrivateInfo", data: "private data" }
		];
		const anyInfo: IJsonLdNodeObject[] = [{ "@id": "any1", "@type": "AnyInfo", data: "any data" }];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{ accessMode: PolicyInformationAccessMode.Public, objects: publicInfo },
					{ accessMode: PolicyInformationAccessMode.Private, objects: privateInfo },
					{ accessMode: PolicyInformationAccessMode.Any, objects: anyInfo }
				]
			}
		});

		const publicResult = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Public,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const privateResult = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Private,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const anyResult = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(publicResult).toEqual([...publicInfo, ...anyInfo]);
		expect(privateResult).toEqual([...privateInfo, ...anyInfo]);
		expect(anyResult).toEqual([...publicInfo, ...privateInfo, ...anyInfo]);
	});

	test("prioritizes exact access mode match over Any", async () => {
		const publicInfo: IJsonLdNodeObject[] = [
			{ "@id": "public1", "@type": "PublicInfo", data: "specific public" }
		];
		const anyInfo: IJsonLdNodeObject[] = [
			{ "@id": "any1", "@type": "AnyInfo", data: "fallback any" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{ accessMode: PolicyInformationAccessMode.Any, objects: anyInfo },
					{ accessMode: PolicyInformationAccessMode.Public, objects: publicInfo }
				]
			}
		});

		const result = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Public,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(result).toEqual([...anyInfo, ...publicInfo]);
	});

	test("returns information when assetTypeActions is undefined (matches all)", async () => {
		const allInfo: IJsonLdNodeObject[] = [
			{ "@id": "all1", "@type": "AllInfo", data: "matches everything" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						assetTypeActions: undefined,
						objects: allInfo
					}
				]
			}
		});

		const result1 = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const result2 = await policyInformationSource.retrieve(
			"image",
			"write",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(result1).toEqual(allInfo);
		expect(result2).toEqual(allInfo);
	});

	test("returns information for specific assetType and action combination", async () => {
		const specificInfo: IJsonLdNodeObject[] = [
			{ "@id": "specific1", "@type": "SpecificInfo", data: "document-read only" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						assetTypeActions: [{ assetType: "document", action: "read" }],
						objects: specificInfo
					}
				]
			}
		});

		const matchingResult = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const nonMatchingResult = await policyInformationSource.retrieve(
			"document",
			"write",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(matchingResult).toEqual(specificInfo);
		expect(nonMatchingResult).toBeUndefined();
	});

	test("returns information when assetType is undefined (matches all asset types)", async () => {
		const readInfo: IJsonLdNodeObject[] = [
			{ "@id": "read1", "@type": "ReadInfo", data: "all assets read action" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						assetTypeActions: [{ assetType: undefined, action: "read" }],
						objects: readInfo
					}
				]
			}
		});

		const documentReadResult = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const imageReadResult = await policyInformationSource.retrieve(
			"image",
			"read",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const documentWriteResult = await policyInformationSource.retrieve(
			"document",
			"write",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(documentReadResult).toEqual(readInfo);
		expect(imageReadResult).toEqual(readInfo);
		expect(documentWriteResult).toBeUndefined();
	});

	test("returns information when action is undefined (matches all actions)", async () => {
		const documentInfo: IJsonLdNodeObject[] = [
			{ "@id": "doc1", "@type": "DocumentInfo", data: "all document actions" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						assetTypeActions: [{ assetType: "document", action: undefined }],
						objects: documentInfo
					}
				]
			}
		});

		const documentReadResult = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const documentWriteResult = await policyInformationSource.retrieve(
			"document",
			"write",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const imageReadResult = await policyInformationSource.retrieve(
			"image",
			"read",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(documentReadResult).toEqual(documentInfo);
		expect(documentWriteResult).toEqual(documentInfo);
		expect(imageReadResult).toBeUndefined();
	});

	test("returns information when both assetType and action are undefined (matches all)", async () => {
		const universalInfo: IJsonLdNodeObject[] = [
			{ "@id": "universal1", "@type": "UniversalInfo", data: "matches everything" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						assetTypeActions: [{ assetType: undefined, action: undefined }],
						objects: universalInfo
					}
				]
			}
		});

		const result1 = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const result2 = await policyInformationSource.retrieve(
			"image",
			"write",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(result1).toEqual(universalInfo);
		expect(result2).toEqual(universalInfo);
	});

	test("handles multiple assetTypeActions combinations", async () => {
		const multiInfo: IJsonLdNodeObject[] = [
			{ "@id": "multi1", "@type": "MultiInfo", data: "multiple combinations" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						assetTypeActions: [
							{ assetType: "document", action: "read" },
							{ assetType: "image", action: "write" },
							{ assetType: "video", action: undefined }
						],
						objects: multiInfo
					}
				]
			}
		});

		const documentReadResult = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const imageWriteResult = await policyInformationSource.retrieve(
			"image",
			"write",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const videoAnyResult = await policyInformationSource.retrieve(
			"video",
			"stream",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const documentWriteResult = await policyInformationSource.retrieve(
			"document",
			"write",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(documentReadResult).toEqual(multiInfo);
		expect(imageWriteResult).toEqual(multiInfo);
		expect(videoAnyResult).toEqual(multiInfo);
		expect(documentWriteResult).toBeUndefined();
	});

	test("combines accessMode and assetTypeActions filtering", async () => {
		const publicDocInfo: IJsonLdNodeObject[] = [
			{ "@id": "pubdoc1", "@type": "PublicDocInfo", data: "public document read" }
		];
		const privateImageInfo: IJsonLdNodeObject[] = [
			{ "@id": "privimg1", "@type": "PrivateImageInfo", data: "private image write" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Public,
						assetTypeActions: [{ assetType: "document", action: "read" }],
						objects: publicDocInfo
					},
					{
						accessMode: PolicyInformationAccessMode.Private,
						assetTypeActions: [{ assetType: "image", action: "write" }],
						objects: privateImageInfo
					}
				]
			}
		});

		const publicDocResult = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Public,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const privateImageResult = await policyInformationSource.retrieve(
			"image",
			"write",
			PolicyInformationAccessMode.Private,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const wrongAccessModeResult = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Private,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		const wrongAssetTypeResult = await policyInformationSource.retrieve(
			"document",
			"write",
			PolicyInformationAccessMode.Public,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(publicDocResult).toEqual(publicDocInfo);
		expect(privateImageResult).toEqual(privateImageInfo);
		expect(wrongAccessModeResult).toBeUndefined();
		expect(wrongAssetTypeResult).toBeUndefined();
	});

	test("returns all entries when assetTypeActions array is empty", async () => {
		const emptyMatchInfo: IJsonLdNodeObject[] = [
			{ "@id": "empty1", "@type": "EmptyMatchInfo", data: "should never match" }
		];

		const policyInformationSource = new StaticPolicyInformationSource({
			config: {
				information: [
					{
						accessMode: PolicyInformationAccessMode.Any,
						assetTypeActions: [],
						objects: emptyMatchInfo
					}
				]
			}
		});

		const result = await policyInformationSource.retrieve(
			"document",
			"read",
			PolicyInformationAccessMode.Any,
			{ userIdentity: "user123" },
			{ content: "test" },
			[]
		);

		expect(result).toEqual(emptyMatchInfo);
	});
});
