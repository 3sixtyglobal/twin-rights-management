// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { PolicyAdministrationPointRestClient } from "../src/policyAdministrationPointRestClient.js";

describe("PolicyAdministrationPointRestClient", () => {
	test("Can create an instance", async () => {
		const client = new PolicyAdministrationPointRestClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
