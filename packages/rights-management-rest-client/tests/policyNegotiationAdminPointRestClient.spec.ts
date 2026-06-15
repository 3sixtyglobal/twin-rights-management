// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HeaderTypes } from "@twin.org/web";
import { PolicyNegotiationAdminPointRestClient } from "../src/policyNegotiationAdminPointRestClient.js";

describe("PolicyNegotiationAdminPointRestClient", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("Can create an instance", async () => {
		const client = new PolicyNegotiationAdminPointRestClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});

	describe("create", () => {
		test("sends POST with body and returns id from Location header", async () => {
			const client = new PolicyNegotiationAdminPointRestClient({
				endpoint: "http://localhost:8080"
			});
			const fetchSpy = vi.spyOn(client, "fetch").mockResolvedValue({
				headers: { [HeaderTypes.Location]: "urn:uuid:consumer-pid-1" }
			});

			const id = await client.create({ id: "urn:uuid:consumer-pid-1" });

			expect(fetchSpy).toHaveBeenCalledWith("/negotiations/admin", "POST", {
				body: { id: "urn:uuid:consumer-pid-1" }
			});
			expect(id).toBe("urn:uuid:consumer-pid-1");
		});

		test("throws GuardError when id is empty", async () => {
			const client = new PolicyNegotiationAdminPointRestClient({
				endpoint: "http://localhost:8080"
			});
			await expect(client.create({ id: "" })).rejects.toMatchObject({ name: "GuardError" });
		});

		test("throws GuardError when Location header is absent from the response", async () => {
			const client = new PolicyNegotiationAdminPointRestClient({
				endpoint: "http://localhost:8080"
			});
			vi.spyOn(client, "fetch").mockResolvedValue({ headers: {} });

			await expect(client.create({ id: "urn:uuid:consumer-pid-2" })).rejects.toMatchObject({
				name: "GuardError"
			});
		});
	});
});
