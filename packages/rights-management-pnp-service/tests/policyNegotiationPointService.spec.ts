// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HttpContextIdKeys } from "@twin.org/api-models";
import {
	TaskSchedulerService,
	initSchema as initSchemaScheduler,
	type ScheduledTask
} from "@twin.org/background-task-scheduler";
import { ContextIdKeys, ContextIdStore, type IContextIds } from "@twin.org/context";
import { ComponentFactory, Factory, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageIdentityConnector,
	initSchema as initSchemaIdentity,
	type IdentityDocument
} from "@twin.org/identity-connector-entity-storage";
import { IdentityConnectorFactory } from "@twin.org/identity-models";
import {
	EntityStorageLoggingConnector,
	initSchema as initSchemaLogging,
	type LogEntry
} from "@twin.org/logging-connector-entity-storage";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import { LoggingService } from "@twin.org/logging-service";
import { nameof } from "@twin.org/nameof";
import {
	PolicyNegotiatorFactory,
	PolicyRequesterFactory,
	type IPolicyNegotiationPointComponent,
	type IPolicyNegotiator,
	type IPolicyRequester
} from "@twin.org/rights-management-models";
import {
	PolicyAdministrationPointService,
	buildPapStorageContext,
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy
} from "@twin.org/rights-management-pap-service";
import { PolicyInformationPointService } from "@twin.org/rights-management-pip-service";
import {
	DataspaceProtocolContexts,
	DataspaceProtocolContractNegotiationStateType,
	DataspaceProtocolContractNegotiationTypes,
	type IDataspaceProtocolOffer
} from "@twin.org/standards-dataspace-protocol";
import { OdrlContexts, OdrlTypes } from "@twin.org/standards-w3c-odrl";
import type { ITrustComponent } from "@twin.org/trust-models";
import {
	EntityStorageVaultConnector,
	initSchema as initSchemaVault,
	type VaultKey,
	type VaultSecret
} from "@twin.org/vault-connector-entity-storage";
import { VaultConnectorFactory } from "@twin.org/vault-models";
import type { PolicyNegotiation } from "../src/entities/policyNegotiation.js";
import { PolicyNegotiationAdminPointService } from "../src/policyNegotiationAdminPointService.js";
import { PolicyNegotiationPointService } from "../src/policyNegotiationPointService.js";
import { initSchema } from "../src/schema.js";

/**
 * JSON-LD context on policies loaded from PAP after lifecycle timestamps are stored.
 */
const PAP_STORED_POLICY_CONTEXT = buildPapStorageContext();

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let odrlPolicyMemoryEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;
let policyNegotiationProviderMemoryEntityStorage: MemoryEntityStorageConnector<PolicyNegotiation>;
let policyNegotiationConsumerMemoryEntityStorage: MemoryEntityStorageConnector<PolicyNegotiation>;
let identityConnector: EntityStorageIdentityConnector;
let negotiationProviderAdminPointComponent: PolicyNegotiationAdminPointService;
let negotiationConsumerAdminPointComponent: PolicyNegotiationAdminPointService;
let adminPointComponent: PolicyAdministrationPointService;
let informationPointComponent: PolicyInformationPointService;
let testIdentityProvider: string;
let testIdentityConsumer: string;
let mockOffer: IDataspaceProtocolOffer;
let mockNegotiator: IPolicyNegotiator;
let mockPolicyRequester: IPolicyRequester;
let mockTrustComponent: ITrustComponent;

const providerOrigin = "http://localhost:3000";
const consumerOrigin = "http://localhost:4000";

/**
 * Helper to create a remote component that forwards calls to the target service with the correct origin.
 * @param target The target service to forward calls to
 * @param targetOrigin The origin to use for calls to the target service
 * @returns A remote component that forwards calls to the target service with the correct origin
 */
function createRemoteComponent(
	target: PolicyNegotiationPointService,
	targetOrigin: string
): IPolicyNegotiationPointComponent {
	return {
		className: () => "TestRemotePolicyNegotiationPointComponent",
		getNegotiation: async (id, trustPayload) => target.getNegotiation(id, trustPayload),
		sendRequestToProvider: async (url, requesterType, odrlOfferId, publicOrigin) =>
			target.sendRequestToProvider(url, requesterType, odrlOfferId, publicOrigin),
		requestFromConsumer: async (message, trustPayload) =>
			target.requestFromConsumer(message, trustPayload),
		offerFromProvider: async (message, trustPayload) =>
			target.offerFromProvider(message, trustPayload),
		agreementFromProvider: async (message, trustPayload) =>
			target.agreementFromProvider(message, trustPayload),
		agreementVerificationFromConsumer: async (message, trustPayload) =>
			target.agreementVerificationFromConsumer(message, trustPayload),
		event: async (message, destination, trustPayload) =>
			target.event(message, destination, trustPayload),
		terminate: async (message, destination, trustPayload) =>
			target.terminate(message, destination, trustPayload),
		sendTerminateToConsumer: async (callbackAddress, providerPid, consumerPid) =>
			target.sendTerminateToConsumer(callbackAddress, providerPid, consumerPid)
	};
}

/**
 * Helper to resolve remote components based on the url.
 * This is set in the beforeEach of the tests to return the correct component based on the url.
 * @throws If the url is not recognized or if the resolver is not configured.
 */
let remoteComponentResolver: (params: {
	endpoint: string;
}) => IPolicyNegotiationPointComponent = () => {
	throw new Error("Remote negotiation component resolver not configured");
};

/**
 * Helper to wait for a negotiation to reach a specific state.
 * @param storage The storage connector for the negotiation
 * @param state The state to wait for
 * @param entity The entity type, either "consumer" or "provider"
 */
async function waitForState(
	storage: MemoryEntityStorageConnector<PolicyNegotiation>,
	state: string,
	entity: "consumer" | "provider"
): Promise<void> {
	for (let i = 0; i < 30; i++) {
		const store = await storage.getStore();
		if (store[0].state === state) {
			return;
		}
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	console.debug((await storage.getStore())[0]);
	throw new Error(`Timeout waiting for state ${state} for ${entity}`);
}

let testOrganizationId: string;

describe("PolicyNegotiationPointService", () => {
	beforeEach(async () => {
		Factory.clearFactories();
		vi.clearAllMocks();

		initSchemaLogging();
		initSchemaScheduler();
		initSchemaPolicyAdministrationPoint();
		initSchemaVault();
		initSchemaIdentity();
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>(),
			config: { storageKey: "log-entry" }
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());

		EntityStorageConnectorFactory.register(
			"scheduled-task",
			() =>
				new MemoryEntityStorageConnector<ScheduledTask>({
					entitySchema: nameof<ScheduledTask>(),
					config: { storageKey: "scheduled-task" }
				})
		);

		const taskSchedulerComponent = new TaskSchedulerService({ config: { intervalMs: 500 } });
		ComponentFactory.register("task-scheduler", () => taskSchedulerComponent);

		EntityStorageConnectorFactory.register(
			"vault-key",
			() =>
				new MemoryEntityStorageConnector<VaultKey>({
					entitySchema: nameof<VaultKey>(),
					config: { storageKey: "vault-key" }
				})
		);
		const secretEntityStorage = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>(),
			config: { storageKey: "vault-secret" }
		});
		EntityStorageConnectorFactory.register("vault-secret", () => secretEntityStorage);

		const vaultConnector = new EntityStorageVaultConnector();
		VaultConnectorFactory.register("vault", () => vaultConnector);

		const identityDocumentEntityStorage = new MemoryEntityStorageConnector<IdentityDocument>({
			entitySchema: nameof<IdentityDocument>(),
			config: { storageKey: "identity-document" }
		});
		EntityStorageConnectorFactory.register(
			"identity-document",
			() => identityDocumentEntityStorage
		);

		identityConnector = new EntityStorageIdentityConnector();
		IdentityConnectorFactory.register("identity", () => identityConnector);

		const docProvider = await identityConnector.createDocument("test-controller");
		testIdentityProvider = docProvider.id;
		await identityConnector.addVerificationMethod(
			"test-controller",
			docProvider.id,
			"verificationMethod",
			"node-authentication-assertion"
		);

		const docConsumer = await identityConnector.createDocument("test-controller");
		testIdentityConsumer = docConsumer.id;
		await identityConnector.addVerificationMethod(
			"test-controller",
			docConsumer.id,
			"verificationMethod",
			"node-authentication-assertion"
		);

		mockOffer = {
			"@context": OdrlContexts.Context,
			"@type": OdrlTypes.Offer,
			"@id": "urn:policy:offer-1",
			assigner: testIdentityProvider
		};

		odrlPolicyMemoryEntityStorage = new MemoryEntityStorageConnector<OdrlPolicy>({
			entitySchema: nameof<OdrlPolicy>(),
			config: { storageKey: "odrl-policy" }
		});
		EntityStorageConnectorFactory.register("odrl-policy", () => odrlPolicyMemoryEntityStorage);

		policyNegotiationProviderMemoryEntityStorage =
			new MemoryEntityStorageConnector<PolicyNegotiation>({
				entitySchema: nameof<PolicyNegotiation>(),
				config: { storageKey: "policy-negotiation-provider" }
			});
		EntityStorageConnectorFactory.register(
			"policy-negotiation-provider",
			() => policyNegotiationProviderMemoryEntityStorage
		);

		policyNegotiationConsumerMemoryEntityStorage =
			new MemoryEntityStorageConnector<PolicyNegotiation>({
				entitySchema: nameof<PolicyNegotiation>(),
				config: { storageKey: "policy-negotiation-consumer" }
			});
		EntityStorageConnectorFactory.register(
			"policy-negotiation-consumer",
			() => policyNegotiationConsumerMemoryEntityStorage
		);

		ComponentFactory.register("platform", () => ({
			className: () => "MockPlatformComponent",
			isMultiTenant: () => false,
			execute: async (method: () => Promise<void>) => method(),
			getLocalOriginContext: async (url: string) => undefined
		}));

		negotiationProviderAdminPointComponent = new PolicyNegotiationAdminPointService({
			policyNegotiationEntityStorageType: "policy-negotiation-provider"
		});
		ComponentFactory.register(
			"policy-negotiation-provider-admin-point",
			() => negotiationProviderAdminPointComponent
		);

		negotiationConsumerAdminPointComponent = new PolicyNegotiationAdminPointService({
			policyNegotiationEntityStorageType: "policy-negotiation-consumer"
		});
		ComponentFactory.register(
			"policy-negotiation-consumer-admin-point",
			() => negotiationConsumerAdminPointComponent
		);

		adminPointComponent = new PolicyAdministrationPointService();
		ComponentFactory.register("policy-administration-point", () => adminPointComponent);

		informationPointComponent = new PolicyInformationPointService();
		ComponentFactory.register("policy-information-point", () => informationPointComponent);

		ComponentFactory.register("pnp-remote", (args?: unknown) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (!Is.string((args as any)?.endpoint)) {
				throw new TypeError("pnp-remote expects an argument of { endpoint: string }");
			}
			return remoteComponentResolver(args as { endpoint: string });
		});

		mockPolicyRequester = {
			className: () => "MockPolicyRequester",
			offer: vi.fn(async (negotiationId, offer) => true),
			agreement: vi.fn(async (negotiationId, agreement) => true),
			finalised: vi.fn(async negotiationId => {}),
			terminated: vi.fn(async negotiationId => {})
		};

		mockNegotiator = {
			className: () => "MockPolicyNegotiator",
			supportsOffer: vi.fn((offer: IDataspaceProtocolOffer) => true),
			handleOffer: vi.fn(async (offer: IDataspaceProtocolOffer) => ({
				accepted: true,
				interventionRequired: false
			})),
			createAgreement: vi.fn(async (offer: IDataspaceProtocolOffer) => ({
				"@context": OdrlContexts.Context,
				"@type": OdrlTypes.Agreement,
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			}))
		};

		mockTrustComponent = {
			className: () => "MockTrustComponent",
			generate: vi.fn(
				async (identity: string, generatorType?: string, info?: { [key: string]: unknown }) =>
					`token:${identity}`
			),
			verify: vi.fn(async (payload: unknown, overrideVerifiers?: string[]) => ({
				verified: true,
				info: { identity: (payload as string).slice(6) }
			}))
		};

		ComponentFactory.register("trust", () => mockTrustComponent);

		testOrganizationId = testIdentityConsumer;
		// Signing identity is the node DID
		ContextIdStore.getContextIds = vi.fn().mockImplementation(() => ({
			[ContextIdKeys.Node]: testIdentityConsumer,
			[ContextIdKeys.Organization]: testOrganizationId,
			[HttpContextIdKeys.PublicOrigin]: providerOrigin
		}));
	});

	afterEach(async () => {
		vi.restoreAllMocks();
		await loggingMemoryEntityStorage?.teardown();
		await odrlPolicyMemoryEntityStorage?.teardown();
		await policyNegotiationProviderMemoryEntityStorage?.teardown();
		await policyNegotiationConsumerMemoryEntityStorage?.teardown();
	});

	test("can create the service", async () => {
		const policyNegotiationPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});
		expect(policyNegotiationPoint).toBeInstanceOf(PolicyNegotiationPointService);
	});

	test("can request a new negotiation and fail with no available requester", async () => {
		const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

		const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-consumer-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});

		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});
		providerPoints.provider = policyNegotiationProviderPoint;
		providerPoints.consumer = policyNegotiationConsumerPoint;
		remoteComponentResolver = (params: { endpoint: string }) => {
			if (params.endpoint.startsWith(providerOrigin)) {
				return createRemoteComponent(providerPoints.provider, providerOrigin);
			}
			if (params.endpoint.startsWith(consumerOrigin)) {
				return createRemoteComponent(providerPoints.consumer, consumerOrigin);
			}
			throw new TypeError(`Unknown remote url ${params.endpoint}`);
		};

		await expect(
			policyNegotiationConsumerPoint.sendRequestToProvider(
				"http://localhost:3000",
				"requester-1",
				"urn:policy:offer-1",
				"http://localhost:4000"
			)
		).rejects.toMatchObject({
			name: "NotFoundError",
			message: "policyNegotiationPointService.noRequesterFound"
		});
	});

	test("can request a new negotiation and fail with no available offer", async () => {
		const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

		const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-consumer-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});

		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});
		providerPoints.provider = policyNegotiationProviderPoint;
		providerPoints.consumer = policyNegotiationConsumerPoint;
		remoteComponentResolver = (params: { endpoint: string }) => {
			if (params.endpoint.startsWith(providerOrigin)) {
				return createRemoteComponent(providerPoints.provider, providerOrigin);
			}
			if (params.endpoint.startsWith(consumerOrigin)) {
				return createRemoteComponent(providerPoints.consumer, consumerOrigin);
			}
			throw new TypeError(`Unknown remote url ${params.endpoint}`);
		};

		testOrganizationId = testIdentityConsumer;

		PolicyRequesterFactory.register("requester-1", () => mockPolicyRequester);

		await expect(
			policyNegotiationConsumerPoint.sendRequestToProvider(
				"http://localhost:3000",
				"requester-1",
				"urn:policy:offer-1",
				"http://localhost:4000"
			)
		).rejects.toMatchObject({
			name: "GeneralError",
			message: "policyNegotiationPointService.noOfferFound"
		});
	});

	test("can request a new negotiation and fail with no available negotiator", async () => {
		const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

		const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-consumer-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});

		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});
		providerPoints.provider = policyNegotiationProviderPoint;
		providerPoints.consumer = policyNegotiationConsumerPoint;
		remoteComponentResolver = (params: { endpoint: string }) => {
			if (params.endpoint.startsWith(providerOrigin)) {
				return createRemoteComponent(providerPoints.provider, providerOrigin);
			}
			if (params.endpoint.startsWith(consumerOrigin)) {
				return createRemoteComponent(providerPoints.consumer, consumerOrigin);
			}
			throw new TypeError(`Unknown remote url ${params.endpoint}`);
		};

		PolicyRequesterFactory.register("requester-1", () => mockPolicyRequester);

		await adminPointComponent.create(mockOffer);

		await expect(
			policyNegotiationConsumerPoint.sendRequestToProvider(
				"http://localhost:3000",
				"requester-1",
				"urn:policy:offer-1",
				"http://localhost:4000"
			)
		).rejects.toMatchObject({
			name: "GeneralError",
			message: "policyNegotiationPointService.noNegotiatorFound"
		});
	});

	test("can request a new negotiation", async () => {
		const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

		const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-consumer-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});

		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});
		providerPoints.provider = policyNegotiationProviderPoint;
		providerPoints.consumer = policyNegotiationConsumerPoint;
		remoteComponentResolver = (params: { endpoint: string }) => {
			if (params.endpoint.startsWith(providerOrigin)) {
				return createRemoteComponent(providerPoints.provider, providerOrigin);
			}
			if (params.endpoint.startsWith(consumerOrigin)) {
				return createRemoteComponent(providerPoints.consumer, consumerOrigin);
			}
			throw new TypeError(`Unknown remote url ${params.endpoint}`);
		};

		PolicyRequesterFactory.register("requester-1", () => mockPolicyRequester);
		await adminPointComponent.create(mockOffer);
		PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

		const consumerPid = await policyNegotiationConsumerPoint.sendRequestToProvider(
			"http://localhost:3000",
			"requester-1",
			"urn:policy:offer-1",
			"http://localhost:4000"
		);

		const consumerStore = await policyNegotiationConsumerMemoryEntityStorage.getStore();
		expect(consumerStore).toHaveLength(1);
		const providerStore = await policyNegotiationProviderMemoryEntityStorage.getStore();
		expect(providerStore).toHaveLength(1);

		expect(consumerStore[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-1",
			state: "REQUESTED"
		});
		expect(consumerStore[0].trustVerificationInfo).toBeUndefined();

		expect(providerStore[0]).toMatchObject({
			id: consumerStore[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": PAP_STORED_POLICY_CONTEXT,
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			state: "REQUESTED"
		});
		expect(providerStore[0].trustVerificationInfo).toEqual({
			identity: testIdentityConsumer
		});
	});

	test("can perform the whole negotiation lifecycle", async () => {
		const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

		const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-consumer-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});

		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});
		providerPoints.provider = policyNegotiationProviderPoint;
		providerPoints.consumer = policyNegotiationConsumerPoint;
		remoteComponentResolver = (params: { endpoint: string }) => {
			if (params.endpoint.startsWith(providerOrigin)) {
				return createRemoteComponent(providerPoints.provider, providerOrigin);
			}
			if (params.endpoint.startsWith(consumerOrigin)) {
				return createRemoteComponent(providerPoints.consumer, consumerOrigin);
			}
			throw new TypeError(`Unknown remote url ${params.endpoint}`);
		};

		PolicyRequesterFactory.register("requester-2", () => mockPolicyRequester);
		await adminPointComponent.create(mockOffer);
		PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

		const consumerPid = await policyNegotiationConsumerPoint.sendRequestToProvider(
			"http://localhost:3000",
			"requester-2",
			"urn:policy:offer-1",
			"http://localhost:4000"
		);

		const consumerStore = await policyNegotiationConsumerMemoryEntityStorage.getStore();
		expect(consumerStore).toHaveLength(1);
		const providerStore = await policyNegotiationProviderMemoryEntityStorage.getStore();
		expect(providerStore).toHaveLength(1);

		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "ACCEPTED", "consumer");

		const consumerStore2 = await policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore2 = await policyNegotiationProviderMemoryEntityStorage.getStore();

		// The consumer has ACCEPTED the offer
		expect(consumerStore2[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore2[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": PAP_STORED_POLICY_CONTEXT,
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			state: "ACCEPTED"
		});

		// After offerFromProvider, trustVerificationInfo records the signing
		// identity of the responder. That's the node DID from the
		// current context. Both consumer and provider services share a single
		// in-memory mock here, so the signer surfaces as `testIdentityConsumer`
		// — the node DID configured in the global ContextIdStore mock. The
		// production scenario has distinct node DIDs per side; the test
		// validates the lifecycle, not the cryptographic separation.
		expect(consumerStore2[0].trustVerificationInfo).toEqual({
			identity: testIdentityConsumer
		});

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "OFFERED", "provider");

		const consumerStore3 = await policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore3 = await policyNegotiationProviderMemoryEntityStorage.getStore();

		// The provider has not yet received the ACCEPTED state, so is still in OFFERED state
		expect(providerStore3[0]).toMatchObject({
			id: consumerStore3[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": PAP_STORED_POLICY_CONTEXT,
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			state: "OFFERED"
		});

		// We wait for the consumer to respond with the ACCEPTED state
		await waitForState(policyNegotiationProviderMemoryEntityStorage, "ACCEPTED", "provider");

		const consumerStore4 = await policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore4 = await policyNegotiationProviderMemoryEntityStorage.getStore();

		// Now the provider should also have the ACCEPTED state
		expect(providerStore4[0]).toMatchObject({
			id: consumerStore4[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": PAP_STORED_POLICY_CONTEXT,
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			state: "ACCEPTED"
		});

		// Now we wait for the provider to send the AGREED state
		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "AGREED", "consumer");

		const consumerStore5 = await policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore5 = await policyNegotiationProviderMemoryEntityStorage.getStore();

		// The consumer has now received the AGREED state
		expect(consumerStore5[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore5[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": PAP_STORED_POLICY_CONTEXT,
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": OdrlContexts.Context,
				"@type": "Agreement",
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "AGREED"
		});

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "AGREED", "provider");

		const consumerStore6 = await policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore6 = await policyNegotiationProviderMemoryEntityStorage.getStore();

		// The provider has now also set the AGREED state
		expect(providerStore6[0]).toMatchObject({
			id: consumerStore6[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": PAP_STORED_POLICY_CONTEXT,
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": OdrlContexts.Context,
				"@type": "Agreement",
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "AGREED"
		});

		// Now we wait for the consumer to VERIFIED the agreement
		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "VERIFIED", "consumer");

		const consumerStore7 = await policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore7 = await policyNegotiationProviderMemoryEntityStorage.getStore();

		// The consumer has now VERIFIED the agreement
		expect(consumerStore7[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore7[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": PAP_STORED_POLICY_CONTEXT,
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": OdrlContexts.Context,
				"@type": "Agreement",
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "VERIFIED"
		});

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "FINALIZED", "provider");

		const consumerStore8 = await policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore8 = await policyNegotiationProviderMemoryEntityStorage.getStore();

		expect(providerStore8[0]).toMatchObject({
			id: consumerStore8[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": PAP_STORED_POLICY_CONTEXT,
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": OdrlContexts.Context,
				"@type": "Agreement",
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "FINALIZED"
		});

		// Now we wait for the consumer to received the FINALIZED state
		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "FINALIZED", "consumer");

		const consumerStore9 = await policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore9 = await policyNegotiationProviderMemoryEntityStorage.getStore();

		expect(consumerStore9[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore9[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": PAP_STORED_POLICY_CONTEXT,
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": OdrlContexts.Context,
				"@type": "Agreement",
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "FINALIZED"
		});

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "FINALIZED", "provider");

		const consumerStore10 = await policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore10 = await policyNegotiationProviderMemoryEntityStorage.getStore();

		expect(providerStore10[0]).toMatchObject({
			id: consumerStore10[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": PAP_STORED_POLICY_CONTEXT,
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": OdrlContexts.Context,
				"@type": "Agreement",
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "FINALIZED"
		});

		expect(mockNegotiator.supportsOffer).toHaveBeenCalledTimes(2);
		expect(mockNegotiator.createAgreement).toHaveBeenCalledTimes(1);
		expect(mockNegotiator.handleOffer).toHaveBeenCalledTimes(1);

		expect(mockPolicyRequester.offer).toHaveBeenCalledTimes(1);
		expect(mockPolicyRequester.offer).toHaveBeenCalledWith(
			consumerPid,
			expect.objectContaining({ "@type": "Offer" })
		);

		expect(mockPolicyRequester.agreement).toHaveBeenCalledTimes(1);
		expect(mockPolicyRequester.agreement).toHaveBeenCalledWith(
			consumerPid,
			expect.objectContaining({ "@type": "Agreement" })
		);

		expect(mockPolicyRequester.finalised).toHaveBeenCalledTimes(1);
		expect(mockPolicyRequester.finalised).toHaveBeenCalledWith(consumerPid);

		expect(mockPolicyRequester.terminated).toHaveBeenCalledTimes(0);
	});

	test("trust data from negotiation initial payload is stored on the finalized PAP agreement", async () => {
		const TRUST_PAYLOAD: { [key: string]: IJsonLdNodeObject } = {
			"did:example:trust": { "@type": "TrustRecord" }
		};

		// Override verify to return trust data in the info object
		mockTrustComponent.verify = vi.fn(async (payload: unknown) => ({
			verified: true,
			info: {
				identity: (payload as string).slice(6),
				data: TRUST_PAYLOAD
			}
		}));

		const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

		const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-consumer-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});

		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});
		providerPoints.provider = policyNegotiationProviderPoint;
		providerPoints.consumer = policyNegotiationConsumerPoint;
		remoteComponentResolver = (params: { endpoint: string }) => {
			if (params.endpoint.startsWith(providerOrigin)) {
				return createRemoteComponent(providerPoints.provider, providerOrigin);
			}
			if (params.endpoint.startsWith(consumerOrigin)) {
				return createRemoteComponent(providerPoints.consumer, consumerOrigin);
			}
			throw new TypeError(`Unknown remote url ${params.endpoint}`);
		};

		PolicyRequesterFactory.register("requester-trust", () => mockPolicyRequester);
		await adminPointComponent.create(mockOffer);
		PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

		await policyNegotiationConsumerPoint.sendRequestToProvider(
			"http://localhost:3000",
			"requester-trust",
			"urn:policy:offer-1",
			"http://localhost:4000"
		);

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "FINALIZED", "provider");
		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "FINALIZED", "consumer");

		// The agreement ID is allocated by mockNegotiator.createAgreement
		const agreement = await adminPointComponent.getAgreement("urn:policy:agreement-1");

		expect(agreement.trustData).toEqual(TRUST_PAYLOAD);
	});

	test("getNegotiation should return error when caller is not a negotiation party", async () => {
		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});

		PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

		await negotiationProviderAdminPointComponent.set({
			id: "provider-pid-auth-test",
			correlationId: "consumer-pid-auth-test",
			dateCreated: new Date(Date.now()).toISOString(),
			offer: mockOffer,
			state: "REQUESTED",
			callbackAddress: "http://localhost:4000/callback",
			organizationIdentity: testIdentityProvider,
			trustVerificationInfo: {
				identity: testIdentityConsumer
			},
			handlerId: "MockPolicyNegotiator"
		});

		const unauthorizedToken = "token:did:iota:unauthorized-node";
		const result = await policyNegotiationProviderPoint.getNegotiation(
			"provider-pid-auth-test",
			unauthorizedToken
		);

		expect(result["@type"]).toBe("ContractNegotiationError");
		if ("code" in result) {
			expect(result.code).toBe("policyNegotiationPointService.callerNotAuthorizedForNegotiation");
		}
	});

	test("getNegotiation should succeed when caller is a negotiation party", async () => {
		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			policyNegotiationPointRemoteComponentType: "pnp-remote",
			config: { callbackPath: "/callback" }
		});

		PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

		await negotiationProviderAdminPointComponent.set({
			id: "provider-pid-auth-test-2",
			correlationId: "consumer-pid-auth-test-2",
			dateCreated: new Date(Date.now()).toISOString(),
			offer: mockOffer,
			state: "REQUESTED",
			callbackAddress: "http://localhost:4000/callback",
			organizationIdentity: testIdentityProvider,
			trustVerificationInfo: {
				identity: testIdentityConsumer
			},
			handlerId: "MockPolicyNegotiator"
		});

		const consumerToken = `token:${testIdentityConsumer}`;
		const result = await policyNegotiationProviderPoint.getNegotiation(
			"provider-pid-auth-test-2",
			consumerToken
		);

		expect(result["@type"]).toBe("ContractNegotiation");
	});

	describe("tenant-token encryption", () => {
		const TEST_NODE_ID = "did:iota:test-node";
		const TEST_TENANT_ID = "tenant-A";

		const setupTenantContextIds = (): void => {
			ContextIdStore.getContextIds = vi.fn().mockImplementation(() => ({
				[ContextIdKeys.Node]: TEST_NODE_ID,
				[ContextIdKeys.Tenant]: TEST_TENANT_ID,
				[ContextIdKeys.Organization]: testOrganizationId
			}));
		};

		test("captures tenantId on the stored negotiation when sending an outbound request", async () => {
			setupTenantContextIds();
			let capturedRequest: unknown;
			const mockComponent = {
				className: () => "TestRemote",
				requestFromConsumer: async (message: unknown) => {
					capturedRequest = message;
					return {
						"@context": [DataspaceProtocolContexts.Context],
						"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiation,
						providerPid: "provider-pid-from-test",
						consumerPid: "ignored",
						state: "REQUESTED"
					};
				}
			} as unknown as IPolicyNegotiationPointComponent;
			remoteComponentResolver = (): IPolicyNegotiationPointComponent => mockComponent;

			PolicyRequesterFactory.register("MockPolicyRequester", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			const consumerPid = await consumer.sendRequestToProvider(
				providerOrigin,
				"MockPolicyRequester",
				"urn:policy:offer-1",
				consumerOrigin
			);

			expect(capturedRequest).toBeDefined();
			const stored = await policyNegotiationConsumerMemoryEntityStorage.get(consumerPid);
			expect(stored).toBeDefined();
		});

		test("adds organization as a query parameter to the outbound callback address", async () => {
			setupTenantContextIds();

			let capturedCallbackAddress: string | undefined;
			const mockComponent = {
				className: () => "TestRemote",
				requestFromConsumer: async (message: { callbackAddress?: string }) => {
					capturedCallbackAddress = message.callbackAddress;
					return {
						"@context": [DataspaceProtocolContexts.Context],
						"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiation,
						providerPid: "provider-pid-from-test",
						consumerPid: "ignored",
						state: "REQUESTED"
					};
				}
			} as unknown as IPolicyNegotiationPointComponent;
			remoteComponentResolver = (): IPolicyNegotiationPointComponent => mockComponent;

			PolicyRequesterFactory.register("MockPolicyRequester", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await consumer.sendRequestToProvider(
				providerOrigin,
				"MockPolicyRequester",
				"urn:policy:offer-1",
				consumerOrigin
			);

			expect(capturedCallbackAddress).toBe(
				`${consumerOrigin}/callback?${ContextIdKeys.Organization}=${encodeURIComponent(testIdentityConsumer)}`
			);
		});

		test("adds organization to the callback address regardless of tenant context", async () => {
			// Does NOT call setupTenantContextIds() — verifies the organisation-id
			// query parameter is added even when no tenant key is present in context.

			let capturedCallbackAddress: string | undefined;
			const mockComponent = {
				className: () => "TestRemote",
				requestFromConsumer: async (message: { callbackAddress?: string }) => {
					capturedCallbackAddress = message.callbackAddress;
					return {
						"@context": [DataspaceProtocolContexts.Context],
						"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiation,
						providerPid: "provider-pid-from-test",
						consumerPid: "ignored",
						state: "REQUESTED"
					};
				}
			} as unknown as IPolicyNegotiationPointComponent;
			remoteComponentResolver = (): IPolicyNegotiationPointComponent => mockComponent;

			PolicyRequesterFactory.register("MockPolicyRequester", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await consumer.sendRequestToProvider(
				providerOrigin,
				"MockPolicyRequester",
				"urn:policy:offer-1",
				consumerOrigin
			);

			expect(capturedCallbackAddress).toBe(
				`${consumerOrigin}/callback?${ContextIdKeys.Organization}=${encodeURIComponent(testIdentityConsumer)}`
			);
		});
	});

	describe("state-guard checks on async send methods", () => {
		function buildServices(): {
			provider: PolicyNegotiationPointService;
			consumer: PolicyNegotiationPointService;
		} {
			const provider = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			const services = { provider, consumer };
			remoteComponentResolver = (params: { endpoint: string }) => {
				if (params.endpoint.startsWith(providerOrigin)) {
					return createRemoteComponent(services.provider, providerOrigin);
				}
				if (params.endpoint.startsWith(consumerOrigin)) {
					return createRemoteComponent(services.consumer, consumerOrigin);
				}
				throw new TypeError(`Unknown remote url ${params.endpoint}`);
			};
			return services;
		}

		test("sendOfferToConsumer aborts silently when negotiation no longer exists", async () => {
			// sendRequestToProvider completes synchronously (requestFromConsumer on the real
			// provider runs inline) and schedules sendOfferToConsumer via setTimeout(100).
			// We remove the provider negotiation in that ~100 ms window so checkNegotiationInState
			// throws NotFoundError and isStateGuardError returns it silently.
			const { consumer } = buildServices();
			PolicyRequesterFactory.register("requester-sg-1", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const offerSpy = vi.spyOn(consumer, "offerFromProvider");

			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-sg-1",
				"urn:policy:offer-1",
				consumerOrigin
			);

			// getStore() returns a copy; use the connector's remove() to delete from the live store
			const snapshot = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(snapshot).toHaveLength(1);
			await policyNegotiationProviderMemoryEntityStorage.remove(snapshot[0].id);

			await new Promise(resolve => setTimeout(resolve, 300));

			expect(await policyNegotiationProviderMemoryEntityStorage.getStore()).toHaveLength(0);
			expect(offerSpy).not.toHaveBeenCalled();
		});

		test("sendOfferToConsumer aborts silently when negotiation is in wrong state", async () => {
			const { consumer } = buildServices();
			PolicyRequesterFactory.register("requester-sg-2", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const offerSpy = vi.spyOn(consumer, "offerFromProvider");

			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-sg-2",
				"urn:policy:offer-1",
				consumerOrigin
			);

			// Use the admin point service to update the live store (getStore() returns a copy)
			const snapshot = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(snapshot).toHaveLength(1);
			await negotiationProviderAdminPointComponent.set({
				...snapshot[0],
				state: DataspaceProtocolContractNegotiationStateType.TERMINATED
			});

			await new Promise(resolve => setTimeout(resolve, 300));

			// sendOfferToConsumer must have aborted: state stays TERMINATED, not overwritten with OFFERED
			const final = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(final[0].state).toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
			expect(offerSpy).not.toHaveBeenCalled();
		});

		test("sendAgreementToConsumer aborts silently when negotiation is in wrong state", async () => {
			// After event() accepts the ACCEPTED event on the provider (state → ACCEPTED),
			// sendAgreementToConsumer is scheduled with a 100 ms delay.
			// We spy on provider.event and immediately flip provider state to TERMINATED inside
			// the spy so that sendAgreementToConsumer's checkNegotiationInState sees invalidState.
			const { provider, consumer } = buildServices();
			PolicyRequesterFactory.register("requester-sg-3", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const originalEvent = provider.event.bind(provider);
			let acceptedHandled = false;
			vi.spyOn(provider, "event").mockImplementation(async (message, destination, trustPayload) => {
				const result = await originalEvent(message, destination, trustPayload);
				if (!acceptedHandled && message.event === "ACCEPTED" && destination === "provider") {
					acceptedHandled = true;
					const providerSnapshot = await policyNegotiationProviderMemoryEntityStorage.getStore();
					if (providerSnapshot.length > 0) {
						await negotiationProviderAdminPointComponent.set({
							...providerSnapshot[0],
							state: DataspaceProtocolContractNegotiationStateType.TERMINATED
						});
					}
				}
				return result;
			});

			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-sg-3",
				"urn:policy:offer-1",
				consumerOrigin
			);

			await new Promise(resolve => setTimeout(resolve, 600));

			// Provider must stay TERMINATED, never move to AGREED
			const final = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(final.length).toBeGreaterThan(0);
			expect(final[0].state).toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
		});

		test("sends the agreement with the provider's organization in the callback address", async () => {
			// Regression for the organization-identifiers refactor: the outbound
			// ContractAgreementMessage's callbackAddress — which the consumer uses to send
			// the verification BACK to the provider — must carry the PROVIDER's
			// organization id (the routing token), not the consumer's
			// (trustVerificationInfo.identity). Both sides share the same mocked context in
			// this suite, so the provider record's organization is flipped to the provider
			// identity just before the ACCEPTED event triggers sendAgreementToConsumer.
			const { provider, consumer } = buildServices();
			PolicyRequesterFactory.register("requester-agreement-org", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const originalEvent = provider.event.bind(provider);
			vi.spyOn(provider, "event").mockImplementation(async (message, destination, trustPayload) => {
				if (message.event === "ACCEPTED" && destination === "provider") {
					const providerSnapshot = await policyNegotiationProviderMemoryEntityStorage.getStore();
					if (providerSnapshot.length > 0) {
						await negotiationProviderAdminPointComponent.set({
							...providerSnapshot[0],
							organizationIdentity: testIdentityProvider
						});
					}
				}
				return originalEvent(message, destination, trustPayload);
			});

			let capturedCallbackAddress: string | undefined;
			const originalAgreement = consumer.agreementFromProvider.bind(consumer);
			vi.spyOn(consumer, "agreementFromProvider").mockImplementation(
				async (message, trustPayload) => {
					capturedCallbackAddress = message.callbackAddress;
					return originalAgreement(message, trustPayload);
				}
			);

			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-agreement-org",
				"urn:policy:offer-1",
				consumerOrigin
			);

			// Wait for the agreement push to reach the consumer (the flipped provider
			// organization intentionally diverges from this suite's shared trust context,
			// so later transitions are not awaited here).
			for (let i = 0; i < 30 && Is.undefined(capturedCallbackAddress); i++) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}

			expect(capturedCallbackAddress).toBeDefined();
			expect(capturedCallbackAddress).toContain(
				`${ContextIdKeys.Organization}=${encodeURIComponent(testIdentityProvider)}`
			);
			expect(capturedCallbackAddress).not.toContain(encodeURIComponent(testIdentityConsumer));
		});

		test("sendAgreementVerificationToProvider aborts silently when negotiation is in wrong state", async () => {
			// After agreementFromProvider sets consumer state to AGREED and schedules
			// sendAgreementVerificationToProvider (100 ms delay), we flip consumer state to
			// TERMINATED so the async callback aborts via isStateGuardError.
			const { consumer } = buildServices();
			PolicyRequesterFactory.register("requester-sg-4", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const originalAgreement = consumer.agreementFromProvider.bind(consumer);
			let agreedHandled = false;
			vi.spyOn(consumer, "agreementFromProvider").mockImplementation(
				async (message, trustPayload) => {
					const result = await originalAgreement(message, trustPayload);
					if (!agreedHandled) {
						agreedHandled = true;
						const consumerSnapshot = await policyNegotiationConsumerMemoryEntityStorage.getStore();
						if (
							consumerSnapshot.length > 0 &&
							consumerSnapshot[0].state === DataspaceProtocolContractNegotiationStateType.AGREED
						) {
							await negotiationConsumerAdminPointComponent.set({
								...consumerSnapshot[0],
								state: DataspaceProtocolContractNegotiationStateType.TERMINATED
							});
						}
					}
					return result;
				}
			);

			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-sg-4",
				"urn:policy:offer-1",
				consumerOrigin
			);

			await new Promise(resolve => setTimeout(resolve, 800));

			// Consumer must stay TERMINATED, never move to VERIFIED
			const final = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(final.length).toBeGreaterThan(0);
			expect(final[0].state).toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
		});

		test("terminateIfResponseError does not resurrect record deleted before it runs", async () => {
			// Scenario: admin DELETE lands during the peer HTTP round-trip (the async gap
			// between the provider dispatching the offer and receiving the error back).
			// By the time terminateIfResponseError runs, the record is already gone.
			// setIfExists() detects this via get() → NotFoundError and returns without writing.
			//
			// sendOfferToConsumer call sequence on the provider:
			//   checkNegotiationInState (state = REQUESTED → pass)
			//   set() — advance state to OFFERED
			//   offerFromProvider round-trip:
			//     → DELETE fires inside fake consumer callback
			//     → returns ContractNegotiationError
			//   terminateIfResponseError:
			//     setIfExists() → get() → NotFoundError → returns false → no write ✓

			const { provider } = buildServices();
			PolicyRequesterFactory.register("requester-rir-1", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiatorRir", () => mockNegotiator);

			// Fake consumer: deletes the provider record during the round-trip, then rejects.
			remoteComponentResolver = (params: { endpoint: string }) => {
				if (params.endpoint.startsWith(providerOrigin)) {
					return createRemoteComponent(provider, providerOrigin);
				}
				return {
					className: () => "FakeConsumerDeletesAndRejects",
					offerFromProvider: async () => {
						// Simulate admin DELETE landing while the provider awaits this response
						const store = await policyNegotiationProviderMemoryEntityStorage.getStore();
						if (store.length > 0) {
							await policyNegotiationProviderMemoryEntityStorage.remove(store[0].id);
						}
						return {
							"@context": [DataspaceProtocolContexts.Context],
							"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationError,
							providerPid: "urn:provider-pid:rir-1",
							consumerPid: "urn:consumer-pid:rir-1",
							code: "consumer.rejectedOffer",
							reason: [{ "@value": "Offer not acceptable" }]
						};
					},
					requestFromConsumer: async () => {
						throw new Error("unexpected");
					},
					sendRequestToProvider: async () => {
						throw new Error("unexpected");
					},
					agreementFromProvider: async () => {
						throw new Error("unexpected");
					},
					agreementVerificationFromConsumer: async () => {
						throw new Error("unexpected");
					},
					event: async () => {
						throw new Error("unexpected");
					},
					terminate: async () => {
						throw new Error("unexpected");
					},
					sendTerminateToConsumer: async () => {
						throw new Error("unexpected");
					},
					getNegotiation: async () => {
						throw new Error("unexpected");
					}
				};
			};

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-rir-1",
				"urn:policy:offer-1",
				consumerOrigin
			);

			// Wait past the setTimeout(100) + fake offerFromProvider callback
			await new Promise(resolve => setTimeout(resolve, 300));

			// setIfExists() detected the record was gone and returned false.
			// The admin DELETE was respected — no upsert happened.
			const store = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(store).toHaveLength(0);
		});

		test("known limitation: setIfExists() is non-atomic across nodes (TOCTOU) — DELETE between get() and set() can still resurrect", async () => {
			// Documents the residual race window that setIfExists() does NOT eliminate across nodes.
			//
			// The guard is a best-effort check-then-act (get → set). A DELETE that lands
			// after get() resolves but before set() commits causes entity storage's upsert to
			// recreate the deleted record.
			//
			// This race requires real async I/O between the two operations (e.g. a real DB
			// where GET and DELETE can overlap). It is injected here deterministically by
			// intercepting pnap.get() call #2 to delete the record mid-read and return the
			// pre-deletion snapshot, simulating a DB read-then-delete overlap.
			//
			// The assertion toHaveLength(1) is INTENTIONAL — it documents the known limitation.
			// To truly close this race, a storage-layer atomic conditional write is needed.

			const { provider } = buildServices();
			PolicyRequesterFactory.register("requester-toctou-1", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiatorToctou", () => mockNegotiator);

			// Fake consumer: returns ContractNegotiationError to trigger terminateIfResponseError.
			remoteComponentResolver = (params: { endpoint: string }) => {
				if (params.endpoint.startsWith(providerOrigin)) {
					return createRemoteComponent(provider, providerOrigin);
				}
				return {
					className: () => "FakeConsumerRejectsOfferToctou",
					offerFromProvider: async () => ({
						"@context": [DataspaceProtocolContexts.Context],
						"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationError,
						providerPid: "urn:provider-pid:toctou-1",
						consumerPid: "urn:consumer-pid:toctou-1",
						code: "consumer.rejectedOffer",
						reason: [{ "@value": "Offer not acceptable" }]
					}),
					requestFromConsumer: async () => {
						throw new Error("unexpected");
					},
					sendRequestToProvider: async () => {
						throw new Error("unexpected");
					},
					agreementFromProvider: async () => {
						throw new Error("unexpected");
					},
					agreementVerificationFromConsumer: async () => {
						throw new Error("unexpected");
					},
					event: async () => {
						throw new Error("unexpected");
					},
					terminate: async () => {
						throw new Error("unexpected");
					},
					sendTerminateToConsumer: async () => {
						throw new Error("unexpected");
					},
					getNegotiation: async () => {
						throw new Error("unexpected");
					}
				};
			};

			// Inject the TOCTOU race: intercept negotiationProviderAdminPointComponent.get()
			// Call #1 — checkNegotiationInState: pass through unchanged.
			// Call #2 — get() inside setIfExists() (terminateIfResponseError path):
			//   return the record (simulates DB read seeing the record before DELETE lands)
			//   then delete it from storage (simulates DELETE completing after the read)
			//   → setIfExists() proceeds to set() → entity storage UPSERT resurrection.
			const originalGet = negotiationProviderAdminPointComponent.get.bind(
				negotiationProviderAdminPointComponent
			);
			const getSpy = vi
				.spyOn(negotiationProviderAdminPointComponent, "get")
				.mockImplementationOnce(async id => originalGet(id))
				.mockImplementationOnce(async id => {
					const result = await originalGet(id);
					const snapshot = await policyNegotiationProviderMemoryEntityStorage.getStore();
					if (snapshot.length > 0) {
						await policyNegotiationProviderMemoryEntityStorage.remove(snapshot[0].id);
					}
					return result;
				});

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-toctou-1",
				"urn:policy:offer-1",
				consumerOrigin
			);

			await new Promise(resolve => setTimeout(resolve, 300));

			getSpy.mockRestore();

			// KNOWN LIMITATION (toHaveLength(1) is intentional):
			// The in-process Mutex (from @twin.org/core) serialises remove() and setIfExists()
			// when both go through the service. It does NOT protect against a DELETE that
			// arrives at the database layer from outside the process (different node, different
			// DB connection, or a direct storage call — as simulated here by the mock).
			// In that scenario: get() sees the record → DELETE lands at DB level → set() upserts.
			// Closing this fully requires a storage-layer atomic write (Option A from the plan:
			// UPDATE ... WHERE id = ? that no-ops if the row was already deleted).
			const toctouStore = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(toctouStore).toHaveLength(1);
			expect(toctouStore[0].state).toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
			expect(toctouStore[0].code).toBe("consumer.rejectedOffer");
		});

		// -------------------------------------------------------------------------
		// Unrecognized (non-state-guard) failures in async send methods.
		//
		// The three tests above cover the errors isStateGuardError() DOES recognize
		// (NotFoundError / invalidState), which are absorbed silently. These cover an
		// error it does NOT recognize: the outbound callback delivery itself failing.
		// An unreachable callbackAddress is a transport problem, not a negotiation
		// problem; it is logged as a warning and must not terminate the negotiation.
		// A pre-delivery failure (e.g. trust generation) is a different matter and
		// must still terminate — see the last test in this group.
		//
		// Originally reproduced the flaky twin-node endpoints.spec.ts failure ("consumer
		// counter-request" seeing state TERMINATED): its fixture supplies
		// callbackAddress http://127.0.0.1:19999/callback, which nothing listens on.
		// -------------------------------------------------------------------------

		// Origin the buildServices() resolver does not know, so the outbound callback
		// throws TypeError("Unknown remote url ...") — a deterministic stand-in for the
		// connection-refused a real unreachable callback address produces.
		const unreachableOrigin = "http://localhost:19999";

		test("callback delivery failure does not terminate an otherwise-valid negotiation", async () => {
			const { consumer } = buildServices();
			PolicyRequesterFactory.register("requester-cb-fail", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			// Everything about this negotiation is valid: the offer exists, the negotiator
			// accepts it, and the provider replied REQUESTED. Only the consumer's callback
			// address is unreachable.
			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-cb-fail",
				"urn:policy:offer-1",
				unreachableOrigin
			);

			// Let the scheduled sendOfferToConsumer (setTimeout 100) run to completion.
			await new Promise(resolve => setTimeout(resolve, 300));

			const stored = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(stored).toHaveLength(1);

			// An undeliverable notification is a transport problem, not a negotiation
			// problem. Per the service's own comments a consumer with no callbackAddress
			// simply polls GET /negotiations/admin/:id, so a callback that cannot be
			// delivered leaves the negotiation readable at OFFERED rather than terminating it.
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.OFFERED);
		});

		test("counter-request after a failed callback delivery is accepted", async () => {
			const { provider, consumer } = buildServices();
			PolicyRequesterFactory.register("requester-cb-race", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-cb-race",
				"urn:policy:offer-1",
				unreachableOrigin
			);

			const [initial] = await policyNegotiationProviderMemoryEntityStorage.getStore();
			const providerPid = initial.id;
			const consumerPid = initial.correlationId;

			// Deliberately lose the race the twin-node test loses intermittently: wait for the
			// background job to finish before sending the counter-request. In twin-node this
			// ordering is left to wall-clock chance, which is why it fails only sometimes.
			await new Promise(resolve => setTimeout(resolve, 300));

			const result = await provider.requestFromConsumer(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
					providerPid,
					consumerPid,
					offer: mockOffer
				},
				`token:${testIdentityConsumer}`
			);

			// The counter-request is accepted: nothing the consumer did was invalid, only an
			// unrelated outbound notification failed, which does not terminate the negotiation
			// (see the previous test) and so does not block a subsequent ContractRequestMessage.
			expect(result["@type"]).toBe(DataspaceProtocolContractNegotiationTypes.ContractNegotiation);
		});

		test("negotiation survives when callback delivery succeeds (control)", async () => {
			const { consumer } = buildServices();
			PolicyRequesterFactory.register("requester-cb-ok", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			// Identical to the first test except the callback origin is one the resolver knows,
			// so delivery succeeds. A successful, reachable round-trip keeps cascading past
			// OFFERED (the accepted offer schedules its own event back to the provider, and so
			// on), so the only stable assertion here is that it never lands on TERMINATED —
			// isolating delivery success as the difference from the failure case above.
			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-cb-ok",
				"urn:policy:offer-1",
				consumerOrigin
			);

			await new Promise(resolve => setTimeout(resolve, 300));

			const stored = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(stored).toHaveLength(1);
			expect(stored[0].state).not.toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
		});

		test("pre-delivery failure (e.g. trust generation) still terminates the negotiation", async () => {
			const { consumer } = buildServices();
			PolicyRequesterFactory.register("requester-pre-delivery-fail", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			// First call: the consumer's own outbound request — succeeds normally, as usual.
			// Second call: sendOfferToConsumer's own trust payload, generated before any
			// delivery is attempted — fails. Unlike the delivery-only failures above, this
			// must still terminate the negotiation via setErrorState.
			vi.spyOn(mockTrustComponent, "generate")
				.mockResolvedValueOnce(`token:${testIdentityConsumer}`)
				.mockRejectedValueOnce(new Error("vault unavailable"));

			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-pre-delivery-fail",
				"urn:policy:offer-1",
				consumerOrigin // reachable — delivery itself is never reached in this test
			);

			await new Promise(resolve => setTimeout(resolve, 300));

			const stored = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(stored).toHaveLength(1);
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
		});
	});

	describe("callbackAddress is optional per DSP spec", () => {
		test("requestFromConsumer accepts a ContractRequestMessage with no callbackAddress", async () => {
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);
			await adminPointComponent.create(mockOffer);

			const provider = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			const result = await provider.requestFromConsumer(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
					consumerPid: "urn:contract-negotiation:no-cb-consumer-pid",
					offer: mockOffer
					// callbackAddress intentionally omitted — must be accepted per DSP spec
				},
				`token:${testIdentityConsumer}`
			);

			expect(result["@type"]).toBe(DataspaceProtocolContractNegotiationTypes.ContractNegotiation);
			if ("state" in result) {
				expect(result.state).toBe(DataspaceProtocolContractNegotiationStateType.REQUESTED);
			}

			const stored = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(stored).toHaveLength(1);
			expect(stored[0].callbackAddress).toBeUndefined();
		});

		test("auto-accept path advances state to OFFERED even when no callbackAddress is provided (polling mode)", async () => {
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);
			await adminPointComponent.create(mockOffer);

			const provider = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await provider.requestFromConsumer(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
					consumerPid: "urn:contract-negotiation:no-cb-auto-accept",
					offer: mockOffer
				},
				`token:${testIdentityConsumer}`
			);

			// Wait past the setTimeout(100) the auto-accept path uses to schedule sendOfferToConsumer.
			await new Promise(resolve => setTimeout(resolve, 250));

			// sendOfferToConsumer advances state to OFFERED regardless of callbackAddress;
			// only the HTTP push to the consumer is gated on the callback being present. A polling
			// client observes the OFFERED transition via GET /negotiations/admin/:id.
			const stored = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(stored).toHaveLength(1);
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.OFFERED);
			expect(stored[0].callbackAddress).toBeUndefined();
		});

		test("agreementFromProvider accepts a ContractAgreementMessage with no callbackAddress", async () => {
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			// Pre-seed the consumer-side negotiation so agreementFromProvider can find it
			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-no-cb-agree",
				correlationId: "provider-pid-no-cb-agree",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.ACCEPTED,
				callbackAddress: "http://localhost:3000/callback",
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityProvider },
				handlerId: "MockPolicyNegotiator"
			});

			const result = await consumer.agreementFromProvider(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
					providerPid: "provider-pid-no-cb-agree",
					consumerPid: "consumer-pid-no-cb-agree",
					agreement: {
						"@type": OdrlTypes.Agreement,
						"@id": "urn:policy:agreement-no-cb",
						assigner: testIdentityProvider,
						assignee: testIdentityConsumer
					}
					// callbackAddress intentionally omitted — must be accepted per DSP spec
				},
				`token:${testIdentityProvider}`
			);

			// The fix is verified if we got past the callbackAddress URL guard:
			// pre-fix would have returned a GuardError on `message.callbackAddress`. Any other
			// downstream outcome (success / a different error code) proves the guard accepted
			// the missing field per the DSP spec.
			if (result && "code" in result) {
				expect(result.code).not.toMatch(/callbackAddress/);
				expect(result.code).not.toMatch(/guard\.(stringValue|url)/);
			}
		});

		test("state advances OFFERED → ACCEPTED → AGREED via event() + sendAgreementToConsumer when no callbackAddress was stored (polling mode)", async () => {
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const provider = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			// Seed a provider-side negotiation in OFFERED state with NO callbackAddress.
			// event() advances OFFERED → ACCEPTED inline (only allowed transition for an ACCEPTED
			// event from provider destination) and schedules sendAgreementToConsumer via setTimeout,
			// which advances ACCEPTED → AGREED regardless of callbackAddress.
			await negotiationProviderAdminPointComponent.set({
				id: "provider-pid-poll-agree",
				correlationId: "consumer-pid-poll-agree",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.OFFERED,
				// callbackAddress intentionally absent — polling mode
				organizationIdentity: testIdentityProvider,
				trustVerificationInfo: { identity: testIdentityConsumer },
				handlerId: "MockPolicyNegotiator"
			});

			await provider.event(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
					providerPid: "provider-pid-poll-agree",
					consumerPid: "consumer-pid-poll-agree",
					event: DataspaceProtocolContractNegotiationStateType.ACCEPTED
				},
				"provider",
				`token:${testIdentityConsumer}`
			);

			// Wait past the setTimeout(100) the ACCEPTED handler uses to schedule sendAgreementToConsumer.
			await new Promise(resolve => setTimeout(resolve, 250));

			const stored = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(stored).toHaveLength(1);
			// sendAgreementToConsumer advances state to AGREED regardless of callbackAddress.
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.AGREED);
			expect(stored[0].agreement).toBeDefined();
			expect(stored[0].callbackAddress).toBeUndefined();
		});

		test("state advances AGREED → VERIFIED on agreementFromProvider when no callbackAddress was stored (polling mode)", async () => {
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			// Seed a consumer-side negotiation in ACCEPTED state with NO callbackAddress so we can
			// receive the provider's agreement and observe the VERIFIED transition triggered by
			// sendAgreementVerificationToProvider's setTimeout. handlerId is intentionally
			// omitted to skip the requester-notification path which isn't under test here.
			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-poll-verify",
				correlationId: "provider-pid-poll-verify",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.ACCEPTED,
				// callbackAddress intentionally absent — polling mode
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityProvider }
			});

			await consumer.agreementFromProvider(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
					providerPid: "provider-pid-poll-verify",
					consumerPid: "consumer-pid-poll-verify",
					agreement: {
						"@type": OdrlTypes.Agreement,
						"@id": "urn:policy:agreement-poll-verify",
						assigner: testIdentityProvider,
						assignee: testIdentityConsumer
					}
					// callbackAddress intentionally omitted
				},
				`token:${testIdentityProvider}`
			);

			// Wait past the setTimeout(100) used to schedule sendAgreementVerificationToProvider.
			await new Promise(resolve => setTimeout(resolve, 250));

			const stored = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(stored).toHaveLength(1);
			// sendAgreementVerificationToProvider advances state to VERIFIED regardless of callback.
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.VERIFIED);
			expect(stored[0].callbackAddress).toBeUndefined();
		});
	});

	describe("consumer-side agreement persistence on finalize", () => {
		test("event(FINALIZED) on the consumer writes the agreement to the consumer PAP so it is resolvable by agreementId", async () => {
			PolicyRequesterFactory.register("requester-2", () => mockPolicyRequester);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			const agreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlTypes.Agreement,
				"@id": "urn:policy:agreement-175",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			};

			// Seed a consumer negotiation in VERIFIED state holding the agreement so the
			// VERIFIED -> FINALIZED transition is allowed. The agreement exists only on the
			// negotiation entity; the consumer PAP has no row for it yet.
			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-175",
				correlationId: "provider-pid-175",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				agreement,
				state: DataspaceProtocolContractNegotiationStateType.VERIFIED,
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityConsumer },
				handlerId: "requester-2"
			});

			// Before finalize the consumer PAP cannot resolve the agreement.
			await expect(adminPointComponent.getAgreement("urn:policy:agreement-175")).rejects.toThrow();

			const result = await consumer.event(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
					providerPid: "provider-pid-175",
					consumerPid: "consumer-pid-175",
					event: DataspaceProtocolContractNegotiationStateType.FINALIZED
				},
				"consumer",
				`token:${testIdentityConsumer}`
			);

			expect(result).toBeUndefined();

			const stored = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.FINALIZED);
			expect(mockPolicyRequester.finalised).toHaveBeenCalledWith("consumer-pid-175");

			// After finalize the agreement is resolvable from the consumer PAP by agreementId
			// (this is what startDataTransfer -> lookupAgreement -> getAgreement relies on).
			const resolved = await adminPointComponent.getAgreement("urn:policy:agreement-175");
			expect(resolved["@id"]).toBe("urn:policy:agreement-175");
			expect(resolved["@type"]).toBe(OdrlTypes.Agreement);
		});

		test("event(FINALIZED) is idempotent when the agreement already exists in the PAP (no throw)", async () => {
			PolicyRequesterFactory.register("requester-2", () => mockPolicyRequester);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			const agreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlTypes.Agreement,
				"@id": "urn:policy:agreement-175-dup",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			};

			// Pre-create the agreement in the PAP so the finalize write hits AlreadyExists.
			await adminPointComponent.create(agreement);

			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-175-dup",
				correlationId: "provider-pid-175-dup",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				agreement,
				state: DataspaceProtocolContractNegotiationStateType.VERIFIED,
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityConsumer },
				handlerId: "requester-2"
			});

			const result = await consumer.event(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
					providerPid: "provider-pid-175-dup",
					consumerPid: "consumer-pid-175-dup",
					event: DataspaceProtocolContractNegotiationStateType.FINALIZED
				},
				"consumer",
				`token:${testIdentityConsumer}`
			);

			// AlreadyExists is swallowed: finalize still succeeds.
			expect(result).toBeUndefined();
			const stored = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.FINALIZED);
		});

		test("event(FINALIZED) fails loudly (does not write) when the agreement id collides with the offer id", async () => {
			PolicyRequesterFactory.register("requester-2", () => mockPolicyRequester);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			// Malformed: a (hypothetical buggy) negotiator reused the offer id for the
			// agreement. The guard must reject this instead of letting the AlreadyExists
			// catch silently swallow a colliding PAP write.
			const collidingId = "urn:policy:offer-1";
			const agreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlTypes.Agreement,
				"@id": collidingId,
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			};

			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-175-collide",
				correlationId: "provider-pid-175-collide",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer, // mockOffer @id is "urn:policy:offer-1"
				agreement,
				state: DataspaceProtocolContractNegotiationStateType.VERIFIED,
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityConsumer },
				handlerId: "requester-2"
			});

			const result = await consumer.event(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
					providerPid: "provider-pid-175-collide",
					consumerPid: "consumer-pid-175-collide",
					event: DataspaceProtocolContractNegotiationStateType.FINALIZED
				},
				"consumer",
				`token:${testIdentityConsumer}`
			);

			// The collision is surfaced as an error (not swallowed), and the colliding
			// agreement is NOT written to the PAP.
			expect(result).toBeDefined();
			await expect(adminPointComponent.getAgreement(collidingId)).rejects.toThrow();
		});

		test("event(FINALIZED) fires terminated() and skips finalised() when PAP create throws a non-AlreadyExists error", async () => {
			PolicyRequesterFactory.register("requester-2", () => mockPolicyRequester);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			const agreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlTypes.Agreement,
				"@id": "urn:policy:agreement-176-fail",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			};

			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-176-fail",
				correlationId: "provider-pid-176-fail",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				agreement,
				state: DataspaceProtocolContractNegotiationStateType.VERIFIED,
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityConsumer },
				handlerId: "requester-2"
			});

			const createSpy = vi
				.spyOn(adminPointComponent, "create")
				.mockRejectedValueOnce(new Error("simulated pap storage failure"));

			const result = await consumer.event(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
					providerPid: "provider-pid-176-fail",
					consumerPid: "consumer-pid-176-fail",
					event: DataspaceProtocolContractNegotiationStateType.FINALIZED
				},
				"consumer",
				`token:${testIdentityConsumer}`
			);

			createSpy.mockRestore();

			// setErrorState was called — an error response is returned
			expect(result).toBeDefined();

			// terminated() fires promptly — requester receives the failure signal
			expect(mockPolicyRequester.terminated).toHaveBeenCalledWith("consumer-pid-176-fail");

			// finalised() is NOT called — the early return prevents the happy-path callback
			expect(mockPolicyRequester.finalised).not.toHaveBeenCalled();

			// The agreement was never written to the PAP
			await expect(
				adminPointComponent.getAgreement("urn:policy:agreement-176-fail")
			).rejects.toThrow();
		});

		test("event(FINALIZED) PAP failure: terminated() is called exactly once for the negotiation — no double-callback from the outer catch", async () => {
			PolicyRequesterFactory.register("requester-2", () => mockPolicyRequester);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			const agreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlTypes.Agreement,
				"@id": "urn:policy:agreement-177-fail",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			};

			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-177-fail",
				correlationId: "provider-pid-177-fail",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				agreement,
				state: DataspaceProtocolContractNegotiationStateType.VERIFIED,
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityConsumer },
				handlerId: "requester-2"
			});

			const createSpy = vi
				.spyOn(adminPointComponent, "create")
				.mockRejectedValueOnce(new Error("simulated pap storage failure"));

			await consumer.event(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
					providerPid: "provider-pid-177-fail",
					consumerPid: "consumer-pid-177-fail",
					event: DataspaceProtocolContractNegotiationStateType.FINALIZED
				},
				"consumer",
				`token:${testIdentityConsumer}`
			);

			createSpy.mockRestore();

			expect(mockPolicyRequester.terminated).toHaveBeenCalledTimes(1);
			expect(mockPolicyRequester.terminated).toHaveBeenCalledWith("consumer-pid-177-fail");
		});
	});

	describe("consumer composite assignee on agreement creation", () => {
		test("stamps the trust verification identity as the agreement assignee", async () => {
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const provider = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			// Seed a provider-side negotiation in ACCEPTED state whose stored
			// trustVerificationInfo carries the consumer's tenant (tid). event(ACCEPTED)
			// schedules sendAgreementToConsumer, which creates the agreement.
			await negotiationProviderAdminPointComponent.set({
				id: "provider-pid-assignee-tenant",
				correlationId: "consumer-pid-assignee-tenant",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.OFFERED,
				organizationIdentity: testIdentityProvider,
				trustVerificationInfo: {
					identity: testIdentityConsumer
				},
				handlerId: "MockPolicyNegotiator"
			});

			await provider.event(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
					providerPid: "provider-pid-assignee-tenant",
					consumerPid: "consumer-pid-assignee-tenant",
					event: DataspaceProtocolContractNegotiationStateType.ACCEPTED
				},
				"provider",
				`token:${testIdentityConsumer}`
			);

			// Wait past the setTimeout used to schedule sendAgreementToConsumer.
			await new Promise(resolve => setTimeout(resolve, 250));

			// The assignee passed to the negotiator must be the consumer composite so it
			// matches the caller composite the transfer side rebuilds (dataspace
			// buildCallerComposite => `identity:tenantId`).
			expect(mockNegotiator.createAgreement).toHaveBeenCalledWith(
				expect.anything(),
				testIdentityConsumer,
				undefined
			);
		});

		test("stamps the bare identity as the agreement assignee when the negotiation has no tenant", async () => {
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const provider = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await negotiationProviderAdminPointComponent.set({
				id: "provider-pid-assignee-bare",
				correlationId: "consumer-pid-assignee-bare",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.OFFERED,
				organizationIdentity: testIdentityProvider,
				// No tenantId — single-tenant / no tid claim.
				trustVerificationInfo: { identity: testIdentityConsumer },
				handlerId: "MockPolicyNegotiator"
			});

			await provider.event(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
					providerPid: "provider-pid-assignee-bare",
					consumerPid: "consumer-pid-assignee-bare",
					event: DataspaceProtocolContractNegotiationStateType.ACCEPTED
				},
				"provider",
				`token:${testIdentityConsumer}`
			);

			await new Promise(resolve => setTimeout(resolve, 250));

			// Backward compatible: no tenant => bare identity assignee.
			expect(mockNegotiator.createAgreement).toHaveBeenCalledWith(
				expect.anything(),
				testIdentityConsumer,
				undefined
			);
		});
	});

	describe("local dispatch", () => {
		function registerPlatformMock(localContext: IContextIds | undefined): void {
			ComponentFactory.register("platform", () => ({
				className: () => "MockPlatformComponent",
				isMultiTenant: () => false,
				execute: async (method: () => Promise<void>) => method(),
				getLocalOriginContext: async (url: string) => localContext
			}));
		}

		test("routes to self and never invokes remote factory when getLocalOriginContext returns a context", async () => {
			registerPlatformMock({
				[ContextIdKeys.Node]: testIdentityConsumer,
				[ContextIdKeys.Organization]: testOrganizationId,
				[HttpContextIdKeys.PublicOrigin]: providerOrigin
			});

			let remoteFactoryInvoked = false;
			ComponentFactory.register("pnp-remote", () => {
				remoteFactoryInvoked = true;
				return {} as IPolicyNegotiationPointComponent;
			});

			const policyNegotiationPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			PolicyRequesterFactory.register("requester-local-dispatch-1", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			await policyNegotiationPoint.sendRequestToProvider(
				providerOrigin,
				"requester-local-dispatch-1",
				"urn:policy:offer-1",
				providerOrigin
			);

			expect(remoteFactoryInvoked).toBe(false);
		});

		test("invokes remote factory when getLocalOriginContext returns undefined", async () => {
			// Default platform mock already returns undefined; verify remote path is taken.
			let remoteFactoryInvoked = false;
			remoteComponentResolver = (params: { endpoint: string }) => {
				remoteFactoryInvoked = true;
				const providerPoint = new PolicyNegotiationPointService({
					policyNegotiationAdministrationPointComponentType:
						"policy-negotiation-provider-admin-point",
					policyNegotiationPointRemoteComponentType: "pnp-remote",
					config: { callbackPath: "/callback" }
				});
				if (params.endpoint.startsWith(providerOrigin)) {
					return createRemoteComponent(providerPoint, providerOrigin);
				}
				throw new TypeError(`Unknown remote url ${params.endpoint}`);
			};

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			PolicyRequesterFactory.register("requester-remote-dispatch-1", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			await consumer.sendRequestToProvider(
				providerOrigin,
				"requester-remote-dispatch-1",
				"urn:policy:offer-1",
				consumerOrigin
			);

			expect(remoteFactoryInvoked).toBe(true);
		});

		test("sendTerminateToConsumer routes to self when getLocalOriginContext returns a context", async () => {
			registerPlatformMock({
				[ContextIdKeys.Node]: testIdentityConsumer,
				[ContextIdKeys.Organization]: testOrganizationId,
				[HttpContextIdKeys.PublicOrigin]: providerOrigin
			});

			let remoteFactoryInvoked = false;
			ComponentFactory.register("pnp-remote", () => {
				remoteFactoryInvoked = true;
				return {} as IPolicyNegotiationPointComponent;
			});

			const policyNegotiationPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			const callbackAddress = `${providerOrigin}/callback`;

			await negotiationProviderAdminPointComponent.set({
				id: "local-terminate-provider-pid",
				correlationId: "local-terminate-consumer-pid",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
				callbackAddress,
				organizationIdentity: testIdentityProvider,
				trustVerificationInfo: { identity: testIdentityConsumer },
				handlerId: "MockPolicyNegotiator"
			});

			await policyNegotiationPoint.sendTerminateToConsumer(
				callbackAddress,
				"local-terminate-provider-pid",
				"local-terminate-consumer-pid"
			);

			expect(remoteFactoryInvoked).toBe(false);
		});

		test("full negotiation lifecycle completes without invoking remote factory when getLocalOriginContext always returns a context", async () => {
			// getLocalOriginContext returns a context for every URL, so withPolicyNegotiationPointComponent
			// routes all outbound calls to `this`. A single service instance handles both consumer
			// and provider roles, writing all negotiations into the single admin point
			// (policy-negotiation-provider-admin-point). The lifecycle is identical to the
			// two-service remote case; only the dispatch path differs.
			registerPlatformMock({
				[ContextIdKeys.Node]: testIdentityConsumer,
				[ContextIdKeys.Organization]: testOrganizationId,
				[HttpContextIdKeys.PublicOrigin]: providerOrigin
			});

			let remoteFactoryInvoked = false;
			ComponentFactory.register("pnp-remote", () => {
				remoteFactoryInvoked = true;
				return {} as IPolicyNegotiationPointComponent;
			});

			const policyNegotiationPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			PolicyRequesterFactory.register("requester-local-lifecycle", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			await policyNegotiationPoint.sendRequestToProvider(
				providerOrigin,
				"requester-local-lifecycle",
				"urn:policy:offer-1",
				providerOrigin
			);

			// Consumer and provider negotiations both land in policy-negotiation-provider-admin-point
			// because local dispatch routes all callbacks to `this`. Wait until both are FINALIZED.
			for (let i = 0; i < 60; i++) {
				const store = await policyNegotiationProviderMemoryEntityStorage.getStore();
				if (store.filter(n => n.state === "FINALIZED").length >= 2) {
					break;
				}
				if (i === 59) {
					const snapshot = await policyNegotiationProviderMemoryEntityStorage.getStore();
					console.debug("local dispatch lifecycle timeout, store:", snapshot);
					throw new Error(
						"Timeout waiting for both negotiations to reach FINALIZED via local dispatch"
					);
				}
				await new Promise(resolve => setTimeout(resolve, 100));
			}

			const finalStore = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(finalStore.filter(n => n.state === "FINALIZED")).toHaveLength(2);
			expect(remoteFactoryInvoked).toBe(false);
		});

		test("cross-tenant: ContextIdStore.run is called with the context returned by getLocalOriginContext, not the caller's context", async () => {
			// Simulates a co-located cross-tenant call: the current context has org A
			// (testOrganizationId) but getLocalOriginContext returns org B's context.
			// withPolicyNegotiationPointComponent must pass org B's context to
			// ContextIdStore.run so the action executes under the correct tenant.
			const crossTenantOrgId = "did:test:org-b-cross-tenant";
			const crossTenantContext = {
				[ContextIdKeys.Node]: testIdentityConsumer,
				[ContextIdKeys.Organization]: crossTenantOrgId,
				[HttpContextIdKeys.PublicOrigin]: providerOrigin
			};

			registerPlatformMock(crossTenantContext);

			const runSpy = vi.spyOn(ContextIdStore, "run");

			ComponentFactory.register("pnp-remote", () => ({}) as IPolicyNegotiationPointComponent);

			const policyNegotiationPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			PolicyRequesterFactory.register("requester-cross-tenant", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			await policyNegotiationPoint.sendRequestToProvider(
				providerOrigin,
				"requester-cross-tenant",
				"urn:policy:offer-1",
				providerOrigin
			);

			// The action must run under the cross-tenant context, not the caller's context.
			// Local dispatch (no remote component) must still occur.
			expect(runSpy).toHaveBeenCalledWith(crossTenantContext, expect.any(Function));

			runSpy.mockRestore();
		});
	});

	describe("direct agreement fast path (feat-150)", () => {
		test("directAgreement skips OFFERED/ACCEPTED: negotiation reaches AGREED directly, then VERIFIED, then FINALIZED", async () => {
			const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

			const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			providerPoints.provider = policyNegotiationProviderPoint;
			providerPoints.consumer = policyNegotiationConsumerPoint;
			remoteComponentResolver = (params: { endpoint: string }) => {
				if (params.endpoint.startsWith(providerOrigin)) {
					return createRemoteComponent(providerPoints.provider, providerOrigin);
				}
				if (params.endpoint.startsWith(consumerOrigin)) {
					return createRemoteComponent(providerPoints.consumer, consumerOrigin);
				}
				throw new TypeError(`Unknown remote url ${params.endpoint}`);
			};

			PolicyRequesterFactory.register("requester-direct-agreement", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			mockNegotiator.handleOffer = vi.fn(async () => ({
				accepted: true,
				interventionRequired: false,
				directAgreement: true
			}));
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const consumerPid = await policyNegotiationConsumerPoint.sendRequestToProvider(
				providerOrigin,
				"requester-direct-agreement",
				"urn:policy:offer-1",
				consumerOrigin
			);

			await waitForState(policyNegotiationConsumerMemoryEntityStorage, "AGREED", "consumer");
			await waitForState(policyNegotiationProviderMemoryEntityStorage, "AGREED", "provider");
			await waitForState(policyNegotiationConsumerMemoryEntityStorage, "VERIFIED", "consumer");
			await waitForState(policyNegotiationProviderMemoryEntityStorage, "FINALIZED", "provider");
			await waitForState(policyNegotiationConsumerMemoryEntityStorage, "FINALIZED", "consumer");

			const consumerStore = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			const providerStore = await policyNegotiationProviderMemoryEntityStorage.getStore();

			expect(consumerStore[0]).toMatchObject({
				id: consumerPid,
				state: "FINALIZED",
				agreement: expect.objectContaining({ "@type": "Agreement" })
			});
			expect(providerStore[0]).toMatchObject({
				state: "FINALIZED",
				agreement: expect.objectContaining({ "@type": "Agreement" })
			});

			// The offer/accept round-trip must never have happened: the consumer's requester
			// callback for an OFFERED message (offer()) must never fire on the fast path.
			expect(mockPolicyRequester.offer).not.toHaveBeenCalled();
			expect(mockPolicyRequester.agreement).toHaveBeenCalledTimes(1);
			expect(mockPolicyRequester.agreement).toHaveBeenCalledWith(
				consumerPid,
				expect.objectContaining({ "@type": "Agreement" })
			);
			expect(mockPolicyRequester.finalised).toHaveBeenCalledTimes(1);
			expect(mockPolicyRequester.finalised).toHaveBeenCalledWith(consumerPid);
			expect(mockPolicyRequester.terminated).not.toHaveBeenCalled();
			expect(mockNegotiator.handleOffer).toHaveBeenCalledTimes(1);
			expect(mockNegotiator.createAgreement).toHaveBeenCalledTimes(1);
		});

		test("direct agreement reaches FINALIZED for a pre-registered consumer record (correlationId is learned from the agreement message)", async () => {
			// A consumer record pre-registered via the admin endpoint (correlationId: "", the
			// twin-node REST-driven shape) rather than created through sendRequestToProvider (which
			// sets correlationId up front - see the sibling test above). On the direct-agreement
			// path, offerFromProvider is never called, so agreementFromProvider is the ONLY place
			// the consumer record ever learns the provider's pid. If it isn't persisted there,
			// sendAgreementVerificationToProvider later sends an empty providerPid, the provider
			// rejects it (guard.stringEmpty), and the negotiation stalls forever at AGREED on the
			// provider side while the consumer record terminates itself.
			const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

			const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			providerPoints.provider = policyNegotiationProviderPoint;
			providerPoints.consumer = policyNegotiationConsumerPoint;
			remoteComponentResolver = (params: { endpoint: string }) => {
				if (params.endpoint.startsWith(providerOrigin)) {
					return createRemoteComponent(providerPoints.provider, providerOrigin);
				}
				if (params.endpoint.startsWith(consumerOrigin)) {
					return createRemoteComponent(providerPoints.consumer, consumerOrigin);
				}
				throw new TypeError(`Unknown remote url ${params.endpoint}`);
			};

			await adminPointComponent.create(mockOffer);
			mockNegotiator.handleOffer = vi.fn(async () => ({
				accepted: true,
				interventionRequired: false,
				directAgreement: true
			}));
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			// Pre-register the consumer record via the admin endpoint (correlationId ""), the same
			// shape twin-node's e2e suite uses - NOT sendRequestToProvider.
			const consumerPid = "urn:uuid:pre-registered-consumer-1";
			await negotiationConsumerAdminPointComponent.create(consumerPid);

			const response = await policyNegotiationProviderPoint.requestFromConsumer(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
					consumerPid,
					offer: {
						"@type": OdrlTypes.Offer,
						"@id": "urn:policy:offer-1",
						assigner: testIdentityProvider
					},
					callbackAddress: `${consumerOrigin}/callback`
				},
				`token:${testIdentityConsumer}`
			);
			const providerPid = response.providerPid;

			await waitForState(policyNegotiationProviderMemoryEntityStorage, "FINALIZED", "provider");
			await waitForState(policyNegotiationConsumerMemoryEntityStorage, "FINALIZED", "consumer");

			const consumerStore = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			const providerStore = await policyNegotiationProviderMemoryEntityStorage.getStore();

			expect(consumerStore[0]).toMatchObject({
				id: consumerPid,
				correlationId: providerPid,
				state: "FINALIZED",
				agreement: expect.objectContaining({ "@type": "Agreement" })
			});
			expect(providerStore[0]).toMatchObject({
				state: "FINALIZED",
				agreement: expect.objectContaining({ "@type": "Agreement" })
			});
		});

		test("interventionRequired takes precedence over directAgreement: negotiation stays REQUESTED", async () => {
			const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

			const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			providerPoints.provider = policyNegotiationProviderPoint;
			providerPoints.consumer = policyNegotiationConsumerPoint;
			remoteComponentResolver = (params: { endpoint: string }) => {
				if (params.endpoint.startsWith(providerOrigin)) {
					return createRemoteComponent(providerPoints.provider, providerOrigin);
				}
				if (params.endpoint.startsWith(consumerOrigin)) {
					return createRemoteComponent(providerPoints.consumer, consumerOrigin);
				}
				throw new TypeError(`Unknown remote url ${params.endpoint}`);
			};

			PolicyRequesterFactory.register("requester-intervention", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			mockNegotiator.handleOffer = vi.fn(async () => ({
				accepted: true,
				interventionRequired: true,
				directAgreement: true
			}));
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			await policyNegotiationConsumerPoint.sendRequestToProvider(
				providerOrigin,
				"requester-intervention",
				"urn:policy:offer-1",
				consumerOrigin
			);

			// Wait past the 100ms scheduling window used by both the offer and direct-agreement branches.
			await new Promise(resolve => setTimeout(resolve, 300));

			const providerStore = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(providerStore).toHaveLength(1);
			expect(providerStore[0].state).toBe(DataspaceProtocolContractNegotiationStateType.REQUESTED);
			expect(mockPolicyRequester.offer).not.toHaveBeenCalled();
			expect(mockNegotiator.createAgreement).not.toHaveBeenCalled();
		});

		test("mixed-version safety net: provider terminates cleanly when the consumer rejects a direct-path agreement", async () => {
			// Simulates negotiating with a consumer whose deployed pnp-service predates this
			// feature: it only accepts a ContractAgreementMessage when its own negotiation is
			// ACCEPTED, so a direct-path message (arriving while it's still REQUESTED) is rejected.
			// This is the exact mixed-version failure mode documented in
			// docs/architecture/components.md's "Upgrade order (breaking change)" note - this test
			// proves the degradation is safe (provider terminates, doesn't hang or corrupt state)
			// rather than just asserting it in prose.
			const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

			const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			providerPoints.provider = policyNegotiationProviderPoint;
			providerPoints.consumer = policyNegotiationConsumerPoint;
			remoteComponentResolver = (params: { endpoint: string }) => {
				if (params.endpoint.startsWith(providerOrigin)) {
					return createRemoteComponent(providerPoints.provider, providerOrigin);
				}
				if (params.endpoint.startsWith(consumerOrigin)) {
					return createRemoteComponent(providerPoints.consumer, consumerOrigin);
				}
				throw new TypeError(`Unknown remote url ${params.endpoint}`);
			};

			PolicyRequesterFactory.register("requester-mixed-version", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			mockNegotiator.handleOffer = vi.fn(async () => ({
				accepted: true,
				interventionRequired: false,
				directAgreement: true
			}));
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			// Stand in for the old consumer's guard: reject with the same invalidState shape
			// pre-feature code returns, instead of actually processing the message.
			vi.spyOn(policyNegotiationConsumerPoint, "agreementFromProvider").mockImplementation(
				async message => ({
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationError,
					providerPid: message.providerPid,
					consumerPid: message.consumerPid,
					code: "PolicyNegotiationPointService.invalidState",
					reason: [
						{
							"@value": "simulated pre-feature consumer: REQUESTED is not ACCEPTED",
							"@language": "en-US"
						}
					]
				})
			);

			await policyNegotiationConsumerPoint.sendRequestToProvider(
				providerOrigin,
				"requester-mixed-version",
				"urn:policy:offer-1",
				consumerOrigin
			);

			// Wait past the 100ms scheduling window for the direct-agreement send.
			await new Promise(resolve => setTimeout(resolve, 300));

			const providerStore = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(providerStore).toHaveLength(1);
			expect(providerStore[0].state).toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
			expect(providerStore[0].code).toBe("PolicyNegotiationPointService.invalidState");

			// The consumer's own record is untouched by the response it sent - it's still
			// wherever sendRequestToProvider left it, matching the real old-consumer guard
			// (which calls setErrorState with an undefined record, so nothing is persisted there).
			const consumerStore = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(consumerStore).toHaveLength(1);
			expect(consumerStore[0].state).toBe(DataspaceProtocolContractNegotiationStateType.REQUESTED);
		});

		test("mixed-version safety net: directAgreement: false succeeds against the same simulated old consumer", async () => {
			// Direct pair to the previous test, proving the documented mitigation actually works,
			// not just that the full cycle happens to succeed in isolation. The simulated consumer
			// here is the same "pre-feature guard" behavior (reject unless its own negotiation is
			// already ACCEPTED) - but because the negotiator signals directAgreement: false, the
			// provider never attempts the fast path, so the consumer's guard is never triggered:
			// agreementFromProvider is only ever called once the consumer has legitimately reached
			// ACCEPTED via the normal OFFERED round-trip, which the simulated guard allows through.
			const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

			const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			providerPoints.provider = policyNegotiationProviderPoint;
			providerPoints.consumer = policyNegotiationConsumerPoint;
			remoteComponentResolver = (params: { endpoint: string }) => {
				if (params.endpoint.startsWith(providerOrigin)) {
					return createRemoteComponent(providerPoints.provider, providerOrigin);
				}
				if (params.endpoint.startsWith(consumerOrigin)) {
					return createRemoteComponent(providerPoints.consumer, consumerOrigin);
				}
				throw new TypeError(`Unknown remote url ${params.endpoint}`);
			};

			PolicyRequesterFactory.register(
				"requester-mixed-version-mitigated",
				() => mockPolicyRequester
			);
			await adminPointComponent.create(mockOffer);
			mockNegotiator.handleOffer = vi.fn(async () => ({
				accepted: true,
				interventionRequired: false,
				directAgreement: false
			}));
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const originalAgreementFromProvider =
				policyNegotiationConsumerPoint.agreementFromProvider.bind(policyNegotiationConsumerPoint);
			vi.spyOn(policyNegotiationConsumerPoint, "agreementFromProvider").mockImplementation(
				async (message, trustPayload) => {
					const stored = await policyNegotiationConsumerMemoryEntityStorage.getStore();
					const negotiation = stored.find(n => n.id === message.consumerPid);
					if (negotiation?.state !== DataspaceProtocolContractNegotiationStateType.ACCEPTED) {
						return {
							"@context": [DataspaceProtocolContexts.Context],
							"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationError,
							providerPid: message.providerPid,
							consumerPid: message.consumerPid,
							code: "PolicyNegotiationPointService.invalidState",
							reason: [
								{
									"@value": "simulated pre-feature consumer: REQUESTED is not ACCEPTED",
									"@language": "en-US"
								}
							]
						};
					}
					return originalAgreementFromProvider(message, trustPayload);
				}
			);

			await policyNegotiationConsumerPoint.sendRequestToProvider(
				providerOrigin,
				"requester-mixed-version-mitigated",
				"urn:policy:offer-1",
				consumerOrigin
			);

			await waitForState(policyNegotiationConsumerMemoryEntityStorage, "FINALIZED", "consumer");

			const consumerStore = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(consumerStore[0].state).toBe(DataspaceProtocolContractNegotiationStateType.FINALIZED);
			// Proves the full OFFERED round-trip actually happened rather than the fast path
			// slipping through some other way.
			expect(mockPolicyRequester.offer).toHaveBeenCalledTimes(1);
		});

		test("agreementFromProvider accepts a ContractAgreementMessage when the consumer negotiation is still REQUESTED", async () => {
			// handlerId on the CONSUMER side identifies the requester (not the negotiator).
			PolicyRequesterFactory.register("requester-direct-guard", () => mockPolicyRequester);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			// No trustVerificationInfo seeded: on the real fast path the consumer's negotiation
			// never goes through offerFromProvider (which is where it's normally first pinned),
			// so this call is the first trusted interaction for this negotiation.
			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-direct-agreement",
				correlationId: "provider-pid-direct-agreement",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
				organizationIdentity: testIdentityConsumer,
				handlerId: "requester-direct-guard"
			});

			const result = await consumer.agreementFromProvider(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
					providerPid: "provider-pid-direct-agreement",
					consumerPid: "consumer-pid-direct-agreement",
					agreement: {
						"@type": OdrlTypes.Agreement,
						"@id": "urn:policy:agreement-direct",
						assigner: testIdentityProvider,
						assignee: testIdentityConsumer
					}
				},
				`token:${testIdentityProvider}`
			);

			expect(result).toBeUndefined();
			const stored = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.AGREED);
			// The provider's identity must now be pinned even though OFFERED never happened.
			expect(stored[0].trustVerificationInfo?.identity).toBe(testIdentityProvider);
		});

		test("agreementFromProvider rejects when handlerId resolves as a registered negotiator (cross-role record confusion guard)", async () => {
			// Simulates review Finding 5: IPolicyNegotiation has no role discriminator, so a
			// long-lived Provider-side record (handlerId is a negotiator class name) could
			// otherwise be addressed here by a counterparty who legitimately knows its id, since
			// widening the state guard to admit REQUESTED made such a record reachable for far
			// longer than the old transient ACCEPTED-only window. A handlerId that resolves as a
			// registered negotiator is refused here even though state and trust-pinning would
			// otherwise pass.
			//
			// Registered under a kebab-case key deliberately DIFFERENT from the negotiator's own
			// className() (per round-2 review N1) - this mirrors how the real engine registers
			// negotiators (nameofKebabCase(...) as the registration key, never the class name), so
			// this test only passes if the guard compares against className() and would fail
			// against the original buggy guard, which compared handlerId to the registration key.
			PolicyNegotiatorFactory.register("mock-policy-negotiator", () => mockNegotiator);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-handler-collision",
				correlationId: "provider-pid-handler-collision",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityProvider },
				// Collides with a registered negotiator name rather than a requester type.
				handlerId: "MockPolicyNegotiator"
			});

			const result = await consumer.agreementFromProvider(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
					providerPid: "provider-pid-handler-collision",
					consumerPid: "consumer-pid-handler-collision",
					agreement: {
						"@type": OdrlTypes.Agreement,
						"@id": "urn:policy:agreement-handler-collision",
						assigner: testIdentityProvider,
						assignee: testIdentityConsumer
					}
				},
				`token:${testIdentityProvider}`
			);

			expect(result).toBeDefined();
			expect(result?.code).toMatch(/invalidState/);

			const stored = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.REQUESTED);
			expect(stored[0].agreement).toBeUndefined();
		});

		test("agreementFromProvider still rejects a ContractAgreementMessage when the consumer negotiation is in OFFERED state", async () => {
			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-offered-guard",
				correlationId: "provider-pid-offered-guard",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.OFFERED,
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityProvider },
				handlerId: "MockPolicyNegotiator"
			});

			const result = await consumer.agreementFromProvider(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
					providerPid: "provider-pid-offered-guard",
					consumerPid: "consumer-pid-offered-guard",
					agreement: {
						"@type": OdrlTypes.Agreement,
						"@id": "urn:policy:agreement-offered-guard",
						assigner: testIdentityProvider,
						assignee: testIdentityConsumer
					}
				},
				`token:${testIdentityProvider}`
			);

			expect(result).toBeDefined();
			expect(result?.code).toMatch(/invalidState/);
			const stored = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.OFFERED);
		});

		test("agreementFromProvider still rejects a ContractAgreementMessage when the consumer negotiation is TERMINATED", async () => {
			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-terminated-guard",
				correlationId: "provider-pid-terminated-guard",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.TERMINATED,
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityProvider },
				handlerId: "MockPolicyNegotiator"
			});

			const result = await consumer.agreementFromProvider(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
					providerPid: "provider-pid-terminated-guard",
					consumerPid: "consumer-pid-terminated-guard",
					agreement: {
						"@type": OdrlTypes.Agreement,
						"@id": "urn:policy:agreement-terminated-guard",
						assigner: testIdentityProvider,
						assignee: testIdentityConsumer
					}
				},
				`token:${testIdentityProvider}`
			);

			expect(result).toBeDefined();
			expect(result?.code).toMatch(/invalidState/);
			const stored = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
		});

		test("agreementFromProvider rejects a different verified identity than the one already pinned", async () => {
			// The security-relevant half of the trust-pinning fix: once an identity is pinned
			// (here, simulating a negotiation that already went through the fast path once),
			// a DIFFERENT verified caller must be rejected, not silently re-pinned/hijacked.
			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-wrong-caller",
				correlationId: "provider-pid-wrong-caller",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityProvider },
				handlerId: "requester-wrong-caller"
			});

			const result = await consumer.agreementFromProvider(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
					providerPid: "provider-pid-wrong-caller",
					consumerPid: "consumer-pid-wrong-caller",
					agreement: {
						"@type": OdrlTypes.Agreement,
						"@id": "urn:policy:agreement-wrong-caller",
						assigner: testIdentityProvider,
						assignee: testIdentityConsumer
					}
				},
				// A different verified identity than the one pinned on the negotiation above.
				"token:did:iota:testnet:attacker-identity"
			);

			expect(result).toBeDefined();
			expect(result?.code).toMatch(/callerNotAuthorizedForNegotiation/);

			// No hijack: the originally pinned identity is unchanged (setErrorState only sets
			// state/code/reason, never trustVerificationInfo).
			const stored = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(stored[0].trustVerificationInfo?.identity).toBe(testIdentityProvider);
		});

		test("agreementFromProvider replay at AGREED leaves the stored record untouched", async () => {
			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await negotiationConsumerAdminPointComponent.set({
				id: "consumer-pid-replay",
				correlationId: "provider-pid-replay",
				dateCreated: new Date(Date.now()).toISOString(),
				offer: mockOffer,
				state: DataspaceProtocolContractNegotiationStateType.AGREED,
				agreement: {
					"@context": OdrlContexts.Context,
					"@type": OdrlTypes.Agreement,
					"@id": "urn:policy:agreement-original",
					assigner: testIdentityProvider,
					assignee: testIdentityConsumer
				},
				organizationIdentity: testIdentityConsumer,
				trustVerificationInfo: { identity: testIdentityProvider },
				handlerId: "requester-replay"
			});

			const result = await consumer.agreementFromProvider(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
					providerPid: "provider-pid-replay",
					consumerPid: "consumer-pid-replay",
					agreement: {
						"@type": OdrlTypes.Agreement,
						"@id": "urn:policy:agreement-REPLAYED-DIFFERENT",
						assigner: testIdentityProvider,
						assignee: testIdentityConsumer
					}
				},
				`token:${testIdentityProvider}`
			);

			expect(result).toBeDefined();
			expect(result?.code).toMatch(/invalidState/);

			const stored = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.AGREED);
			expect(stored[0].agreement?.["@id"]).toBe("urn:policy:agreement-original");
		});

		test("requestFromConsumer: accepted false with directAgreement true still terminates via negotiationFailed", async () => {
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);
			await adminPointComponent.create(mockOffer);
			mockNegotiator.handleOffer = vi.fn(async () => ({
				accepted: false,
				interventionRequired: false,
				directAgreement: true
			}));

			const provider = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			const result = await provider.requestFromConsumer(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
					consumerPid: "urn:contract-negotiation:accepted-false-direct-true",
					offer: mockOffer,
					callbackAddress: "http://localhost:4000/callback"
				},
				`token:${testIdentityConsumer}`
			);

			expect(result).toBeDefined();
			expect("code" in result).toBe(true);
			if ("code" in result) {
				expect(result.code).toMatch(/negotiationFailed/);
			}

			const stored = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
		});

		test("directAgreement fast path advances state to AGREED even when no callbackAddress is provided (polling mode)", async () => {
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);
			await adminPointComponent.create(mockOffer);
			mockNegotiator.handleOffer = vi.fn(async () => ({
				accepted: true,
				interventionRequired: false,
				directAgreement: true
			}));

			const provider = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});

			await provider.requestFromConsumer(
				{
					"@context": [DataspaceProtocolContexts.Context],
					"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
					consumerPid: "urn:contract-negotiation:no-cb-direct-agreement",
					offer: mockOffer
					// callbackAddress intentionally omitted — must be accepted per DSP spec
				},
				`token:${testIdentityConsumer}`
			);

			// Wait past the setTimeout(100) the direct-agreement branch uses to schedule
			// sendAgreementToConsumer.
			await new Promise(resolve => setTimeout(resolve, 250));

			const stored = await policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(stored).toHaveLength(1);
			expect(stored[0].state).toBe(DataspaceProtocolContractNegotiationStateType.AGREED);
			expect(stored[0].callbackAddress).toBeUndefined();
			expect(stored[0].agreement).toBeDefined();
		});

		test("sendRequestToProvider persists the requested offer on the consumer's own record", async () => {
			// Regression for review Finding 6: previously this record only ever had `offer`
			// populated by offerFromProvider (the OFFERED step), which the direct-agreement fast
			// path never runs - leaving `offer` permanently undefined for fast-path negotiations
			// and silently disabling the agreementOfferIdCollision guard (which compares the
			// agreement's id against this field) further down the line. sendRequestToProvider now
			// persists it directly, regardless of which path the negotiation later takes.
			const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

			const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-provider-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				config: { callbackPath: "/callback" }
			});
			providerPoints.provider = policyNegotiationProviderPoint;
			providerPoints.consumer = policyNegotiationConsumerPoint;
			remoteComponentResolver = (params: { endpoint: string }) => {
				if (params.endpoint.startsWith(providerOrigin)) {
					return createRemoteComponent(providerPoints.provider, providerOrigin);
				}
				if (params.endpoint.startsWith(consumerOrigin)) {
					return createRemoteComponent(providerPoints.consumer, consumerOrigin);
				}
				throw new TypeError(`Unknown remote url ${params.endpoint}`);
			};

			PolicyRequesterFactory.register("requester-offer-persisted", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);
			mockNegotiator.handleOffer = vi.fn(async () => ({
				accepted: true,
				interventionRequired: false,
				directAgreement: true
			}));
			PolicyNegotiatorFactory.register("MockPolicyNegotiator", () => mockNegotiator);

			const consumerPid = await policyNegotiationConsumerPoint.sendRequestToProvider(
				providerOrigin,
				"requester-offer-persisted",
				"urn:policy:offer-1",
				consumerOrigin
			);

			const consumerStore = await policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(consumerStore).toHaveLength(1);
			expect(consumerStore[0].id).toBe(consumerPid);
			expect(consumerStore[0].offer?.["@id"]).toBe("urn:policy:offer-1");

			// The existing (unmodified) "event(FINALIZED) fails loudly ... offer id" test proves
			// the agreementOfferIdCollision guard itself works correctly once this field is
			// populated - the two tests together cover Finding 6 end-to-end.
		});
	});
});
