// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { PolicyNegotiationAdminPointClient } from "../src/policyNegotiationAdminPointClient";

describe("PolicyNegotiationAdminPointClient", () => {
	test("Can create an instance", async () => {
		const client = new PolicyNegotiationAdminPointClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
