// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IDataspaceProtocolPolicy } from "@twin.org/standards-dataspace-protocol";
import type { IOdrlParty } from "@twin.org/standards-w3c-odrl";
import { OdrlTwinVocabulary } from "../src/models/odrlTwinVocabulary.js";
import { OdrlPolicyHelper } from "../src/utils/odrlPolicyHelper.js";

describe("OdrlPolicyHelper", () => {
	describe("extractAssigneeIdentity", () => {
		it("returns the assignee when it is a string", () => {
			const policy = {
				type: "Set",
				"@id": "policy-1",
				assignee: "did:example:assignee-1"
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.extractAssigneeIdentity(policy)).toBe("did:example:assignee-1");
		});

		it("returns the assignee uid when assignee is an object", () => {
			const policy = {
				type: "Set",
				"@id": "policy-2",
				assignee: { "@id": "did:example:assignee-2" }
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.extractAssigneeIdentity(policy)).toBe("did:example:assignee-2");
		});

		it("throws a GeneralError when assignee is missing", () => {
			const policy = {
				type: "Set",
				"@id": "policy-3"
			} as unknown as IDataspaceProtocolPolicy;

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
				"@id": "policy-4",
				assignee: ""
			} as unknown as IDataspaceProtocolPolicy;

			expect(() => OdrlPolicyHelper.extractAssigneeIdentity(policy)).toThrowError(
				/guard\.stringEmpty/
			);
		});

		it("throws a GuardError when assignee object uid is missing", () => {
			const policy = {
				type: "Set",
				"@id": "policy-5",
				assignee: {}
			} as unknown as IDataspaceProtocolPolicy;

			expect(() => OdrlPolicyHelper.extractAssigneeIdentity(policy)).toThrowError(/guard\.string/);
		});

		it("throws a GuardError when assignee object uid is empty", () => {
			const policy = {
				type: "Set",
				"@id": "policy-6",
				assignee: { "@id": "" }
			} as unknown as IDataspaceProtocolPolicy;

			expect(() => OdrlPolicyHelper.extractAssigneeIdentity(policy)).toThrowError(
				/guard\.stringEmpty/
			);
		});
	});

	describe("extractAssignerIdentity", () => {
		it("returns the assigner when it is a string", () => {
			const policy = {
				type: "Set",
				"@id": "policy-11",
				assigner: "did:example:assigner-1"
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.extractAssignerIdentity(policy)).toBe("did:example:assigner-1");
		});

		it("returns the assigner uid when assigner is an object", () => {
			const policy = {
				type: "Set",
				"@id": "policy-12",
				assigner: { "@id": "did:example:assigner-2" }
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.extractAssignerIdentity(policy)).toBe("did:example:assigner-2");
		});

		it("throws a GeneralError when assigner is missing", () => {
			const policy = {
				type: "Set",
				"@id": "policy-13"
			} as unknown as IDataspaceProtocolPolicy;

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
				"@id": "policy-14",
				assigner: ""
			} as unknown as IDataspaceProtocolPolicy;

			expect(() => OdrlPolicyHelper.extractAssignerIdentity(policy)).toThrowError(
				/guard\.stringEmpty/
			);
		});

		it("throws a GuardError when assigner object uid is missing", () => {
			const policy = {
				type: "Set",
				"@id": "policy-15",
				assigner: {}
			} as unknown as IDataspaceProtocolPolicy;

			expect(() => OdrlPolicyHelper.extractAssignerIdentity(policy)).toThrowError(/guard\.string/);
		});

		it("throws a GuardError when assigner object uid is empty", () => {
			const policy = {
				type: "Set",
				"@id": "policy-16",
				assigner: { "@id": "" }
			} as unknown as IDataspaceProtocolPolicy;

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
				OdrlPolicyHelper.getPartyIds({ "@id": "did:example:party-2" } as unknown as IOdrlParty)
			).toEqual(["did:example:party-2"]);
		});

		it("returns @id when party is an object with @id", () => {
			expect(
				OdrlPolicyHelper.getPartyIds({ "@id": "did:example:party-3" } as unknown as IOdrlParty)
			).toEqual(["did:example:party-3"]);
		});

		it("prefers @id over uid when both are present", () => {
			expect(
				OdrlPolicyHelper.getPartyIds({
					"@id": "did:example:party-4",
					uid: "did:example:party-ignored"
				} as unknown as IOdrlParty)
			).toEqual(["did:example:party-4"]);
		});

		it("returns a unique list when party is an array", () => {
			expect(
				OdrlPolicyHelper.getPartyIds([
					"did:example:party-a",
					{ "@id": "did:example:party-b" } as unknown as IOdrlParty,
					{ "@id": "did:example:party-b" } as unknown as IOdrlParty,
					"did:example:party-a",
					{ "@id": "" } as unknown as IOdrlParty,
					{}
				])
			).toEqual(["did:example:party-a", "did:example:party-b"]);
		});
	});

	describe("getTargets", () => {
		it("returns a unique list of target ids from string and object targets", () => {
			const policy = {
				type: "Set",
				"@id": "policy-41",
				target: [
					"asset-1",
					{ "@id": "asset-2" },
					{ "@id": "asset-2" },
					"asset-1",
					{ "@id": "" },
					{} as unknown
				]
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getTargets(policy).sort()).toEqual(["asset-1", "asset-2"]);
		});

		it("handles a single target value (non-array)", () => {
			const policy = {
				type: "Set",
				"@id": "policy-42",
				target: { "@id": "asset-single" }
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getTargets(policy)).toEqual(["asset-single"]);
		});

		it("returns an empty list when targets are missing", () => {
			const policy = {
				type: "Set",
				"@id": "policy-43"
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getTargets(policy)).toEqual([]);
		});

		it("returns targets from permission, prohibition, and obligation rules", () => {
			const policy = {
				type: "Set",
				"@id": "policy-44",
				permission: [{ target: "asset-from-permission" }],
				prohibition: [{ target: "asset-from-prohibition" }],
				obligation: [{ target: "asset-from-obligation" }]
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getTargets(policy).sort()).toEqual([
				"asset-from-obligation",
				"asset-from-permission",
				"asset-from-prohibition"
			]);
		});

		it("deduplicates targets across policy-level and rule-level", () => {
			const policy = {
				type: "Set",
				"@id": "policy-45",
				target: "shared-asset",
				permission: [{ target: "shared-asset" }, { target: "unique-asset" }]
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getTargets(policy).sort()).toEqual(["shared-asset", "unique-asset"]);
		});
	});

	describe("getDatasetTargets", () => {
		it("returns only the policy-level target, ignoring rule-level targets", () => {
			const policy = {
				type: "Set",
				"@id": "policy-46",
				target: "dataset-1",
				permission: [
					{
						action: "read",
						target: OdrlTwinVocabulary.JsonPath,
						[OdrlTwinVocabulary.JsonPathExpression]: "$"
					}
				]
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getDatasetTargets(policy)).toEqual(["dataset-1"]);
		});

		it("returns empty when policy-level target is missing, even if rules have targets", () => {
			const policy = {
				type: "Set",
				"@id": "policy-47",
				permission: [{ target: "asset-from-permission" }]
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getDatasetTargets(policy)).toEqual([]);
		});

		it("returns multiple top-level targets deduped", () => {
			const policy = {
				type: "Set",
				"@id": "policy-48",
				target: ["dataset-a", "dataset-b", "dataset-a"]
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getDatasetTargets(policy).sort()).toEqual(["dataset-a", "dataset-b"]);
		});

		it("ignores AssetCollection in rule-level target (constraint, not dataset)", () => {
			const policy = {
				type: "Set",
				"@id": "policy-49",
				target: "consignment-dataset",
				permission: [
					{
						action: "read",
						target: {
							"@type": "AssetCollection",
							source: "consignment-dataset",
							refinement: {
								leftOperand: "unloadingLocation.id",
								operator: "eq",
								rightOperand: "unece:LOCODE#GBDVR"
							}
						}
					}
				]
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getDatasetTargets(policy)).toEqual(["consignment-dataset"]);
		});
	});

	describe("getActions", () => {
		it("returns a unique list of actions from string and object actions", () => {
			const policy = {
				type: "Set",
				"@id": "policy-51",
				action: ["use", { "@id": "read" }, { "@id": "read" }, "use", { "@id": "" }, {} as unknown]
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getActions(policy).sort()).toEqual(["read", "use"]);
		});

		it("handles a single action value (non-array)", () => {
			const policy = {
				type: "Set",
				"@id": "policy-52",
				action: "read"
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getActions(policy)).toEqual(["read"]);
		});

		it("returns an empty list when actions are missing", () => {
			const policy = {
				type: "Set",
				"@id": "policy-53"
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getActions(policy)).toEqual([]);
		});

		it("returns actions from permission, prohibition, and obligation rules", () => {
			const policy = {
				type: "Set",
				"@id": "policy-54",
				permission: [{ action: "use" }],
				prohibition: [{ action: "print" }],
				obligation: [{ action: "inform" }]
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getActions(policy).sort()).toEqual(["inform", "print", "use"]);
		});

		it("deduplicates actions across policy-level and rule-level", () => {
			const policy = {
				type: "Set",
				"@id": "policy-55",
				action: "use",
				permission: [{ action: "use" }, { action: "display" }]
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getActions(policy).sort()).toEqual(["display", "use"]);
		});

		it("indexes obligation action when no top-level action exists", () => {
			const policy = {
				"@type": "Set",
				"@id": "policy-56",
				obligation: [{ action: "inform", target: "twin:asset:consignment:*" }]
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.getActions(policy)).toEqual(["inform"]);
			expect(OdrlPolicyHelper.getTargets(policy)).toEqual(["twin:asset:consignment:*"]);
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
				"@id": "policy-61",
				assignee: "did:example:assignee",
				assigner: "did:example:assigner",
				target: "asset-1",
				action: "read"
			} as unknown as IDataspaceProtocolPolicy;

			expect(OdrlPolicyHelper.matchPolicy(policy, {})).toBe(true);
		});

		it("matches assignee, assigner, target and action", () => {
			const policy = {
				type: "Set",
				"@id": "policy-62",
				assignee: { "@id": "did:example:assignee" },
				assigner: { "@id": "did:example:assigner" },
				target: ["asset-1", { "@id": "asset-2" }],
				action: ["read", { "@id": "use" }]
			} as unknown as IDataspaceProtocolPolicy;

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
				"@id": "policy-63",
				assignee: "did:example:assignee-a"
			} as unknown as IDataspaceProtocolPolicy;

			expect(
				OdrlPolicyHelper.matchPolicy(policy, {
					assignee: "did:example:assignee-b"
				})
			).toBe(false);
		});

		it("returns false when assigner does not match", () => {
			const policy = {
				type: "Set",
				"@id": "policy-64",
				assigner: "did:example:assigner-a"
			} as unknown as IDataspaceProtocolPolicy;

			expect(
				OdrlPolicyHelper.matchPolicy(policy, {
					assigner: "did:example:assigner-b"
				})
			).toBe(false);
		});

		it("returns false when target does not match", () => {
			const policy = {
				type: "Set",
				"@id": "policy-65",
				target: ["asset-1"]
			} as unknown as IDataspaceProtocolPolicy;

			expect(
				OdrlPolicyHelper.matchPolicy(policy, {
					target: "asset-2"
				})
			).toBe(false);
		});

		it("returns false when action does not match", () => {
			const policy = {
				type: "Set",
				"@id": "policy-66",
				action: ["read"]
			} as unknown as IDataspaceProtocolPolicy;

			expect(
				OdrlPolicyHelper.matchPolicy(policy, {
					action: "use"
				})
			).toBe(false);
		});
	});
});
