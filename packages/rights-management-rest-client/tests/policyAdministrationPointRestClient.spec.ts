// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GuardError } from "@twin.org/core";
import { SortDirection } from "@twin.org/entity";
import type {
	IRightsManagementAgreement,
	IRightsManagementOffer,
	IRightsManagementPolicy,
	IRightsManagementSet
} from "@twin.org/rights-management-models";
import { OdrlContexts, OdrlTypes } from "@twin.org/standards-w3c-odrl";
import { HttpMethod } from "@twin.org/web";
import { PolicyAdministrationPointRestClient } from "../src/policyAdministrationPointRestClient.js";
import {
	createdResponse,
	jsonResponse,
	noContentResponse,
	setupFetchMock,
	teardownFetchMock
} from "./helpers/restClientTestHelpers.js";

// OpenAPI spec: ../../rights-management-service/docs/open-api/spec.json
const ENDPOINT = "http://localhost:8080";
const PREFIX = "rights-management";

const POLICY_ID = "urn:rm:policy:test001";
const AGREEMENT_ID = "urn:rm:agreement:test001";
const SET_ID = "urn:rm:set:test001";
const OFFER_ID = "urn:rm:offer:test001";
const LOCATION = `${ENDPOINT}/${PREFIX}/policy/admin/${POLICY_ID}`;

const TEST_POLICY: IRightsManagementPolicy = {
	"@context": OdrlContexts.Context,
	"@type": OdrlTypes.Set,
	"@id": POLICY_ID,
	assigner: "urn:did:assigner:001",
	target: "urn:dataset:target:001"
};

const TEST_AGREEMENT: IRightsManagementAgreement = {
	"@context": OdrlContexts.Context,
	"@type": OdrlTypes.Agreement,
	"@id": AGREEMENT_ID,
	assigner: "urn:did:assigner:001",
	assignee: "urn:did:assignee:001"
};

const TEST_SET: IRightsManagementSet = {
	"@context": OdrlContexts.Context,
	"@type": OdrlTypes.Set,
	"@id": SET_ID
};

const TEST_OFFER: IRightsManagementOffer = {
	"@context": OdrlContexts.Context,
	"@type": OdrlTypes.Offer,
	"@id": OFFER_ID,
	assigner: "urn:did:assigner:001"
};

const fetchMock = vi.fn();

describe("PolicyAdministrationPointRestClient", () => {
	let client: PolicyAdministrationPointRestClient;

	beforeEach(() => {
		setupFetchMock(fetchMock);
		client = new PolicyAdministrationPointRestClient({ endpoint: ENDPOINT });
	});

	afterEach(() => {
		teardownFetchMock(fetchMock);
	});

	describe("create", () => {
		test("throws when policy is undefined", async () => {
			await expect(client.create(undefined as never)).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.objectUndefined"
			});
		});

		test("sends POST to /{prefix}/policy/admin", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.create(TEST_POLICY);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/policy/admin`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends policy as the request body", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.create(TEST_POLICY);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body["@id"]).toBe(POLICY_ID);
		});

		test("returns the policy ID", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			const result = await client.create(TEST_POLICY);

			expect(result).toBe(POLICY_ID);
		});
	});

	describe("update", () => {
		test("throws when policy is undefined", async () => {
			await expect(client.update(undefined as never)).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.objectUndefined"
			});
		});

		test("sends PUT to /{prefix}/policy/admin/:id", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.update(TEST_POLICY);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/policy/admin/${POLICY_ID}`);
			expect(options.method).toBe(HttpMethod.PUT);
		});

		test("sends policy as the request body", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.update(TEST_POLICY);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body["@id"]).toBe(POLICY_ID);
		});

		test("resolves without a return value", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			const result = await client.update(TEST_POLICY);

			expect(result).toBeUndefined();
		});
	});

	describe("get", () => {
		test("throws when policyId is empty", async () => {
			await expect(client.get("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends GET to /{prefix}/policy/admin/:id", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_POLICY));

			await client.get(POLICY_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/policy/admin/${POLICY_ID}`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("returns the policy", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_POLICY));

			const result = await client.get(POLICY_ID);

			expect(result).toEqual(TEST_POLICY);
		});
	});

	describe("getAgreement", () => {
		test("throws when agreementId is empty", async () => {
			await expect(client.getAgreement("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends GET to /{prefix}/policy/admin/agreement/:id", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_AGREEMENT));

			await client.getAgreement(AGREEMENT_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/policy/admin/agreement/${AGREEMENT_ID}`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("returns the agreement", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_AGREEMENT));

			const result = await client.getAgreement(AGREEMENT_ID);

			expect(result).toEqual(TEST_AGREEMENT);
		});
	});

	describe("getSet", () => {
		test("throws when setId is empty", async () => {
			await expect(client.getSet("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends GET to /{prefix}/policy/admin/set/:id", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_SET));

			await client.getSet(SET_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/policy/admin/set/${SET_ID}`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("returns the set", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_SET));

			const result = await client.getSet(SET_ID);

			expect(result).toEqual(TEST_SET);
		});
	});

	describe("getOffer", () => {
		test("throws when offerId is empty", async () => {
			await expect(client.getOffer("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends GET to /{prefix}/policy/admin/offer/:id", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_OFFER));

			await client.getOffer(OFFER_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/policy/admin/offer/${OFFER_ID}`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("returns the offer", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_OFFER));

			const result = await client.getOffer(OFFER_ID);

			expect(result).toEqual(TEST_OFFER);
		});
	});

	describe("remove", () => {
		test("throws when policyId is empty", async () => {
			await expect(client.remove("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends DELETE to /{prefix}/policy/admin/:id", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.remove(POLICY_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/policy/admin/${POLICY_ID}`);
			expect(options.method).toBe(HttpMethod.DELETE);
		});

		test("resolves without a return value", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			const result = await client.remove(POLICY_ID);

			expect(result).toBeUndefined();
		});
	});

	describe("query", () => {
		test("sends GET to /{prefix}/policy/admin", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_POLICY]));

			await client.query();

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toContain(`${ENDPOINT}/${PREFIX}/policy/admin`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("includes assigner query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_POLICY]));

			await client.query({ assigner: "urn:did:assigner:001" });

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("assigner=");
		});

		test("includes assignee query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_POLICY]));

			await client.query({ assignee: "urn:did:assignee:001" });

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("assignee=");
		});

		test("includes cursor query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_POLICY]));

			await client.query(undefined, undefined, "page2");

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("cursor=page2");
		});

		test("includes limit query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_POLICY]));

			await client.query(undefined, undefined, undefined, 10);

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("limit=10");
		});

		test("includes properties query parameter as comma-separated list when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_POLICY]));

			await client.query(undefined, undefined, undefined, undefined, ["@id", "@type"]);

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("properties=");
		});

		test("includes orderBy and orderByDirection query parameters when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_POLICY]));

			await client.query(
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				"dateCreated",
				SortDirection.Ascending
			);

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("orderBy=dateCreated");
			expect(url).toContain(`orderByDirection=${SortDirection.Ascending}`);
		});

		test("returns policies array", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_POLICY]));

			const result = await client.query();

			expect(result.policies).toEqual([TEST_POLICY]);
		});

		test("returns undefined cursor when no Link header is present", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_POLICY]));

			const result = await client.query();

			expect(result.cursor).toBeUndefined();
		});

		test("extracts cursor from the Link next relation header", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				status: 200,
				headers: new Headers({
					"content-type": "application/json",
					link: `<${ENDPOINT}/${PREFIX}/policy/admin?cursor=page2>; rel="next"`
				}),
				json: async () => [TEST_POLICY]
			});

			const result = await client.query();

			expect(result.cursor).toBe("page2");
		});
	});
});
