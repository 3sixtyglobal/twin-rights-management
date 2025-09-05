// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { PolicyNegotiationPointClient } from "../src/policyNegotiationPointClient";

describe("PolicyNegotiationPointClient", () => {
	test("Can create an instance", async () => {
		const client = new PolicyNegotiationPointClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
