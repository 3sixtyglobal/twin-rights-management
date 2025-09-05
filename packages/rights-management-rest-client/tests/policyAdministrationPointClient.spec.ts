// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { PolicyAdministrationPointClient } from "../src/policyAdministrationPointClient";

describe("PolicyAdministrationPointClient", () => {
	test("Can create an instance", async () => {
		const client = new PolicyAdministrationPointClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
