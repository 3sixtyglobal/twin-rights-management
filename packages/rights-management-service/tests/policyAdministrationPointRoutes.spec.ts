// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HttpHeaderHelper, type IHttpRequestContext } from "@twin.org/api-models";
import { ComponentFactory, Factory } from "@twin.org/core";
import type {
	IPapCreateRequest,
	IPolicyAdministrationPointComponent
} from "@twin.org/rights-management-models";
import { OdrlContexts, OdrlTypes } from "@twin.org/standards-w3c-odrl";
import { HeaderTypes, HttpStatusCode } from "@twin.org/web";
import { papCreate } from "../src/policyAdministrationPointRoutes.js";

const BASE_ROUTE_NAME = "rights-management";
const POLICY_UID = "urn:rights-management:abc123def456";

const mockPapComponent: IPolicyAdministrationPointComponent = {
	className: () => "MockPapComponent",
	create: vi.fn(async () => POLICY_UID),
	update: vi.fn(),
	get: vi.fn(),
	getAgreement: vi.fn(),
	getSet: vi.fn(),
	getOffer: vi.fn(),
	remove: vi.fn(),
	query: vi.fn()
};

const mockHttpRequestContext: IHttpRequestContext = {
	serverRequest: { url: "http://localhost:3000/rights-management/policy/admin" },
	processorState: {}
};

const createRequest: IPapCreateRequest = {
	body: {
		"@context": OdrlContexts.Context,
		"@type": OdrlTypes.Set,
		permission: [
			{
				target: "http://example.com/asset/1",
				action: "use"
			}
		]
	}
};

describe("policyAdministrationPointRoutes", () => {
	beforeEach(() => {
		Factory.clearFactories();
		vi.clearAllMocks();

		ComponentFactory.register("pap", () => mockPapComponent);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("papCreate returns 201 with the templated Location header", async () => {
		const response = await papCreate(mockHttpRequestContext, "pap", createRequest, BASE_ROUTE_NAME);

		expect(mockPapComponent.create).toHaveBeenCalledWith(createRequest.body);
		expect(response.statusCode).toEqual(HttpStatusCode.created);
		expect(response.headers?.[HeaderTypes.Location]).toEqual(
			`/${BASE_ROUTE_NAME}/policy/admin/${encodeURIComponent(POLICY_UID)}`
		);
	});

	test("papCreate Location header resolves the uid through the rest client extractId template", async () => {
		const response = await papCreate(mockHttpRequestContext, "pap", createRequest, BASE_ROUTE_NAME);

		expect(
			HttpHeaderHelper.extractId(response.headers, `${BASE_ROUTE_NAME}/policy/admin/:id`)
		).toEqual(POLICY_UID);
	});
});
