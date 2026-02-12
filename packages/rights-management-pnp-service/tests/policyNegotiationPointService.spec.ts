// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { TaskSchedulerService } from "@twin.org/background-task-scheduler";
import { ContextIdStore } from "@twin.org/context";
import { ComponentFactory, Factory } from "@twin.org/core";
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
	initSchema as initSchemaPolicyAdministrationPoint,
	type OdrlPolicy
} from "@twin.org/rights-management-pap-service";
import { PolicyInformationPointService } from "@twin.org/rights-management-pip-service";
import { OdrlContexts, OdrlTypes, type IOdrlOffer } from "@twin.org/standards-w3c-odrl";
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
let mockOffer: IOdrlOffer;
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
		requestFromConsumer: async (message, _publicOrigin, trustPayload) =>
			target.requestFromConsumer(message, targetOrigin, trustPayload),
		offerFromProvider: async (message, _publicOrigin, trustPayload) =>
			target.offerFromProvider(message, targetOrigin, trustPayload),
		agreementFromProvider: async (message, _publicOrigin, trustPayload) =>
			target.agreementFromProvider(message, targetOrigin, trustPayload),
		agreementVerificationFromConsumer: async (message, _publicOrigin, trustPayload) =>
			target.agreementVerificationFromConsumer(message, targetOrigin, trustPayload),
		event: async (message, destination, _publicOrigin, trustPayload) =>
			target.event(message, destination, targetOrigin, trustPayload),
		terminate: async (message, destination, trustPayload) =>
			target.terminate(message, destination, trustPayload)
	};
}

/**
 * Helper to resolve remote components based on the url.
 * This is set in the beforeEach of the tests to return the correct component based on the url.
 * @throws If the url is not recognized or if the resolver is not configured.
 */
let remoteComponentResolver: (url: string) => IPolicyNegotiationPointComponent = () => {
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
		const store = storage.getStore();
		if (store[0].state === state) {
			return;
		}
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	console.debug(storage.getStore()[0]);
	throw new Error(`Timeout waiting for state ${state} for ${entity}`);
}

let testOrganizationId: string;

describe("PolicyNegotiationPointService", () => {
	beforeEach(async () => {
		Factory.clearFactories();
		vi.clearAllMocks();

		initSchemaLogging();
		initSchemaPolicyAdministrationPoint();
		initSchemaVault();
		initSchemaIdentity();
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());

		const taskSchedulerComponent = new TaskSchedulerService({ config: { overrideInterval: 0.5 } });
		ComponentFactory.register("task-scheduler", () => taskSchedulerComponent);

		EntityStorageConnectorFactory.register(
			"vault-key",
			() =>
				new MemoryEntityStorageConnector<VaultKey>({
					entitySchema: nameof<VaultKey>()
				})
		);
		const secretEntityStorage = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>()
		});
		EntityStorageConnectorFactory.register("vault-secret", () => secretEntityStorage);

		const vaultConnector = new EntityStorageVaultConnector();
		VaultConnectorFactory.register("vault", () => vaultConnector);

		const identityDocumentEntityStorage = new MemoryEntityStorageConnector<IdentityDocument>({
			entitySchema: nameof<IdentityDocument>()
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
			uid: "urn:policy:offer-1",
			assigner: testIdentityProvider
		};

		odrlPolicyMemoryEntityStorage = new MemoryEntityStorageConnector<OdrlPolicy>({
			entitySchema: nameof<OdrlPolicy>()
		});
		EntityStorageConnectorFactory.register("odrl-policy", () => odrlPolicyMemoryEntityStorage);

		policyNegotiationProviderMemoryEntityStorage =
			new MemoryEntityStorageConnector<PolicyNegotiation>({
				entitySchema: nameof<PolicyNegotiation>()
			});
		EntityStorageConnectorFactory.register(
			"policy-negotiation-provider",
			() => policyNegotiationProviderMemoryEntityStorage
		);

		policyNegotiationConsumerMemoryEntityStorage =
			new MemoryEntityStorageConnector<PolicyNegotiation>({
				entitySchema: nameof<PolicyNegotiation>()
			});
		EntityStorageConnectorFactory.register(
			"policy-negotiation-consumer",
			() => policyNegotiationConsumerMemoryEntityStorage
		);

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
			if (typeof args !== "string") {
				throw new TypeError("pnp-remote expects a url string argument");
			}
			return remoteComponentResolver(args);
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
			supportsOffer: vi.fn((offer: IOdrlOffer) => true),
			handleOffer: vi.fn(async (offer: IOdrlOffer) => ({
				accepted: true,
				interventionRequired: false
			})),
			createAgreement: vi.fn(async (offer: IOdrlOffer) => ({
				"@context": OdrlContexts.Context,
				"@type": OdrlTypes.Agreement,
				uid: "urn:policy:agreement-1",
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
		ContextIdStore.getContextIds = vi
			.fn()
			.mockImplementation(() => ({ organization: testOrganizationId }));
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("can create the service", async () => {
		const policyNegotiationPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			remoteNegotiationComponentType: "pnp-remote",
			config: {
				callbackPath: "/callback"
			}
		});
		expect(policyNegotiationPoint).toBeInstanceOf(PolicyNegotiationPointService);
	});

	test("can request a new negotiation and fail with no available requester", async () => {
		const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

		const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-consumer-admin-point",
			remoteNegotiationComponentType: "pnp-remote",
			config: {
				callbackPath: "/callback"
			}
		});

		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			remoteNegotiationComponentType: "pnp-remote",
			config: {
				callbackPath: "/callback"
			}
		});
		providerPoints.provider = policyNegotiationProviderPoint;
		providerPoints.consumer = policyNegotiationConsumerPoint;
		remoteComponentResolver = (url: string) => {
			if (url.startsWith(providerOrigin)) {
				return createRemoteComponent(providerPoints.provider, providerOrigin);
			}
			if (url.startsWith(consumerOrigin)) {
				return createRemoteComponent(providerPoints.consumer, consumerOrigin);
			}
			throw new TypeError(`Unknown remote url ${url}`);
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
			remoteNegotiationComponentType: "pnp-remote",
			config: {
				callbackPath: "/callback"
			}
		});

		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			remoteNegotiationComponentType: "pnp-remote",
			config: {
				callbackPath: "/callback"
			}
		});
		providerPoints.provider = policyNegotiationProviderPoint;
		providerPoints.consumer = policyNegotiationConsumerPoint;
		remoteComponentResolver = (url: string) => {
			if (url.startsWith(providerOrigin)) {
				return createRemoteComponent(providerPoints.provider, providerOrigin);
			}
			if (url.startsWith(consumerOrigin)) {
				return createRemoteComponent(providerPoints.consumer, consumerOrigin);
			}
			throw new TypeError(`Unknown remote url ${url}`);
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
			remoteNegotiationComponentType: "pnp-remote",
			config: {
				callbackPath: "/callback"
			}
		});

		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			remoteNegotiationComponentType: "pnp-remote",
			config: {
				callbackPath: "/callback"
			}
		});
		providerPoints.provider = policyNegotiationProviderPoint;
		providerPoints.consumer = policyNegotiationConsumerPoint;
		remoteComponentResolver = (url: string) => {
			if (url.startsWith(providerOrigin)) {
				return createRemoteComponent(providerPoints.provider, providerOrigin);
			}
			if (url.startsWith(consumerOrigin)) {
				return createRemoteComponent(providerPoints.consumer, consumerOrigin);
			}
			throw new TypeError(`Unknown remote url ${url}`);
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
			remoteNegotiationComponentType: "pnp-remote",
			config: {
				callbackPath: "/callback"
			}
		});

		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			remoteNegotiationComponentType: "pnp-remote",
			config: {
				callbackPath: "/callback"
			}
		});
		providerPoints.provider = policyNegotiationProviderPoint;
		providerPoints.consumer = policyNegotiationConsumerPoint;
		remoteComponentResolver = (url: string) => {
			if (url.startsWith(providerOrigin)) {
				return createRemoteComponent(providerPoints.provider, providerOrigin);
			}
			if (url.startsWith(consumerOrigin)) {
				return createRemoteComponent(providerPoints.consumer, consumerOrigin);
			}
			throw new TypeError(`Unknown remote url ${url}`);
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

		const consumerStore = policyNegotiationConsumerMemoryEntityStorage.getStore();
		expect(consumerStore).toHaveLength(1);
		const providerStore = policyNegotiationProviderMemoryEntityStorage.getStore();
		expect(providerStore).toHaveLength(1);

		expect(consumerStore[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-1",
			offer: undefined,
			state: "REQUESTED"
		});

		expect(providerStore[0]).toMatchObject({
			id: consumerStore[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				assigner: testIdentityProvider,
				uid: "urn:policy:offer-1"
			},
			state: "REQUESTED"
		});
	});

	test("can perform the whole negotiation lifecycle", async () => {
		const providerPoints: { [id: string]: PolicyNegotiationPointService } = {};

		const policyNegotiationConsumerPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-consumer-admin-point",
			remoteNegotiationComponentType: "pnp-remote",
			config: {
				callbackPath: "/callback"
			}
		});

		const policyNegotiationProviderPoint = new PolicyNegotiationPointService({
			policyNegotiationAdministrationPointComponentType: "policy-negotiation-provider-admin-point",
			remoteNegotiationComponentType: "pnp-remote",
			config: {
				callbackPath: "/callback"
			}
		});
		providerPoints.provider = policyNegotiationProviderPoint;
		providerPoints.consumer = policyNegotiationConsumerPoint;
		remoteComponentResolver = (url: string) => {
			if (url.startsWith(providerOrigin)) {
				return createRemoteComponent(providerPoints.provider, providerOrigin);
			}
			if (url.startsWith(consumerOrigin)) {
				return createRemoteComponent(providerPoints.consumer, consumerOrigin);
			}
			throw new TypeError(`Unknown remote url ${url}`);
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

		const consumerStore = policyNegotiationConsumerMemoryEntityStorage.getStore();
		expect(consumerStore).toHaveLength(1);
		const providerStore = policyNegotiationProviderMemoryEntityStorage.getStore();
		expect(providerStore).toHaveLength(1);

		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "ACCEPTED", "consumer");

		// The consumer has ACCEPTED the offer
		expect(consumerStore[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				assigner: testIdentityProvider,
				uid: "urn:policy:offer-1"
			},
			state: "ACCEPTED"
		});

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "OFFERED", "provider");

		// The provider has not yet received the ACCEPTED state, so is still in OFFERED state
		expect(providerStore[0]).toMatchObject({
			id: consumerStore[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				assigner: testIdentityProvider,
				uid: "urn:policy:offer-1"
			},
			state: "OFFERED"
		});

		// We wait for the consumer to respond with the ACCEPTED state
		await waitForState(policyNegotiationProviderMemoryEntityStorage, "ACCEPTED", "provider");

		// Now the provider should also have the ACCEPTED state
		expect(providerStore[0]).toMatchObject({
			id: consumerStore[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				assigner: testIdentityProvider,
				uid: "urn:policy:offer-1"
			},
			state: "ACCEPTED"
		});

		// Now we wait for the provider to send the AGREED state
		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "AGREED", "consumer");

		// The consumer has now received the AGREED state
		expect(consumerStore[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				assigner: testIdentityProvider,
				uid: "urn:policy:offer-1"
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Agreement",
				uid: "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "AGREED"
		});

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "AGREED", "provider");

		// The provider has now also set the AGREED state
		expect(providerStore[0]).toMatchObject({
			id: consumerStore[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				assigner: testIdentityProvider,
				uid: "urn:policy:offer-1"
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Agreement",
				uid: "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "AGREED"
		});

		// Now we wait for the consumer to VERIFIED the agreement
		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "VERIFIED", "consumer");

		// The consumer has now VERIFIED the agreement
		expect(consumerStore[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				assigner: testIdentityProvider,
				uid: "urn:policy:offer-1"
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Agreement",
				uid: "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "VERIFIED"
		});

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "FINALIZED", "provider");

		expect(providerStore[0]).toMatchObject({
			id: consumerStore[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				assigner: testIdentityProvider,
				uid: "urn:policy:offer-1"
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Agreement",
				uid: "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "FINALIZED"
		});

		// Now we wait for the consumer to received the FINALIZED state
		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "FINALIZED", "consumer");

		expect(consumerStore[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				assigner: testIdentityProvider,
				uid: "urn:policy:offer-1"
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Agreement",
				uid: "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "FINALIZED"
		});

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "FINALIZED", "provider");

		expect(providerStore[0]).toMatchObject({
			id: consumerStore[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				assigner: testIdentityProvider,
				uid: "urn:policy:offer-1"
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Agreement",
				uid: "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "FINALIZED"
		});

		expect(mockNegotiator.supportsOffer).toHaveBeenCalledTimes(2);
		expect(mockNegotiator.createAgreement).toHaveBeenCalledTimes(1);
		expect(mockNegotiator.handleOffer).toHaveBeenCalledTimes(1);

		expect(mockPolicyRequester.offer).toHaveBeenCalledTimes(1);
		expect(mockPolicyRequester.agreement).toHaveBeenCalledTimes(1);
		expect(mockPolicyRequester.finalised).toHaveBeenCalledTimes(1);
		expect(mockPolicyRequester.terminated).toHaveBeenCalledTimes(0);
	});
});
