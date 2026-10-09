// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GuardError } from "@3sixty/core";
import type { IPolicyNegotiation } from "@3sixty/rights-management-models";
import { DataspaceProtocolContractNegotiationStateType } from "@3sixty/standards-dataspace-protocol";
import { HttpMethod } from "@3sixty/web";
import { PolicyNegotiationAdminPointRestClient } from "../src/policyNegotiationAdminPointRestClient.js";
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

const POLICY_ID = "urn:rm:negotiation:provider001";
const CONSUMER_PID = "urn:rm:negotiation:consumer001";
const LOCATION = `${ENDPOINT}/${PREFIX}/negotiations/admin/${POLICY_ID}`;

const TEST_NEGOTIATION: IPolicyNegotiation = {
	id: POLICY_ID,
	correlationId: CONSUMER_PID,
	dateCreated: "2026-01-01T00:00:00.000Z",
	state: DataspaceProtocolContractNegotiationStateType.REQUESTED,
	organizationIdentity: "urn:did:org:001"
};

const fetchMock = vi.fn();

describe("PolicyNegotiationAdminPointRestClient", () => {
	let client: PolicyNegotiationAdminPointRestClient;

	beforeEach(() => {
		setupFetchMock(fetchMock);
		client = new PolicyNegotiationAdminPointRestClient({ endpoint: ENDPOINT });
	});

	afterEach(() => {
		teardownFetchMock(fetchMock);
	});

	describe("create", () => {
		test("throws when id is empty", async () => {
			await expect(client.create("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends POST to /{prefix}/negotiations/admin", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.create(POLICY_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/admin`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends id in the request body", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.create(POLICY_ID);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.id).toBe(POLICY_ID);
		});

		test("returns the policy ID", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			const result = await client.create(POLICY_ID);

			expect(result).toBe(POLICY_ID);
		});
	});

	describe("get", () => {
		test("throws when policyId is empty", async () => {
			await expect(client.get("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends GET to /{prefix}/negotiations/admin/:policyId", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_NEGOTIATION));

			await client.get(POLICY_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/admin/${POLICY_ID}`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("returns the policy negotiation", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_NEGOTIATION));

			const result = await client.get(POLICY_ID);

			expect(result).toEqual(TEST_NEGOTIATION);
		});
	});

	describe("set", () => {
		test("throws when negotiation is undefined", async () => {
			await expect(client.set(undefined as never)).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.objectUndefined"
			});
		});

		test("sends PUT to /{prefix}/negotiations/admin/:policyId", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.set(TEST_NEGOTIATION);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/admin/${POLICY_ID}`);
			expect(options.method).toBe(HttpMethod.PUT);
		});

		test("sends negotiation as the request body", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.set(TEST_NEGOTIATION);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.id).toBe(POLICY_ID);
			expect(body.state).toBe(DataspaceProtocolContractNegotiationStateType.REQUESTED);
		});

		test("resolves without a return value", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			const result = await client.set(TEST_NEGOTIATION);

			expect(result).toBeUndefined();
		});
	});

	describe("remove", () => {
		test("throws when policyId is empty", async () => {
			await expect(client.remove("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends DELETE to /{prefix}/negotiations/admin/:policyId", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.remove(POLICY_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/admin/${POLICY_ID}`);
			expect(options.method).toBe(HttpMethod.DELETE);
		});

		test("resolves without a return value", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			const result = await client.remove(POLICY_ID);

			expect(result).toBeUndefined();
		});
	});

	describe("query", () => {
		test("sends GET to /{prefix}/negotiations/admin", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_NEGOTIATION]));

			await client.query();

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toContain(`${ENDPOINT}/${PREFIX}/negotiations/admin`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("includes state query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_NEGOTIATION]));

			await client.query(DataspaceProtocolContractNegotiationStateType.REQUESTED);

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("state=REQUESTED");
		});

		test("includes cursor query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_NEGOTIATION]));

			await client.query(undefined, "page2");

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("cursor=page2");
		});

		test("returns items array", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_NEGOTIATION]));

			const result = await client.query();

			expect(result.items).toEqual([TEST_NEGOTIATION]);
		});

		test("returns undefined cursor when no Link header is present", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse([TEST_NEGOTIATION]));

			const result = await client.query();

			expect(result.cursor).toBeUndefined();
		});

		test("extracts cursor from the Link next relation header", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				status: 200,
				headers: new Headers({
					"content-type": "application/json",
					link: `<${ENDPOINT}/${PREFIX}/negotiations/admin?cursor=page2>; rel="next"`
				}),
				json: async () => [TEST_NEGOTIATION]
			});

			const result = await client.query();

			expect(result.cursor).toBe("page2");
		});
	});
});
