// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { POLICY_METADATA_CONTEXT } from "@twin.org/rights-management-models";
import { OdrlContexts, type OdrlContextType } from "@twin.org/standards-w3c-odrl";
import {
	ensurePolicyMetadataContext,
	hasPolicyMetadata,
	hasPolicyMetadataContext,
	normalizeContext
} from "../src/utils/policyContextHelper.js";

describe("policyContextHelper", () => {
	test("normalizeContext defaults to ODRL when omitted", () => {
		expect(normalizeContext()).toEqual(OdrlContexts.Context);
		expect(normalizeContext(undefined)).toEqual(OdrlContexts.Context);
	});

	test("normalizeContext preserves caller context", () => {
		const twinContext = [
			OdrlContexts.Context,
			{
				twin: "https://w3id.org/twin/odrl/"
			}
		] as OdrlContextType;

		expect(normalizeContext(twinContext)).toEqual(twinContext);
	});

	test("ensurePolicyMetadataContext appends metadata terms to string context", () => {
		expect(ensurePolicyMetadataContext(OdrlContexts.Context)).toEqual([
			OdrlContexts.Context,
			POLICY_METADATA_CONTEXT
		]);
	});

	test("ensurePolicyMetadataContext appends metadata terms to array context", () => {
		const twinContext = [
			OdrlContexts.Context,
			{
				twin: "https://w3id.org/twin/odrl/"
			}
		] as OdrlContextType;

		expect(ensurePolicyMetadataContext(twinContext)).toEqual([
			...twinContext,
			POLICY_METADATA_CONTEXT
		]);
	});

	test("ensurePolicyMetadataContext is idempotent when metadata terms are present", () => {
		const withMetadata = [OdrlContexts.Context, POLICY_METADATA_CONTEXT] as OdrlContextType;
		expect(ensurePolicyMetadataContext(withMetadata)).toEqual(withMetadata);
		expect(hasPolicyMetadataContext(withMetadata)).toBe(true);
	});

	test("hasPolicyMetadata returns true when dateCreated or dateModified is present", () => {
		expect(hasPolicyMetadata({})).toBe(false);
		expect(hasPolicyMetadata({ dateCreated: "2025-06-10T10:00:00.000Z" })).toBe(true);
		expect(hasPolicyMetadata({ dateModified: "2025-06-10T10:00:00.000Z" })).toBe(true);
		expect(
			hasPolicyMetadata({
				dateCreated: "2025-06-10T10:00:00.000Z",
				dateModified: "2025-06-10T10:00:00.000Z"
			})
		).toBe(true);
	});
});
