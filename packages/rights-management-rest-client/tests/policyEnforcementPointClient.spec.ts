// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { PolicyEnforcementPointClient } from "../src/policyEnforcementPointClient";

describe("PolicyEnforcementPointClient", () => {
	test("Can create an instance", async () => {
		const client = new PolicyEnforcementPointClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
