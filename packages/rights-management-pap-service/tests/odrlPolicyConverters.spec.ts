// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { OdrlContexts, OdrlPolicyType, type OdrlContextType } from "@twin.org/standards-w3c-odrl";
import { OdrlPolicy } from "../src/entities/odrlPolicy.js";
import { convertFromStoragePolicy } from "../src/utils/odrlPolicyConverters.js";
import { buildPapStorageContext } from "../src/utils/policyContextHelper.js";

describe("odrlPolicyConverters", () => {
	describe("convertFromStoragePolicy", () => {
		test("should return stored context for lifecycle policies when present", () => {
			const storedContext = [
				OdrlContexts.Context,
				{
					custom: "https://example.org/custom/"
				}
			] as OdrlContextType;

			const storagePolicy = new OdrlPolicy();
			storagePolicy.id = "urn:twin:policy:test";
			storagePolicy.type = OdrlPolicyType.Set;
			storagePolicy.dateCreated = "2025-06-10T10:00:00.000Z";
			storagePolicy.dateModified = "2025-06-10T10:00:00.000Z";
			storagePolicy.context = storedContext;
			storagePolicy.assignerIndex = "||";
			storagePolicy.assigneeIndex = "||";
			storagePolicy.targetIndex = "||";
			storagePolicy.actionIndex = "||";

			const policy = convertFromStoragePolicy(storagePolicy);

			expect(policy["@context"]).toEqual(storedContext);
		});

		test("should fall back to canonical policy metadata context when stored context is missing", () => {
			const storagePolicy = new OdrlPolicy();
			storagePolicy.id = "urn:twin:policy:test";
			storagePolicy.type = OdrlPolicyType.Set;
			storagePolicy.dateCreated = "2025-06-10T10:00:00.000Z";
			storagePolicy.dateModified = "2025-06-10T10:00:00.000Z";
			storagePolicy.assignerIndex = "||";
			storagePolicy.assigneeIndex = "||";
			storagePolicy.targetIndex = "||";
			storagePolicy.actionIndex = "||";

			const policy = convertFromStoragePolicy(storagePolicy);

			expect(policy["@context"]).toEqual(buildPapStorageContext());
		});

		test("should return ODRL-only context for legacy policies without policy metadata", () => {
			const storagePolicy = new OdrlPolicy();
			storagePolicy.id = "urn:twin:policy:legacy";
			storagePolicy.type = OdrlPolicyType.Set;
			storagePolicy.assignerIndex = "||";
			storagePolicy.assigneeIndex = "||";
			storagePolicy.targetIndex = "||";
			storagePolicy.actionIndex = "||";

			const policy = convertFromStoragePolicy(storagePolicy);

			expect(policy["@context"]).toBe(OdrlContexts.Context);
		});
	});
});
