// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
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
	PolicyDecision,
	PolicyObligationEnforcerFactory,
	type IPolicyAdministrationPointComponent,
	type IPolicyObligationEnforcer
} from "@twin.org/rights-management-models";
import {
	ConflictStrategyType,
	OdrlContexts,
	OperatorType,
	PolicyType,
	type IOdrlAgreement,
	type IOdrlConstraint,
	type IOdrlLogicalConstraint,
	type IOdrlPolicy
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

const registerPolicyAdministrationPointComponent = (policies: Map<string, IOdrlPolicy>): void => {
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:unconditional",
			permission: [{ action: "read" }]
		};

		const decisions = await arbiter.decide(policy, undefined, { any: "data" });
		expect(decisions).toHaveLength(1);
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
	});

	test("grants when permission parties match the agreement", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const agreement: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			uid: "agreement:party-match",
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
		const agreement: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			uid: "agreement:party-mismatch",
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

	test("throws when permission duty has no enforcer", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:duty-no-enforcer",
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:duty-enforced",
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:duty-denied",
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

	test("grants if any permission applies (any applicable permission authorizes)", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:and",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.age",
							operator: OperatorType.Gteq,
							rightOperand: { "@value": "18", "@type": "xsd:integer" }
						}
					]
				},
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:none"
		};

		const decisions = await arbiter.decide(policy, undefined, { any: "data" });
		expect(decisions).toHaveLength(1);
		expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
	});

	test("denies when an applicable prohibition has no explicit scope selectors (deny-overrides)", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:prohibit-all",
			permission: [{ action: "read" }],
			prohibition: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:conflict-perm",
			conflict: ConflictStrategyType.Perm,
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
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
							operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:conflict-prohibit",
			conflict: ConflictStrategyType.Prohibit,
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
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
							operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:conflict-invalid",
			conflict: ConflictStrategyType.Invalid,
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
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
							operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:age",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.age",
							operator: OperatorType.Gteq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:age",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.age",
							operator: OperatorType.Gteq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:logical-or",
			permission: [
				{
					constraint: [
						{
							or: {
								"@list": [
									{
										leftOperand: "twin:jsonpath:$.age",
										operator: OperatorType.Gteq,
										rightOperand: { "@value": "18", "@type": "xsd:integer" }
									},
									{
										leftOperand: "twin:jsonpath:$.region",
										operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:logical-xone",
			permission: [
				{
					constraint: [
						{
							xone: {
								"@list": [
									{
										leftOperand: "twin:jsonpath:$.age",
										operator: OperatorType.Gteq,
										rightOperand: { "@value": "18", "@type": "xsd:integer" }
									},
									{
										leftOperand: "twin:jsonpath:$.region",
										operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:logical-and-sequence",
			permission: [
				{
					constraint: [
						{
							andSequence: {
								"@list": [
									{
										leftOperand: "twin:jsonpath:$.age",
										operator: OperatorType.Gteq,
										rightOperand: { "@value": "18", "@type": "xsd:integer" }
									},
									{
										leftOperand: "twin:jsonpath:$.region",
										operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:logical-duplicate-uid",
			permission: [
				{
					constraint: [
						{
							and: [
								{
									uid: "constraint:1",
									leftOperand: "twin:jsonpath:$.age",
									operator: OperatorType.Gteq,
									rightOperand: { "@value": "18", "@type": "xsd:integer" }
								},
								{
									uid: "constraint:1",
									leftOperand: "twin:jsonpath:$.region",
									operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:logical-unique-uid",
			permission: [
				{
					constraint: [
						{
							and: [
								{
									uid: "constraint:1",
									leftOperand: "twin:jsonpath:$.age",
									operator: OperatorType.Gteq,
									rightOperand: { "@value": "18", "@type": "xsd:integer" }
								},
								{
									uid: "constraint:2",
									leftOperand: "twin:jsonpath:$.region",
									operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:string-order",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.code",
							operator: OperatorType.Gt,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:right-jsonpath",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.age",
							operator: OperatorType.Gteq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:right-jsonpath-typed",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:tags",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.tags[*]",
							operator: OperatorType.IsAnyOf,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:left-jsonpath-prefix",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.age",
							operator: OperatorType.Gteq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:left-jsonpath-missing-target",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:",
							operator: OperatorType.Gteq,
							rightOperand: { "@value": "18", "@type": "xsd:integer" }
						}
					]
				}
			]
		};

		await expect(arbiter.decide(policy, undefined, { age: 18 })).rejects.toThrow();
	});

	test("uses information context when permission target is twin:information:<key>", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:info-target",
			permission: [
				{
					target: "twin:information:subject",
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		const decisions = await arbiter.decide(
			policy,
			{ subject: { region: "EU" } as unknown as IJsonLdNodeObject },
			{ region: "US" }
		);
		expect(decisions[0].decision).toBe(PolicyDecision.Granted);
	});

	test("throws when permission target references missing information key", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:info-target-missing",
			permission: [
				{
					target: "twin:information:missing",
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
							rightOperand: "EU"
						}
					]
				}
			]
		};

		await expect(
			arbiter.decide(
				policy,
				{ subject: { region: "EU" } as unknown as IJsonLdNodeObject },
				{ region: "EU" }
			)
		).rejects.toThrow();
	});

	test("denies when a prohibition constraint applies", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:prohibit-email",
			permission: [{ action: "read" }],
			prohibition: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:prohibit-email-conditional",
			permission: [{ action: "read" }],
			prohibition: [
				{
					constraint: [
						// condition uses jsonpath-typed rightOperand for comparison
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
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
		const policy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:log",
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
		const parentPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:parent",
			permission: [{ action: "read" }]
		};

		const childPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:child",
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
		const parentPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:parent-prohib",
			prohibition: [
				{
					action: "delete",
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.isPaid",
							operator: OperatorType.Eq,
							rightOperand: { "@value": "false", "@type": "xsd:boolean" }
						}
					]
				}
			]
		};

		const childPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:child-prohib",
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
		const parentPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:parent-deny",
			prohibition: [{ action: "read" }]
		};

		const childPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:child-deny",
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
		const parentPolicy1: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:parent1",
			permission: [{ action: "read" }]
		};

		const parentPolicy2: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:parent2",
			permission: [{ action: "write" }]
		};

		const childPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:child-multi",
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
		const parentPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:parent-conflict",
			conflict: ConflictStrategyType.Perm,
			permission: [{ action: "read" }]
		};

		const childPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:child-conflict",
			inheritFrom: "policy:parent-conflict",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
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
							operator: OperatorType.Eq,
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
		const parentPolicy1: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:parent-conflict-1",
			conflict: ConflictStrategyType.Perm,
			permission: [{ action: "read" }]
		};

		const parentPolicy2: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:parent-conflict-2",
			conflict: ConflictStrategyType.Prohibit,
			permission: [{ action: "read" }]
		};

		const childPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:child-conflict-invalid",
			inheritFrom: ["policy:parent-conflict-1", "policy:parent-conflict-2"],
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.region",
							operator: OperatorType.Eq,
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
							operator: OperatorType.Eq,
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
		const childPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:child-missing",
			inheritFrom: "policy:missing-parent",
			permission: [{ action: "read" }]
		};

		// Register PAP with empty policies - parent policy not found
		const policiesToRetrieve = new Map<string, IOdrlPolicy>();
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
		const policy1: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:circular-1",
			inheritFrom: "policy:circular-2",
			permission: [{ action: "read" }]
		};

		const policy2: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:circular-2",
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
		const policiesToRetrieve = new Map<string, IOdrlPolicy>();
		for (let i = 1; i <= 11; i++) {
			policiesToRetrieve.set(`policy:depth-${i}`, {
				"@context": OdrlContexts.Context,
				"@type": PolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				uid: `policy:depth-${i}`,
				inheritFrom: i < 11 ? `policy:depth-${i + 1}` : undefined,
				permission: [{ action: "read" }]
			});
		}

		const rootPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:depth-0",
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
		const parent2: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:depth-config-2",
			permission: [{ action: "read" }]
		};

		const parent1: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:depth-config-1",
			inheritFrom: "policy:depth-config-2",
			permission: [{ action: "read" }]
		};

		const rootPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:depth-config-0",
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

		const parentPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:parent-oblig",
			obligation: [{ action: "audit" }]
		};

		const childPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:child-oblig",
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
		const parentPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:parent-constraint",
			permission: [
				{
					action: "read",
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.territory",
							operator: OperatorType.Eq,
							rightOperand: "US"
						}
					]
				}
			]
		};

		const childPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:child-constraint",
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
		const parentPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:parent-constraint-fail",
			permission: [
				{
					action: "read",
					constraint: [
						{
							leftOperand: "twin:jsonpath:$.territory",
							operator: OperatorType.Eq,
							rightOperand: "US"
						}
					]
				}
			]
		};

		const childPolicy: IOdrlAgreement = {
			"@context": OdrlContexts.Context,
			"@type": PolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			uid: "policy:child-constraint-fail",
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
			const policy: IOdrlAgreement = {
				"@context": OdrlContexts.Context,
				"@type": PolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				uid: "policy:no-action-no-request",
				permission: [{}]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" });
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});

		test("grants when permission has no action specified but an action is requested (action-agnostic)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IOdrlAgreement = {
				"@context": OdrlContexts.Context,
				"@type": PolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				uid: "policy:no-action-with-request",
				permission: [{}]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});

		test("grants when permission action matches the requested action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IOdrlAgreement = {
				"@context": OdrlContexts.Context,
				"@type": PolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				uid: "policy:action-match",
				permission: [{ action: "read" }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});

		test("denies when permission action does not match the requested action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IOdrlAgreement = {
				"@context": OdrlContexts.Context,
				"@type": PolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				uid: "policy:action-mismatch",
				permission: [{ action: "read" }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "write");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
		});

		test("grants when permission has multiple actions and one matches the requested action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IOdrlAgreement = {
				"@context": OdrlContexts.Context,
				"@type": PolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				uid: "policy:multiple-actions-match",
				permission: [{ action: ["read", "write", "delete"] }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "write");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});

		test("denies when permission has multiple actions but none match the requested action", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IOdrlAgreement = {
				"@context": OdrlContexts.Context,
				"@type": PolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				uid: "policy:multiple-actions-no-match",
				permission: [{ action: ["read", "delete"] }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "write");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
		});

		test("grants when permission has no action and multiple other permissions are denied", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IOdrlAgreement = {
				"@context": OdrlContexts.Context,
				"@type": PolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				uid: "policy:any-permission-applies",
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
			const policy: IOdrlAgreement = {
				"@context": OdrlContexts.Context,
				"@type": PolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				uid: "policy:no-matching-actions",
				permission: [{ action: "read" }, { action: "write" }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "delete");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
		});

		test("denies prohibition when actions match", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IOdrlAgreement = {
				"@context": OdrlContexts.Context,
				"@type": PolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				uid: "policy:prohibit-action",
				permission: [{ action: "read" }],
				prohibition: [{ action: "read" }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Denied });
		});

		test("grants when action is permitted but prohibition action does not match", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IOdrlAgreement = {
				"@context": OdrlContexts.Context,
				"@type": PolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				uid: "policy:perm-prohib-mismatch",
				permission: [{ action: "read" }],
				prohibition: [{ action: "write" }]
			};

			const decisions = await arbiter.decide(policy, undefined, { any: "data" }, "read");
			expect(decisions).toHaveLength(1);
			expect(decisions[0]).toEqual({ target: "$", decision: PolicyDecision.Granted });
		});
	});
});
