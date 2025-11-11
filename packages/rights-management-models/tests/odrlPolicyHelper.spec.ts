// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { OdrlContexts, type IOdrlPolicy, ActionType } from "@twin.org/standards-w3c-odrl";
import { OdrlPolicyHelper } from "../src/utils/odrlPolicyHelper.js";

describe("OdrlPolicyHelper", () => {
	describe("findExpirationDate", () => {
		test("returns expiration date when valid constraint exists", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: [
							{
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", "read");
			expect(result).toBe("2024-12-31T23:59:59Z");
		});

		test("returns undefined when no permissions exist", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy"
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", "read");
			expect(result).toBeUndefined();
		});

		test("returns undefined when permissions is not an array", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: {
					target: "document",
					action: "read"
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} as any
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", "read");
			expect(result).toBeUndefined();
		});

		test("returns undefined when no constraints exist", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read"
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", "read");
			expect(result).toBeUndefined();
		});

		test("returns undefined when constraints is not an array", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: {
							leftOperand: "dateTime",
							operator: "lteq",
							rightOperand: "2024-12-31T23:59:59Z"
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
						} as any
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", "read");
			expect(result).toBeUndefined();
		});

		test("matches any asset type when assetType parameter is undefined", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: [
							{
								assetType: "image",
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, undefined, "read");
			expect(result).toBe("2024-12-31T23:59:59Z");
		});

		test("matches any action when action parameter is undefined", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: [
							{
								action: "write",
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", undefined);
			expect(result).toBe("2024-12-31T23:59:59Z");
		});

		test("matches any asset type when assetType parameter is undefined", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: [
							{
								assetType: "image",
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, undefined, "read");
			expect(result).toBe("2024-12-31T23:59:59Z");
		});

		test("matches any action when action parameter is undefined", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: [
							{
								action: "write",
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", undefined);
			expect(result).toBe("2024-12-31T23:59:59Z");
		});

		test("returns undefined when assetType does not match", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: [
							{
								assetType: "image",
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document2", "read");
			expect(result).toBeUndefined();
		});

		test("returns undefined when action does not match", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: [
							{
								action: "write",
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", "read2");
			expect(result).toBeUndefined();
		});

		test("returns undefined when leftOperand is not dateTime", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: [
							{
								leftOperand: "spatial",
								operator: "lteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", "read");
			expect(result).toBeUndefined();
		});

		test("returns undefined when operator is not lteq", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: [
							{
								leftOperand: "dateTime",
								operator: "gteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", "read");
			expect(result).toBeUndefined();
		});

		test("returns undefined when rightOperand is not a valid dateTime string", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: [
							{
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "not-a-date"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", "read");
			expect(result).toBeUndefined();
		});

		test("returns first matching expiration date when multiple exist", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "document",
						action: "read",
						constraint: [
							{
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-06-30T23:59:59Z"
							},
							{
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", "read");
			expect(result).toBe("2024-06-30T23:59:59Z");
		});

		test("searches through multiple permissions", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "test-policy",
				permission: [
					{
						target: "image",
						action: "annotate",
						constraint: [
							{
								leftOperand: "spatial",
								operator: "eq",
								rightOperand: "EU"
							}
						]
					},
					{
						target: "document",
						action: "read",
						constraint: [
							{
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const result = OdrlPolicyHelper.findExpirationDate(policy, "document", "read");
			expect(result).toBe("2024-12-31T23:59:59Z");
		});

		test("handles complex policy with multiple permissions and constraints", () => {
			const policy: IOdrlPolicy = {
				"@context": OdrlContexts.ContextRoot,
				"@type": "Agreement",
				uid: "complex-policy",
				permission: [
					{
						target: "video",
						action: "stream",
						constraint: [
							{
								leftOperand: "spatial",
								operator: "eq",
								rightOperand: "US"
							},
							{
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-06-30T23:59:59Z"
							}
						]
					},
					{
						target: "document",
						action: "read",
						constraint: [
							{
								leftOperand: "count",
								operator: "lteq",
								rightOperand: "5"
							},
							{
								leftOperand: "dateTime",
								operator: "lteq",
								rightOperand: "2024-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const videoResult = OdrlPolicyHelper.findExpirationDate(policy, "video", "stream");
			expect(videoResult).toBe("2024-06-30T23:59:59Z");

			const documentResult = OdrlPolicyHelper.findExpirationDate(policy, "document", "read");
			expect(documentResult).toBe("2024-12-31T23:59:59Z");

			const noMatchResult = OdrlPolicyHelper.findExpirationDate(policy, "image", "view");
			expect(noMatchResult).toBeUndefined();
		});
	});

	describe("matchAsset", () => {
		test("returns true if target is empty", () => {
			expect(OdrlPolicyHelper.matchAsset(undefined, "doc")).toBe(true);
			expect(OdrlPolicyHelper.matchAsset([], "doc")).toBe(false);
		});
		test("returns true if matchAssetType is empty", () => {
			expect(OdrlPolicyHelper.matchAsset("doc", undefined)).toBe(true);
		});
		test("returns true if target matches matchAssetType", () => {
			expect(OdrlPolicyHelper.matchAsset("doc", "doc")).toBe(true);
		});
		test("returns false if target does not match matchAssetType", () => {
			expect(OdrlPolicyHelper.matchAsset("doc", "img")).toBe(false);
		});
		test("returns true if any target in array matches matchAssetType", () => {
			expect(OdrlPolicyHelper.matchAsset(["img", "doc"], "doc")).toBe(true);
		});
		test("returns false if no targets in array match matchAssetType", () => {
			expect(OdrlPolicyHelper.matchAsset(["img", "vid"], "doc")).toBe(false);
		});
	});

	describe("matchAction", () => {
		test("returns true if action is empty", () => {
			expect(OdrlPolicyHelper.matchAction(undefined, "read")).toBe(true);
			expect(OdrlPolicyHelper.matchAction([], "read")).toBe(false);
		});
		test("returns true if matchAction is empty", () => {
			expect(OdrlPolicyHelper.matchAction("read", undefined)).toBe(true);
		});
		test("returns true if action matches matchAction", () => {
			expect(OdrlPolicyHelper.matchAction(ActionType.Read, "read")).toBe(true);
		});
		test("returns false if action does not match matchAction", () => {
			expect(OdrlPolicyHelper.matchAction(ActionType.Delete, "read")).toBe(false);
		});
		test("returns true if any action in array matches matchAction", () => {
			expect(OdrlPolicyHelper.matchAction([ActionType.Delete, ActionType.Read], "read")).toBe(true);
		});
		test("returns false if no actions in array match matchAction", () => {
			expect(OdrlPolicyHelper.matchAction([ActionType.Delete, ActionType.Display], "read")).toBe(
				false
			);
		});
	});

	describe("matchTargetAndAction", () => {
		test("returns true if both asset and action match", () => {
			expect(
				OdrlPolicyHelper.matchTargetAndAction("doc", ActionType.Read, {
					assetType: "doc",
					action: "read"
				})
			).toBe(true);
		});
		test("returns false if asset does not match", () => {
			expect(
				OdrlPolicyHelper.matchTargetAndAction("img", ActionType.Read, {
					assetType: "doc",
					action: "read"
				})
			).toBe(false);
		});
		test("returns false if action does not match", () => {
			expect(
				OdrlPolicyHelper.matchTargetAndAction("doc", ActionType.Delete, {
					assetType: "doc",
					action: "read"
				})
			).toBe(false);
		});
		test("returns true if both are empty", () => {
			expect(OdrlPolicyHelper.matchTargetAndAction(undefined, undefined, undefined)).toBe(true);
		});
	});
});
