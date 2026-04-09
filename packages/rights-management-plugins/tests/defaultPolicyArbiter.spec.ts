// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageLoggingConnector,
	initSchema,
	type LogEntry
} from "@twin.org/logging-connector-entity-storage";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import { LoggingService } from "@twin.org/logging-service";
import { nameof } from "@twin.org/nameof";
import {
	OdrlProfiles,
	PolicyDecision,
	PolicyObligationEnforcerFactory,
	type IPolicyAdministrationPointComponent,
	type IPolicyObligationEnforcer
} from "@twin.org/rights-management-models";
import type {
	IDataspaceProtocolAgreement,
	IDataspaceProtocolPolicy
} from "@twin.org/standards-dataspace-protocol";
import {
	OdrlConflictStrategyType,
	OdrlContexts,
	OdrlOperatorType,
	OdrlPolicyType,
	type IOdrlConstraint,
	type IOdrlLogicalConstraint
} from "@twin.org/standards-w3c-odrl";
import { DefaultPolicyArbiter } from "../src/policyArbiters/defaultPolicyArbiter.js";

let loggingMemoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
let registeredObligationEnforcers: string[] = [];
let registeredPapComponentType: string | undefined;
const registerObligationEnforcer = (
	id: string,
	enforce: IPolicyObligationEnforcer["enforce"]
): void => {
	const enforcer: IPolicyObligationEnforcer = {
		className: () => id,
		enforce
	};
	PolicyObligationEnforcerFactory.register(id, () => enforcer);
	registeredObligationEnforcers.push(id);
};

const registerPolicyAdministrationPointComponent = (
	policies: Map<string, IDataspaceProtocolPolicy>
): void => {
	const papComponent: IPolicyAdministrationPointComponent = {
		className: () => "test-pap",
		create: vi.fn(),
		update: vi.fn(),
		get: async (policyId: string) => {
			const policy = policies.get(policyId);
			if (!policy) {
				throw new Error(`Policy not found: ${policyId}`);
			}
			return policy;
		},
		getAgreement: vi.fn(),
		getSet: vi.fn(),
		getOffer: vi.fn(),
		getEcosystemPolicy: vi.fn(),
		remove: vi.fn(),
		query: vi.fn()
	};

	// Unregister the default PAP and register the test one
	ComponentFactory.unregister("policy-administration-point");
	ComponentFactory.register("policy-administration-point", () => papComponent);
	registeredPapComponentType = "policy-administration-point";
};

describe("DefaultPolicyArbiter", () => {
	beforeEach(() => {
		initSchema();

		loggingMemoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register("logging", () => new EntityStorageLoggingConnector());
		ComponentFactory.register("logging", () => new LoggingService());

		// Register a default PAP that rejects all requests (for tests that don't use inheritance)
		const defaultPap: IPolicyAdministrationPointComponent = {
			className: () => "default-test-pap",
			create: vi.fn(),
			update: vi.fn(),
			get: async (policyId: string) => {
				throw new Error(`Policy not found: ${policyId}`);
			},
			getAgreement: vi.fn(),
			getSet: vi.fn(),
			getOffer: vi.fn(),
			getEcosystemPolicy: vi.fn(),
			remove: vi.fn(),
			query: vi.fn()
		};
		ComponentFactory.register("policy-administration-point", () => defaultPap);
	});

	afterEach(() => {
		for (const enforcerId of registeredObligationEnforcers) {
			PolicyObligationEnforcerFactory.unregister(enforcerId);
		}
		registeredObligationEnforcers = [];

		// Only unregister the test PAP if it was actually registered
		if (registeredPapComponentType) {
			try {
				ComponentFactory.unregister("policy-administration-point");
			} catch {
				// Ignore if already unregistered
			}
			registeredPapComponentType = undefined;
		}
	});

	test("grants when a permission has no constraints", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:unconditional",
			permission: [{ action: "read" }]
		};

		const decisions = await arbiter.decide(policy, undefined, { any: "data" });
		expect(decisions).toHaveLength(1);
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
	});

	test("grants when permission parties match the agreement", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const agreement: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			"@id": "agreement:party-match",
			assigner: "did:example:assigner",
			assignee: "did:example:assignee",
			permission: [
				{
					action: "read",
					assigner: "did:example:assigner",
					assignee: "did:example:assignee"
				}
			]
		};

		const decisions = await arbiter.decide(agreement, undefined, { any: "data" });
		expect(decisions).toHaveLength(1);
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
	});

	test("denies when permission parties do not match the agreement", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const agreement: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			"@id": "agreement:party-mismatch",
			assigner: "did:example:assigner",
			assignee: "did:example:assignee",
			permission: [
				{
					action: "read",
					assigner: "did:example:other-assigner",
					assignee: "did:example:assignee"
				}
			]
		};

		const decisions = await arbiter.decide(agreement, undefined, { any: "data" });
		expect(decisions).toHaveLength(1);
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
	});

	test("throws when assignee PartyCollection source is provided", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const agreement: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			"@id": "agreement:party-collection-source-provided",
			assigner: "did:example:assigner",
			assignee: "did:example:assignee",
			permission: [
				{
					action: "read",
					assignee: {
						"@type": "PartyCollection",
						source: "did:example:assignee",
						refinement: [
							{
								leftOperand: "twin:jsonpath:$.region",
								operator: OdrlOperatorType.Eq,
								rightOperand: "EU"
							}
						]
					}
				}
			]
		};

		await expect(arbiter.decide(agreement, undefined, { region: "EU" })).rejects.toThrow(
			"partyCollectionSourceNotSupported"
		);
	});

	test("throws when assignee PartyCollection source is provided regardless of refinement", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const agreement: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			"@id": "agreement:party-collection-source-provided-refinement-fail",
			assigner: "did:example:assigner",
			assignee: "did:example:assignee",
			permission: [
				{
					action: "read",
					assignee: {
						"@type": "PartyCollection",
						source: "did:example:assignee",
						refinement: [
							{
								leftOperand: "twin:jsonpath:$.region",
								operator: OdrlOperatorType.Eq,
								rightOperand: "EU"
							}
						]
					}
				}
			]
		};

		await expect(arbiter.decide(agreement, undefined, { region: "US" })).rejects.toThrow(
			"partyCollectionSourceNotSupported"
		);
	});

	test("does not throw and denies when PartyCollection source is missing", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const agreement: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			"@id": "agreement:party-collection-source-missing-allowed",
			assigner: "did:example:assigner",
			assignee: "did:example:assignee",
			permission: [
				{
					action: "read",
					assignee: {
						"@type": "PartyCollection",
						refinement: [
							{
								leftOperand: "twin:jsonpath:$.region",
								operator: OdrlOperatorType.Eq,
								rightOperand: "EU"
							}
						]
					}
				}
			]
		};

		const decisions = await arbiter.decide(agreement, undefined, { region: "EU" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
	});

	test("collects PartyCollection refinements when source is missing", () => {
		const arbiter = new DefaultPolicyArbiter();
		const exposedArbiter = arbiter as unknown as {
			resolveRulePartyContext: (party: unknown) => {
				partyIds: string[];
				refinements: (IOdrlConstraint | IOdrlLogicalConstraint)[];
			};
		};

		const context = exposedArbiter.resolveRulePartyContext({
			"@type": "PartyCollection",
			refinement: [
				{
					leftOperand: "twin:jsonpath:$.region",
					operator: OdrlOperatorType.Eq,
					rightOperand: "EU"
				}
			]
		});

		expect(context.partyIds).toEqual([]);
		expect(context.refinements).toHaveLength(1);
	});

	test("throws when assignee party has assignerOf set", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const agreement: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			"@id": "agreement:party-assigner-of",
			assigner: "did:example:assigner",
			assignee: "did:example:assignee",
			permission: [
				{
					action: "read",
					assignee: {
						"@type": "Party",
						uid: "did:example:assignee",
						assignerOf: "policy:some-policy"
					} as unknown as string
				}
			]
		};

		await expect(arbiter.decide(agreement, undefined, { any: "data" })).rejects.toThrow(
			"partyAssignerOfNotSupported"
		);
	});

	test("throws when assignee party has assigneeOf set", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const agreement: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			"@id": "agreement:party-assignee-of",
			assigner: "did:example:assigner",
			assignee: "did:example:assignee",
			permission: [
				{
					action: "read",
					assignee: {
						"@type": "Party",
						uid: "did:example:assignee",
						assigneeOf: "policy:some-policy"
					} as unknown as string
				}
			]
		};

		await expect(arbiter.decide(agreement, undefined, { any: "data" })).rejects.toThrow(
			"partyAssigneeOfNotSupported"
		);
	});

	test("throws when assignee party has partOf set", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const agreement: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			"@id": "agreement:party-part-of",
			assigner: "did:example:assigner",
			assignee: "did:example:assignee",
			permission: [
				{
					action: "read",
					assignee: {
						"@type": "Party",
						uid: "did:example:assignee",
						partOf: "collection:verified-parties"
					} as unknown as string
				}
			]
		};

		await expect(arbiter.decide(agreement, undefined, { any: "data" })).rejects.toThrow(
			"partyPartOfNotSupported"
		);
	});

	test("throws when permission duty has no enforcer", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:duty-no-enforcer",
			permission: [
				{
					action: "read",
					duty: [{ action: "attribute" }]
				}
			]
		};

		await expect(arbiter.decide(policy, undefined, { any: "data" })).rejects.toThrow(
			"noObligationEnforcersRegistered"
		);
	});

	test("grants when permission duty is enforced by any enforcer", async () => {
		registerObligationEnforcer("deny-enforcer", vi.fn().mockResolvedValue(false));
		registerObligationEnforcer("allow-enforcer", vi.fn().mockResolvedValue(true));

		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:duty-enforced",
			permission: [
				{
					action: "read",
					duty: [{ action: "compensate" }]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { any: "data" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
	});

	test("denies when all duty enforcers return false", async () => {
		registerObligationEnforcer("deny-enforcer-1", vi.fn().mockResolvedValue(false));
		registerObligationEnforcer("deny-enforcer-2", vi.fn().mockResolvedValue(false));

		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:duty-denied",
			permission: [
				{
					action: "read",
					duty: [{ action: "attribute" }]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { any: "data" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
	});

	test("grants when duty consequence is fulfilled", async () => {
		registerObligationEnforcer(
			"consequence-enforcer",
			vi.fn().mockImplementation(async (_policy, duty) => duty.action === "compensate")
		);

		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:duty-consequence-fulfilled",
			permission: [
				{
					action: "read",
					duty: [
						{
							action: "attribute",
							consequence: [{ action: "compensate" }]
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { any: "data" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
	});

	test("does not deny when prohibition remedy is fulfilled", async () => {
		registerObligationEnforcer(
			"remedy-enforcer",
			vi.fn().mockImplementation(async (_policy, duty) => duty.action === "anonymize")
		);

		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:prohibition-remedy-fulfilled",
			permission: [{ action: "read" }],
			prohibition: [
				{
					action: "read",
					remedy: [{ action: "anonymize" }]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "read");
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
	});

	test("denies when prohibition remedy is not fulfilled", async () => {
		registerObligationEnforcer("deny-remedy-enforcer", vi.fn().mockResolvedValue(false));

		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:prohibition-remedy-not-fulfilled",
			permission: [{ action: "read" }],
			prohibition: [
				{
					action: "read",
					remedy: [{ action: "anonymize" }]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "read");
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
	});

	test("grants when policy-level obligation is fulfilled", async () => {
		registerObligationEnforcer("allow-obligation-enforcer", vi.fn().mockResolvedValue(true));

		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:obligation-fulfilled",
			permission: [{ action: "read" }],
			obligation: [{ action: "compensate" }]
		};

		const decisions = await arbiter.decide(policy, undefined, { any: "data" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
	});

	test("denies when policy-level obligation is not fulfilled", async () => {
		registerObligationEnforcer("deny-obligation-enforcer", vi.fn().mockResolvedValue(false));

		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:obligation-not-fulfilled",
			permission: [{ action: "read" }],
			obligation: [{ action: "attribute" }]
		};

		const decisions = await arbiter.decide(policy, undefined, { any: "data" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
	});

	test("denies all per-target decisions when obligation is not fulfilled", async () => {
		registerObligationEnforcer(
			"deny-multi-target-obligation-enforcer",
			vi.fn().mockResolvedValue(false)
		);

		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:multi-target-obligation-fail",
			permission: [
				{ action: "read", target: "twin:jsonpath:$.items[*]" },
				{ action: "read", target: "twin:jsonpath:$.meta" }
			],
			obligation: [{ action: "compensate" }]
		};

		const decisions = await arbiter.decide(policy, undefined, {
			items: [{ id: "a" }],
			meta: { version: 1 }
		});

		expect(decisions).toHaveLength(2);
		expect(decisions).toEqual(
			expect.arrayContaining([
				{ target: "$.items[*]", decision: PolicyDecision.Denied },
				{ target: "$.meta", decision: PolicyDecision.Denied }
			])
		);
	});

	test("grants if any permission applies (any applicable permission authorizes)", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:and",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.age",
							operator: OdrlOperatorType.Gteq,
							rightOperand: { "@value": "18", "@type": "xsd:integer" }
						}
					]
				},
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { age: 18, region: "US" });
		expect(decisions[0].decision).toBe(PolicyDecision.Granted);
	});

	test("denies when there are no permissions (closed-world)", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:none"
		};

		const decisions = await arbiter.decide(policy, undefined, { any: "data" });
		expect(decisions).toHaveLength(1);
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
	});

	test("denies when an applicable prohibition has no explicit scope selectors (deny-overrides)", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:prohibit-all",
			permission: [{ action: "read" }],
			prohibition: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		const decisionsDenied = await arbiter.decide(policy, undefined, { region: "EU" });
		expect(decisionsDenied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);

		const decisionsGranted = await arbiter.decide(policy, undefined, { region: "US" });
		expect(decisionsGranted).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
	});

	test("perm conflict strategy grants when both permission and prohibition apply", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:conflict-perm",
			conflict: OdrlConflictStrategyType.Perm,
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			],
			prohibition: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { region: "EU" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
	});

	test("prohibit conflict strategy denies when both permission and prohibition apply", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:conflict-prohibit",
			conflict: OdrlConflictStrategyType.Prohibit,
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			],
			prohibition: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { region: "EU" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
	});

	test("invalid conflict strategy denies when both permission and prohibition apply", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:conflict-invalid",
			conflict: OdrlConflictStrategyType.Invalid,
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			],
			prohibition: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { region: "EU" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
	});

	test("denies when all permission constraints fail", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:age",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.age",
							operator: OdrlOperatorType.Gteq,
							rightOperand: { "@value": "18", "@type": "xsd:integer" }
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { age: 17 });
		expect(decisions).toHaveLength(1);
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
	});

	test("grants when numeric constraints pass", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:age",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.age",
							operator: OdrlOperatorType.Gteq,
							rightOperand: { "@value": "18", "@type": "xsd:integer" }
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { age: 18 });
		expect(decisions[0].decision).toBe(PolicyDecision.Granted);
	});

	test("supports logical constraint or", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:logical-or",
			permission: [
				{
					constraint: [
						{
							or: {
								"@list": [
									{
										leftOperand: "twin:jsonpath:$.age",
										operator: OdrlOperatorType.Gteq,
										rightOperand: { "@value": "18", "@type": "xsd:integer" }
									},
									{
										leftOperand: "twin:jsonpath:$.region",
										operator: OdrlOperatorType.Eq,
										rightOperand: "EU"
									}
								]
							}
						} as unknown as IOdrlConstraint | IOdrlLogicalConstraint
					]
				}
			]
		};

		const granted = await arbiter.decide(policy, undefined, { age: 18, region: "US" });
		expect(granted[0].decision).toBe(PolicyDecision.Granted);

		const denied = await arbiter.decide(policy, undefined, { age: 17, region: "US" });
		expect(denied[0].decision).toBe(PolicyDecision.Denied);
	});

	test("supports logical constraint xone", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:logical-xone",
			permission: [
				{
					constraint: [
						{
							xone: {
								"@list": [
									{
										leftOperand: "twin:jsonpath:$.age",
										operator: OdrlOperatorType.Gteq,
										rightOperand: { "@value": "18", "@type": "xsd:integer" }
									},
									{
										leftOperand: "twin:jsonpath:$.region",
										operator: OdrlOperatorType.Eq,
										rightOperand: "EU"
									}
								] as unknown as { "@id": string }[]
							}
						} as unknown as IOdrlConstraint | IOdrlLogicalConstraint
					]
				}
			]
		};

		const granted = await arbiter.decide(policy, undefined, { age: 18, region: "US" });
		expect(granted[0].decision).toBe(PolicyDecision.Granted);

		const denied = await arbiter.decide(policy, undefined, { age: 18, region: "EU" });
		expect(denied[0].decision).toBe(PolicyDecision.Denied);
	});

	test("supports logical constraint andSequence with @list", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:logical-and-sequence",
			permission: [
				{
					constraint: [
						{
							andSequence: {
								"@list": [
									{
										leftOperand: "twin:jsonpath:$.age",
										operator: OdrlOperatorType.Gteq,
										rightOperand: { "@value": "18", "@type": "xsd:integer" }
									},
									{
										leftOperand: "twin:jsonpath:$.region",
										operator: OdrlOperatorType.Eq,
										rightOperand: "EU"
									}
								] as unknown as { "@id": string }[]
							}
						} as unknown as IOdrlConstraint | IOdrlLogicalConstraint
					]
				}
			]
		};

		const granted = await arbiter.decide(policy, undefined, { age: 18, region: "EU" });
		expect(granted[0].decision).toBe(PolicyDecision.Granted);

		const denied = await arbiter.decide(policy, undefined, { age: 17, region: "EU" });
		expect(denied[0].decision).toBe(PolicyDecision.Denied);
	});

	test("rejects logical constraint with duplicate operand UIDs", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:logical-duplicate-uid",
			permission: [
				{
					constraint: [
						{
							and: [
								{
									"@id": "constraint:1",
									leftOperand: "twin:jsonpath:$.age",
									operator: OdrlOperatorType.Gteq,
									rightOperand: { "@value": "18", "@type": "xsd:integer" }
								},
								{
									"@id": "constraint:1",
									leftOperand: "twin:jsonpath:$.region",
									operator: OdrlOperatorType.Eq,
									rightOperand: "EU"
								}
							] as unknown as (IOdrlConstraint | IOdrlLogicalConstraint)[]
						} as unknown as IOdrlConstraint | IOdrlLogicalConstraint
					]
				}
			]
		};

		await expect(arbiter.decide(policy, undefined, { age: 18, region: "EU" })).rejects.toThrow(
			"logicalConstraintOperandNotUnique"
		);
	});

	test("validates logical constraint with unique operand UIDs", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:logical-unique-uid",
			permission: [
				{
					constraint: [
						{
							and: [
								{
									"@id": "constraint:1",
									leftOperand: "twin:jsonpath:$.age",
									operator: OdrlOperatorType.Gteq,
									rightOperand: { "@value": "18", "@type": "xsd:integer" }
								},
								{
									"@id": "constraint:2",
									leftOperand: "twin:jsonpath:$.region",
									operator: OdrlOperatorType.Eq,
									rightOperand: "EU"
								}
							] as unknown as (IOdrlConstraint | IOdrlLogicalConstraint)[]
						} as unknown as IOdrlConstraint | IOdrlLogicalConstraint
					]
				}
			]
		};

		const granted = await arbiter.decide(policy, undefined, { age: 18, region: "EU" });
		expect(granted[0].decision).toBe(PolicyDecision.Granted);

		const denied = await arbiter.decide(policy, undefined, { age: 17, region: "EU" });
		expect(denied[0].decision).toBe(PolicyDecision.Denied);
	});

	test("supports ordered string comparisons via localeCompare", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:string-order",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.code",
							operator: OdrlOperatorType.Gt,
							rightOperand: "a"
						}
					]
				}
			]
		};

		const granted = await arbiter.decide(policy, undefined, { code: "b" });
		expect(granted[0].decision).toBe(PolicyDecision.Granted);

		const denied = await arbiter.decide(policy, undefined, { code: "a" });
		expect(denied[0].decision).toBe(PolicyDecision.Denied);
	});

	test("denies when rightOperand is a plain JSONPath string (not supported)", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:right-jsonpath",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.age",
							operator: OdrlOperatorType.Gteq,
							rightOperand: "$.minAge"
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { age: 18, minAge: 18 });
		expect(decisions[0].decision).toBe(PolicyDecision.Denied);
	});

	test("supports rightOperand as JSONPath (typed object)", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:right-jsonpath-typed",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: { "@value": "$.allowedRegion", "@type": "twin:jsonpath" }
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, {
			region: "EU",
			allowedRegion: "EU"
		});
		expect(decisions[0].decision).toBe(PolicyDecision.Granted);
	});

	test("supports list comparisons from JSONPath", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:tags",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.tags[*]",
							operator: OdrlOperatorType.IsAnyOf,
							rightOperand: ["c", "b"]
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { tags: ["a", "b"] });
		expect(decisions[0].decision).toBe(PolicyDecision.Granted);
	});

	test("supports leftOperand twin:jsonpath:<path>", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:left-jsonpath-prefix",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.age",
							operator: OdrlOperatorType.Gteq,
							rightOperand: { "@value": "18", "@type": "xsd:integer" }
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { age: 18 });
		expect(decisions[0].decision).toBe(PolicyDecision.Granted);
	});

	test("throws when leftOperand is twin:jsonpath: with no target", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:left-jsonpath-missing-target",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:",
							operator: OdrlOperatorType.Gteq,
							rightOperand: { "@value": "18", "@type": "xsd:integer" }
						}
					]
				}
			]
		};

		await expect(arbiter.decide(policy, undefined, { age: 18 })).rejects.toThrow();
	});

	test("returns a specific decision target when permission target uses twin:jsonpath", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:jsonpath-target",
			permission: [
				{
					target: "twin:jsonpath:$.items[*]",
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "US"
						}
					]
				}
			]
		};

		const decisionsGranted = await arbiter.decide(policy, undefined, {
			region: "US",
			items: [{ id: "a" }]
		});
		expect(decisionsGranted).toEqual([{ target: "$.items[*]", decision: PolicyDecision.Granted }]);

		const decisionsDenied = await arbiter.decide(policy, undefined, {
			region: "EU",
			items: [{ id: "a" }]
		});
		expect(decisionsDenied).toEqual([{ target: "$.items[*]", decision: PolicyDecision.Denied }]);
	});

	test("expands compact permission with multiple targets into atomic target-scoped rules", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:compact-multiple-targets",
			permission: [
				{
					target: ["twin:jsonpath:$.items[*]", "twin:jsonpath:$.meta"],
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, {
			region: "EU",
			items: [{ id: "a" }],
			meta: { version: 1 }
		});

		expect(decisions).toEqual(
			expect.arrayContaining([
				{ target: "$.items[*]", decision: PolicyDecision.Granted },
				{ target: "$.meta", decision: PolicyDecision.Granted }
			])
		);
		expect(decisions).toHaveLength(2);
	});

	test("throws when rule target does not use twin:jsonpath prefix", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:unsupported-target",
			permission: [
				{
					target: "did:example:asset-1",
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		await expect(arbiter.decide(policy, undefined, { region: "EU" })).rejects.toThrow(
			"ruleTargetNotSupported"
		);
	});

	test("returns target-scoped denial when prohibition target uses twin:jsonpath", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:prohibit-targeted",
			permission: [{ action: "read", target: "twin:jsonpath:$.items[*]" }],
			prohibition: [
				{
					action: "read",
					target: "twin:jsonpath:$.items[*]",
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, {
			region: "EU",
			items: [{ id: "a" }]
		});

		expect(decisions).toEqual([{ target: "$.items[*]", decision: PolicyDecision.Denied }]);
	});

	test("returns root denied and single-property granted decisions", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:root-denied-single-property-granted",
			permission: [{ action: "read", target: "twin:jsonpath:$.profile.email" }],
			prohibition: [{ action: "read" }]
		};

		const decisions = await arbiter.decide(
			policy,
			undefined,
			{ profile: { email: "alice@example.com", phone: "123" } },
			"read"
		);

		expect(decisions).toHaveLength(2);
		expect(decisions).toEqual(
			expect.arrayContaining([
				{ target: "$", decision: PolicyDecision.Denied },
				{ target: "$.profile.email", decision: PolicyDecision.Granted }
			])
		);
	});

	test("uses AssetCollection source as decision target and applies refinement constraints", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:asset-collection-source-and-refinement",
			permission: [
				{
					action: "read",
					target: {
						"@type": "AssetCollection",
						source: "twin:jsonpath:$.items[*]",
						refinement: {
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					}
				}
			]
		};

		const granted = await arbiter.decide(
			policy,
			undefined,
			{ region: "EU", items: [{ id: "a" }] },
			"read"
		);
		expect(granted).toEqual([{ target: "$.items[0]", decision: PolicyDecision.Granted }]);

		const denied = await arbiter.decide(
			policy,
			undefined,
			{ region: "US", items: [{ id: "a" }] },
			"read"
		);
		expect(denied).toEqual([{ target: "$.items[0]", decision: PolicyDecision.Denied }]);
	});

	test("throws when AssetCollection source is missing", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:asset-collection-source-missing",
			permission: [
				{
					action: "read",
					target: {
						"@type": "AssetCollection",
						refinement: {
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					}
				}
			]
		};

		await expect(arbiter.decide(policy, undefined, { region: "EU" }, "read")).rejects.toThrow(
			"assetCollectionSourceNotSupported"
		);
	});

	test("throws when AssetCollection source is not twin:jsonpath", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:asset-collection-source-invalid",
			permission: [
				{
					action: "read",
					target: {
						"@type": "AssetCollection",
						source: "https://example.com/items",
						refinement: {
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					}
				}
			]
		};

		await expect(arbiter.decide(policy, undefined, { region: "EU" }, "read")).rejects.toThrow(
			"assetCollectionSourceNotSupported"
		);
	});

	test("uses AssetCollection source as prohibition target and applies refinement constraints", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:asset-collection-prohibition-refinement",
			permission: [{ action: "read", target: "twin:jsonpath:$.items[*]" }],
			prohibition: [
				{
					action: "read",
					target: {
						"@type": "AssetCollection",
						source: "twin:jsonpath:$.items[*]",
						refinement: {
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					}
				}
			]
		};

		// Refinement is satisfied — prohibition fires and denies
		const denied = await arbiter.decide(
			policy,
			undefined,
			{ region: "EU", items: [{ id: "a" }] },
			"read"
		);
		expect(denied).toEqual(
			expect.arrayContaining([
				{ target: "$.items[*]", decision: PolicyDecision.Granted },
				{ target: "$.items[0]", decision: PolicyDecision.Denied }
			])
		);

		// Refinement is not satisfied — prohibition does not fire and permission grants
		const granted = await arbiter.decide(
			policy,
			undefined,
			{ region: "US", items: [{ id: "a" }] },
			"read"
		);
		expect(granted).toEqual([{ target: "$.items[*]", decision: PolicyDecision.Granted }]);
	});

	test("throws when target asset has hasPolicy set", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:asset-has-policy",
			permission: [
				{
					action: "read",
					target: {
						"@type": "Asset",
						uid: "twin:jsonpath:$.items[*]",
						hasPolicy: "policy:governing"
					} as unknown as string
				}
			]
		};

		await expect(arbiter.decide(policy, undefined, { items: [] })).rejects.toThrow(
			"assetHasPolicyNotSupported"
		);
	});

	test("throws when target asset has partOf set", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:asset-part-of",
			permission: [
				{
					action: "read",
					target: {
						"@type": "Asset",
						uid: "twin:jsonpath:$.items[*]",
						partOf: "collection:my-assets"
					} as unknown as string
				}
			]
		};

		await expect(arbiter.decide(policy, undefined, { items: [] })).rejects.toThrow(
			"assetPartOfNotSupported"
		);
	});

	test("denies when a prohibition constraint applies", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:prohibit-email",
			permission: [{ action: "read" }],
			prohibition: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(policy, undefined, { region: "EU" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
	});

	test("allows jsonpath-typed rightOperand comparisons in prohibition conditions", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:prohibit-email-conditional",
			permission: [{ action: "read" }],
			prohibition: [
				{
					constraint: [
						// condition uses jsonpath-typed rightOperand for comparison
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: { "@value": "$.blockedRegion", "@type": "twin:jsonpath" }
						}
					]
				}
			]
		};

		const decisionsBlocked = await arbiter.decide(policy, undefined, {
			region: "EU",
			blockedRegion: "EU"
		});
		expect(decisionsBlocked).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);

		const decisionsNotBlocked = await arbiter.decide(policy, undefined, {
			name: "Alice",
			email: "a@b.com",
			region: "US",
			blockedRegion: "EU"
		});
		expect(decisionsNotBlocked).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
	});

	test("logs decidingPolicy with policy id", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:log",
			permission: [{ action: "read" }]
		};

		await arbiter.decide(policy);

		const logs = loggingMemoryEntityStorage.getStore();
		expect(logs).toHaveLength(1);
		expect(logs[0]).toMatchObject({
			level: "info",
			source: DefaultPolicyArbiter.CLASS_NAME,
			message: "decidingPolicy",
			data: {
				policyId: "policy:log"
			}
		});
	});

	test("inherits permissions from parent policy", async () => {
		const parentPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:parent",
			permission: [{ action: "read" }]
		};

		const childPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:child",
			inheritFrom: "policy:parent",
			permission: [{ action: "write" }]
		};

		const policiesToRetrieve = new Map([["policy:parent", parentPolicy]]);
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		const decisions = await arbiter.decide(childPolicy, undefined, { any: "data" });
		expect(decisions).toHaveLength(1);
		// Should grant because child has write permission and inherited read permission
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
	});

	test("inherits prohibitions from parent policy", async () => {
		const parentPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:parent-prohib",
			prohibition: [
				{
					action: "delete",
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.isPaid",
							operator: OdrlOperatorType.Eq,
							rightOperand: { "@value": "false", "@type": "xsd:boolean" }
						}
					]
				}
			]
		};

		const childPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:child-prohib",
			inheritFrom: "policy:parent-prohib",
			permission: [{ action: "read" }]
		};

		const policiesToRetrieve = new Map([["policy:parent-prohib", parentPolicy]]);
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		const decisions = await arbiter.decide(childPolicy, undefined, {
			isPaid: true
		});
		expect(decisions).toHaveLength(1);
		// Should grant because inherited prohibition constraint is not satisfied
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
	});

	test("applies inherited prohibition to deny access", async () => {
		const parentPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:parent-deny",
			prohibition: [{ action: "read" }]
		};

		const childPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:child-deny",
			inheritFrom: "policy:parent-deny",
			permission: [{ action: "read" }]
		};

		const policiesToRetrieve = new Map([["policy:parent-deny", parentPolicy]]);
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		const decisions = await arbiter.decide(childPolicy, undefined, { any: "data" });
		expect(decisions).toHaveLength(1);
		// Should deny because inherited prohibition overrides permission (deny-overrides)
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
	});

	test("inherits from multiple parent policies", async () => {
		const parentPolicy1: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:parent1",
			permission: [{ action: "read" }]
		};

		const parentPolicy2: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:parent2",
			permission: [{ action: "write" }]
		};

		const childPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:child-multi",
			inheritFrom: ["policy:parent1", "policy:parent2"],
			permission: [{ action: "execute" }]
		};

		const policiesToRetrieve = new Map([
			["policy:parent1", parentPolicy1],
			["policy:parent2", parentPolicy2]
		]);
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		const decisions = await arbiter.decide(childPolicy, undefined, { any: "data" });
		expect(decisions).toHaveLength(1);
		// Should grant because all three permissions are inherited/defined
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
	});

	test("inherits conflict strategy from parent policy", async () => {
		const parentPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:parent-conflict",
			conflict: OdrlConflictStrategyType.Perm,
			permission: [{ action: "read" }]
		};

		const childPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:child-conflict",
			inheritFrom: "policy:parent-conflict",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			],
			prohibition: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		const policiesToRetrieve = new Map([["policy:parent-conflict", parentPolicy]]);
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		const decisions = await arbiter.decide(childPolicy, undefined, { region: "EU" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
	});

	test("conflicting inherited strategies default to invalid", async () => {
		const parentPolicy1: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:parent-conflict-1",
			conflict: OdrlConflictStrategyType.Perm,
			permission: [{ action: "read" }]
		};

		const parentPolicy2: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:parent-conflict-2",
			conflict: OdrlConflictStrategyType.Prohibit,
			permission: [{ action: "read" }]
		};

		const childPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:child-conflict-invalid",
			inheritFrom: ["policy:parent-conflict-1", "policy:parent-conflict-2"],
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			],
			prohibition: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		const policiesToRetrieve = new Map([
			["policy:parent-conflict-1", parentPolicy1],
			["policy:parent-conflict-2", parentPolicy2]
		]);
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		const decisions = await arbiter.decide(childPolicy, undefined, { region: "EU" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
	});

	test("throws when inherited policy does not exist", async () => {
		const childPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:child-missing",
			inheritFrom: "policy:missing-parent",
			permission: [{ action: "read" }]
		};

		// Register PAP with empty policies - parent policy not found
		const policiesToRetrieve = new Map<string, IDataspaceProtocolPolicy>();
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		// Should throw because parent policy cannot be found
		await expect(arbiter.decide(childPolicy, undefined, { any: "data" })).rejects.toThrow(
			"Policy not found"
		);
	});

	test("throws when circular inheritance is detected", async () => {
		// Create two policies that inherit from each other
		const policy1: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:circular-1",
			inheritFrom: "policy:circular-2",
			permission: [{ action: "read" }]
		};

		const policy2: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:circular-2",
			inheritFrom: "policy:circular-1",
			permission: [{ action: "write" }]
		};

		// Register PAP with circular policies
		const policiesToRetrieve = new Map([
			["policy:circular-1", policy1],
			["policy:circular-2", policy2]
		]);
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		// Should throw because of circular inheritance
		await expect(arbiter.decide(policy1, undefined, { any: "data" })).rejects.toThrow(
			"circularInheritanceDetected"
		);
	});

	test("throws when inherited policy depth exceeds default limit", async () => {
		// Create a chain longer than the default max depth (10)
		// depth-0 -> depth-1 -> ... -> depth-11 (11 edges)
		const policiesToRetrieve = new Map<string, IDataspaceProtocolPolicy>();
		for (let i = 1; i <= 11; i++) {
			policiesToRetrieve.set(`policy:depth-${i}`, {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": `policy:depth-${i}`,
				inheritFrom: i < 11 ? `policy:depth-${i + 1}` : undefined,
				permission: [{ action: "read" }]
			});
		}

		const rootPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:depth-0",
			inheritFrom: "policy:depth-1",
			permission: [{ action: "write" }]
		};

		registerPolicyAdministrationPointComponent(policiesToRetrieve);
		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		await expect(arbiter.decide(rootPolicy, undefined, { any: "data" })).rejects.toThrow(
			"maxInheritanceDepthExceeded"
		);
	});

	test("uses configured maxInheritanceDepth when resolving inherited policies", async () => {
		// depth-0 -> depth-1 -> depth-2 (2 edges) should succeed with maxInheritanceDepth=2
		const parent2: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:depth-config-2",
			permission: [{ action: "read" }]
		};

		const parent1: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:depth-config-1",
			inheritFrom: "policy:depth-config-2",
			permission: [{ action: "read" }]
		};

		const rootPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:depth-config-0",
			inheritFrom: "policy:depth-config-1",
			permission: [{ action: "write" }]
		};

		const policiesToRetrieve = new Map([
			["policy:depth-config-1", parent1],
			["policy:depth-config-2", parent2]
		]);
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType,
			config: {
				maxInheritanceDepth: 2
			}
		});

		const decisions = await arbiter.decide(rootPolicy, undefined, { any: "data" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
	});

	test("inherits obligations from parent policy", async () => {
		// Register an obligation enforcer that always succeeds
		registerObligationEnforcer("success-enforcer", async () => true);

		const parentPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:parent-oblig",
			obligation: [{ action: "audit" }]
		};

		const childPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:child-oblig",
			inheritFrom: "policy:parent-oblig",
			permission: [{ action: "read", duty: [{ action: "encrypt" }] }]
		};

		const policiesToRetrieve = new Map([["policy:parent-oblig", parentPolicy]]);
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		const decisions = await arbiter.decide(childPolicy, undefined, { any: "data" });
		expect(decisions).toHaveLength(1);
		// Should grant because duties are enforced
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
	});

	test("inherits permissions with constraints from parent policy", async () => {
		const parentPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:parent-constraint",
			permission: [
				{
					action: "read",
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.territory",
							operator: OdrlOperatorType.Eq,
							rightOperand: "US"
						}
					]
				}
			]
		};

		const childPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:child-constraint",
			inheritFrom: "policy:parent-constraint"
		};

		const policiesToRetrieve = new Map([["policy:parent-constraint", parentPolicy]]);
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		// When constraint is satisfied
		const decisionsSatisfied = await arbiter.decide(childPolicy, undefined, {
			territory: "US"
		});
		expect(decisionsSatisfied).toHaveLength(1);
		expect(decisionsSatisfied[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
	});

	test("does not grant when inherited permission constraint is not satisfied", async () => {
		const parentPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:parent-constraint-fail",
			permission: [
				{
					action: "read",
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.territory",
							operator: OdrlOperatorType.Eq,
							rightOperand: "US"
						}
					]
				}
			]
		};

		const childPolicy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:child-constraint-fail",
			inheritFrom: "policy:parent-constraint-fail"
		};

		const policiesToRetrieve = new Map([["policy:parent-constraint-fail", parentPolicy]]);
		registerPolicyAdministrationPointComponent(policiesToRetrieve);

		const arbiter = new DefaultPolicyArbiter({
			policyAdministrationPointComponentType: registeredPapComponentType
		});

		// When constraint is not satisfied
		const decisionsUnsatisfied = await arbiter.decide(childPolicy, undefined, {
			territory: "EU"
		});
		expect(decisionsUnsatisfied).toHaveLength(1);
		expect(decisionsUnsatisfied[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
	});

	describe("Action matching", () => {
		test("grants when permission has no action specified and no action is requested", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:no-action-no-request",
				permission: [{}]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" });
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});

		test("grants when permission has no action specified but an action is requested (action-agnostic)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:no-action-with-request",
				permission: [{}]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});

		test("grants when permission action matches the requested action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:action-match",
				permission: [{ action: "read" }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});

		test("denies when permission action does not match the requested action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:action-mismatch",
				permission: [{ action: "read" }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "write");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
		});

		test("grants when permission has multiple actions and one matches the requested action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:multiple-actions-match",
				permission: [{ action: ["read", "write", "delete"] }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "write");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});

		test("denies when permission has multiple actions but none match the requested action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:multiple-actions-no-match",
				permission: [{ action: ["read", "delete"] }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "write");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
		});

		test("grants when permission has no action and multiple other permissions are denied", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:any-permission-applies",
				permission: [
					{ action: "write" },
					{ action: "delete" },
					{} // permission with no action - should grant for any action
				]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});

		test("denies when multiple permissions have specific actions but none match the requested action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:no-matching-actions",
				permission: [{ action: "read" }, { action: "write" }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "delete");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
		});

		test("denies prohibition when actions match", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:prohibit-action",
				permission: [{ action: "read" }],
				prohibition: [{ action: "read" }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
		});

		test("grants when action is permitted but prohibition action does not match", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:perm-prohib-mismatch",
				permission: [{ action: "read" }],
				prohibition: [{ action: "write" }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});
	});

	describe("Per-item decisions with AssetCollection refinement", () => {
		test("returns root decision followed by per-item decisions with absolute wildcard JSONPath", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:per-item-mixed",
				permission: [
					{
						action: "read",
						target: {
							"@type": "AssetCollection",
							source: "twin:jsonpath:$.itemList.itemListElement[*]",
							refinement: {
								leftOperand: "twin:jsonpath:$.itemList.itemListElement[*].unloadingLocation.id",
								operator: OdrlOperatorType.Eq,
								rightOperand: "unece:LOCODE#GBFXT"
							}
						}
					}
				]
			};

			const data = {
				itemList: {
					itemListElement: [
						{ unloadingLocation: { id: "unece:LOCODE#GBFXT" }, id: "consignment-1" },
						{ unloadingLocation: { id: "unece:LOCODE#GBDVR" }, id: "consignment-2" },
						{ unloadingLocation: { id: "unece:LOCODE#GBFXT" }, id: "consignment-3" }
					]
				}
			};

			const decisions = await arbiter.decide(policy, undefined, data);
			expect(decisions).toHaveLength(3);
			expect(decisions).toEqual(
				expect.arrayContaining([
					{ target: "$.itemList.itemListElement[0]", decision: PolicyDecision.Granted },
					{ target: "$.itemList.itemListElement[1]", decision: PolicyDecision.Denied },
					{ target: "$.itemList.itemListElement[2]", decision: PolicyDecision.Granted }
				])
			);
		});

		test("denies first item and grants second item with explicit itemListElement targets", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:per-item-index-targets",
				permission: [
					{
						action: "read",
						target: "twin:jsonpath:$.itemList.itemListElement[1]"
					}
				],
				prohibition: [
					{
						action: "read",
						target: "twin:jsonpath:$.itemList.itemListElement[0]"
					}
				]
			};

			const decisions = await arbiter.decide(
				policy,
				undefined,
				{
					itemList: {
						itemListElement: [{ id: "item-1" }, { id: "item-2" }]
					}
				},
				"read"
			);

			expect(decisions).toHaveLength(2);
			expect(decisions).toEqual(
				expect.arrayContaining([
					{ target: "$.itemList.itemListElement[0]", decision: PolicyDecision.Denied },
					{ target: "$.itemList.itemListElement[1]", decision: PolicyDecision.Granted }
				])
			);
		});

		test("grants all items when all match the refinement constraint", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:per-item-all-match",
				permission: [
					{
						action: "read",
						target: {
							"@type": "AssetCollection",
							source: "twin:jsonpath:$.itemList.itemListElement[*]",
							refinement: {
								leftOperand: "twin:jsonpath:$.itemList.itemListElement[*].country",
								operator: OdrlOperatorType.Eq,
								rightOperand: "PL"
							}
						}
					}
				]
			};

			const data = {
				itemList: {
					itemListElement: [
						{ country: "PL", id: "item-1" },
						{ country: "PL", id: "item-2" }
					]
				}
			};

			const decisions = await arbiter.decide(policy, undefined, data);
			expect(decisions).toHaveLength(2);
			expect(decisions).toEqual(
				expect.arrayContaining([
					{ target: "$.itemList.itemListElement[0]", decision: PolicyDecision.Granted },
					{ target: "$.itemList.itemListElement[1]", decision: PolicyDecision.Granted }
				])
			);
		});

		test("denies all items when none match the refinement constraint", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:per-item-none-match",
				permission: [
					{
						action: "read",
						target: {
							"@type": "AssetCollection",
							source: "twin:jsonpath:$.itemList.itemListElement[*]",
							refinement: {
								leftOperand: "twin:jsonpath:$.itemList.itemListElement[*].country",
								operator: OdrlOperatorType.Eq,
								rightOperand: "PL"
							}
						}
					}
				]
			};

			const data = {
				itemList: {
					itemListElement: [
						{ country: "DE", id: "item-1" },
						{ country: "FR", id: "item-2" }
					]
				}
			};

			const decisions = await arbiter.decide(policy, undefined, data);
			expect(decisions).toHaveLength(2);
			expect(decisions).toEqual(
				expect.arrayContaining([
					{ target: "$.itemList.itemListElement[0]", decision: PolicyDecision.Denied },
					{ target: "$.itemList.itemListElement[1]", decision: PolicyDecision.Denied }
				])
			);
		});

		test("returns root-level decision when permission has no AssetCollection target", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:no-asset-collection",
				permission: [{ action: "read" }]
			};

			const data = {
				itemList: {
					itemListElement: [
						{ country: "PL", id: "item-1" },
						{ country: "DE", id: "item-2" }
					]
				}
			};

			const decisions = await arbiter.decide(policy, undefined, data);
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});

		test("returns per-item denied decisions when action does not match", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:per-item-denied-root",
				permission: [
					{
						action: "write",
						target: {
							"@type": "AssetCollection",
							source: "twin:jsonpath:$.itemList.itemListElement[*]",
							refinement: {
								leftOperand: "twin:jsonpath:$.itemList.itemListElement[*].country",
								operator: OdrlOperatorType.Eq,
								rightOperand: "PL"
							}
						}
					}
				]
			};

			const data = {
				itemList: {
					itemListElement: [{ country: "PL", id: "item-1" }]
				}
			};

			const decisions = await arbiter.decide(policy, undefined, data, "read");
			expect(decisions).toEqual([
				{ target: "$.itemList.itemListElement[0]", decision: PolicyDecision.Denied }
			]);
		});

		test("evaluates multiple refinement constraints with AND semantics", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:per-item-multi-refinement",
				permission: [
					{
						action: "read",
						target: {
							"@type": "AssetCollection",
							source: "twin:jsonpath:$.itemList.itemListElement[*]",
							refinement: [
								{
									leftOperand: "twin:jsonpath:$.itemList.itemListElement[*].country",
									operator: OdrlOperatorType.Eq,
									rightOperand: "GB"
								},
								{
									leftOperand: "twin:jsonpath:$.itemList.itemListElement[*].status",
									operator: OdrlOperatorType.Eq,
									rightOperand: "active"
								}
							]
						}
					}
				]
			};

			const data = {
				itemList: {
					itemListElement: [
						{ country: "GB", status: "active", id: "item-1" },
						{ country: "GB", status: "inactive", id: "item-2" },
						{ country: "DE", status: "active", id: "item-3" },
						{ country: "DE", status: "inactive", id: "item-4" }
					]
				}
			};

			const decisions = await arbiter.decide(policy, undefined, data);
			expect(decisions).toHaveLength(4);
			expect(decisions).toEqual(
				expect.arrayContaining([
					{ target: "$.itemList.itemListElement[0]", decision: PolicyDecision.Granted },
					{ target: "$.itemList.itemListElement[1]", decision: PolicyDecision.Denied },
					{ target: "$.itemList.itemListElement[2]", decision: PolicyDecision.Denied },
					{ target: "$.itemList.itemListElement[3]", decision: PolicyDecision.Denied }
				])
			);
		});

		test("works with direct array path in wildcard JSONPath", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:per-item-direct-array",
				permission: [
					{
						action: "read",
						target: {
							"@type": "AssetCollection",
							source: "twin:jsonpath:$.items[*]",
							refinement: {
								leftOperand: "twin:jsonpath:$.items[*].type",
								operator: OdrlOperatorType.Eq,
								rightOperand: "A"
							}
						}
					}
				]
			};

			const data = {
				items: [
					{ type: "A", id: "1" },
					{ type: "B", id: "2" }
				]
			};

			const decisions = await arbiter.decide(policy, undefined, data);
			expect(decisions).toHaveLength(2);
			expect(decisions).toEqual(
				expect.arrayContaining([
					{ target: "$.items[0]", decision: PolicyDecision.Granted },
					{ target: "$.items[1]", decision: PolicyDecision.Denied }
				])
			);
		});

		test("throws when AssetCollection has source property set", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:source-not-supported",
				permission: [
					{
						action: "read",
						target: {
							"@type": "AssetCollection",
							source: "https://twin.example.org/external-data",
							refinement: {
								leftOperand: "twin:jsonpath:$.items[*].type",
								operator: OdrlOperatorType.Eq,
								rightOperand: "A"
							}
						}
					}
				]
			};

			await expect(arbiter.decide(policy, undefined, { items: [{ type: "A" }] })).rejects.toThrow(
				"assetCollectionSourceNotSupported"
			);
		});
	});

	describe("Operator coverage", () => {
		test("neq operator grants when value differs", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:neq-grant",
				permission: [
					{
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.status",
								operator: OdrlOperatorType.Neq,
								rightOperand: "blocked"
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, undefined, { status: "active" });
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, undefined, { status: "blocked" });
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("lt operator grants when value is strictly less than threshold", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:lt-grant",
				permission: [
					{
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.count",
								operator: OdrlOperatorType.Lt,
								rightOperand: { "@value": "10", "@type": "xsd:integer" }
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, undefined, { count: 9 });
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, undefined, { count: 10 });
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("lteq operator grants when value is less than or equal to threshold", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:lteq-grant",
				permission: [
					{
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.level",
								operator: OdrlOperatorType.Lteq,
								rightOperand: { "@value": "5", "@type": "xsd:integer" }
							}
						]
					}
				]
			};

			const grantedEqual = await arbiter.decide(policy, undefined, { level: 5 });
			expect(grantedEqual[0].decision).toBe(PolicyDecision.Granted);

			const grantedLess = await arbiter.decide(policy, undefined, { level: 3 });
			expect(grantedLess[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, undefined, { level: 6 });
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("isNoneOf operator grants when value is not in the list", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:isnone-grant",
				permission: [
					{
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.region",
								operator: OdrlOperatorType.IsNoneOf,
								rightOperand: ["CN", "RU"]
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, undefined, { region: "EU" });
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, undefined, { region: "CN" });
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("isAllOf operator grants when values exactly match the required set", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:isall-grant",
				permission: [
					{
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.roles[*]",
								operator: OdrlOperatorType.IsAllOf,
								rightOperand: ["admin", "editor"]
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, undefined, { roles: ["admin", "editor"] });
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, undefined, { roles: ["admin"] });
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("supports logical and constraint", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:logical-and",
				permission: [
					{
						constraint: [
							{
								and: [
									{
										leftOperand: "twin:jsonpath:$.age",
										operator: OdrlOperatorType.Gteq,
										rightOperand: { "@value": "18", "@type": "xsd:integer" }
									},
									{
										leftOperand: "twin:jsonpath:$.region",
										operator: OdrlOperatorType.Eq,
										rightOperand: "EU"
									}
								] as unknown as (IOdrlConstraint | IOdrlLogicalConstraint)[]
							} as unknown as IOdrlConstraint | IOdrlLogicalConstraint
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, undefined, { age: 18, region: "EU" });
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, undefined, { age: 18, region: "US" });
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("locTimeEq operator grants when values are equal", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:loctimeeq-grant",
				permission: [
					{
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.zone",
								operator: OdrlOperatorType.LocTimeEq,
								rightOperand: "Europe/London"
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, undefined, { zone: "Europe/London" });
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, undefined, { zone: "America/New_York" });
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("throws when constraint uses rightOperandReference", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:right-operand-reference",
				permission: [
					{
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.region",
								operator: OdrlOperatorType.Eq,
								rightOperandReference: "https://example.com/allowed-regions"
							} as unknown as IOdrlConstraint
						]
					}
				]
			};

			await expect(arbiter.decide(policy, undefined, { region: "EU" })).rejects.toThrow(
				"rightOperandReferenceNotSupported"
			);
		});
	});

	describe("Information target", () => {
		test("evaluates permission constraints against information map entry when target is twin:information", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:info-target-grant",
				permission: [
					{
						action: "read",
						target: "twin:information:$.credentials",
						constraint: [
							{
								leftOperand: "twin:information:$.credentials.clearanceLevel",
								operator: OdrlOperatorType.Gteq,
								rightOperand: { "@value": "3", "@type": "xsd:integer" }
							}
						]
					}
				]
			};

			const information = {
				credentials: { "@id": "info:credentials", clearanceLevel: 4 }
			};

			const granted = await arbiter.decide(policy, information, { unrelated: "data" });
			expect(granted).toEqual([{ target: "$.credentials", decision: PolicyDecision.Granted }]);

			const informationDenied = {
				credentials: { "@id": "info:credentials", clearanceLevel: 2 }
			};

			const denied = await arbiter.decide(policy, informationDenied, { unrelated: "data" });
			expect(denied).toEqual([{ target: "$.credentials", decision: PolicyDecision.Denied }]);
		});

		test("throws ruleTargetNotSupported when the information key is absent", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:info-target-missing",
				permission: [
					{
						action: "read",
						target: "twin:information:$.credentials",
						constraint: [
							{
								leftOperand: "twin:information:$.credentials.clearanceLevel",
								operator: OdrlOperatorType.Gteq,
								rightOperand: { "@value": "3", "@type": "xsd:integer" }
							}
						]
					}
				]
			};

			await expect(arbiter.decide(policy, {}, { unrelated: "data" })).rejects.toThrow(
				"ruleTargetNotSupported"
			);
		});

		test("supports mixed twin:jsonpath and twin:information operand lookups", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:info-target-mixed-lookups",
				permission: [
					{
						action: "read",
						target: "twin:information:$.credentials",
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.requestedLevel",
								operator: OdrlOperatorType.Lteq,
								rightOperand: {
									"@value": "$.credentials.clearanceLevel",
									"@type": "twin:information"
								}
							}
						]
					}
				]
			};

			const information = {
				credentials: { "@id": "info:credentials", clearanceLevel: 4 }
			};

			const granted = await arbiter.decide(policy, information, { requestedLevel: 3 }, "read");
			expect(granted).toEqual([{ target: "$.credentials", decision: PolicyDecision.Granted }]);

			const denied = await arbiter.decide(policy, information, { requestedLevel: 5 }, "read");
			expect(denied).toEqual([{ target: "$.credentials", decision: PolicyDecision.Denied }]);
		});
	});

	describe("Obligation applicability", () => {
		test("obligation with constraints is skipped when constraints are not satisfied", async () => {
			registerObligationEnforcer("fail-if-called", vi.fn().mockResolvedValue(false));

			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:obligation-constraint-skip",
				permission: [{ action: "read" }],
				obligation: [
					{
						action: "compensate",
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.isPremium",
								operator: OdrlOperatorType.Eq,
								rightOperand: { "@value": "true", "@type": "xsd:boolean" }
							}
						]
					}
				]
			};

			// Obligation constraint is not satisfied — obligation is skipped, permission is granted
			const decisions = await arbiter.decide(policy, undefined, { isPremium: false });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
		});

		test("obligation with constraints is enforced when constraints are satisfied", async () => {
			registerObligationEnforcer("accept-compensate", vi.fn().mockResolvedValue(true));

			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:obligation-constraint-enforced",
				permission: [{ action: "read" }],
				obligation: [
					{
						action: "compensate",
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.isPremium",
								operator: OdrlOperatorType.Eq,
								rightOperand: { "@value": "true", "@type": "xsd:boolean" }
							}
						]
					}
				]
			};

			// Obligation constraint is satisfied — obligation is enforced and succeeds
			const decisions = await arbiter.decide(policy, undefined, { isPremium: true });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
		});

		test("obligation scoped to a specific party is skipped for other parties", async () => {
			registerObligationEnforcer("party-fail-enforcer", vi.fn().mockResolvedValue(false));

			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				"@id": "policy:obligation-party-scoped",
				permission: [{ action: "read" }],
				obligation: [
					{
						action: "audit",
						assignee: "did:example:other-party"
					}
				]
			};

			// Obligation targets a different assignee — it is skipped, so the permission grants
			const decisions = await arbiter.decide(policy, undefined, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
		});
	});

	describe("Compact rule expansion", () => {
		test("expands compact permission with multiple actions into atomic action-scoped rules", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:compact-multiple-actions",
				permission: [
					{
						action: ["read", "write"],
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.region",
								operator: OdrlOperatorType.Eq,
								rightOperand: "EU"
							}
						]
					}
				]
			};

			// Both actions are permitted — requesting either should grant
			const grantedRead = await arbiter.decide(policy, undefined, { region: "EU" }, "read");
			expect(grantedRead).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			const grantedWrite = await arbiter.decide(policy, undefined, { region: "EU" }, "write");
			expect(grantedWrite).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			// Action not in the compact list is denied
			const denied = await arbiter.decide(policy, undefined, { region: "EU" }, "delete");
			expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("expands compact permission with target and action arrays into cartesian product rules", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:compact-cartesian",
				permission: [
					{
						target: ["twin:jsonpath:$.items[*]", "twin:jsonpath:$.meta"],
						action: ["read", "write"]
					}
				]
			};

			// Four atomic rules produced: items×read, items×write, meta×read, meta×write
			const decisionsRead = await arbiter.decide(
				policy,
				undefined,
				{ items: [{ id: "a" }], meta: { v: 1 } },
				"read"
			);
			expect(decisionsRead).toHaveLength(2);
			expect(decisionsRead).toEqual(
				expect.arrayContaining([
					{ target: "$.items[*]", decision: PolicyDecision.Granted },
					{ target: "$.meta", decision: PolicyDecision.Granted }
				])
			);

			const decisionsDelete = await arbiter.decide(
				policy,
				undefined,
				{ items: [{ id: "a" }], meta: { v: 1 } },
				"delete"
			);
			expect(decisionsDelete).toHaveLength(2);
			expect(decisionsDelete).toEqual(
				expect.arrayContaining([
					{ target: "$.items[*]", decision: PolicyDecision.Denied },
					{ target: "$.meta", decision: PolicyDecision.Denied }
				])
			);
		});

		test("expands compact prohibition with multiple targets into atomic target-scoped rules", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:compact-prohibition-targets",
				permission: [
					{ action: "read", target: "twin:jsonpath:$.items[*]" },
					{ action: "read", target: "twin:jsonpath:$.meta" }
				],
				prohibition: [
					{
						action: "read",
						target: ["twin:jsonpath:$.items[*]", "twin:jsonpath:$.meta"],
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.region",
								operator: OdrlOperatorType.Eq,
								rightOperand: "EU"
							}
						]
					}
				]
			};

			// Both targets are prohibited when region is EU
			const denied = await arbiter.decide(
				policy,
				undefined,
				{ region: "EU", items: [{ id: "a" }], meta: { v: 1 } },
				"read"
			);
			expect(denied).toHaveLength(2);
			expect(denied).toEqual(
				expect.arrayContaining([
					{ target: "$.items[*]", decision: PolicyDecision.Denied },
					{ target: "$.meta", decision: PolicyDecision.Denied }
				])
			);

			// Both targets are permitted when region is not EU
			const granted = await arbiter.decide(
				policy,
				undefined,
				{ region: "US", items: [{ id: "a" }], meta: { v: 1 } },
				"read"
			);
			expect(granted).toHaveLength(2);
			expect(granted).toEqual(
				expect.arrayContaining([
					{ target: "$.items[*]", decision: PolicyDecision.Granted },
					{ target: "$.meta", decision: PolicyDecision.Granted }
				])
			);
		});
	});

	describe("Action hierarchy", () => {
		test("grants when rule action includedIn matches the requested parent action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:action-included-in",
				permission: [
					{
						// "print" is a sub-action of "reproduce"; requesting "reproduce" is covered
						action: { "@id": "print", includedIn: "reproduce" } as unknown as string
					}
				]
			};

			// Requesting the parent action — covered by includedIn
			const grantedParent = await arbiter.decide(policy, undefined, { any: "data" }, "reproduce");
			expect(grantedParent).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			// Requesting the exact action — still an exact match
			const grantedExact = await arbiter.decide(policy, undefined, { any: "data" }, "print");
			expect(grantedExact).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			// Requesting an unrelated action — denied
			const denied = await arbiter.decide(policy, undefined, { any: "data" }, "distribute");
			expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("grants when rule action implies the requested action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:action-implies",
				permission: [
					{
						// "distribute" implies "reproduce"; requesting "reproduce" is covered
						action: { "@id": "distribute", implies: ["reproduce"] } as unknown as string
					}
				]
			};

			// Requesting an implied action — covered
			const grantedImplied = await arbiter.decide(policy, undefined, { any: "data" }, "reproduce");
			expect(grantedImplied).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			// Requesting the exact action — still an exact match
			const grantedExact = await arbiter.decide(policy, undefined, { any: "data" }, "distribute");
			expect(grantedExact).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			// Requesting an action that is neither exact nor implied — denied
			const denied = await arbiter.decide(policy, undefined, { any: "data" }, "print");
			expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("grants when requested action is among multiple implied actions", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:action-implies-multiple",
				permission: [
					{
						action: {
							"@id": "distribute",
							implies: ["reproduce", "display"]
						} as unknown as string
					}
				]
			};

			const grantedFirst = await arbiter.decide(policy, undefined, { any: "data" }, "reproduce");
			expect(grantedFirst).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			const grantedSecond = await arbiter.decide(policy, undefined, { any: "data" }, "display");
			expect(grantedSecond).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			const denied = await arbiter.decide(policy, undefined, { any: "data" }, "print");
			expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("applies includedIn and implies to prohibitions", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:action-hierarchy-prohibition",
				permission: [{ action: "read" }, { action: "reproduce" }, { action: "distribute" }],
				prohibition: [
					{
						// prohibit "print" (sub-action of "reproduce") when region is EU
						action: { "@id": "print", includedIn: "reproduce" } as unknown as string,
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.region",
								operator: OdrlOperatorType.Eq,
								rightOperand: "EU"
							}
						]
					}
				]
			};

			// Requesting "reproduce" in EU is prohibited (print includedIn reproduce covers reproduce)
			const deniedReproduce = await arbiter.decide(
				policy,
				undefined,
				{ region: "EU" },
				"reproduce"
			);
			expect(deniedReproduce).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);

			// Requesting "reproduce" outside EU is not prohibited
			const grantedReproduce = await arbiter.decide(
				policy,
				undefined,
				{ region: "US" },
				"reproduce"
			);
			expect(grantedReproduce).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
		});

		test("action with rdf:value form is matched correctly", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:action-rdf-value",
				permission: [
					{
						action: {
							"rdf:value": { "@id": "read" },
							implies: ["reproduce"]
						} as unknown as string
					}
				]
			};

			// Exact match via rdf:value
			const grantedExact = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(grantedExact).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			// Implied action
			const grantedImplied = await arbiter.decide(policy, undefined, { any: "data" }, "reproduce");
			expect(grantedImplied).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			// Unrelated action
			const denied = await arbiter.decide(policy, undefined, { any: "data" }, "distribute");
			expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});
	});

	describe("Profile guard", () => {
		test("throws when policy declares an unknown third-party profile", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:profile-guard",
				profile: "https://example.com/custom-profile",
				permission: [{ action: "use" }]
			} as unknown as IDataspaceProtocolAgreement;

			await expect(arbiter.decide(policy, undefined, {})).rejects.toThrow(
				"policyProfileNotSupported"
			);
		});

		test("accepts when policy declares the TWIN ODRL profile (string form)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:twin-profile",
				profile: OdrlProfiles.Twin,
				permission: [{ action: "use", target: "twin:jsonpath:$.value" }]
			} as unknown as IDataspaceProtocolAgreement;

			const decisions = await arbiter.decide(policy, undefined, { value: "test" });
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$.value", decision: PolicyDecision.Granted });
		});

		test("accepts when policy declares the TWIN ODRL profile (array form)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:twin-profile-array",
				profile: [OdrlProfiles.Twin],
				permission: [{ action: "use", target: "twin:jsonpath:$.value" }]
			} as unknown as IDataspaceProtocolAgreement;

			const decisions = await arbiter.decide(policy, undefined, { value: "test" });
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$.value", decision: PolicyDecision.Granted });
		});

		test("accepts when profile is an empty string (treated as no profile declared)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:empty-string-profile",
				profile: "",
				permission: [{ action: "use", target: "twin:jsonpath:$.value" }]
			} as unknown as IDataspaceProtocolAgreement;

			const decisions = await arbiter.decide(policy, undefined, { value: "test" });
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$.value", decision: PolicyDecision.Granted });
		});

		test("accepts when profile array contains only empty strings (treated as no profile declared)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:empty-array-profile",
				profile: [""],
				permission: [{ action: "use", target: "twin:jsonpath:$.value" }]
			} as unknown as IDataspaceProtocolAgreement;

			const decisions = await arbiter.decide(policy, undefined, { value: "test" });
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$.value", decision: PolicyDecision.Granted });
		});

		test("accepts TWIN profile with trailing slash (URI normalization)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:twin-profile-trailing-slash",
				profile: `${OdrlProfiles.Twin}/`,
				permission: [{ action: "use", target: "twin:jsonpath:$.value" }]
			} as unknown as IDataspaceProtocolAgreement;

			const decisions = await arbiter.decide(policy, undefined, { value: "test" });
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$.value", decision: PolicyDecision.Granted });
		});

		test("accepts TWIN profile with double slash in path (URI normalization)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:twin-profile-double-slash",
				profile: OdrlProfiles.Twin.replace("schema.twindev.org/odrl", "schema.twindev.org//odrl"),
				permission: [{ action: "use", target: "twin:jsonpath:$.value" }]
			} as unknown as IDataspaceProtocolAgreement;

			const decisions = await arbiter.decide(policy, undefined, { value: "test" });
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$.value", decision: PolicyDecision.Granted });
		});

		test("accepts TWIN profile with uppercase scheme (URI normalization)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:twin-profile-uppercase-scheme",
				profile: OdrlProfiles.Twin.replace("https://", "HTTPS://"),
				permission: [{ action: "use", target: "twin:jsonpath:$.value" }]
			} as unknown as IDataspaceProtocolAgreement;

			const decisions = await arbiter.decide(policy, undefined, { value: "test" });
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$.value", decision: PolicyDecision.Granted });
		});

		test("accepts TWIN profile with uppercase host (URI normalization)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:twin-profile-uppercase-host",
				profile: OdrlProfiles.Twin.replace("schema.twindev.org", "SCHEMA.TWINDEV.ORG"),
				permission: [{ action: "use", target: "twin:jsonpath:$.value" }]
			} as unknown as IDataspaceProtocolAgreement;

			const decisions = await arbiter.decide(policy, undefined, { value: "test" });
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$.value", decision: PolicyDecision.Granted });
		});

		test("rejects when one profile in array is unknown (every, not some)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:mixed-profiles",
				profile: [OdrlProfiles.Twin, "https://attacker.example/custom-profile"],
				permission: [{ action: "use" }]
			} as unknown as IDataspaceProtocolAgreement;

			await expect(arbiter.decide(policy, undefined, {})).rejects.toThrow(
				"policyProfileNotSupported"
			);
		});

		test("inherits policy-level target to rules that omit it", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:policy-level-target-inherited",
				target: "twin:jsonpath:$.items[*]",
				permission: [{ action: "read" }]
			} as unknown as IDataspaceProtocolAgreement;

			// Permission inherits the policy-level target; the decision target should be $.items[*]
			const granted = await arbiter.decide(policy, undefined, { items: [{ id: "a" }] }, "read");
			expect(granted).toEqual([{ target: "$.items[*]", decision: PolicyDecision.Granted }]);
		});

		test("rule-level target overrides policy-level target", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:policy-level-target-overridden",
				target: "twin:jsonpath:$.items[*]",
				permission: [{ action: "read", target: "twin:jsonpath:$.meta" }]
			} as unknown as IDataspaceProtocolAgreement;

			// Rule-level target takes precedence over the policy-level default
			const granted = await arbiter.decide(
				policy,
				undefined,
				{ items: [{ id: "a" }], meta: { v: 1 } },
				"read"
			);
			expect(granted).toEqual([{ target: "$.meta", decision: PolicyDecision.Granted }]);
		});

		test("inherits policy-level action to rules that omit it", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:policy-level-action-inherited",
				action: "read",
				permission: [{}]
			} as unknown as IDataspaceProtocolAgreement;

			// Permission inherits the policy-level action; requesting "read" should grant
			const granted = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(granted).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			// Requesting a different action should be denied
			const denied = await arbiter.decide(policy, undefined, { any: "data" }, "write");
			expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("rule-level action overrides policy-level action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:policy-level-action-overridden",
				action: "read",
				permission: [{ action: "write" }]
			} as unknown as IDataspaceProtocolAgreement;

			// Rule-level action takes precedence; "write" is permitted, "read" is not
			const grantedWrite = await arbiter.decide(policy, undefined, { any: "data" }, "write");
			expect(grantedWrite).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			const deniedRead = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(deniedRead).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("throws when constraint specifies a dataType", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:constraint-datatype-guard",
				permission: [
					{
						action: "use",
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.count",
								operator: OdrlOperatorType.Lteq,
								rightOperand: "10",
								dataType: "xsd:integer"
							}
						]
					}
				]
			};

			await expect(arbiter.decide(policy, undefined, { count: 5 })).rejects.toThrow(
				"constraintDataTypeNotSupported"
			);
		});

		test("throws when constraint specifies a unit", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:constraint-unit-guard",
				permission: [
					{
						action: "use",
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.price",
								operator: OdrlOperatorType.Lteq,
								rightOperand: "100",
								unit: "https://dbpedia.org/resource/Euro"
							}
						]
					}
				]
			};

			await expect(arbiter.decide(policy, undefined, { price: 50 })).rejects.toThrow(
				"constraintUnitNotSupported"
			);
		});

		test("throws when constraint specifies a status", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:constraint-status-guard",
				permission: [
					{
						action: "use",
						constraint: [
							{
								leftOperand: "twin:jsonpath:$.count",
								operator: OdrlOperatorType.Lteq,
								rightOperand: "5",
								status: "odrl:policyUsage"
							} as unknown as IOdrlConstraint
						]
					}
				]
			};

			await expect(arbiter.decide(policy, undefined, { count: 3 })).rejects.toThrow(
				"constraintStatusNotSupported"
			);
		});

		test("evaluates action refinements: grants when refinement constraint is satisfied", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:action-refinement-grant",
				permission: [
					{
						action: {
							"@id": "print",
							refinement: [
								{
									leftOperand: "twin:jsonpath:$.count",
									operator: OdrlOperatorType.Lteq,
									rightOperand: "5"
								}
							]
						} as unknown as string
					}
				]
			};

			const granted = await arbiter.decide(policy, undefined, { count: 3 }, "print");
			expect(granted).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			const denied = await arbiter.decide(policy, undefined, { count: 10 }, "print");
			expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("evaluates action refinements: prohibition triggered only when refinement is satisfied", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:action-refinement-prohibition",
				permission: [{ action: "print" }],
				prohibition: [
					{
						// prohibited when count exceeds 5
						action: {
							"@id": "print",
							refinement: [
								{
									leftOperand: "twin:jsonpath:$.count",
									operator: OdrlOperatorType.Gt,
									rightOperand: "5"
								}
							]
						} as unknown as string
					}
				]
			};

			// count=10 satisfies the refinement "count > 5" so prohibition applies
			const denied = await arbiter.decide(policy, undefined, { count: 10 }, "print");
			expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);

			// count=3 does not satisfy "count > 5" so prohibition does not apply, permission grants
			const granted = await arbiter.decide(policy, undefined, { count: 3 }, "print");
			expect(granted).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
		});

		test("evaluates action refinements on implied action coverage", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:action-refinement-implied",
				permission: [
					{
						// distribute implies reproduce; refinement constrains the permission
						action: {
							"@id": "distribute",
							implies: ["reproduce"],
							refinement: [
								{
									leftOperand: "twin:jsonpath:$.region",
									operator: OdrlOperatorType.Eq,
									rightOperand: "EU"
								}
							]
						} as unknown as string
					}
				]
			};

			// requesting implied action "reproduce" in EU — refinement satisfied
			const granted = await arbiter.decide(policy, undefined, { region: "EU" }, "reproduce");
			expect(granted).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			// requesting implied action "reproduce" outside EU — refinement not satisfied
			const denied = await arbiter.decide(policy, undefined, { region: "US" }, "reproduce");
			expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("throws when inherited policy declares an unsupported profile", async () => {
			const parentPolicy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:unsupported-profile-parent",
				profile: "https://third-party.example/unsupported-profile",
				permission: [{ action: "read" }]
			} as unknown as IDataspaceProtocolAgreement;

			const childPolicy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:child-with-unsupported-parent",
				inheritFrom: "policy:unsupported-profile-parent",
				permission: [{ action: "use" }]
			} as unknown as IDataspaceProtocolAgreement;

			const policiesToRetrieve = new Map([["policy:unsupported-profile-parent", parentPolicy]]);
			registerPolicyAdministrationPointComponent(policiesToRetrieve);

			const arbiter = new DefaultPolicyArbiter({
				policyAdministrationPointComponentType: registeredPapComponentType
			});

			await expect(arbiter.decide(childPolicy, undefined, {})).rejects.toThrow(
				"inheritedPolicyProfileNotSupported"
			);
		});
	});
});
