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
		requestFromConsumer: async (message, trustPayload, _publicOrigin) =>
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

		ComponentFactory.register("url-transformer", () => ({
			className: () => "MockUrlTransformerComponent",
			addEncryptedQueryParamToUrl: vi.fn(async (url: string, _id: string, _value: string) => url)
		}));

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
			offer: undefined,
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
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
			},
			state: "ACCEPTED"
		});

		// After offerFromProvider, trustVerificationInfo should be set to the provider's identity
		expect(consumerStore[0].trustVerificationInfo).toEqual({
			identity: testIdentityProvider
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
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
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
				"@id": "urn:policy:offer-1",
				assigner: testIdentityProvider
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

		expect(consumerStore[0]).toMatchObject({
			id: consumerPid,
			correlationId: providerStore[0].id,
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
			const resolver = (): IPolicyNegotiationPointComponent =>
				({
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
				}) as unknown as IPolicyNegotiationPointComponent;
			remoteComponentResolver = resolver;

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
			expect(stored?.tenantId).toBe(TEST_TENANT_ID);
		});

		test("encrypts the outbound callbackAddress when url transformer component is configured", async () => {
			setupTenantContextIds();

			const mockUrlTransformerComponent = {
				className: () => "MockUrlTransformerComponent",
				addEncryptedQueryParamToUrl: vi.fn(
					async (url: string, _id: string, _value: string) => `${url}?tenant=fake-encrypted-token`
				)
			};
			ComponentFactory.register("mock-url-transformer", () => mockUrlTransformerComponent);

			let capturedCallbackAddress: string | undefined;
			const resolver = (): IPolicyNegotiationPointComponent =>
				({
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
				}) as unknown as IPolicyNegotiationPointComponent;
			remoteComponentResolver = resolver;

			PolicyRequesterFactory.register("MockPolicyRequester", () => mockPolicyRequester);
			await adminPointComponent.create(mockOffer);

			const consumer = new PolicyNegotiationPointService({
				policyNegotiationAdministrationPointComponentType:
					"policy-negotiation-consumer-admin-point",
				policyNegotiationPointRemoteComponentType: "pnp-remote",
				urlTransformerComponentType: "mock-url-transformer",
				config: { callbackPath: "/callback" }
			});

			await consumer.sendRequestToProvider(
				providerOrigin,
				"MockPolicyRequester",
				"urn:policy:offer-1",
				consumerOrigin
			);

			expect(mockUrlTransformerComponent.addEncryptedQueryParamToUrl).toHaveBeenCalledWith(
				`${consumerOrigin}/callback`,
				"tenant",
				TEST_TENANT_ID
			);
			expect(capturedCallbackAddress).toBe(
				`${consumerOrigin}/callback?tenant=fake-encrypted-token`
			);
		});

		test("returns raw callbackAddress when hosting component is absent", async () => {
			setupTenantContextIds();

			let capturedCallbackAddress: string | undefined;
			const resolver = (): IPolicyNegotiationPointComponent =>
				({
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
				}) as unknown as IPolicyNegotiationPointComponent;
			remoteComponentResolver = resolver;

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

			expect(capturedCallbackAddress).toBe(`${consumerOrigin}/callback`);
		});
	});
});
