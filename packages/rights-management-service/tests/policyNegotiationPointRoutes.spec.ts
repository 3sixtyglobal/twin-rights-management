// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IHostingComponent, IHttpRequestContext } from "@twin.org/api-models";
import { ComponentFactory, Factory } from "@twin.org/core";
import type {
	IPnpNegotiateRequest,
	IPnpOfferRequest,
	IPolicyNegotiationPointComponent
} from "@twin.org/rights-management-models";
import {
	DataspaceProtocolContexts,
	DataspaceProtocolContractNegotiationStateType,
	DataspaceProtocolContractNegotiationTypes,
	type IDataspaceProtocolContractNegotiation
} from "@twin.org/standards-dataspace-protocol";
import { OdrlTypes } from "@twin.org/standards-w3c-odrl";
import { HeaderTypes, MimeTypes } from "@twin.org/web";
import {
	generateRestRoutesPolicyNegotiationPoint,
	pnpNegotiationOffer,
	pnpNegotiationRequest
} from "../src/policyNegotiationPointRoutes.js";

const TEST_PUBLIC_ORIGIN = "http://localhost:3000";

const mockContractNegotiation: IDataspaceProtocolContractNegotiation = {
	"@context": DataspaceProtocolContexts.Context,
	"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiation,
	providerPid: "urn:negotiation:provider-1",
	consumerPid: "urn:negotiation:consumer-1",
	state: DataspaceProtocolContractNegotiationStateType.REQUESTED
};

const mockHostingComponent: IHostingComponent = {
	className: () => "MockHostingComponent",
	getPublicOrigin: vi.fn(async () => TEST_PUBLIC_ORIGIN),
	getTenantOrigin: vi.fn(async () => undefined),
	buildPublicUrl: vi.fn(async (url: string) => `${TEST_PUBLIC_ORIGIN}${url}`),
	matchesLocalOrigin: vi.fn(async () => undefined)
};

const mockPnpComponent: IPolicyNegotiationPointComponent = {
	className: () => "MockPnpComponent",
	getNegotiation: vi.fn(),
	sendRequestToProvider: vi.fn(),
	requestFromConsumer: vi.fn(async () => mockContractNegotiation),
	offerFromProvider: vi.fn(async () => mockContractNegotiation),
	agreementFromProvider: vi.fn(),
	agreementVerificationFromConsumer: vi.fn(),
	event: vi.fn(),
	terminate: vi.fn(),
	sendTerminateToConsumer: vi.fn()
};

const mockHttpRequestContext: IHttpRequestContext = {
	serverRequest: { url: "http://localhost:3000/rights-management/negotiations" },
	hostingComponentType: "hosting",
	processorState: {}
};

describe("generateRestRoutesPolicyNegotiationPoint route flags", () => {
	const routes = generateRestRoutesPolicyNegotiationPoint("rights-management", "pnp");

	test("generates exactly 9 PNP routes", () => {
		expect(routes).toHaveLength(9);
	});

	test.each(routes)(
		"$operationId should have skipAuth: true and skipTenant unset (tenant key required via tenantToken)",
		route => {
			expect(route.skipAuth, `${route.operationId} is missing skipAuth: true`).toBe(true);
			expect(
				route.skipTenant ?? false,
				`${route.operationId} should not set skipTenant: true (tenant context required via encrypted tenantToken)`
			).toBe(false);
		}
	);
});

describe("policyNegotiationPointRoutes", () => {
	beforeEach(() => {
		Factory.clearFactories();
		vi.clearAllMocks();

		ComponentFactory.register("hosting", () => mockHostingComponent);
		ComponentFactory.register("pnp", () => mockPnpComponent);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("pnpNegotiationRequest returns body when pathParams.id is set (update path)", async () => {
		const request: IPnpNegotiateRequest = {
			headers: {
				[HeaderTypes.Accept]: MimeTypes.Json
			},
			pathParams: {
				id: "urn:negotiation:consumer-1"
			},
			body: {
				"@context": DataspaceProtocolContexts.Context,
				"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
				consumerPid: "urn:negotiation:consumer-1",
				offer: {
					"@type": OdrlTypes.Offer,
					"@id": "urn:policy:offer-1",
					assigner: "did:iota:provider"
				},
				callbackAddress: "http://localhost:4000"
			}
		};

		const response = await pnpNegotiationRequest(mockHttpRequestContext, "pnp", request);

		expect(response.body).toBeDefined();
		expect(response.body).toEqual(mockContractNegotiation);
	});

	test("pnpNegotiationRequest returns body when pathParams.id is not set (create path)", async () => {
		const request: IPnpNegotiateRequest = {
			headers: {
				[HeaderTypes.Accept]: MimeTypes.Json
			},
			body: {
				"@context": DataspaceProtocolContexts.Context,
				"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
				consumerPid: "urn:negotiation:consumer-1",
				offer: {
					"@type": OdrlTypes.Offer,
					"@id": "urn:policy:offer-1",
					assigner: "did:iota:provider"
				},
				callbackAddress: "http://localhost:4000"
			}
		};

		const response = await pnpNegotiationRequest(mockHttpRequestContext, "pnp", request);

		expect(response.body).toBeDefined();
		expect(response.body).toEqual(mockContractNegotiation);
		expect(response.statusCode).toBe(201);
	});

	test("pnpNegotiationOffer returns body when pathParams.id is set (update path)", async () => {
		const request: IPnpOfferRequest = {
			headers: {
				[HeaderTypes.Accept]: MimeTypes.Json
			},
			pathParams: {
				id: "urn:negotiation:consumer-1"
			},
			body: {
				"@context": DataspaceProtocolContexts.Context,
				"@type": DataspaceProtocolContractNegotiationTypes.ContractOfferMessage,
				providerPid: "urn:negotiation:provider-1",
				offer: {
					"@type": OdrlTypes.Offer,
					"@id": "urn:policy:offer-1",
					assigner: "did:iota:provider"
				},
				callbackAddress: "http://localhost:3000"
			}
		};

		const response = await pnpNegotiationOffer(mockHttpRequestContext, "pnp", request);

		expect(response.body).toBeDefined();
		expect(response.body).toEqual(mockContractNegotiation);
	});

	test("pnpNegotiationOffer returns body when pathParams.id is not set (create path)", async () => {
		const request: IPnpOfferRequest = {
			headers: {
				[HeaderTypes.Accept]: MimeTypes.Json
			},
			body: {
				"@context": DataspaceProtocolContexts.Context,
				"@type": DataspaceProtocolContractNegotiationTypes.ContractOfferMessage,
				providerPid: "urn:negotiation:provider-1",
				offer: {
					"@type": OdrlTypes.Offer,
					"@id": "urn:policy:offer-1",
					assigner: "did:iota:provider"
				},
				callbackAddress: "http://localhost:3000"
			}
		};

		const response = await pnpNegotiationOffer(mockHttpRequestContext, "pnp", request);

		expect(response.body).toBeDefined();
		expect(response.body).toEqual(mockContractNegotiation);
		expect(response.statusCode).toBe(201);
	});
});
