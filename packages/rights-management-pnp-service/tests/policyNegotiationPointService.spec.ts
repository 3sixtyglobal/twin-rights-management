// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	TaskSchedulerService,
	initSchema as initSchemaScheduler,
	type ScheduledTask
} from "@twin.org/background-task-scheduler";
import { ContextIdKeys, ContextIdStore } from "@twin.org/context";
import { ComponentFactory, Factory, Is } from "@twin.org/core";
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
		requestFromConsumer: async (message, trustPayload, publicOrigin) =>
			target.requestFromConsumer(message, trustPayload, targetOrigin),
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
		initSchemaScheduler();
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

		EntityStorageConnectorFactory.register(
			"scheduled-task",
			() =>
				new MemoryEntityStorageConnector<ScheduledTask>({
					entitySchema: nameof<ScheduledTask>()
				})
		);

		const taskSchedulerComponent = new TaskSchedulerService({ config: { intervalMs: 500 } });
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
			"@id": "urn:policy:offer-1",
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

		ComponentFactory.register("platform", () => ({
			className: () => "MockPlatformComponent",
			isMultiTenant: () => false,
			execute: async (method: () => Promise<void>) => method()
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
			[ContextIdKeys.Organization]: testOrganizationId
		}));
	});

	afterEach(() => {
		vi.restoreAllMocks();
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
				"@context": "http://www.w3.org/ns/odrl.jsonld",
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

		const consumerStore = policyNegotiationConsumerMemoryEntityStorage.getStore();
		expect(consumerStore).toHaveLength(1);
		const providerStore = policyNegotiationProviderMemoryEntityStorage.getStore();
		expect(providerStore).toHaveLength(1);

		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "ACCEPTED", "consumer");

		const consumerStore2 = policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore2 = policyNegotiationProviderMemoryEntityStorage.getStore();

		// The consumer has ACCEPTED the offer
		expect(consumerStore2[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore2[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
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

		const consumerStore3 = policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore3 = policyNegotiationProviderMemoryEntityStorage.getStore();

		// The provider has not yet received the ACCEPTED state, so is still in OFFERED state
		expect(providerStore3[0]).toMatchObject({
			id: consumerStore3[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			state: "OFFERED"
		});

		// We wait for the consumer to respond with the ACCEPTED state
		await waitForState(policyNegotiationProviderMemoryEntityStorage, "ACCEPTED", "provider");

		const consumerStore4 = policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore4 = policyNegotiationProviderMemoryEntityStorage.getStore();

		// Now the provider should also have the ACCEPTED state
		expect(providerStore4[0]).toMatchObject({
			id: consumerStore4[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			state: "ACCEPTED"
		});

		// Now we wait for the provider to send the AGREED state
		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "AGREED", "consumer");

		const consumerStore5 = policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore5 = policyNegotiationProviderMemoryEntityStorage.getStore();

		// The consumer has now received the AGREED state
		expect(consumerStore5[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore5[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Agreement",
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "AGREED"
		});

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "AGREED", "provider");

		const consumerStore6 = policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore6 = policyNegotiationProviderMemoryEntityStorage.getStore();

		// The provider has now also set the AGREED state
		expect(providerStore6[0]).toMatchObject({
			id: consumerStore6[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Agreement",
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "AGREED"
		});

		// Now we wait for the consumer to VERIFIED the agreement
		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "VERIFIED", "consumer");

		const consumerStore7 = policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore7 = policyNegotiationProviderMemoryEntityStorage.getStore();

		// The consumer has now VERIFIED the agreement
		expect(consumerStore7[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore7[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Agreement",
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "VERIFIED"
		});

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "FINALIZED", "provider");

		const consumerStore8 = policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore8 = policyNegotiationProviderMemoryEntityStorage.getStore();

		expect(providerStore8[0]).toMatchObject({
			id: consumerStore8[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Agreement",
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "FINALIZED"
		});

		// Now we wait for the consumer to received the FINALIZED state
		await waitForState(policyNegotiationConsumerMemoryEntityStorage, "FINALIZED", "consumer");

		const consumerStore9 = policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore9 = policyNegotiationProviderMemoryEntityStorage.getStore();

		expect(consumerStore9[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore9[0].id,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "requester-2",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Agreement",
				"@id": "urn:policy:agreement-1",
				assigner: testIdentityProvider,
				assignee: testIdentityConsumer
			},
			state: "FINALIZED"
		});

		await waitForState(policyNegotiationProviderMemoryEntityStorage, "FINALIZED", "provider");

		const consumerStore10 = policyNegotiationConsumerMemoryEntityStorage.getStore();
		const providerStore10 = policyNegotiationProviderMemoryEntityStorage.getStore();

		expect(providerStore10[0]).toMatchObject({
			id: consumerStore10[0].correlationId,
			correlationId: consumerPid,
			dateCreated: expect.any(String),
			expires: expect.any(Number),
			handlerId: "MockPolicyNegotiator",
			offer: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
				"@type": "Offer",
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			agreement: {
				"@context": "http://www.w3.org/ns/odrl.jsonld",
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
			const snapshot = policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(snapshot).toHaveLength(1);
			await policyNegotiationProviderMemoryEntityStorage.remove(snapshot[0].id);

			await new Promise(resolve => setTimeout(resolve, 300));

			expect(policyNegotiationProviderMemoryEntityStorage.getStore()).toHaveLength(0);
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
			const snapshot = policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(snapshot).toHaveLength(1);
			await negotiationProviderAdminPointComponent.set({
				...snapshot[0],
				state: DataspaceProtocolContractNegotiationStateType.TERMINATED
			});

			await new Promise(resolve => setTimeout(resolve, 300));

			// sendOfferToConsumer must have aborted: state stays TERMINATED, not overwritten with OFFERED
			const final = policyNegotiationProviderMemoryEntityStorage.getStore();
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
					const providerSnapshot = policyNegotiationProviderMemoryEntityStorage.getStore();
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
			const final = policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(final.length).toBeGreaterThan(0);
			expect(final[0].state).toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
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
						const consumerSnapshot = policyNegotiationConsumerMemoryEntityStorage.getStore();
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
			const final = policyNegotiationConsumerMemoryEntityStorage.getStore();
			expect(final.length).toBeGreaterThan(0);
			expect(final[0].state).toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
		});

		test("terminateIfResponseError does not resurrect record deleted before it runs — issue #162", async () => {
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
						const store = policyNegotiationProviderMemoryEntityStorage.getStore();
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
			const store = policyNegotiationProviderMemoryEntityStorage.getStore();
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
			// To truly close this race, a storage-layer atomic conditional write is needed
			// (Option A from the issue #162 plan: UPDATE ... WHERE id = ? that no-ops if deleted).

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
					const snapshot = policyNegotiationProviderMemoryEntityStorage.getStore();
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
			const toctouStore = policyNegotiationProviderMemoryEntityStorage.getStore();
			expect(toctouStore).toHaveLength(1);
			expect(toctouStore[0].state).toBe(DataspaceProtocolContractNegotiationStateType.TERMINATED);
			expect(toctouStore[0].code).toBe("consumer.rejectedOffer");
		});
	});

	describe("callbackAddress is optional per DSP spec (issue #130)", () => {
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
				`token:${testIdentityConsumer}`,
				providerOrigin
			);

			expect(result["@type"]).toBe(DataspaceProtocolContractNegotiationTypes.ContractNegotiation);
			if ("state" in result) {
				expect(result.state).toBe(DataspaceProtocolContractNegotiationStateType.REQUESTED);
			}

			const stored = policyNegotiationProviderMemoryEntityStorage.getStore();
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
				`token:${testIdentityConsumer}`,
				providerOrigin
			);

			// Wait past the setTimeout(100) the auto-accept path uses to schedule sendOfferToConsumer.
			await new Promise(resolve => setTimeout(resolve, 250));

			// sendOfferToConsumer advances state to OFFERED regardless of callbackAddress;
			// only the HTTP push to the consumer is gated on the callback being present. A polling
			// client observes the OFFERED transition via GET /negotiations/admin/:id.
			const stored = policyNegotiationProviderMemoryEntityStorage.getStore();
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

			const stored = policyNegotiationProviderMemoryEntityStorage.getStore();
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

			const stored = policyNegotiationConsumerMemoryEntityStorage.getStore();
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

			const stored = policyNegotiationConsumerMemoryEntityStorage.getStore();
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
			const stored = policyNegotiationConsumerMemoryEntityStorage.getStore();
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
});
