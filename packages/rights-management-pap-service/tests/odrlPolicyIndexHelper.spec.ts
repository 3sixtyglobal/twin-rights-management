// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Converter } from "@twin.org/core";
import { Blake2b } from "@twin.org/crypto";
import { OdrlPolicyIndexHelper } from "../src/utils/odrlPolicyIndexHelper.js";

const POLICY_ID = "urn:rights-management:policy-1";
const DATE_CREATED = "2026-01-01T00:00:00.000Z";

/**
 * Hash a value independently of the helper.
 * @param value The value to hash.
 * @returns The base64 url encoded Blake2b-160 hash.
 */
function expectedHash(value: string): string {
	return Converter.bytesToBase64Url(Blake2b.sum160(Converter.utf8ToBytes(value)));
}

describe("OdrlPolicyIndexHelper", () => {
	test("should hash a value as base64 url encoded Blake2b-160", () => {
		const hash = OdrlPolicyIndexHelper.hashValue("urn:asset:dataset-1");

		expect(hash).toEqual(expectedHash("urn:asset:dataset-1"));
		expect(hash).toHaveLength(27);
	});

	test("should hash a value case insensitively", () => {
		expect(OdrlPolicyIndexHelper.hashValue("URN:Asset:Dataset-1")).toEqual(
			OdrlPolicyIndexHelper.hashValue("urn:asset:dataset-1")
		);
	});

	test("should not hash an absent or empty value", () => {
		expect(OdrlPolicyIndexHelper.hashValue()).toBeUndefined();
		expect(OdrlPolicyIndexHelper.hashValue("")).toBeUndefined();
	});

	test("should create an index entry with case folded values and their hashes", () => {
		const entry = OdrlPolicyIndexHelper.createIndexEntry(
			POLICY_ID,
			DATE_CREATED,
			"did:example:Provider",
			"did:example:Consumer",
			"urn:asset:Dataset-1",
			"Use"
		);

		expect(entry).toEqual({
			id: expect.stringMatching(/^[\da-f]{64}$/),
			policyId: POLICY_ID,
			assigner: "did:example:provider",
			assignerHash: expectedHash("did:example:provider"),
			assignee: "did:example:consumer",
			assigneeHash: expectedHash("did:example:consumer"),
			target: "urn:asset:dataset-1",
			targetHash: expectedHash("urn:asset:dataset-1"),
			action: "use",
			actionHash: expectedHash("use"),
			dateCreated: DATE_CREATED
		});
	});

	test("should leave absent values and their hashes undefined", () => {
		const entry = OdrlPolicyIndexHelper.createIndexEntry(POLICY_ID, DATE_CREATED, "did:example:a");

		expect(entry.assigner).toEqual("did:example:a");
		expect(entry.assignee).toBeUndefined();
		expect(entry.assigneeHash).toBeUndefined();
		expect(entry.target).toBeUndefined();
		expect(entry.targetHash).toBeUndefined();
		expect(entry.action).toBeUndefined();
		expect(entry.actionHash).toBeUndefined();
	});

	test("should derive the same id for the same combination regardless of case", () => {
		const lower = OdrlPolicyIndexHelper.createIndexEntry(
			POLICY_ID,
			DATE_CREATED,
			"did:example:a",
			undefined,
			"urn:asset:1",
			"use"
		);
		const upper = OdrlPolicyIndexHelper.createIndexEntry(
			POLICY_ID,
			DATE_CREATED,
			"DID:EXAMPLE:A",
			undefined,
			"URN:ASSET:1",
			"USE"
		);

		expect(upper.id).toEqual(lower.id);
	});

	test("should derive a different id when any field differs", () => {
		const base = OdrlPolicyIndexHelper.createIndexEntry(
			POLICY_ID,
			DATE_CREATED,
			"did:example:a",
			"did:example:b",
			"urn:asset:1",
			"use"
		);
		const variants = [
			OdrlPolicyIndexHelper.createIndexEntry(
				"urn:rights-management:policy-2",
				DATE_CREATED,
				"did:example:a",
				"did:example:b",
				"urn:asset:1",
				"use"
			),
			OdrlPolicyIndexHelper.createIndexEntry(
				POLICY_ID,
				"2026-01-02T00:00:00.000Z",
				"did:example:a",
				"did:example:b",
				"urn:asset:1",
				"use"
			),
			// Swapping the assigner and assignee must not collide.
			OdrlPolicyIndexHelper.createIndexEntry(
				POLICY_ID,
				DATE_CREATED,
				"did:example:b",
				"did:example:a",
				"urn:asset:1",
				"use"
			),
			OdrlPolicyIndexHelper.createIndexEntry(
				POLICY_ID,
				DATE_CREATED,
				"did:example:a",
				"did:example:b",
				"urn:asset:1",
				"read"
			)
		];

		for (const variant of variants) {
			expect(variant.id).not.toEqual(base.id);
		}
	});
});
