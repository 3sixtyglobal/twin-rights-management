// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	AuthenticationGeneratorFactory,
	type IAuthenticationGenerator
} from "@twin.org/api-models";
import { PolicyNegotiationPointRestClient } from "../src/policyNegotiationPointRestClient";

describe("PolicyNegotiationPointRestClient", () => {
	test("Can create an instance", async () => {
		AuthenticationGeneratorFactory.register(
			"verifiable-credential",
			() => ({}) as IAuthenticationGenerator
		);

		const client = new PolicyNegotiationPointRestClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
