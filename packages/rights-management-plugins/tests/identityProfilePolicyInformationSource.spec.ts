// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Factory } from "@twin.org/core";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import type { IIdentityProfileComponent } from "@twin.org/identity-models";
import {
	EntityStorageLoggingConnector,
	initSchema,
	type LogEntry
} from "@twin.org/logging-connector-entity-storage";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import { LoggingService } from "@twin.org/logging-service";
import { nameof } from "@twin.org/nameof";
import { PolicyInformationAccessMode } from "@twin.org/rights-management-models";
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import { OdrlContexts, OdrlPolicyType } from "@twin.org/standards-w3c-odrl";
import { IdentityProfilePolicyInformationSource } from "../src/policyInformationSources/identityProfilePolicyInformationSource.js";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let mockGetPublic: ReturnType<typeof vi.fn>;
let mockGet: ReturnType<typeof vi.fn>;
let mockIdentityProfile: IIdentityProfileComponent;

function createPolicy(options?: {
	uid?: string;
	assignee?: string;
	assigner?: string;
}): IDataspaceProtocolPolicy {
	const policy: IDataspaceProtocolPolicy = {
		"@context": OdrlContexts.Context,
		"@type": OdrlPolicyType.Set,
		"@id": options?.uid ?? "policy123"
	};
	if (options?.assignee !== undefined) {
		policy.assignee = options.assignee;
	}
	if (options?.assigner !== undefined) {
		policy.assigner = options.assigner;
	}
	return policy;
}

describe("IdentityProfilePolicyInformationSource", () => {
	beforeEach(() => {
		Factory.clearFactories();
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>(),
			config: { storageKey: "log-entry" }
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register(
			"logging",
			() => new EntityStorageLoggingConnector({ config: { batchSize: 1, batchIntervalMs: 0 } })
		);
		ComponentFactory.register("logging", () => new LoggingService());
		ComponentFactory.register("platform", () => ({
			className: () => "MockPlatformComponent",
			isMultiTenant: () => false,
			execute: async (method: () => Promise<void>) => method(),
			getLocalOriginContext: async () => undefined
		}));

		mockGetPublic = vi.fn();
		mockGet = vi.fn();

		mockIdentityProfile = {
			className: () => "MockIdentityProfile",
			create: vi.fn(),
			get: mockGet as IIdentityProfileComponent["get"],
			getPublic: mockGetPublic as IIdentityProfileComponent["getPublic"],
			update: vi.fn(),
			remove: vi.fn(),
			list: vi.fn()
		};

		ComponentFactory.register("identity-profile", () => mockIdentityProfile);
	});

	afterEach(async () => {
		await loggingMemoryEntityStorage?.teardown();
	});

	test("can create the source", () => {
		const source = new IdentityProfilePolicyInformationSource();
		expect(source).toBeInstanceOf(IdentityProfilePolicyInformationSource);
		expect(source.className()).toBe(IdentityProfilePolicyInformationSource.CLASS_NAME);
	});

	test("returns empty object when policy is undefined", async () => {
		const source = new IdentityProfilePolicyInformationSource();
		const result = await source.retrieve(undefined, PolicyInformationAccessMode.Public);
		expect(result).toEqual({});
		expect(mockGetPublic).not.toHaveBeenCalled();
		expect(mockGet).not.toHaveBeenCalled();
	});

	test("returns empty object when policy has no assignee or assigner", async () => {
		const source = new IdentityProfilePolicyInformationSource();
		const result = await source.retrieve(createPolicy(), PolicyInformationAccessMode.Public);
		expect(result).toEqual({});
		expect(mockGetPublic).not.toHaveBeenCalled();
		expect(mockGet).not.toHaveBeenCalled();
	});

	test("retrieves only public profile for assignee when accessMode is Public", async () => {
		const publicProfile = { "@type": "Person", name: "Alice", role: "admin" };
		mockGetPublic.mockResolvedValue(publicProfile);

		const source = new IdentityProfilePolicyInformationSource();
		const result = await source.retrieve(
			createPolicy({ assignee: "did:example:assignee" }),
			PolicyInformationAccessMode.Public
		);

		expect(mockGetPublic).toHaveBeenCalledWith("did:example:assignee");
		expect(mockGet).not.toHaveBeenCalled();
		expect(result).toEqual({ profile: { "did:example:assignee": { public: publicProfile } } });
	});

	test("retrieves public and private profiles for assignee when accessMode is Private", async () => {
		const publicProfile = { "@type": "Person", name: "Alice" };
		const privateProfile = { secret: "value", internalRole: "owner" };
		mockGet.mockResolvedValue({
			identity: "did:example:assignee",
			publicProfile,
			privateProfile
		});

		const source = new IdentityProfilePolicyInformationSource();
		const result = await source.retrieve(
			createPolicy({ assignee: "did:example:assignee" }),
			PolicyInformationAccessMode.Private
		);

		expect(mockGet).toHaveBeenCalledWith(undefined, undefined, "did:example:assignee");
		expect(mockGetPublic).not.toHaveBeenCalled();
		expect(result).toEqual({
			profile: { "did:example:assignee": { public: publicProfile, private: privateProfile } }
		});
	});

	test("retrieves public and private profiles for assignee when accessMode is Any", async () => {
		const publicProfile = { "@type": "Person", name: "Alice" };
		const privateProfile = { secret: "value", internalRole: "owner" };
		mockGet.mockResolvedValue({
			identity: "did:example:assignee",
			publicProfile,
			privateProfile
		});

		const source = new IdentityProfilePolicyInformationSource();
		const result = await source.retrieve(
			createPolicy({ assignee: "did:example:assignee" }),
			PolicyInformationAccessMode.Any
		);

		expect(mockGet).toHaveBeenCalledWith(undefined, undefined, "did:example:assignee");
		expect(mockGetPublic).not.toHaveBeenCalled();
		expect(result).toEqual({
			profile: { "did:example:assignee": { public: publicProfile, private: privateProfile } }
		});
	});

	test("retrieves profiles for both assignee and assigner", async () => {
		const assigneeProfile = { "@type": "Person", name: "Alice" };
		const assignerProfile = { "@type": "Organization", name: "IOTA" };
		mockGetPublic.mockResolvedValueOnce(assigneeProfile).mockResolvedValueOnce(assignerProfile);

		const source = new IdentityProfilePolicyInformationSource();
		const result = await source.retrieve(
			createPolicy({ assignee: "did:example:assignee", assigner: "did:example:assigner" }),
			PolicyInformationAccessMode.Public
		);

		expect(mockGetPublic).toHaveBeenCalledTimes(2);
		expect(mockGetPublic).toHaveBeenCalledWith("did:example:assignee");
		expect(mockGetPublic).toHaveBeenCalledWith("did:example:assigner");
		expect(result).toEqual({
			profile: {
				"did:example:assignee": { public: assigneeProfile },
				"did:example:assigner": { public: assignerProfile }
			}
		});
	});

	test("skips identity and logs error when getPublic throws", async () => {
		mockGetPublic.mockRejectedValue(new Error("Profile not found"));

		const source = new IdentityProfilePolicyInformationSource({
			loggingComponentType: "logging"
		});
		const result = await source.retrieve(
			createPolicy({ assignee: "did:example:assignee" }),
			PolicyInformationAccessMode.Public
		);

		expect(result).toEqual({});

		const logEntries = await loggingMemoryEntityStorage.getStore();
		expect(
			logEntries.some(e => e.level === "error" && e.message === "profileRetrievalFailed")
		).toBe(true);
	});

	test("skips identity and logs error when get throws", async () => {
		mockGet.mockRejectedValue(new Error("Profile not found"));

		const source = new IdentityProfilePolicyInformationSource({
			loggingComponentType: "logging"
		});
		const result = await source.retrieve(
			createPolicy({ assignee: "did:example:assignee" }),
			PolicyInformationAccessMode.Private
		);

		expect(result).toEqual({});

		const logEntries = await loggingMemoryEntityStorage.getStore();
		expect(
			logEntries.some(e => e.level === "error" && e.message === "profileRetrievalFailed")
		).toBe(true);
	});

	test("continues processing remaining identities when one lookup fails", async () => {
		const assignerProfile = { "@type": "Organization", name: "IOTA" };
		mockGetPublic
			.mockRejectedValueOnce(new Error("Profile not found"))
			.mockResolvedValueOnce(assignerProfile);

		const source = new IdentityProfilePolicyInformationSource();
		const result = await source.retrieve(
			createPolicy({ assignee: "did:example:assignee", assigner: "did:example:assigner" }),
			PolicyInformationAccessMode.Public
		);

		expect(result).toEqual({ profile: { "did:example:assigner": { public: assignerProfile } } });
	});

	test("handles missing public and private profiles in Any mode gracefully", async () => {
		mockGet.mockResolvedValue({ identity: "did:example:assignee" });

		const source = new IdentityProfilePolicyInformationSource();
		const result = await source.retrieve(
			createPolicy({ assignee: "did:example:assignee" }),
			PolicyInformationAccessMode.Any
		);

		expect(result).toEqual({
			profile: { "did:example:assignee": { public: undefined, private: undefined } }
		});
	});

	test("throws when accessMode is invalid", async () => {
		const source = new IdentityProfilePolicyInformationSource();
		await expect(
			source.retrieve(
				createPolicy({ assignee: "did:example:assignee" }),
				"invalid" as unknown as PolicyInformationAccessMode
			)
		).rejects.toThrow();
	});

	test("uses custom identityProfileComponentType when specified in options", () => {
		const customGetPublic = vi.fn();
		const customProfile: IIdentityProfileComponent = {
			className: () => "CustomProfile",
			create: vi.fn(),
			get: vi.fn(),
			getPublic: customGetPublic,
			update: vi.fn(),
			remove: vi.fn(),
			list: vi.fn()
		};
		ComponentFactory.register("custom-identity-profile", () => customProfile);

		const source = new IdentityProfilePolicyInformationSource({
			identityProfileComponentType: "custom-identity-profile"
		});
		expect(source).toBeInstanceOf(IdentityProfilePolicyInformationSource);
	});
});
