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
import type { IDataspaceProtocolOffer } from "@3sixty/standards-dataspace-protocol";
import { OdrlContexts, OdrlTypes } from "@3sixty/standards-w3c-odrl";
import { PassThroughPolicyNegotiator } from "../src/policyNegotiators/passThroughPolicyNegotiator.js";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;

describe("PassThroughPolicyNegotiator", () => {
	beforeAll(() => {
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>(),
			config: { storageKey: "log-entry" }
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);

		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());

		ComponentFactory.register("logging", () => new LoggingService());
	});

	afterAll(() => {
		ComponentFactory.reset();
		EntityStorageConnectorFactory.reset();
		LoggingConnectorFactory.reset();
	});

	test("supportsOffer returns true for any offer", () => {
		const negotiator = new PassThroughPolicyNegotiator();
		const offer: IDataspaceProtocolOffer = {
			"@context": OdrlContexts.Context,
			"@type": OdrlTypes.Offer,
			"@id": "urn:policy:test-offer",
			assigner: "did:iota:test-provider"
		};
		expect(negotiator.supportsOffer(offer)).toBe(true);
	});

	test("handleOffer accepts any offer", async () => {
		const negotiator = new PassThroughPolicyNegotiator();
		const offer: IDataspaceProtocolOffer = {
			"@context": OdrlContexts.Context,
			"@type": OdrlTypes.Offer,
			"@id": "urn:policy:test-offer",
			assigner: "did:iota:test-provider"
		};
		const result = await negotiator.handleOffer(offer);
		expect(result.accepted).toBe(true);
		expect(result.interventionRequired).toBe(false);
		expect(result.directAgreement).toBe(false);
	});

	test("handleOffer signals directAgreement: true when configured", async () => {
		const negotiator = new PassThroughPolicyNegotiator({ config: { directAgreement: true } });
		const offer: IDataspaceProtocolOffer = {
			"@context": OdrlContexts.Context,
			"@type": OdrlTypes.Offer,
			"@id": "urn:policy:test-offer",
			assigner: "did:iota:test-provider"
		};
		const result = await negotiator.handleOffer(offer);
		expect(result.accepted).toBe(true);
		expect(result.interventionRequired).toBe(false);
		expect(result.directAgreement).toBe(true);
	});

	test("createAgreement generates a unique ID different from the offer", async () => {
		const negotiator = new PassThroughPolicyNegotiator();
		const offer: IDataspaceProtocolOffer = {
			"@context": OdrlContexts.Context,
			"@type": OdrlTypes.Offer,
			"@id": "urn:policy:original-offer-id",
			assigner: "did:iota:test-provider",
			permission: [{ action: "read" }]
		};

		const agreement = await negotiator.createAgreement(offer, "did:iota:test-consumer");

		expect(agreement).toBeDefined();
		if (agreement) {
			expect(agreement["@type"]).toBe("Agreement");
			expect(agreement["@id"]).not.toBe("urn:policy:original-offer-id");
			expect(agreement["@id"]).toMatch(/^urn:policy:/);
			expect(agreement.assignee).toBe("did:iota:test-consumer");
		}
	});

	test("createAgreement produces unique IDs across multiple calls for the same offer", async () => {
		const negotiator = new PassThroughPolicyNegotiator();
		const offer: IDataspaceProtocolOffer = {
			"@context": OdrlContexts.Context,
			"@type": OdrlTypes.Offer,
			"@id": "urn:policy:reusable-offer",
			assigner: "did:iota:test-provider",
			permission: [{ action: "read" }]
		};

		const agreement1 = await negotiator.createAgreement(offer, "did:iota:consumer-a");
		const agreement2 = await negotiator.createAgreement(offer, "did:iota:consumer-b");

		expect(agreement1).toBeDefined();
		expect(agreement2).toBeDefined();
		if (agreement1 && agreement2) {
			expect(agreement1["@id"]).not.toBe(offer["@id"]);
			expect(agreement2["@id"]).not.toBe(offer["@id"]);
			expect(agreement1["@id"]).not.toBe(agreement2["@id"]);
		}
	});

	test("createAgreement preserves offer permissions in the agreement", async () => {
		const negotiator = new PassThroughPolicyNegotiator();
		const offer: IDataspaceProtocolOffer = {
			"@context": OdrlContexts.Context,
			"@type": OdrlTypes.Offer,
			"@id": "urn:policy:test-offer",
			assigner: "did:iota:test-provider",
			permission: [{ action: "read" }]
		};

		const agreement = await negotiator.createAgreement(offer, "did:iota:test-consumer");

		expect(agreement).toBeDefined();
		if (agreement) {
			expect(agreement.permission).toEqual([{ action: "read" }]);
			expect(agreement.assigner).toBe("did:iota:test-provider");
		}
	});
});
