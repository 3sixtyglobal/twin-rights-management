// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { PolicyNegotiationAdminPointRestClient } from "../src/policyNegotiationAdminPointRestClient.js";

describe("PolicyNegotiationAdminPointRestClient", () => {
	test("Can create an instance", async () => {
		const client = new PolicyNegotiationAdminPointRestClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
