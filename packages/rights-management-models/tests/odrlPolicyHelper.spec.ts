// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlParty, IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import { OdrlPolicyHelper } from "../src/utils/odrlPolicyHelper.js";

describe("OdrlPolicyHelper", () => {
	describe("extractAssigneeIdentity", () => {
		it("returns the assignee when it is a string", () => {
			const policy = {
				type: "Set",
				uid: "policy-1",
				assignee: "did:example:assignee-1"
			} as unknown as IOdrlPolicy;

			expect(OdrlPolicyHelper.extractAssigneeIdentity(policy)).toBe("did:example:assignee-1");
		});

		it("returns the assignee uid when assignee is an object", () => {
			const policy = {
				type: "Set",
				uid: "policy-2",
				assignee: { uid: "did:example:assignee-2" }
			} as unknown as IOdrlPolicy;

			expect(OdrlPolicyHelper.extractAssigneeIdentity(policy)).toBe("did:example:assignee-2");
		});

		it("throws a GeneralError when assignee is missing", () => {
			const policy = {
				type: "Set",
				uid: "policy-3"
			} as unknown as IOdrlPolicy;

			try {
				OdrlPolicyHelper.extractAssigneeIdentity(policy);
				expect.fail("Expected extractAssigneeIdentity to throw");
			} catch (err) {
				const error = err as { name?: string; message?: string; properties?: unknown };
				expect(error.name).toBe("GeneralError");
				expect(error.message).toMatch(/odrlPolicyHelper\.policyMissingAssignee/);
				expect(error.properties).toMatchObject({ policyType: "Set", policyId: "policy-3" });
			}
		});

		it("throws a GeneralError when assignee is an empty string", () => {
			const policy = {
				type: "Set",
				uid: "policy-4",
				assignee: ""
			} as unknown as IOdrlPolicy;

			expect(() => OdrlPolicyHelper.extractAssigneeIdentity(policy)).toThrowError(
				/guard\.stringEmpty/
			);
		});

		it("throws a GuardError when assignee object uid is missing", () => {
			const policy = {
				type: "Set",
				uid: "policy-5",
				assignee: {}
			} as unknown as IOdrlPolicy;

			expect(() => OdrlPolicyHelper.extractAssigneeIdentity(policy)).toThrowError(/guard\.string/);
		});

		it("throws a GuardError when assignee object uid is empty", () => {
			const policy = {
				type: "Set",
				uid: "policy-6",
				assignee: { uid: "" }
			} as unknown as IOdrlPolicy;

			expect(() => OdrlPolicyHelper.extractAssigneeIdentity(policy)).toThrowError(
				/guard\.stringEmpty/
			);
		});
	});

	describe("extractAssignerIdentity", () => {
		it("returns the assigner when it is a string", () => {
			const policy = {
				type: "Set",
				uid: "policy-11",
				assigner: "did:example:assigner-1"
			} as unknown as IOdrlPolicy;

			expect(OdrlPolicyHelper.extractAssignerIdentity(policy)).toBe("did:example:assigner-1");
		});

		it("returns the assigner uid when assigner is an object", () => {
			const policy = {
				type: "Set",
				uid: "policy-12",
				assigner: { uid: "did:example:assigner-2" }
			} as unknown as IOdrlPolicy;

			expect(OdrlPolicyHelper.extractAssignerIdentity(policy)).toBe("did:example:assigner-2");
		});

		it("throws a GeneralError when assigner is missing", () => {
			const policy = {
				type: "Set",
				uid: "policy-13"
			} as unknown as IOdrlPolicy;

			try {
				OdrlPolicyHelper.extractAssignerIdentity(policy);
				expect.fail("Expected extractAssignerIdentity to throw");
			} catch (err) {
				const error = err as { name?: string; message?: string; properties?: unknown };
				expect(error.name).toBe("GeneralError");
				expect(error.message).toMatch(/odrlPolicyHelper\.policyMissingAssigner/);
				expect(error.properties).toMatchObject({ policyType: "Set", policyId: "policy-13" });
			}
		});

		it("throws a GeneralError when assigner is an empty string", () => {
			const policy = {
				type: "Set",
				uid: "policy-14",
				assigner: ""
			} as unknown as IOdrlPolicy;

			expect(() => OdrlPolicyHelper.extractAssignerIdentity(policy)).toThrowError(
				/guard\.stringEmpty/
			);
		});

		it("throws a GuardError when assigner object uid is missing", () => {
			const policy = {
				type: "Set",
				uid: "policy-15",
				assigner: {}
			} as unknown as IOdrlPolicy;

			expect(() => OdrlPolicyHelper.extractAssignerIdentity(policy)).toThrowError(/guard\.string/);
		});

		it("throws a GuardError when assigner object uid is empty", () => {
			const policy = {
				type: "Set",
				uid: "policy-16",
				assigner: { uid: "" }
			} as unknown as IOdrlPolicy;

			expect(() => OdrlPolicyHelper.extractAssignerIdentity(policy)).toThrowError(
				/guard\.stringEmpty/
			);
		});
	});

	describe("getPartyIds", () => {
		it("returns an empty array when party is missing", () => {
			expect(OdrlPolicyHelper.getPartyIds()).toEqual([]);
		});

		it("returns the id when party is a string", () => {
			expect(OdrlPolicyHelper.getPartyIds("did:example:party-1")).toEqual(["did:example:party-1"]);
		});

		it("returns uid when party is an object with uid", () => {
			expect(
				OdrlPolicyHelper.getPartyIds({ uid: "did:example:party-2" } as unknown as IOdrlParty)
			).toEqual(["did:example:party-2"]);
		});

		it("returns @id when party is an object with @id", () => {
			expect(
				OdrlPolicyHelper.getPartyIds({ "@id": "did:example:party-3" } as unknown as IOdrlParty)
			).toEqual(["did:example:party-3"]);
		});

		it("prefers uid over @id when both are present", () => {
			expect(
				OdrlPolicyHelper.getPartyIds({
					uid: "did:example:party-4",
					"@id": "did:example:party-ignored"
				} as unknown as IOdrlParty)
			).toEqual(["did:example:party-4"]);
		});

		it("returns a unique list when party is an array", () => {
			expect(
				OdrlPolicyHelper.getPartyIds([
					"did:example:party-a",
					{ uid: "did:example:party-b" } as unknown as IOdrlParty,
					{ "@id": "did:example:party-b" } as unknown as IOdrlParty,
					"did:example:party-a",
					{ uid: "" } as unknown as IOdrlParty,
					{} as unknown as IOdrlParty
				])
			).toEqual(["did:example:party-a", "did:example:party-b"]);
		});
	});

	describe("getTargets", () => {
		it("returns a unique list of target ids from string and object targets", () => {
			const policy = {
				type: "Set",
				uid: "policy-41",
				target: [
					"asset-1",
					{ uid: "asset-2" },
					{ uid: "asset-2" },
					"asset-1",
					{ uid: "" },
					{} as unknown
				]
			} as unknown as IOdrlPolicy;

			expect(OdrlPolicyHelper.getTargets(policy).sort()).toEqual(["asset-1", "asset-2"]);
		});

		it("handles a single target value (non-array)", () => {
			const policy = {
				type: "Set",
				uid: "policy-42",
				target: { uid: "asset-single" }
			} as unknown as IOdrlPolicy;

			expect(OdrlPolicyHelper.getTargets(policy)).toEqual(["asset-single"]);
		});

		it("returns an empty list when targets are missing", () => {
			const policy = {
				type: "Set",
				uid: "policy-43"
			} as unknown as IOdrlPolicy;

			expect(OdrlPolicyHelper.getTargets(policy)).toEqual([]);
		});
	});

	describe("getActions", () => {
		it("returns a unique list of actions from string and object actions", () => {
			const policy = {
				type: "Set",
				uid: "policy-51",
				action: ["use", { uid: "read" }, { uid: "read" }, "use", { uid: "" }, {} as unknown]
			} as unknown as IOdrlPolicy;

			expect(OdrlPolicyHelper.getActions(policy).sort()).toEqual(["read", "use"]);
		});

		it("handles a single action value (non-array)", () => {
			const policy = {
				type: "Set",
				uid: "policy-52",
				action: "read"
			} as unknown as IOdrlPolicy;

			expect(OdrlPolicyHelper.getActions(policy)).toEqual(["read"]);
		});

		it("returns an empty list when actions are missing", () => {
			const policy = {
				type: "Set",
				uid: "policy-53"
			} as unknown as IOdrlPolicy;

			expect(OdrlPolicyHelper.getActions(policy)).toEqual([]);
		});
	});

	describe("matchPolicy", () => {
		it("returns false when policy is undefined", () => {
			expect(
				OdrlPolicyHelper.matchPolicy(undefined, {
					assignee: "did:example:assignee",
					assigner: "did:example:assigner",
					target: "asset-1",
					action: "read"
				})
			).toBe(false);
		});

		it("returns true when there are no filter options", () => {
			const policy = {
				type: "Set",
				uid: "policy-61",
				assignee: "did:example:assignee",
				assigner: "did:example:assigner",
				target: "asset-1",
				action: "read"
			} as unknown as IOdrlPolicy;

			expect(OdrlPolicyHelper.matchPolicy(policy, {})).toBe(true);
		});

		it("matches assignee, assigner, target and action", () => {
			const policy = {
				type: "Set",
				uid: "policy-62",
				assignee: { uid: "did:example:assignee" },
				assigner: { uid: "did:example:assigner" },
				target: ["asset-1", { uid: "asset-2" }],
				action: ["read", { uid: "use" }]
			} as unknown as IOdrlPolicy;

			expect(
				OdrlPolicyHelper.matchPolicy(policy, {
					assignee: "did:example:assignee",
					assigner: "did:example:assigner",
					target: "asset-2",
					action: "use"
				})
			).toBe(true);
		});

		it("returns false when assignee does not match", () => {
			const policy = {
				type: "Set",
				uid: "policy-63",
				assignee: "did:example:assignee-a"
			} as unknown as IOdrlPolicy;

			expect(
				OdrlPolicyHelper.matchPolicy(policy, {
					assignee: "did:example:assignee-b"
				})
			).toBe(false);
		});

		it("returns false when assigner does not match", () => {
			const policy = {
				type: "Set",
				uid: "policy-64",
				assigner: "did:example:assigner-a"
			} as unknown as IOdrlPolicy;

			expect(
				OdrlPolicyHelper.matchPolicy(policy, {
					assigner: "did:example:assigner-b"
				})
			).toBe(false);
		});

		it("returns false when target does not match", () => {
			const policy = {
				type: "Set",
				uid: "policy-65",
				target: ["asset-1"]
			} as unknown as IOdrlPolicy;

			expect(
				OdrlPolicyHelper.matchPolicy(policy, {
					target: "asset-2"
				})
			).toBe(false);
		});

		it("returns false when action does not match", () => {
			const policy = {
				type: "Set",
				uid: "policy-66",
				action: ["read"]
			} as unknown as IOdrlPolicy;

			expect(
				OdrlPolicyHelper.matchPolicy(policy, {
					action: "use"
				})
			).toBe(false);
		});
	});
});
