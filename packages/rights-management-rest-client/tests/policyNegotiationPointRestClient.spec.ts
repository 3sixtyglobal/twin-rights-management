// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { PolicyNegotiationPointRestClient } from "../src/policyNegotiationPointRestClient.js";

describe("PolicyNegotiationPointRestClient", () => {
	test("Can create an instance", async () => {
		const client = new PolicyNegotiationPointRestClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
