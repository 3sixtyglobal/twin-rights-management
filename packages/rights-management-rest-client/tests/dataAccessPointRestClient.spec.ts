// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataAccessPointRestClient } from "../src/dataAccessPointRestClient.js";

describe("DataAccessPointRestClient", () => {
	test("Can create an instance", async () => {
		const client = new DataAccessPointRestClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
