// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { readFileSync } from "node:fs";
import path from "node:path";
import { ComponentFactory } from "@twin.org/core";
import { JsonPathHelper } from "@twin.org/data-json-path";
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
	OdrlLeftOperandType,
	OdrlOperatorType,
	OdrlPolicyType,
	type IOdrlConstraint,
	type IOdrlLogicalConstraint
} from "@twin.org/standards-w3c-odrl";
import { DefaultPolicyArbiter } from "../src/policyArbiters/defaultPolicyArbiter.js";

declare module "@twin.org/standards-w3c-odrl" {
	interface IOdrlConstraint {
		"twin:jsonPathDataSource"?: string;
		"twin:jsonPathExpression"?: string;
	}
	interface IOdrlAsset {
		"twin:jsonPathDataSource"?: string;
		"twin:jsonPathExpression"?: string;
	}
}

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

const loadUseCaseFixture = <T = IDataspaceProtocolAgreement>(relativePath: string): T => {
	const fixturePath = path.join(__dirname, "../../../docs/use-cases", relativePath);
	let fileContents = readFileSync(fixturePath, "utf8");
	if (fileContents.charCodeAt(0) === 0xfeff) {
		fileContents = fileContents.slice(1);
	}
	return JSON.parse(fileContents) as T;
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
			entitySchema: nameof<LogEntry>(),
			config: { storageKey: "log-entry" }
		});
		EntityStorageConnectorFactory.register("log-entry", () => loggingMemoryEntityStorage);
		LoggingConnectorFactory.register(
			"logging",
			// Disable batching (default in logging-connector-entity-storage >= next.6) so log
			// entries are written synchronously and assertions on the store are deterministic.
			() => new EntityStorageLoggingConnector({ config: { batchSize: 1, batchIntervalMs: 0 } })
		);
		ComponentFactory.register("logging", () => new LoggingService());
		ComponentFactory.register("platform", () => ({
			className: () => "MockPlatformComponent",
			isMultiTenant: () => false,
			execute: async (method: () => Promise<void>) => method(),
			getLocalOriginContext: async () => undefined
		}));

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

	afterEach(async () => {
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

		await loggingMemoryEntityStorage?.teardown();
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.region",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.region",
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

	test("real UC6 offer-registration.json example grants/denies correctly (docs stay in sync with the arbiter)", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const offerPath = path.join(
			__dirname,
			"../../../docs/use-cases/06-policy-negotiation-offer-to-agreement/offer-registration.json"
		);
		let offerFileContents = readFileSync(offerPath, "utf8");
		if (offerFileContents.charCodeAt(0) === 0xfeff) {
			offerFileContents = offerFileContents.slice(1);
		}
		const offer = JSON.parse(offerFileContents) as IDataspaceProtocolAgreement;

		// Loads the actual documentation fixture from disk rather than a hand-authored stand-in, so a
		// future edit to the doc (e.g. reintroducing a missing "$" prefix or an unsupported
		// PartyCollection source) is caught here instead of silently drifting from what the arbiter
		// actually accepts.
		const granted = await arbiter.decide(
			offer,
			undefined,
			{
				assets: [{ id: "vet-cert-doc-6ce567", assetType: "DataResource" }],
				legalAddress: { countryCode: "PL" }
			},
			"read"
		);
		expect(granted).toEqual([{ target: "$.assets[0]", decision: PolicyDecision.Granted }]);

		const denied = await arbiter.decide(
			offer,
			undefined,
			{
				assets: [{ id: "vet-cert-doc-6ce567", assetType: "DataResource" }],
				legalAddress: { countryCode: "US" }
			},
			"read"
		);
		expect(denied).toEqual([{ target: "$.assets[0]", decision: PolicyDecision.Denied }]);
	});

	describe("real use-case fixtures", () => {
		test("UC1 policy.json grants/denies correctly (docs stay in sync with the arbiter)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = loadUseCaseFixture("01-basic-data-resource-access/policy.json");

			// The unresolvable Asset+uid target was removed (this use case is about assignee-attribute
			// scoping, not target filtering - "is this the right resource" is a policy-lookup-layer
			// concern, not something the arbiter's target mechanism needs to re-enforce here), and the
			// assignee refinement's missing-"$" prefix is fixed, so this now grants/denies correctly.
			// Loads the real pip-context.json rather than a hand-authored stand-in, so this proves the
			// policy is genuinely executable against its own committed fixture - legalAddress.countryCode
			// is nested under assigneeAttributes there, not at the top level.
			const pipContext = loadUseCaseFixture<{
				assigneeAttributes: { legalAddress: { countryCode: string } };
			}>("01-basic-data-resource-access/pip-context.json");
			const granted = await arbiter.decide(policy, undefined, pipContext, "read");
			expect(granted).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			const denied = await arbiter.decide(
				policy,
				undefined,
				{ assigneeAttributes: { legalAddress: { countryCode: "US" } } },
				"read"
			);
			expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("UC2 policy.json filters consignments per-item correctly (docs stay in sync with the arbiter)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = loadUseCaseFixture("02-country-filtered-consignments/policy.json");
			const sourceData = loadUseCaseFixture<{
				consignments: { destinationCountry: string }[];
			}>("02-country-filtered-consignments/source-data.json");

			// The AssetCollection target now resolves via "twin:jsonPath" over the real consignments
			// array (source-data.json, loaded from disk so doc drift is caught here), the refinement's
			// "$" prefix is fixed and correctly wildcard-scoped per item, and the unsupported
			// PropertyReference rightOperand is replaced with a supported twin:jsonPath/information
			// lookup - so this now filters exactly as description.md's narrative describes: only the
			// PL-bound consignments (indices 0 and 2) are granted.
			const decisions = await arbiter.decide(
				policy,
				{ assigneeAttributes: { countryCode: "PL" } },
				sourceData,
				"read"
			);
			expect(decisions).toEqual([
				{ target: "$.consignments[0]", decision: PolicyDecision.Granted },
				{ target: "$.consignments[1]", decision: PolicyDecision.Denied },
				{ target: "$.consignments[2]", decision: PolicyDecision.Granted },
				{ target: "$.consignments[3]", decision: PolicyDecision.Denied }
			]);

			// A country absent from every consignment (PL/DE/FR are the only ones present) proves the
			// filter is genuinely comparing per-item, not vacuously granting everything.
			const deniedAll = await arbiter.decide(
				policy,
				{ assigneeAttributes: { countryCode: "GB" } },
				sourceData,
				"read"
			);
			expect(deniedAll).toEqual([
				{ target: "$.consignments[0]", decision: PolicyDecision.Denied },
				{ target: "$.consignments[1]", decision: PolicyDecision.Denied },
				{ target: "$.consignments[2]", decision: PolicyDecision.Denied },
				{ target: "$.consignments[3]", decision: PolicyDecision.Denied }
			]);
		});

		test("UC4 policy.json grants/denies correctly (docs stay in sync with the arbiter)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = loadUseCaseFixture("04-multi-constraint-service-offering/policy.json");

			// The unresolvable ServiceOffering target was removed (same "one specific, singular thing"
			// treatment as UC1 - "is this the right service" is a policy-lookup-layer concern, not
			// something the arbiter's target mechanism needs to re-enforce here), and the
			// certifications refinement's missing-"$" prefix is fixed, so this now grants/denies
			// correctly across all three AND'd constraints (dateTime window x2 + certifications).
			// The built-in "dateTime" leftOperand resolves via the real system clock (not injectable),
			// and the fixture's window ends 2035-12-31 - pin the clock inside this test so it keeps
			// proving doc/arbiter sync instead of going red the day the real window actually expires.
			vi.setSystemTime(new Date("2026-07-01T00:00:00Z"));
			try {
				const granted = await arbiter.decide(
					policy,
					undefined,
					{ assigneeAttributes: { certifications: ["ISO27001"] } },
					"use"
				);
				expect(granted).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

				const denied = await arbiter.decide(
					policy,
					undefined,
					{ assigneeAttributes: { certifications: ["ISO9001"] } },
					"use"
				);
				expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
			} finally {
				vi.useRealTimers();
			}
		});

		test("UC5 policy.json grants/denies correctly, per-constraint (docs stay in sync with the arbiter)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = loadUseCaseFixture("05-catalogue-gated-notification/policy.json");

			// The unresolvable ServiceOffering target was removed, the assignee refinement's invalid
			// "contains" operator was replaced with the supported "isAnyOf" (the correct "list contains
			// value" semantics), and both the rule-level and duty-level constraints' missing-"$" prefixes
			// are fixed. The duty's own constraint is never evaluated by the built-in arbiter itself
			// (enforceDuty() delegates entirely to registered IPolicyObligationEnforcer implementations -
			// confirmed by reading defaultPolicyArbiter.ts), so this test registers an enforcer that
			// actually resolves the duty's twin:jsonPath constraint via the real JsonPathHelper, proving
			// the "$" fix is meaningful for any real implementer, not just cosmetically correct.
			registerObligationEnforcer(
				"uc5-inform-enforcer",
				async (enforcedPolicy, duty, information, ruleDataContext) => {
					const dutyRecord = duty as unknown as {
						constraint?: { "twin:jsonPathExpression"?: string; rightOperand?: unknown }[];
					};
					const constraint = dutyRecord.constraint?.[0];
					if (!constraint?.["twin:jsonPathExpression"]) {
						return true;
					}
					const matches = JsonPathHelper.query(
						constraint["twin:jsonPathExpression"],
						ruleDataContext
					);
					return matches.length === 1 && matches[0].value === constraint.rightOperand;
				}
			);

			const base = {
				assigneeAttributes: { certifications: ["FSA-Trusted-Notifier"] },
				resourceAttributes: {
					consignment: { destinationCountry: { countryId: "GB" } },
					latestDocument: { documentTypeCode: "unece:DocumentCodeList#853" }
				}
			};

			const granted = await arbiter.decide(policy, undefined, base, "use");
			expect(granted).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			// Each mismatch proves its own constraint is genuinely load-bearing, not vacuously true.
			const wrongCertification = await arbiter.decide(
				policy,
				undefined,
				{ ...base, assigneeAttributes: { certifications: ["ISO27001"] } },
				"use"
			);
			expect(wrongCertification).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);

			const wrongCountry = await arbiter.decide(
				policy,
				undefined,
				{
					...base,
					resourceAttributes: {
						...base.resourceAttributes,
						consignment: { destinationCountry: { countryId: "FR" } }
					}
				},
				"use"
			);
			expect(wrongCountry).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);

			const wrongDocumentType = await arbiter.decide(
				policy,
				undefined,
				{
					...base,
					resourceAttributes: {
						...base.resourceAttributes,
						latestDocument: { documentTypeCode: "unece:DocumentCodeList#002" }
					}
				},
				"use"
			);
			expect(wrongDocumentType).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("legacy jsonPathSelector shape never matches, even when the data satisfies it (regression guard, description.md no longer documents this)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			// Mirrors the legacy shape that description.md:275 used to document as a supported extension
			// Removed that false claim. Not loaded from disk, since this guards
			// against the shape itself resurfacing, not any prose. Kept as a regression guard: the arbiter
			// still silently fails closed on this shape rather than throwing, which is worth pinning.
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:jsonpath-selector-doc-probe",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [
					{
						action: "read",
						constraint: [
							{
								leftOperand: {
									"@id": "https://w3id.org/twin/odrl/propertyValue",
									jsonPathSelector: ".legalAddress.countryCode"
								},
								operator: OdrlOperatorType.Eq,
								rightOperand: "PL"
							} as unknown as IOdrlConstraint
						]
					}
				]
			};

			// The data genuinely satisfies the documented intent (countryCode is "PL"), but the shape
			// never resolves, so this denies regardless - proving the doc teaches a non-working pattern.
			const decisions = await arbiter.decide(agreement, undefined, {
				legalAddress: { countryCode: "PL" }
			});
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});
	});

	test("grants when assignee PartyCollection refinement matches the data datasource (source still missing, no longer denied)", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const agreement: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			"@id": "agreement:party-collection-source-missing-grant",
			assigner: "did:example:assigner",
			assignee: "did:example:assignee",
			permission: [
				{
					action: "read",
					assignee: {
						"@type": "PartyCollection",
						refinement: [
							{
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.region",
								operator: OdrlOperatorType.Eq,
								rightOperand: "EU"
							}
						]
					}
				}
			]
		};

		const decisions = await arbiter.decide(agreement, undefined, { region: "EU" });
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
	});

	test("denies when assignee PartyCollection refinement does not match the data datasource (source still missing)", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const agreement: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			"@id": "agreement:party-collection-source-missing-deny",
			assigner: "did:example:assigner",
			assignee: "did:example:assignee",
			permission: [
				{
					action: "read",
					assignee: {
						"@type": "PartyCollection",
						refinement: [
							{
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.region",
								operator: OdrlOperatorType.Eq,
								rightOperand: "EU"
							}
						]
					}
				}
			]
		};

		const decisions = await arbiter.decide(agreement, undefined, { region: "US" });
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
					leftOperand: "twin:jsonPath",
					"twin:jsonPathExpression": "$.region",
					operator: OdrlOperatorType.Eq,
					rightOperand: "EU"
				}
			]
		});

		expect(context.partyIds).toEqual([]);
		expect(context.refinements).toHaveLength(1);
	});

	describe("assignee/assigner PartyCollection refinements", () => {
		test("grants when assignee PartyCollection refinement matches the consumer's verified attributes in the information datasource", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:party-collection-info-refinement-match",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [
					{
						action: "read",
						assignee: {
							"@type": "PartyCollection",
							refinement: [
								{
									leftOperand: "twin:jsonPath",
									"twin:jsonPathDataSource": "information",
									"twin:jsonPathExpression": "$.subject.role",
									operator: OdrlOperatorType.Eq,
									rightOperand: "BorderAgency"
								}
							]
						}
					}
				]
			};

			const information = { subject: { role: "BorderAgency" } };

			// An assignee scoped by attribute refinement rather than a fixed id now behaves like any
			// other satisfied constraint: the refinement matches (subject.role === "BorderAgency"), so
			// this grants.
			const decisions = await arbiter.decide(agreement, information, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
		});

		test("denies when assignee PartyCollection refinement does not match the information datasource", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:party-collection-info-refinement-mismatch",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [
					{
						action: "read",
						assignee: {
							"@type": "PartyCollection",
							refinement: [
								{
									leftOperand: "twin:jsonPath",
									"twin:jsonPathDataSource": "information",
									"twin:jsonPathExpression": "$.subject.role",
									operator: OdrlOperatorType.Eq,
									rightOperand: "BorderAgency"
								}
							]
						}
					}
				]
			};

			const information = { subject: { role: "Carrier" } };

			const decisions = await arbiter.decide(agreement, information, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("grants when assignee PartyCollection refinement is a logical 'or' constraint that matches one branch", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:party-collection-info-refinement-logical-or",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [
					{
						action: "read",
						assignee: {
							"@type": "PartyCollection",
							refinement: [
								{
									or: {
										"@list": [
											{
												leftOperand: "twin:jsonPath",
												"twin:jsonPathDataSource": "information",
												"twin:jsonPathExpression": "$.subject.role",
												operator: OdrlOperatorType.Eq,
												rightOperand: "BorderAgency"
											},
											{
												leftOperand: "twin:jsonPath",
												"twin:jsonPathDataSource": "information",
												"twin:jsonPathExpression": "$.subject.role",
												operator: OdrlOperatorType.Eq,
												rightOperand: "CustomsOfficer"
											}
										]
									}
								} as unknown as IOdrlConstraint | IOdrlLogicalConstraint
							]
						}
					}
				]
			};

			// Mirrors the real-world assignee PartyCollection shape used by
			// twin-supply-chain's isn-notify-template.json (a role-refinement matched against multiple
			// acceptable roles), proving evaluateConstraint's logical-constraint path (not just plain
			// constraints) works through the new empty-partyIds branch.
			const granted = await arbiter.decide(
				agreement,
				{ subject: { role: "CustomsOfficer" } },
				{ any: "data" }
			);
			expect(granted).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);

			const denied = await arbiter.decide(
				agreement,
				{ subject: { role: "Carrier" } },
				{ any: "data" }
			);
			expect(denied).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("prohibition with matching assignee PartyCollection refinement now applies (deny-overrides)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:prohibition-party-collection-refinement-match",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [{ action: "read" }],
				prohibition: [
					{
						action: "read",
						assignee: {
							"@type": "PartyCollection",
							refinement: [
								{
									leftOperand: "twin:jsonPath",
									"twin:jsonPathDataSource": "information",
									"twin:jsonPathExpression": "$.subject.role",
									operator: OdrlOperatorType.Eq,
									rightOperand: "BorderAgency"
								}
							]
						}
					}
				]
			};

			const information = { subject: { role: "BorderAgency" } };

			// The prohibition's assignee refinement matches, so under the default Invalid conflict
			// strategy (alongside the unconditional permission) it now applies and denies.
			const decisions = await arbiter.decide(agreement, information, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("prohibition with non-matching assignee PartyCollection refinement does not apply", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:prohibition-party-collection-refinement-mismatch",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [{ action: "read" }],
				prohibition: [
					{
						action: "read",
						assignee: {
							"@type": "PartyCollection",
							refinement: [
								{
									leftOperand: "twin:jsonPath",
									"twin:jsonPathDataSource": "information",
									"twin:jsonPathExpression": "$.subject.role",
									operator: OdrlOperatorType.Eq,
									rightOperand: "BorderAgency"
								}
							]
						}
					}
				]
			};

			const information = { subject: { role: "Carrier" } };

			// The prohibition's refinement does not match, so it stays inapplicable and the
			// unconditional permission still grants.
			const decisions = await arbiter.decide(agreement, information, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
		});

		test("obligation with matching assignee PartyCollection refinement is now enforced", async () => {
			registerObligationEnforcer(
				"deny-party-refinement-obligation",
				vi.fn().mockResolvedValue(false)
			);

			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:obligation-party-collection-refinement-match",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [{ action: "read" }],
				obligation: [
					{
						action: "compensate",
						assignee: {
							"@type": "PartyCollection",
							refinement: [
								{
									leftOperand: "twin:jsonPath",
									"twin:jsonPathDataSource": "information",
									"twin:jsonPathExpression": "$.subject.role",
									operator: OdrlOperatorType.Eq,
									rightOperand: "BorderAgency"
								}
							]
						}
					}
				]
			};

			const information = { subject: { role: "BorderAgency" } };

			// The obligation's assignee refinement matches, so it is now applicable — and since no
			// enforcer fulfills it, the whole decision is denied.
			const decisions = await arbiter.decide(agreement, information, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("obligation with non-matching assignee PartyCollection refinement is skipped", async () => {
			registerObligationEnforcer(
				"deny-party-refinement-obligation-mismatch",
				vi.fn().mockResolvedValue(false)
			);

			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:obligation-party-collection-refinement-mismatch",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [{ action: "read" }],
				obligation: [
					{
						action: "compensate",
						assignee: {
							"@type": "PartyCollection",
							refinement: [
								{
									leftOperand: "twin:jsonPath",
									"twin:jsonPathDataSource": "information",
									"twin:jsonPathExpression": "$.subject.role",
									operator: OdrlOperatorType.Eq,
									rightOperand: "BorderAgency"
								}
							]
						}
					}
				]
			};

			const information = { subject: { role: "Carrier" } };

			// The obligation's refinement does not match, so it stays inapplicable, is treated as
			// fulfilled without calling the enforcer, and the unconditional permission grants.
			const decisions = await arbiter.decide(agreement, information, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
		});

		test("grants when assigner PartyCollection refinement matches", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:assigner-party-collection-refinement-match",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [
					{
						action: "read",
						assigner: {
							"@type": "PartyCollection",
							refinement: [
								{
									leftOperand: "twin:jsonPath",
									"twin:jsonPathDataSource": "information",
									"twin:jsonPathExpression": "$.subject.role",
									operator: OdrlOperatorType.Eq,
									rightOperand: "TrustedPublisher"
								}
							]
						}
					}
				]
			};

			const information = { subject: { role: "TrustedPublisher" } };

			// Symmetric to the assignee case above but on the assigner side — resolveRulePartyContext
			// and isPartyContextApplicable treat assigner and assignee identically, so this now grants
			// too.
			const decisions = await arbiter.decide(agreement, information, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
		});

		test("denies when assigner PartyCollection refinement does not match", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:assigner-party-collection-refinement-mismatch",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [
					{
						action: "read",
						assigner: {
							"@type": "PartyCollection",
							refinement: [
								{
									leftOperand: "twin:jsonPath",
									"twin:jsonPathDataSource": "information",
									"twin:jsonPathExpression": "$.subject.role",
									operator: OdrlOperatorType.Eq,
									rightOperand: "TrustedPublisher"
								}
							]
						}
					}
				]
			};

			const information = { subject: { role: "UnknownPublisher" } };

			const decisions = await arbiter.decide(agreement, information, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("denies when assignee PartyCollection has no source and no refinement (empty party context stays fail-closed)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:empty-party-collection",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [
					{
						action: "read",
						assignee: {
							"@type": "PartyCollection"
						}
					}
				]
			};

			// A PartyCollection with neither a source nor a refinement resolves to an empty party
			// context ({ partyIds: [], refinements: [] }). This must NOT be treated as "no constraint,
			// applies to anyone" - it falls through to isPartyApplicable, which keeps the pre-existing
			// fail-closed behavior (an empty id list never matches). Guards against a malformed or
			// degenerate PartyCollection silently granting to any assignee.
			const decisions = await arbiter.decide(agreement, undefined, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("denies when assignee is an untyped object carrying source/refinement but no @type (malformed party stays fail-closed)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:untyped-source-bearing-party",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [
					{
						action: "read",
						// Mirrors twin-supply-chain's isn-read-policy.json assignee shape: a party object
						// carrying `source`/`refinement` but no `@type`. OdrlPolicyHelper.getType() reads
						// only "@type"/"type", so this is NOT recognized as a PartyCollection - it bypasses
						// the partyCollectionSourceNotSupported throw entirely, and its refinement is never
						// collected (that only happens inside the PartyCollection branch). It resolves to
						// the same empty party context as the test above, and must stay denied rather than
						// silently matching any assignee.
						assignee: {
							source: "urn:supply-chain:notification-recipients",
							refinement: [
								{
									leftOperand: "information:$.role",
									operator: OdrlOperatorType.Eq,
									rightOperand: "BorderAgency"
								}
							]
						}
					}
				]
			};

			const decisions = await arbiter.decide(agreement, undefined, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
		});

		test("grants when assignee Party object with uid matches the agreement (regression pin)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:party-object-uid-match",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [
					{
						action: "read",
						assignee: { uid: "did:example:assignee" }
					}
				]
			};

			const decisions = await arbiter.decide(agreement, undefined, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
		});

		test("grants via a mixed assignee array when the plain id matches, even though the PartyCollection refinement does not (compact-form OR expansion, regression pin)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const agreement: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				"@id": "agreement:mixed-assignee-array-or-expansion",
				assigner: "did:example:assigner",
				assignee: "did:example:assignee",
				permission: [
					{
						action: "read",
						assignee: [
							"did:example:assignee",
							{
								"@type": "PartyCollection",
								refinement: [
									{
										leftOperand: "twin:jsonPath",
										"twin:jsonPathDataSource": "information",
										"twin:jsonPathExpression": "$.subject.role",
										operator: OdrlOperatorType.Eq,
										rightOperand: "BorderAgency"
									}
								]
							}
						]
					}
				]
			};

			const information = { subject: { role: "Carrier" } };

			// An array-valued assignee is NOT evaluated as one combined (ids AND refinements)
			// context: expandRule cross-multiplies compact rule fields into independent atomic
			// permissions before isRuleApplicableToParties ever runs, one atomic permission per
			// array element. This test expands into two atomic rules sharing target "$": one with
			// plain assignee "did:example:assignee" (matches), one with the PartyCollection
			// refinement (does not match). Either atomic rule applying grants the shared target:
			// OR-across-array semantics, not AND-within-one-rule (pre-existing behavior).
			const decisions = await arbiter.decide(agreement, information, { any: "data" });
			expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Granted }]);
		});
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
					}
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
					}
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
					}
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
			vi.fn().mockImplementation(async (policy, duty) => duty.action === "compensate")
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
			vi.fn().mockImplementation(async (policy, duty) => duty.action === "anonymize")
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
				{
					action: "read",
					target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.items[*]" }
				},
				{
					action: "read",
					target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.meta" }
				}
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.age",
							operator: OdrlOperatorType.Gteq,
							rightOperand: { "@value": "18", "@type": "xsd:integer" }
						}
					]
				},
				{
					constraint: [
						{
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.age",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.age",
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
										leftOperand: "twin:jsonPath",
										"twin:jsonPathExpression": "$.age",
										operator: OdrlOperatorType.Gteq,
										rightOperand: { "@value": "18", "@type": "xsd:integer" }
									},
									{
										leftOperand: "twin:jsonPath",
										"twin:jsonPathExpression": "$.region",
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
										leftOperand: "twin:jsonPath",
										"twin:jsonPathExpression": "$.age",
										operator: OdrlOperatorType.Gteq,
										rightOperand: { "@value": "18", "@type": "xsd:integer" }
									},
									{
										leftOperand: "twin:jsonPath",
										"twin:jsonPathExpression": "$.region",
										operator: OdrlOperatorType.Eq,
										rightOperand: "EU"
									}
								] as unknown as { "@id": string }[]
							}
						}
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
										leftOperand: "twin:jsonPath",
										"twin:jsonPathExpression": "$.age",
										operator: OdrlOperatorType.Gteq,
										rightOperand: { "@value": "18", "@type": "xsd:integer" }
									},
									{
										leftOperand: "twin:jsonPath",
										"twin:jsonPathExpression": "$.region",
										operator: OdrlOperatorType.Eq,
										rightOperand: "EU"
									}
								] as unknown as { "@id": string }[]
							}
						}
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
									leftOperand: "twin:jsonPath",
									"twin:jsonPathExpression": "$.age",
									operator: OdrlOperatorType.Gteq,
									rightOperand: { "@value": "18", "@type": "xsd:integer" }
								},
								{
									"@id": "constraint:1",
									leftOperand: "twin:jsonPath",
									"twin:jsonPathExpression": "$.region",
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
									leftOperand: "twin:jsonPath",
									"twin:jsonPathExpression": "$.age",
									operator: OdrlOperatorType.Gteq,
									rightOperand: { "@value": "18", "@type": "xsd:integer" }
								},
								{
									"@id": "constraint:2",
									leftOperand: "twin:jsonPath",
									"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.code",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.age",
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

	test("supports rightOperand as canonical JSONPath (typed object)", async () => {
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: {
								"@type": "twin:jsonPath",
								"twin:jsonPathExpression": "$.allowedRegion"
							}
						} as unknown as IOdrlConstraint
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.tags[*]",
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

	test("supports canonical leftOperand twin:jsonPath with twin:jsonPathExpression", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:left-jsonpath-canonical",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.age",
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

	test("throws when canonical leftOperand twin:jsonPath is missing twin:jsonPathExpression", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:left-jsonpath-canonical-missing-expression",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonPath",
							operator: OdrlOperatorType.Gteq,
							rightOperand: { "@value": "18", "@type": "xsd:integer" }
						}
					]
				}
			]
		};

		await expect(arbiter.decide(policy, undefined, { age: 18 })).rejects.toThrow();
	});

	test("supports canonical rightOperand jsonPath expression in typed object", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:right-jsonpath-canonical-typed",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: {
								"@type": "twin:jsonPath",
								"twin:jsonPathExpression": "$.allowedRegion"
							}
						} as unknown as IOdrlConstraint
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

	test("throws when canonical rightOperand twin:jsonPath is missing twin:jsonPathExpression", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:right-jsonpath-canonical-missing-expression",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: {
								"@type": "twin:jsonPath"
							}
						} as unknown as IOdrlConstraint
					]
				}
			]
		};

		await expect(
			arbiter.decide(policy, undefined, {
				region: "EU",
				allowedRegion: "EU"
			})
		).rejects.toThrow();
	});

	test("throws when canonical rightOperand twin:jsonPath uses @value without twin:jsonPathExpression", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:right-jsonpath-canonical-value-without-expression",
			permission: [
				{
					constraint: [
						{
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: {
								"@type": "twin:jsonPath",
								"@value": "$.allowedRegion"
							}
						}
					]
				}
			]
		};

		await expect(
			arbiter.decide(policy, undefined, {
				region: "EU",
				allowedRegion: "EU"
			})
		).rejects.toThrow();
	});

	test("throws when canonical leftOperand has empty twin:jsonPathExpression", async () => {
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "",
							operator: OdrlOperatorType.Gteq,
							rightOperand: { "@value": "18", "@type": "xsd:integer" }
						}
					]
				}
			]
		};

		await expect(arbiter.decide(policy, undefined, { age: 18 })).rejects.toThrow();
	});

	test("returns a specific decision target when permission target uses twin:jsonPath", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:jsonpath-target",
			permission: [
				{
					target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.items[*]" },
					constraint: [
						{
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
					target: [
						{ "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.items[*]" },
						{ "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.meta" }
					],
					constraint: [
						{
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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

	test("throws when rule target does not use twin:jsonPath prefix", async () => {
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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

	test("returns target-scoped denial when prohibition target uses twin:jsonPath", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:prohibit-targeted",
			permission: [
				{
					action: "read",
					target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.items[*]" }
				}
			],
			prohibition: [
				{
					action: "read",
					target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.items[*]" },
					constraint: [
						{
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
			permission: [
				{
					action: "read",
					target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.profile.email" }
				}
			],
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
						source: "twin:jsonPath",
						"twin:jsonPathExpression": "$.items[*]",
						refinement: {
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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

	test("returns root grant and no per-item decisions for AssetCollection targeting an empty array", async () => {
		const arbiter = new DefaultPolicyArbiter();
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:asset-collection-empty-array",
			permission: [
				{
					action: "read",
					target: {
						"@type": "AssetCollection",
						source: "twin:jsonPath",
						"twin:jsonPathExpression": "$.items[*]",
						refinement: {
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: "EU"
						}
					}
				}
			]
		};

		// Should resolve without throwing (no ruleTargetNotSupported error).
		// With an empty array no items are granted, so the closed-world fallback denies root.
		const decisions = await arbiter.decide(policy, undefined, { region: "EU", items: [] }, "read");
		expect(decisions).toEqual([{ target: "$", decision: PolicyDecision.Denied }]);
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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

	test("throws when AssetCollection source is not twin:jsonPath", async () => {
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
			permission: [
				{
					action: "read",
					target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.items[*]" }
				}
			],
			prohibition: [
				{
					action: "read",
					target: {
						"@type": "AssetCollection",
						source: "twin:jsonPath",
						"twin:jsonPathExpression": "$.items[*]",
						refinement: {
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
						uid: "twin:jsonPath:$.items[*]",
						hasPolicy: "policy:governing"
					}
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
						uid: "twin:jsonPath:$.items[*]",
						partOf: "collection:my-assets"
					}
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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

	test("allows canonical jsonPath typed rightOperand comparisons in prohibition conditions", async () => {
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
							operator: OdrlOperatorType.Eq,
							rightOperand: {
								"@type": "twin:jsonPath",
								"twin:jsonPathExpression": "$.blockedRegion"
							}
						} as unknown as IOdrlConstraint
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
		const arbiter = new DefaultPolicyArbiter({ loggingComponentType: "logging" });
		const policy: IDataspaceProtocolAgreement = {
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": "policy:log",
			permission: [{ action: "read" }]
		};

		await arbiter.decide(policy);

		const logs = await loggingMemoryEntityStorage.getStore();
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.isPaid",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.region",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.territory",
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
							leftOperand: "twin:jsonPath",
							"twin:jsonPathExpression": "$.territory",
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
							source: "twin:jsonPath",
							"twin:jsonPathExpression": "$.itemList.itemListElement[*]",
							refinement: {
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.itemList.itemListElement[*].unloadingLocation.id",
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
						target: {
							"@type": "twin:jsonPath",
							"twin:jsonPathExpression": "$.itemList.itemListElement[1]"
						}
					}
				],
				prohibition: [
					{
						action: "read",
						target: {
							"@type": "twin:jsonPath",
							"twin:jsonPathExpression": "$.itemList.itemListElement[0]"
						}
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
							source: "twin:jsonPath",
							"twin:jsonPathExpression": "$.itemList.itemListElement[*]",
							refinement: {
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.itemList.itemListElement[*].country",
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
							source: "twin:jsonPath",
							"twin:jsonPathExpression": "$.itemList.itemListElement[*]",
							refinement: {
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.itemList.itemListElement[*].country",
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
							source: "twin:jsonPath",
							"twin:jsonPathExpression": "$.itemList.itemListElement[*]",
							refinement: {
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.itemList.itemListElement[*].country",
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
							source: "twin:jsonPath",
							"twin:jsonPathExpression": "$.itemList.itemListElement[*]",
							refinement: [
								{
									leftOperand: "twin:jsonPath",
									"twin:jsonPathExpression": "$.itemList.itemListElement[*].country",
									operator: OdrlOperatorType.Eq,
									rightOperand: "GB"
								},
								{
									leftOperand: "twin:jsonPath",
									"twin:jsonPathExpression": "$.itemList.itemListElement[*].status",
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
							source: "twin:jsonPath",
							"twin:jsonPathExpression": "$.items[*]",
							refinement: {
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.items[*].type",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.items[*].type",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.status",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.count",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.level",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.region",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.roles[*]",
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
										leftOperand: "twin:jsonPath",
										"twin:jsonPathExpression": "$.age",
										operator: OdrlOperatorType.Gteq,
										rightOperand: { "@value": "18", "@type": "xsd:integer" }
									},
									{
										leftOperand: "twin:jsonPath",
										"twin:jsonPathExpression": "$.region",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.zone",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.region",
								operator: OdrlOperatorType.Eq,
								rightOperandReference: "https://example.com/allowed-regions"
							}
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
		test("evaluates permission constraints against information map entry when target data source is information", async () => {
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
						target: {
							"@type": "twin:jsonPath",
							"twin:jsonPathDataSource": "information",
							"twin:jsonPathExpression": "$.credentials"
						},
						constraint: [
							{
								leftOperand: "twin:jsonPath",
								"twin:jsonPathDataSource": "information",
								"twin:jsonPathExpression": "$.credentials.clearanceLevel",
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
						target: {
							"@type": "twin:jsonPath",
							"twin:jsonPathDataSource": "information",
							"twin:jsonPathExpression": "$.credentials"
						},
						constraint: [
							{
								leftOperand: "twin:jsonPath",
								"twin:jsonPathDataSource": "information",
								"twin:jsonPathExpression": "$.credentials.clearanceLevel",
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

		test("supports mixed data and information operand lookups", async () => {
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
						target: {
							"@type": "twin:jsonPath",
							"twin:jsonPathDataSource": "information",
							"twin:jsonPathExpression": "$.credentials"
						},
						constraint: [
							{
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.requestedLevel",
								operator: OdrlOperatorType.Lteq,
								rightOperand: {
									"@type": "twin:jsonPath",
									"twin:jsonPathDataSource": "information",
									"twin:jsonPathExpression": "$.credentials.clearanceLevel"
								} as unknown as IOdrlConstraint["rightOperand"]
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.isPremium",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.isPremium",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.region",
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
						target: [
							{ "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.items[*]" },
							{ "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.meta" }
						],
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
					{
						action: "read",
						target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.items[*]" }
					},
					{
						action: "read",
						target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.meta" }
					}
				],
				prohibition: [
					{
						action: "read",
						target: [
							{ "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.items[*]" },
							{ "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.meta" }
						],
						constraint: [
							{
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.region",
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
						action: { "@id": "print", includedIn: "reproduce" }
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
						action: { "@id": "distribute", implies: ["reproduce"] }
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
						}
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
						action: { "@id": "print", includedIn: "reproduce" },
						constraint: [
							{
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.region",
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
						}
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
			};

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
				permission: [
					{
						action: "use",
						target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.value" }
					}
				]
			};

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
				permission: [
					{
						action: "use",
						target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.value" }
					}
				]
			};

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
				permission: [
					{
						action: "use",
						target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.value" }
					}
				]
			};

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
				permission: [
					{
						action: "use",
						target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.value" }
					}
				]
			};

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
				permission: [
					{
						action: "use",
						target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.value" }
					}
				]
			};

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
				permission: [
					{
						action: "use",
						target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.value" }
					}
				]
			};

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
				permission: [
					{
						action: "use",
						target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.value" }
					}
				]
			};

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
				permission: [
					{
						action: "use",
						target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.value" }
					}
				]
			};

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
			};

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
				target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.items[*]" },
				permission: [{ action: "read" }]
			};

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
				target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.items[*]" },
				permission: [
					{
						action: "read",
						target: { "@type": "twin:jsonPath", "twin:jsonPathExpression": "$.meta" }
					}
				]
			};

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
			};

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
			};

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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.count",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.price",
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
								leftOperand: "twin:jsonPath",
								"twin:jsonPathExpression": "$.count",
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
									leftOperand: "twin:jsonPath",
									"twin:jsonPathExpression": "$.count",
									operator: OdrlOperatorType.Lteq,
									rightOperand: "5"
								}
							]
						}
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
									leftOperand: "twin:jsonPath",
									"twin:jsonPathExpression": "$.count",
									operator: OdrlOperatorType.Gt,
									rightOperand: "5"
								}
							]
						}
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
									leftOperand: "twin:jsonPath",
									"twin:jsonPathExpression": "$.region",
									operator: OdrlOperatorType.Eq,
									rightOperand: "EU"
								}
							]
						}
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
			};

			const childPolicy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:child-with-unsupported-parent",
				inheritFrom: "policy:unsupported-profile-parent",
				permission: [{ action: "use" }]
			};

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

	describe("dateTime left operand", () => {
		test("grants when current date is before the lt bound", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const futureDate = new Date();
			futureDate.setFullYear(futureDate.getFullYear() + 1);
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:datetime-lt-future",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.DateTime,
								operator: OdrlOperatorType.Lt,
								rightOperand: {
									"@value": futureDate.toISOString(),
									"@type": "xsd:dateTime"
								}
							}
						]
					}
				]
			};

			const decisions = await arbiter.decide(policy, undefined, {});
			expect(decisions[0].decision).toBe(PolicyDecision.Granted);
		});

		test("denies when current date is after the lt bound", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:datetime-lt-past",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.DateTime,
								operator: OdrlOperatorType.Lt,
								rightOperand: {
									"@value": "2018-01-01",
									"@type": "xsd:date"
								}
							}
						]
					}
				]
			};

			const decisions = await arbiter.decide(policy, undefined, {});
			expect(decisions[0].decision).toBe(PolicyDecision.Denied);
		});

		test("grants when current date is within a gteq/lteq window", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const past = new Date();
			past.setFullYear(past.getFullYear() - 1);
			const future = new Date();
			future.setFullYear(future.getFullYear() + 1);
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:datetime-window",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.DateTime,
								operator: OdrlOperatorType.Gteq,
								rightOperand: { "@value": past.toISOString(), "@type": "xsd:dateTime" }
							},
							{
								leftOperand: OdrlLeftOperandType.DateTime,
								operator: OdrlOperatorType.Lteq,
								rightOperand: { "@value": future.toISOString(), "@type": "xsd:dateTime" }
							}
						]
					}
				]
			};

			const decisions = await arbiter.decide(policy, undefined, {});
			expect(decisions[0].decision).toBe(PolicyDecision.Granted);
		});

		test("grants when current date is within a gteq/lteq window expressed as bare ISO strings", async () => {
			// Regression test when the leftOperand resolves to a genuine Date instance (as the built-in "dateTime"
			// operand always does) and the rightOperand is a bare ISO string rather than the typed
			// {"@value": ..., "@type": "xsd:dateTime"} wrapper used by every other test in this describe
			// block, Coerce.number(dateInstance) returns its epoch millisecond timestamp while
			// Coerce.number(isoString) uses Number.parseFloat, which silently truncates at the first
			// "-" and returns just the leading year (e.g. "2035-12-31..." -> 2035). Both sides were
			// "defined numbers", so compareOrdered's numeric-first branch fired and compared an
			// epoch millisecond timestamp against a bare 4-digit year - gteq spuriously passed (huge >= small
			// year) while lteq spuriously failed (huge <= small year is false), regardless of the
			// actual dates involved.
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:datetime-window-bare-string",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.DateTime,
								operator: OdrlOperatorType.Gteq,
								rightOperand: "2020-01-01T00:00:00Z"
							},
							{
								leftOperand: OdrlLeftOperandType.DateTime,
								operator: OdrlOperatorType.Lteq,
								rightOperand: "2099-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const decisions = await arbiter.decide(policy, undefined, {});
			expect(decisions[0].decision).toBe(PolicyDecision.Granted);
		});

		test("denies when current date is after a bare-ISO-string lteq bound", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:datetime-lteq-bare-string-expired",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.DateTime,
								operator: OdrlOperatorType.Lteq,
								rightOperand: "2020-12-31T23:59:59Z"
							}
						]
					}
				]
			};

			const decisions = await arbiter.decide(policy, undefined, {});
			expect(decisions[0].decision).toBe(PolicyDecision.Denied);
		});

		test("denies (fails closed) when the dateTime rightOperand is a malformed date string", async () => {
			// Regression test: a Date on one side (the built-in "dateTime" leftOperand) means this can
			// only be a date comparison. If the other side is a string that fails Date parsing (e.g.
			// "31/12/2035", day/month/year order - genuinely Invalid Date in JS, not just non-ISO), the
			// old code fell through to the numeric branch: Coerce.number(dateInstance) = epoch ms,
			// Coerce.number("31/12/2035") = Number.parseFloat's prefix-truncated 31 - reproducing the
			// exact epoch-ms-vs-truncated-number bug this whole guard exists to prevent (gteq always
			// true, lteq always false, regardless of the real dates). Failing closed (deny) instead is
			// strictly safer than a nonsensical comparison.
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:datetime-malformed-string",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.DateTime,
								operator: OdrlOperatorType.Gteq,
								rightOperand: "31/12/2035"
							}
						]
					}
				]
			};

			const decisions = await arbiter.decide(policy, undefined, {});
			expect(decisions[0].decision).toBe(PolicyDecision.Denied);
		});
	});

	describe("unsupported ODRL built-in left operands", () => {
		test.each([
			OdrlLeftOperandType.Count,
			OdrlLeftOperandType.ElapsedTime,
			OdrlLeftOperandType.Language,
			OdrlLeftOperandType.Purpose,
			OdrlLeftOperandType.PayAmount
		])("throws for built-in left operand '%s' when information is absent", async leftOperand => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:unsupported-operand",
				permission: [
					{
						constraint: [
							{
								leftOperand,
								operator: OdrlOperatorType.Eq,
								rightOperand: "any"
							}
						]
					}
				]
			};

			await expect(arbiter.decide(policy, undefined, {})).rejects.toThrow(
				"leftOperandNotSupported"
			);
		});
	});

	describe("information key left operands", () => {
		test("grants when purpose eq matches information value", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:info-purpose-eq",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.Purpose,
								operator: OdrlOperatorType.Eq,
								rightOperand: "research"
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, { purpose: "research" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { purpose: "commercial" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("grants when purpose neq does not match information value", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:info-purpose-neq",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.Purpose,
								operator: OdrlOperatorType.Neq,
								rightOperand: "commercial"
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, { purpose: "research" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { purpose: "commercial" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("grants when count gt information value exceeds threshold", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:info-count-gt",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.Count,
								operator: OdrlOperatorType.Gt,
								rightOperand: { "@value": "3", "@type": "xsd:integer" }
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, { count: 5 }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { count: 2 }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("grants when count lteq information value is within limit", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:info-count-lteq",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.Count,
								operator: OdrlOperatorType.Lteq,
								rightOperand: { "@value": "10", "@type": "xsd:integer" }
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, { count: 10 }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { count: 11 }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("grants with isAnyOf when purpose is in the permitted set", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:info-isanyof",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.Purpose,
								operator: OdrlOperatorType.IsAnyOf,
								rightOperand: ["research", "education"]
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, { purpose: "education" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { purpose: "commercial" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("grants with isNoneOf when purpose is not in the blocked set", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:info-isnoneof",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.Purpose,
								operator: OdrlOperatorType.IsNoneOf,
								rightOperand: ["commercial", "advertising"]
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, { purpose: "research" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { purpose: "commercial" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		describe("spatial left operands", () => {
			test("locTimeEq grants when spatial region matches", async () => {
				const arbiter = new DefaultPolicyArbiter();
				const policy: IDataspaceProtocolAgreement = {
					"@context": OdrlContexts.Context,
					"@type": OdrlPolicyType.Agreement,
					assigner: "did:example:default-assigner",
					assignee: "did:example:default-assignee",
					"@id": "policy:spatial-loctimeeq",
					permission: [
						{
							constraint: [
								{
									leftOperand: OdrlLeftOperandType.Spatial,
									operator: OdrlOperatorType.LocTimeEq,
									rightOperand: "urn:example:region:EU"
								}
							]
						}
					]
				};

				const granted = await arbiter.decide(policy, { spatial: "urn:example:region:EU" }, {});
				expect(granted[0].decision).toBe(PolicyDecision.Granted);

				const denied = await arbiter.decide(policy, { spatial: "urn:example:region:US" }, {});
				expect(denied[0].decision).toBe(PolicyDecision.Denied);
			});

			test("locTimeEq grants when virtualLocation matches", async () => {
				const arbiter = new DefaultPolicyArbiter();
				const policy: IDataspaceProtocolAgreement = {
					"@context": OdrlContexts.Context,
					"@type": OdrlPolicyType.Agreement,
					assigner: "did:example:default-assigner",
					assignee: "did:example:default-assignee",
					"@id": "policy:virtual-loctimeeq",
					permission: [
						{
							constraint: [
								{
									leftOperand: OdrlLeftOperandType.VirtualLocation,
									operator: OdrlOperatorType.LocTimeEq,
									rightOperand: "https://example.org/space/alpha"
								}
							]
						}
					]
				};

				const granted = await arbiter.decide(
					policy,
					{ virtualLocation: "https://example.org/space/alpha" },
					{}
				);
				expect(granted[0].decision).toBe(PolicyDecision.Granted);

				const denied = await arbiter.decide(
					policy,
					{ virtualLocation: "https://example.org/space/beta" },
					{}
				);
				expect(denied[0].decision).toBe(PolicyDecision.Denied);
			});

			test("locTimeGteq grants when absoluteSpatialPosition meets the threshold", async () => {
				const arbiter = new DefaultPolicyArbiter();
				const policy: IDataspaceProtocolAgreement = {
					"@context": OdrlContexts.Context,
					"@type": OdrlPolicyType.Agreement,
					assigner: "did:example:default-assigner",
					assignee: "did:example:default-assignee",
					"@id": "policy:spatial-locgtimegteq",
					permission: [
						{
							constraint: [
								{
									leftOperand: OdrlLeftOperandType.AbsoluteSpatialPosition,
									operator: OdrlOperatorType.LocTimeGteq,
									rightOperand: { "@value": "51.0", "@type": "xsd:decimal" }
								}
							]
						}
					]
				};

				const granted = await arbiter.decide(policy, { absoluteSpatialPosition: 51.5 }, {});
				expect(granted[0].decision).toBe(PolicyDecision.Granted);

				const denied = await arbiter.decide(policy, { absoluteSpatialPosition: 50.9 }, {});
				expect(denied[0].decision).toBe(PolicyDecision.Denied);
			});
		});

		test("throws when known built-in key is absent from information", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:info-key-absent",
				permission: [
					{
						constraint: [
							{
								leftOperand: OdrlLeftOperandType.Purpose,
								operator: OdrlOperatorType.Eq,
								rightOperand: "research"
							}
						]
					}
				]
			};

			await expect(arbiter.decide(policy, { language: "en" }, {})).rejects.toThrow(
				"leftOperandNotSupported"
			);
		});

		test.each([OdrlOperatorType.IsA, OdrlOperatorType.HasPart, OdrlOperatorType.IsPartOf])(
			"structural operator '%s' still throws for known built-in even with information present",
			async operator => {
				const arbiter = new DefaultPolicyArbiter();
				const policy: IDataspaceProtocolAgreement = {
					"@context": OdrlContexts.Context,
					"@type": OdrlPolicyType.Agreement,
					assigner: "did:example:default-assigner",
					assignee: "did:example:default-assignee",
					"@id": "policy:structural-operator",
					permission: [
						{
							constraint: [
								{
									leftOperand: OdrlLeftOperandType.Purpose,
									operator,
									rightOperand: "research"
								}
							]
						}
					]
				};

				await expect(arbiter.decide(policy, { purpose: "research" }, {})).rejects.toThrow(
					"leftOperandNotSupported"
				);
			}
		);

		test("resolves custom non-ODRL key directly from information", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy: IDataspaceProtocolAgreement = {
				"@context": OdrlContexts.Context,
				"@type": OdrlPolicyType.Agreement,
				assigner: "did:example:default-assigner",
				assignee: "did:example:default-assignee",
				"@id": "policy:custom-info-key",
				permission: [
					{
						constraint: [
							{
								leftOperand: "contractTier",
								operator: OdrlOperatorType.Eq,
								rightOperand: "premium"
							}
						]
					}
				]
			};

			const granted = await arbiter.decide(policy, { contractTier: "premium" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { contractTier: "standard" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});
	});

	describe("left operand spec coverage", () => {
		// Builds a minimal agreement with a single constraint, reused across many tests below.
		const makeAgreement = (
			id: string,
			leftOperand: string,
			operator: string,
			rightOperand: IOdrlConstraint["rightOperand"]
		): IDataspaceProtocolAgreement => ({
			"@context": OdrlContexts.Context,
			"@type": OdrlPolicyType.Agreement,
			assigner: "did:example:default-assigner",
			assignee: "did:example:default-assignee",
			"@id": id,
			permission: [
				{
					constraint: [{ leftOperand, operator: operator as OdrlOperatorType, rightOperand }]
				}
			]
		});

		// ── String / URI operands ──────────────────────────────────────────────────
		// Spec: fileFormat, industry, media, product, deliveryChannel, systemDevice,
		//       unitOfCount, recipient, version all carry string or IRI values and are
		//       compared with equality operators.

		test.each([
			[OdrlLeftOperandType.FileFormat, "image/jpeg", "image/png"],
			[OdrlLeftOperandType.Industry, "publishing", "finance"],
			[OdrlLeftOperandType.Media, "print", "electronic"],
			[OdrlLeftOperandType.Product, "urn:product:enterprise", "urn:product:basic"],
			[OdrlLeftOperandType.DeliveryChannel, "mobile", "web"],
			[OdrlLeftOperandType.SystemDevice, "did:device:sensor-1", "did:device:sensor-2"],
			[OdrlLeftOperandType.UnitOfCount, "perUser", "perDevice"],
			[OdrlLeftOperandType.Recipient, "did:example:alice", "did:example:bob"],
			[OdrlLeftOperandType.Version, "2.0", "1.0"]
		] as [string, string, string][])(
			"string/URI operand '%s' eq grants when matching, denies otherwise",
			async (leftOperand, matchValue, otherValue) => {
				const arbiter = new DefaultPolicyArbiter();
				const policy = makeAgreement(
					`policy:str-${leftOperand}`,
					leftOperand,
					OdrlOperatorType.Eq,
					matchValue
				);

				const granted = await arbiter.decide(policy, { [leftOperand]: matchValue }, {});
				expect(granted[0].decision).toBe(PolicyDecision.Granted);

				const denied = await arbiter.decide(policy, { [leftOperand]: otherValue }, {});
				expect(denied[0].decision).toBe(PolicyDecision.Denied);
			}
		);

		test("media isAnyOf grants when value is within the allowed set", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:media-isanyof",
				OdrlLeftOperandType.Media,
				OdrlOperatorType.IsAnyOf,
				["print", "electronic"]
			);

			const granted = await arbiter.decide(policy, { media: "electronic" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { media: "advertising" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		// ── Numeric operands ──────────────────────────────────────────────────────
		// Spec: payAmount (xsd:decimal), percentage (xsd:decimal 0-100),
		//       absoluteSize, relativeSize, relativeTemporalPosition, resolution
		//       all carry numeric values and support ordered comparison operators.

		test.each([
			// [leftOperand, infoValue (grants), threshold, operator]
			[OdrlLeftOperandType.PayAmount, 50, 100, OdrlOperatorType.Lteq],
			[OdrlLeftOperandType.Percentage, 75, 50, OdrlOperatorType.Gt],
			[OdrlLeftOperandType.AbsoluteSize, 1024, 2048, OdrlOperatorType.Lt],
			[OdrlLeftOperandType.RelativeSize, 80, 80, OdrlOperatorType.Gteq],
			[OdrlLeftOperandType.Resolution, 300, 300, OdrlOperatorType.Gteq],
			[OdrlLeftOperandType.RelativeTemporalPosition, 25, 50, OdrlOperatorType.Lt]
		] as [string, number, number, string][])(
			"numeric operand '%s' with '%s' grants when threshold is met",
			async (leftOperand, infoValue, threshold, operator) => {
				const arbiter = new DefaultPolicyArbiter();
				const policy = makeAgreement(`policy:num-${leftOperand}`, leftOperand, operator, {
					"@value": String(threshold),
					"@type": "xsd:decimal"
				});

				const granted = await arbiter.decide(policy, { [leftOperand]: infoValue }, {});
				expect(granted[0].decision).toBe(PolicyDecision.Granted);
			}
		);

		// ── Event operand temporal semantics ─────────────────────────────────────
		// Spec: operators signal before (lt), during (eq) or after (gt) the named event.
		// When event context and reference are ISO date strings, string ordering matches
		// chronological ordering, making lt/eq/gt semantically correct.

		test("event lt grants when context date is before the event date", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:event-lt",
				OdrlLeftOperandType.Event,
				OdrlOperatorType.Lt,
				"2025-01-01"
			);

			const granted = await arbiter.decide(policy, { event: "2024-06-01" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { event: "2026-01-01" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("event eq grants during (matching) the named event", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:event-eq",
				OdrlLeftOperandType.Event,
				OdrlOperatorType.Eq,
				"urn:event:conference-2024"
			);

			const granted = await arbiter.decide(policy, { event: "urn:event:conference-2024" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { event: "urn:event:conference-2025" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("event gt grants when context date is after the event date", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:event-gt",
				OdrlLeftOperandType.Event,
				OdrlOperatorType.Gt,
				"2023-06-15"
			);

			const granted = await arbiter.decide(policy, { event: "2024-01-01" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { event: "2022-01-01" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("same-year ISO date strings compare chronologically, not as truncated year numbers", async () => {
			// Regression: Coerce.number("2025-06-01") == Coerce.number("2025-12-31") == 2025
			// because Number.parseFloat truncates at the first "-", making any two same-year
			// dates compare as equal. The date-string guard must fire before the numeric branch.
			const arbiter = new DefaultPolicyArbiter();
			const gteqPolicy = makeAgreement(
				"policy:event-date-string-gteq",
				OdrlLeftOperandType.Event,
				OdrlOperatorType.Gteq,
				"2025-12-31"
			);

			// June 1 is NOT >= December 31 (same year)
			const denied = await arbiter.decide(gteqPolicy, { event: "2025-06-01" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);

			// December 31 IS >= June 1 (same year)
			const granted = await arbiter.decide(gteqPolicy, { event: "2025-12-31" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);
		});

		test("same-year ISO datetime strings compare chronologically with lt", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:event-datetime-string-lt",
				OdrlLeftOperandType.Event,
				OdrlOperatorType.Lt,
				"2025-12-31T23:59:59Z"
			);

			// June 1 IS < December 31 (same year)
			const granted = await arbiter.decide(policy, { event: "2025-06-01T00:00:00Z" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			// December 31 is NOT < June 1 (same year)
			const denied = await arbiter.decide(policy, { event: "2025-12-31T23:59:59Z" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("same-hour ISO time strings compare chronologically, not as truncated hour numbers", async () => {
			// Regression: Coerce.number("09:30:00") == Coerce.number("09:45:00") == 9
			// because Number.parseFloat truncates at the first ":".
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:event-time-string-lt",
				OdrlLeftOperandType.Event,
				OdrlOperatorType.Lt,
				"09:45:00"
			);

			// 09:30 IS < 09:45 (same hour)
			const granted = await arbiter.decide(policy, { event: "09:30:00" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			// 09:45 is NOT < 09:30 (same hour)
			const denied = await arbiter.decide(policy, { event: "09:45:00" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		// ── Duration operands ─────────────────────────────────────────────────────
		// Spec: delayPeriod (eq/gt/gteq), elapsedTime (eq/lt/lteq),
		//       meteredTime (eq/lt/lteq), timeInterval (eq only) — all xsd:duration.
		// ISO 8601 strings are supported end-to-end: coerceXsdType maps xsd:duration
		// to Coerce.duration, and compareOrdered resolves duration strings on either side.

		test("delayPeriod gteq grants when ISO 8601 delay meets minimum (spec: eq/gt/gteq)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:delayperiod-gteq",
				OdrlLeftOperandType.DelayPeriod,
				OdrlOperatorType.Gteq,
				{ "@value": "PT30M", "@type": "xsd:duration" }
			);

			// PT1H (3600s) >= PT30M (1800s)
			const granted = await arbiter.decide(policy, { delayPeriod: "PT1H" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			// PT15M (900s) is not >= PT30M (1800s)
			const denied = await arbiter.decide(policy, { delayPeriod: "PT15M" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("elapsedTime lteq grants when ISO 8601 elapsed time is within limit (spec: eq/lt/lteq)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:elapsedtime-lteq",
				OdrlLeftOperandType.ElapsedTime,
				OdrlOperatorType.Lteq,
				{ "@value": "PT1H", "@type": "xsd:duration" }
			);

			// PT30M (1800s) <= PT1H (3600s)
			const granted = await arbiter.decide(policy, { elapsedTime: "PT30M" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			// PT2H (7200s) is not <= PT1H (3600s)
			const denied = await arbiter.decide(policy, { elapsedTime: "PT2H" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("meteredTime lteq grants when ISO 8601 metered time is within budget (spec: eq/lt/lteq)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:meteredtime-lteq",
				OdrlLeftOperandType.MeteredTime,
				OdrlOperatorType.Lteq,
				{ "@value": "PT10M", "@type": "xsd:duration" }
			);

			// PT5M (300s) <= PT10M (600s)
			const granted = await arbiter.decide(policy, { meteredTime: "PT5M" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			// PT11M (660s) is not <= PT10M (600s)
			const denied = await arbiter.decide(policy, { meteredTime: "PT11M" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("timeInterval eq grants when ISO 8601 interval matches (spec: eq only)", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:timeinterval-eq",
				OdrlLeftOperandType.TimeInterval,
				OdrlOperatorType.Eq,
				{ "@value": "P1D", "@type": "xsd:duration" }
			);

			// P1D (86400s) == P1D (86400s)
			const granted = await arbiter.decide(policy, { timeInterval: "P1D" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			// PT12H (43200s) != P1D (86400s)
			const denied = await arbiter.decide(policy, { timeInterval: "PT12H" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		// ── Coordinate and complex operands ───────────────────────────────────────
		// Spec: spatialCoordinates carries longitude/latitude/altitude values;
		//       absoluteTemporalPosition carries a Media Fragment URI string.
		// For structured coordinate objects, only deep equality (eq) is meaningful.
		// Ordering operators are not defined by the spec for coordinate types.

		test("spatialCoordinates eq grants when coordinate object matches exactly", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const coords = { lon: 13.405, lat: 52.52, datum: "WGS84" };
			const policy = makeAgreement(
				"policy:spatialcoords-eq",
				OdrlLeftOperandType.SpatialCoordinates,
				OdrlOperatorType.Eq,
				JSON.stringify(coords)
			);

			const granted = await arbiter.decide(
				policy,
				{ spatialCoordinates: JSON.stringify(coords) },
				{}
			);
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(
				policy,
				{ spatialCoordinates: JSON.stringify({ lon: 2.35, lat: 48.85, datum: "WGS84" }) },
				{}
			);
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("absoluteTemporalPosition eq grants when media fragment URI matches", async () => {
			const arbiter = new DefaultPolicyArbiter();
			// Media Fragment URI format: t=<start>,<end> (seconds in media stream)
			const policy = makeAgreement(
				"policy:abstemporalpos-eq",
				OdrlLeftOperandType.AbsoluteTemporalPosition,
				OdrlOperatorType.Eq,
				"t=30,60"
			);

			const granted = await arbiter.decide(policy, { absoluteTemporalPosition: "t=30,60" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			const denied = await arbiter.decide(policy, { absoluteTemporalPosition: "t=0,30" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("neq correctly denies when ISO 8601 duration string matches xsd:duration right operand", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:neq-duration-regression",
				OdrlLeftOperandType.DelayPeriod,
				OdrlOperatorType.Neq,
				{ "@value": "PT1H", "@type": "xsd:duration" }
			);

			// "PT1H" == "PT1H" semantically → Neq must DENY
			const denied = await arbiter.decide(policy, { delayPeriod: "PT1H" }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);

			// "PT2H" != "PT1H" → Neq must GRANT
			const granted = await arbiter.decide(policy, { delayPeriod: "PT2H" }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);
		});

		test("eq does not grant when boolean false and string '0' are compared", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement("policy:eq-boolean-zero", "enabled", OdrlOperatorType.Eq, "0");

			// false is not equal to "0" — no numeric coercion should bridge them
			const denied = await arbiter.decide(policy, { enabled: false }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});

		test("isNoneOf correctly denies when numeric information value is in string-array right operand", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:isnone-numeric",
				OdrlLeftOperandType.Count,
				OdrlOperatorType.IsNoneOf,
				["1", "2", "3"]
			);

			// count = 1 (number) is in ["1","2","3"] → IsNoneOf must DENY
			const denied = await arbiter.decide(policy, { count: 1 }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);

			// count = 4 is not in ["1","2","3"] → IsNoneOf must GRANT
			const granted = await arbiter.decide(policy, { count: 4 }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);
		});

		test("xsd:duration right operand accepts non-ISO numeric string as seconds", async () => {
			const arbiter = new DefaultPolicyArbiter();
			const policy = makeAgreement(
				"policy:duration-numeric-fallback",
				OdrlLeftOperandType.DelayPeriod,
				OdrlOperatorType.Gteq,
				{ "@value": "1800", "@type": "xsd:duration" }
			);

			// 3600s >= 1800s → GRANT
			const granted = await arbiter.decide(policy, { delayPeriod: 3600 }, {});
			expect(granted[0].decision).toBe(PolicyDecision.Granted);

			// 900s < 1800s → DENY
			const denied = await arbiter.decide(policy, { delayPeriod: 900 }, {});
			expect(denied[0].decision).toBe(PolicyDecision.Denied);
		});
	});
});
