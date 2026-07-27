// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GuardError } from "@twin.org/core";
import type {
	IDataspaceProtocolContractAgreementMessage,
	IDataspaceProtocolContractAgreementVerificationMessage,
	IDataspaceProtocolContractNegotiation,
	IDataspaceProtocolContractNegotiationEventMessage,
	IDataspaceProtocolContractNegotiationTerminationMessage,
	IDataspaceProtocolContractOfferMessage,
	IDataspaceProtocolContractRequestMessage
} from "@twin.org/standards-dataspace-protocol";
import {
	DataspaceProtocolContractNegotiationStateType,
	DataspaceProtocolContractNegotiationTypes,
	DataspaceProtocolContexts
} from "@twin.org/standards-dataspace-protocol";
import { HttpMethod } from "@twin.org/web";
import { PolicyNegotiationPointRestClient } from "../src/policyNegotiationPointRestClient.js";
import {
	jsonResponse,
	setupFetchMock,
	teardownFetchMock
} from "./helpers/restClientTestHelpers.js";

// OpenAPI spec: ../../rights-management-service/docs/open-api/spec.json
const ENDPOINT = "http://localhost:8080";
const PREFIX = "rights-management";

const PROVIDER_PID = "urn:rm:negotiation:provider001";
const CONSUMER_PID = "urn:rm:negotiation:consumer001";
const OFFER_ID = "urn:rm:offer:test001";
const TRUST_PAYLOAD = "token.jwt.test";

const TEST_NEGOTIATION: IDataspaceProtocolContractNegotiation = {
	"@context": DataspaceProtocolContexts.Context,
	"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiation,
	providerPid: PROVIDER_PID,
	consumerPid: CONSUMER_PID,
	state: DataspaceProtocolContractNegotiationStateType.REQUESTED
};

const TEST_REQUEST_MESSAGE: IDataspaceProtocolContractRequestMessage = {
	"@context": DataspaceProtocolContexts.Context,
	"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
	consumerPid: CONSUMER_PID,
	offer: {
		"@id": OFFER_ID,
		"@type": "Offer",
		assigner: "urn:did:assigner:001"
	}
};

const TEST_REQUEST_MESSAGE_WITH_PROVIDER: IDataspaceProtocolContractRequestMessage = {
	"@context": DataspaceProtocolContexts.Context,
	"@type": DataspaceProtocolContractNegotiationTypes.ContractRequestMessage,
	providerPid: PROVIDER_PID,
	consumerPid: CONSUMER_PID,
	offer: {
		"@id": OFFER_ID,
		"@type": "Offer",
		assigner: "urn:did:assigner:001"
	}
};

const TEST_OFFER_MESSAGE: IDataspaceProtocolContractOfferMessage = {
	"@context": DataspaceProtocolContexts.Context,
	"@type": DataspaceProtocolContractNegotiationTypes.ContractOfferMessage,
	providerPid: PROVIDER_PID,
	offer: {
		"@id": OFFER_ID,
		"@type": "Offer",
		assigner: "urn:did:assigner:001"
	}
};

const TEST_OFFER_MESSAGE_WITH_CONSUMER: IDataspaceProtocolContractOfferMessage = {
	"@context": DataspaceProtocolContexts.Context,
	"@type": DataspaceProtocolContractNegotiationTypes.ContractOfferMessage,
	providerPid: PROVIDER_PID,
	consumerPid: CONSUMER_PID,
	offer: {
		"@id": OFFER_ID,
		"@type": "Offer",
		assigner: "urn:did:assigner:001"
	}
};

const TEST_AGREEMENT_MESSAGE: IDataspaceProtocolContractAgreementMessage = {
	"@context": DataspaceProtocolContexts.Context,
	"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementMessage,
	providerPid: PROVIDER_PID,
	consumerPid: CONSUMER_PID,
	agreement: {
		"@id": "urn:rm:agreement:test001",
		"@type": "Agreement",
		assigner: "urn:did:assigner:001",
		assignee: "urn:did:assignee:001"
	}
};

const TEST_VERIFICATION_MESSAGE: IDataspaceProtocolContractAgreementVerificationMessage = {
	"@context": DataspaceProtocolContexts.Context,
	"@type": DataspaceProtocolContractNegotiationTypes.ContractAgreementVerificationMessage,
	providerPid: PROVIDER_PID,
	consumerPid: CONSUMER_PID
};

const TEST_EVENT_MESSAGE: IDataspaceProtocolContractNegotiationEventMessage = {
	"@context": DataspaceProtocolContexts.Context,
	"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationEventMessage,
	providerPid: PROVIDER_PID,
	consumerPid: CONSUMER_PID,
	event: "ACCEPTED"
};

const TEST_TERMINATION_MESSAGE: IDataspaceProtocolContractNegotiationTerminationMessage = {
	"@context": DataspaceProtocolContexts.Context,
	"@type": DataspaceProtocolContractNegotiationTypes.ContractNegotiationTerminationMessage,
	providerPid: PROVIDER_PID,
	consumerPid: CONSUMER_PID
};

const fetchMock = vi.fn();

describe("PolicyNegotiationPointRestClient", () => {
	let client: PolicyNegotiationPointRestClient;

	beforeEach(() => {
		setupFetchMock(fetchMock);
		client = new PolicyNegotiationPointRestClient({ endpoint: ENDPOINT });
	});

	afterEach(() => {
		teardownFetchMock(fetchMock);
	});

	describe("getNegotiation", () => {
		test("throws when id is empty", async () => {
			await expect(client.getNegotiation("", TRUST_PAYLOAD)).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when trustPayload is empty", async () => {
			await expect(client.getNegotiation(PROVIDER_PID, "")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends GET to /{prefix}/negotiations/:id", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_NEGOTIATION));

			await client.getNegotiation(PROVIDER_PID, TRUST_PAYLOAD);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/${PROVIDER_PID}`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("returns the negotiation", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_NEGOTIATION));

			const result = await client.getNegotiation(PROVIDER_PID, TRUST_PAYLOAD);

			expect(result).toEqual(TEST_NEGOTIATION);
		});
	});

	describe("sendRequestToProvider", () => {
		test("throws NotSupportedError", async () => {
			await expect(
				client.sendRequestToProvider("http://example.com", "requesterType", OFFER_ID)
			).rejects.toMatchObject({ name: "NotSupportedError" });
		});
	});

	describe("requestFromConsumer", () => {
		test("throws when message is undefined", async () => {
			await expect(
				client.requestFromConsumer(undefined as never, TRUST_PAYLOAD)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.objectUndefined"
			});
		});

		test("throws when message.consumerPid is empty", async () => {
			await expect(
				client.requestFromConsumer(
					{
						...TEST_REQUEST_MESSAGE,
						consumerPid: ""
					},
					TRUST_PAYLOAD
				)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when trustPayload is empty", async () => {
			await expect(client.requestFromConsumer(TEST_REQUEST_MESSAGE, "")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws NotSupportedError when publicOrigin is provided", async () => {
			await expect(
				client.requestFromConsumer(TEST_REQUEST_MESSAGE, TRUST_PAYLOAD, "http://origin.com")
			).rejects.toMatchObject({ name: "NotSupportedError" });
		});

		test("sends POST to /{prefix}/negotiations/request when no providerPid", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_NEGOTIATION));

			await client.requestFromConsumer(TEST_REQUEST_MESSAGE, TRUST_PAYLOAD);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/request`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends POST to /{prefix}/negotiations/:id/request when providerPid is set", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_NEGOTIATION));

			await client.requestFromConsumer(TEST_REQUEST_MESSAGE_WITH_PROVIDER, TRUST_PAYLOAD);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/${PROVIDER_PID}/request`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends message as the request body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_NEGOTIATION));

			await client.requestFromConsumer(TEST_REQUEST_MESSAGE, TRUST_PAYLOAD);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.consumerPid).toBe(CONSUMER_PID);
		});

		test("returns the negotiation", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_NEGOTIATION));

			const result = await client.requestFromConsumer(TEST_REQUEST_MESSAGE, TRUST_PAYLOAD);

			expect(result).toEqual(TEST_NEGOTIATION);
		});
	});

	describe("offerFromProvider", () => {
		test("throws when message is undefined", async () => {
			await expect(
				client.offerFromProvider(undefined as never, TRUST_PAYLOAD)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.objectUndefined"
			});
		});

		test("throws when message.providerPid is empty", async () => {
			await expect(
				client.offerFromProvider(
					{
						...TEST_OFFER_MESSAGE,
						providerPid: ""
					},
					TRUST_PAYLOAD
				)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when trustPayload is empty", async () => {
			await expect(client.offerFromProvider(TEST_OFFER_MESSAGE, "")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends POST to /{prefix}/negotiations/offers when no consumerPid", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_NEGOTIATION));

			await client.offerFromProvider(TEST_OFFER_MESSAGE, TRUST_PAYLOAD);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/offers`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends POST to /{prefix}/negotiations/:id/offers when consumerPid is set", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_NEGOTIATION));

			await client.offerFromProvider(TEST_OFFER_MESSAGE_WITH_CONSUMER, TRUST_PAYLOAD);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/${CONSUMER_PID}/offers`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("returns the negotiation", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_NEGOTIATION));

			const result = await client.offerFromProvider(TEST_OFFER_MESSAGE, TRUST_PAYLOAD);

			expect(result).toEqual(TEST_NEGOTIATION);
		});
	});

	describe("agreementFromProvider", () => {
		test("throws when message is undefined", async () => {
			await expect(
				client.agreementFromProvider(undefined as never, TRUST_PAYLOAD)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.objectUndefined"
			});
		});

		test("throws when message.providerPid is empty", async () => {
			await expect(
				client.agreementFromProvider(
					{
						...TEST_AGREEMENT_MESSAGE,
						providerPid: ""
					},
					TRUST_PAYLOAD
				)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when message.consumerPid is empty", async () => {
			await expect(
				client.agreementFromProvider(
					{
						...TEST_AGREEMENT_MESSAGE,
						consumerPid: ""
					},
					TRUST_PAYLOAD
				)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when trustPayload is empty", async () => {
			await expect(client.agreementFromProvider(TEST_AGREEMENT_MESSAGE, "")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends POST to /{prefix}/negotiations/:id/agreement", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(undefined));

			await client.agreementFromProvider(TEST_AGREEMENT_MESSAGE, TRUST_PAYLOAD);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/${CONSUMER_PID}/agreement`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends message as the request body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(undefined));

			await client.agreementFromProvider(TEST_AGREEMENT_MESSAGE, TRUST_PAYLOAD);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.providerPid).toBe(PROVIDER_PID);
			expect(body.consumerPid).toBe(CONSUMER_PID);
		});
	});

	describe("agreementVerificationFromConsumer", () => {
		test("throws when message is undefined", async () => {
			await expect(
				client.agreementVerificationFromConsumer(undefined as never, TRUST_PAYLOAD)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.objectUndefined"
			});
		});

		test("throws when message.providerPid is empty", async () => {
			await expect(
				client.agreementVerificationFromConsumer(
					{
						...TEST_VERIFICATION_MESSAGE,
						providerPid: ""
					},
					TRUST_PAYLOAD
				)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when message.consumerPid is empty", async () => {
			await expect(
				client.agreementVerificationFromConsumer(
					{
						...TEST_VERIFICATION_MESSAGE,
						consumerPid: ""
					},
					TRUST_PAYLOAD
				)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when trustPayload is empty", async () => {
			await expect(
				client.agreementVerificationFromConsumer(TEST_VERIFICATION_MESSAGE, "")
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends POST to /{prefix}/negotiations/:id/agreement/verification", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(undefined));

			await client.agreementVerificationFromConsumer(TEST_VERIFICATION_MESSAGE, TRUST_PAYLOAD);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/${PROVIDER_PID}/agreement/verification`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends message as the request body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(undefined));

			await client.agreementVerificationFromConsumer(TEST_VERIFICATION_MESSAGE, TRUST_PAYLOAD);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.providerPid).toBe(PROVIDER_PID);
			expect(body.consumerPid).toBe(CONSUMER_PID);
		});
	});

	describe("event", () => {
		test("throws when message is undefined", async () => {
			await expect(
				client.event(undefined as never, "provider", TRUST_PAYLOAD)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.objectUndefined"
			});
		});

		test("throws when destination is invalid", async () => {
			await expect(
				client.event(TEST_EVENT_MESSAGE, "invalid" as never, TRUST_PAYLOAD)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME
			});
		});

		test("throws when message.providerPid is empty", async () => {
			await expect(
				client.event({ ...TEST_EVENT_MESSAGE, providerPid: "" }, "provider", TRUST_PAYLOAD)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when trustPayload is empty", async () => {
			await expect(client.event(TEST_EVENT_MESSAGE, "provider", "")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends POST to /{prefix}/negotiations/:providerPid/events when destination is provider", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(undefined));

			await client.event(TEST_EVENT_MESSAGE, "provider", TRUST_PAYLOAD);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/${PROVIDER_PID}/events`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends POST to /{prefix}/negotiations/:consumerPid/events when destination is consumer", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(undefined));

			await client.event(TEST_EVENT_MESSAGE, "consumer", TRUST_PAYLOAD);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/${CONSUMER_PID}/events`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends message as the request body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(undefined));

			await client.event(TEST_EVENT_MESSAGE, "provider", TRUST_PAYLOAD);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.providerPid).toBe(PROVIDER_PID);
			expect(body.consumerPid).toBe(CONSUMER_PID);
		});
	});

	describe("terminate", () => {
		test("throws when message is undefined", async () => {
			await expect(
				client.terminate(undefined as never, "provider", TRUST_PAYLOAD)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.objectUndefined"
			});
		});

		test("throws when destination is invalid", async () => {
			await expect(
				client.terminate(TEST_TERMINATION_MESSAGE, "invalid" as never, TRUST_PAYLOAD)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME
			});
		});

		test("throws when message.providerPid is empty", async () => {
			await expect(
				client.terminate(
					{ ...TEST_TERMINATION_MESSAGE, providerPid: "" },
					"provider",
					TRUST_PAYLOAD
				)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when trustPayload is empty", async () => {
			await expect(
				client.terminate(TEST_TERMINATION_MESSAGE, "provider", "")
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends POST to /{prefix}/negotiations/:providerPid/termination when destination is provider", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(undefined));

			await client.terminate(TEST_TERMINATION_MESSAGE, "provider", TRUST_PAYLOAD);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/${PROVIDER_PID}/termination`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends POST to /{prefix}/negotiations/:consumerPid/termination when destination is consumer", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(undefined));

			await client.terminate(TEST_TERMINATION_MESSAGE, "consumer", TRUST_PAYLOAD);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/negotiations/${CONSUMER_PID}/termination`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends message as the request body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(undefined));

			await client.terminate(TEST_TERMINATION_MESSAGE, "provider", TRUST_PAYLOAD);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.providerPid).toBe(PROVIDER_PID);
			expect(body.consumerPid).toBe(CONSUMER_PID);
		});
	});

	describe("sendTerminateToConsumer", () => {
		test("throws when callbackAddress is empty", async () => {
			await expect(
				client.sendTerminateToConsumer("", PROVIDER_PID, CONSUMER_PID)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when callbackAddress is not a valid URL", async () => {
			await expect(
				client.sendTerminateToConsumer("not-a-url", PROVIDER_PID, CONSUMER_PID)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.url"
			});
		});

		test("throws when providerPid is empty", async () => {
			await expect(
				client.sendTerminateToConsumer("http://callback.example.com", "", CONSUMER_PID)
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when consumerPid is empty", async () => {
			await expect(
				client.sendTerminateToConsumer("http://callback.example.com", PROVIDER_PID, "")
			).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws NotSupportedError for valid arguments", async () => {
			await expect(
				client.sendTerminateToConsumer("http://callback.example.com", PROVIDER_PID, CONSUMER_PID)
			).rejects.toMatchObject({ name: "NotSupportedError" });
		});
	});
});
