# Rights Management Use Cases

This directory contains comprehensive use cases for testing and validating the TWIN Platform Rights Management system. Each use case demonstrates ODRL policy evaluation and PDP decision-making across various access scenarios during runtime (Phase 2 - Access Evaluation).

## Architecture Overview

The TWIN Platform Rights Management system operates in two distinct phases:

### Phase 1: Policy Lifecycle (Negotiation)

- **PNP (Policy Negotiation Point)**: IDS Contract Negotiation between provider and consumer
- **PNAP (Policy Negotiation Administration Point)**: Manages negotiation state machine
- **Outcome**: Creates Agreement policies from Offers through negotiation protocol
- **Demonstrated in**: UC6 (Policy Negotiation - Offer to Agreement Lifecycle)

### Phase 2: Access Evaluation (Runtime)

- **PDP (Policy Decision Point)**: Evaluates existing Agreement policies for access requests
- **PEP (Policy Enforcement Point)**: Enforces PDP decisions with data transformation; called directly by application code
- **PMP (Policy Management Point)**: Queries PAP for matching policies using Policy Locator
- **PIP (Policy Information Point)**: Provides runtime context for constraint evaluation
- **Demonstrated in**: UC1-UC5 (all current use cases)

## Implementation Status

⚠️ **Important**: These use cases define the **target specification** for rights management features and serve as test-driven development (TDD) fixtures. Some patterns demonstrated represent **planned functionality** that guides future implementation rather than documenting existing features.

### JSONPath Constraint Evaluation

JSONPath constraint evaluation is implemented in the default arbiter using canonical JSON-LD fields.

**Current Status**: Implemented with canonical `twin:jsonPath` + `twin:jsonPathExpression` operands.

**Supported Components**:

- Arbiter logic for path-based constraint checking
- Typed right-operand JSONPath references
- PIP/PDP integration for context-based path evaluation

**Example Pattern from UC1**:

```json
{
  "leftOperand": "twin:jsonPath",
  "twin:jsonPathExpression": "$.assigneeAttributes.legalAddress.countryCode",
  "operator": "eq",
  "rightOperand": "PL"
}
```

**Implementation Notes**:

- Canonical syntax is required for JSONPath operands.
- Legacy inline JSONPath operand syntax is intentionally not supported.
- Arbiter evaluation supports both left and typed right operands.

### TWIN ODRL Extensions

#### JSON Path Constraints

The TWIN Platform extends ODRL with custom leftOperand types for evaluating nested properties using JSON Path expressions.

**Canonical Format (preferred)**:

```json
{
  "leftOperand": "twin:jsonPath",
  "twin:jsonPathExpression": "$.legalAddress.countryCode",
  "operator": "<operator>",
  "rightOperand": "<value>"
}
```

**Format Specification**:

- **Namespace**: `twin:` maps to `https://w3id.org/twin/odrl/`
- **Canonical Operand Type**: `jsonPath`
- **Canonical Expression Field**: `twin:jsonPathExpression`
- **Path Expression**: Follows JSONPath syntax (`$.property`, `$.nested.property`, etc.)

**Context Requirements**:

```json
{
  "@context": [
    "http://www.w3.org/ns/odrl.jsonld",
    {
      "twin": "https://w3id.org/twin/odrl/"
    }
  ]
}
```

**Examples**:

```json
// Canonical simple property access
{
  "leftOperand": "twin:jsonPath",
  "twin:jsonPathExpression": "$.legalAddress.countryCode"
}

// Canonical typed right operand
{
  "rightOperand": {
    "@type": "twin:jsonPath",
    "twin:jsonPathExpression": "$.allowedRegion"
  }
}

// Canonical deep nesting
{
  "leftOperand": "twin:jsonPath",
  "twin:jsonPathExpression": "$.payload.documentTypeCode"
}
```

**Arbiter Implementation** (when built):

- Parse canonical `twin:jsonPathExpression`
- Evaluate path against PIP context using `jsonpath-plus` library
- Return extracted value for operator comparison

### ✅ Currently Implemented

The following architectural components are implemented and functional:

- **PAP**: Policy storage and retrieval with entity storage connectors
- **PMP**: Policy query resolution using Policy Locator pattern
- **PIP**: Runtime context aggregation from Information Sources
- **PXP**: Pre/post evaluation hooks for obligations and telemetry
- **PDP**: Evaluation pipeline orchestration with Arbiter coordination
- **PEP**: Enforcement framework with processor registration
- **PNP**: IDS Contract Negotiation state machine
- **PNAP**: Negotiation administration and manual intervention
- **Application Code**: High-level code that calls PEP for access control and data enforcement
- **Simple Matching**: Asset type and action string equality matching
- **ODRL Standards**: W3C ODRL 2.2 conformant policy structures

**Note**: Use cases UC1-UC5 demonstrate the **expected behavior** when all features are implemented. They provide clear specifications for test-driven development and serve as implementation acceptance criteria.

## Use Case Index

| ID                                                 | Name                                    | Action Type | Asset Target                                | Key Features                                                                                               | Phase       |
| -------------------------------------------------- | --------------------------------------- | ----------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------- |
| [UC1](./01-basic-data-resource-access/)            | Basic Data Resource Access              | `read`      | DataResource                                | PartyCollection, country filtering, JSON Path selectors, **PEP enforcement**                               | Phase 2     |
| [UC2](./02-country-filtered-consignments/)         | Country Filtered Consignments           | `view`      | Consignment (asset class)                   | Data filtering, PIP integration, reduced datasets, **PEP data transformation**                             | Phase 2     |
| [UC3](./03-specific-resource-inheritance/)         | Specific Resource Inheritance           | `read`      | CONS000001 (specific) + Consignment (class) | Policy inheritance, Set + Agreement, **PEP layered evaluation**                                            | Phase 2     |
| [UC4](./04-multi-constraint-service-offering/)     | Multi-Constraint Service Offering       | `use`       | ServiceOffering                             | Multiple constraints (temporal + attribute), **PEP permission checks**                                     | Phase 2     |
| [UC5](./05-catalogue-gated-notification/)          | Catalogue-Gated Notification            | `use`       | NotificationService + Consignment           | ODRL duty clauses, Data Space Connector integration, Federated Catalogue, **duty enforcement**             | Phase 2     |
| [UC6](./06-policy-negotiation-offer-to-agreement/) | Policy Negotiation - Offer to Agreement | N/A         | Offer → Agreement                           | **IDS Contract Negotiation**, PNP state machine, Negotiator evaluation, **Offer→Agreement transformation** | **Phase 1** |
| [UC7](./07-policy-negotiation-direct-agreement/)   | Policy Negotiation - Direct Agreement   | N/A         | Offer → Agreement                           | **DSP 2025-1 REQUESTED→AGREED shortcut**, `directAgreement` signal, contrasts with UC6 full cycle          | **Phase 1** |

## Component Format

Use cases follow different component structures depending on which phase they demonstrate:

### Phase 2 (Access Evaluation) - UC1-UC5

Each Phase 2 use case has 6-7 components:

### Standard Components (6 required)

### 1. description.md

Human-readable scenario description including:

- **Prerequisites**: Explains that Agreement policy already exists (created via Phase 1 negotiation, administrative action, or automated onboarding)
- **Business Context**: Real-world scenario and motivation
- **Parties Involved**: Assigner (provider) and assignee (consumer) with identities
- **Scenario Flow**: Separated into Phase 1 (policy lifecycle) and Phase 2 (runtime access)
- **PEP Integration**: Application code patterns with PEP enforcement examples
- **Architecture Components**: Detailed component usage for both phases
- **Expected Behavior**: Success and failure scenarios
- **Testing Focus**: Key aspects to validate

### 2. access-request.json

Policy Locator used by PMP to query PAP for matching Agreement policies:

```json
{
  "$comment": "Policy Locator - Used by PMP to query PAP...",
  "assetType": "string",
  "action": "string",
  "resourceId": "string (optional)",
  "requestingNodeIdentity": "did:iota:..."
}
```

**Note**: This is NOT a PNP negotiation request. It represents runtime access requests during Phase 2 (Access Evaluation).

### 3. policy.json

Agreement policy that already exists in PAP, conforming to `@twin.org/standards-w3c-odrl` interfaces:

- `IOdrlAgreement` - Bilateral agreement with specific assignee (most common in UC1-UC5)
- `IOdrlSet` - Asset class policies without specific parties (used with Agreement in UC3)
- `IOdrlOffer` - Initial offer from data provider (used in Phase 1 negotiation - see UC6)
- Includes permissions, constraints, duties (if applicable)

**Lifecycle**: Created via Phase 1 (PNP negotiation), administrative action, or automated onboarding. Already exists before Phase 2 access requests.

### 4. pdp-request.json

Policy Decision Point evaluation request - **IDENTICAL to access-request.json** (Policy Locator pattern):

```json
{
  "$comment": "Policy Locator for PDP evaluation via PMP",
  "assignee": "string (optional)",
  "action": "string",
  "assetType": "string",
  "resourceId": "string (optional)"
}
```

### 5. pip-context.json

Policy Information Point contextual data - runtime facts provided by Information Sources to PDP during policy evaluation:

```json
{
  "$comment": "PIP Context - Runtime facts for PDP evaluation (Phase 2)",
  "currentDateTime": "ISO 8601",
  "assigneeAttributes": {
    "legalAddress": { "countryCode": "PL" },
    "certifications": ["ISO27001"]
  },
  "resourceAttributes": {
    "destinationCountry": "GB"
  },
  "environmentAttributes": {
    "catalogueLookup": { "endpoint": "..." }
  }
}
```

**Note**: This is NOT consumer-provided negotiation context. PIP aggregates runtime facts from trusted Information Sources (identity systems, catalogues, resource storage).

### 6. expected-decision.json

Expected PDP decision and enforcement result:

```json
{
  "decision": "permit | deny",
  "appliedConstraints": [],
  "obligations": [],
  "filteredData": {} // for view actions only
}
```

### Optional Components

**7. notification-trace.json** _(Optional for duty-based policies)_

Trace of the notification delivery made to satisfy an ODRL duty clause:

```json
{
  "notifyActivityRequest": {
    "endpoint": "https://<duty-target-endpoint>",
    "method": "POST",
    "body": { "...": "Activity Streams payload delivered to the duty's target" }
  },
  "notes": "Notification is sent only when the PDP decision is permit and the duty is successfully enforced."
}
```

Used in UC5 (Catalogue-Gated Notification) to trace the actual delivery to the duty's target endpoint (the assignee's own connector), which is what satisfies the attached duty for veterinary-certificate documents.

**source-data.json** - Sample unfiltered data for view actions demonstrating PEP post-action transformation (used in UC2)

### Component Example Files (New Format)

Each use case now includes additional component example files that clarify what each component provides to other components:

#### PAP (Policy Administration Point) Files

- **`pap-agreement.json`** - Shows policy storage format with `papMetadata` object
  - Storage timestamps and versioning
  - Indexed fields for PMP queries (assigner, action, target)
  - Policy locator hints (lookup keys, searchable constraints)
  - Inheritance metadata (UC3: `inheritsFrom`, `precedence`)
  - Temporal metadata (UC4: `expiresAt`, `validFrom`, `validUntil`)
  - Duty tracking (UC5: `hasDutyClause`, `obligationTracking`)

#### PMP (Policy Management Point) Files

- **`pmp-policy-locator.json`** - Shows how PMP queries PAP
  - `policyQuery`: Request context (assigner, assignee, action, target)
  - `lookupStrategy`: Index selection and lookup keys
  - `filterCriteria`: How PMP queries PAP using indexed fields
  - `matchedPolicies`: Policies found with match scores
  - `policySelectionResult`: Selected policy and next step

#### PIP (Policy Information Point) Files

- **`pip-context.json`** - Runtime context facts
  - Already exists in UC1-UC5
  - UC6 adds `negotiationContext` showing Agreement derivation

#### PDP (Policy Decision Point) Files

- **`pdp-request.json`** - PDP evaluation request format
  - Request ID and timestamp
  - Action, assignee, resource details
  - Applicable policy reference
  - Full context for evaluation

- **`pdp-decision.json`** - New decision format with `dataDecisions` array
  - Overall decision (Permit/Deny)
  - `dataDecisions`: Array of granular decisions on data elements
    - `target`: JSONPath selector (e.g., `$..*`, `$.consignments[0]`)
    - `decision`: Granted/Denied
    - `reasoning`: Human-readable explanation
  - `evaluatedConstraints`: Constraint evaluation results
  - `obligations`: Duty clauses if applicable

#### Access Request Files

- **`access-request.json`** - Initial access request
  - Request ID and timestamp
  - Asset type and action
  - Requesting node identity
  - UC6 adds `negotiationReference` with agreement UID and original offer

### ODRL Inheritance Pattern (Offer → Agreement)

UC6 demonstrates ODRL inheritance using the `derivedFrom` property to link Agreements to their source Offers:

```json
{
  "@type": "Agreement",
  "uid": "https://giw-node.example.org/policies/agreements/agr-001",
  "derivedFrom": {
    "@id": "https://giw-node.example.org/policies/offers/vet-cert-offer-001",
    "@type": "Offer"
  },
  "assigner": "did:iota:...",
  "assignee": "did:iota:...",
  "permission": [...]
}
```

This pattern shows:

- **Traceability**: Agreements reference their originating Offer
- **Negotiation Context**: Track which Offer led to which Agreement
- **Policy Lineage**: Understand policy evolution from Offer → Agreement → Enforcement

### Phase 1 (Policy Negotiation) - UC6

Each Phase 1 use case has 7 components demonstrating the negotiation lifecycle:

#### 1. description.md (UC6)

Complete negotiation scenario with:

- Business context for why negotiation is needed
- Provider and Consumer parties
- IDS state machine flow (REQUESTED → OFFERED → AGREED → FINALIZED)
- Negotiator evaluation logic
- Connection to Phase 2 (how created Agreement is used)

#### 2. offer-registration.json

Initial Offer policy registered by Provider in PNP with PartyCollection assignees

#### 3. negotiation-initiation.json

Consumer negotiation request (IDS ContractRequestMessage) with identity and context

#### 4. negotiator-evaluation.json

Provider Negotiator evaluation trace showing:

- Constraint satisfaction checks
- Business rule evaluation
- Decision: accept, counter, reject, or pause for PNAP

#### 5. agreement-acceptance.json

Consumer accepts Offer terms (IDS ContractAgreementMessage)

#### 6. finalized-agreement.json

Final Agreement stored in PAP - **This is the policy used by UC1-UC5**

#### 7. state-transitions.json

Complete IDS state machine audit trail with timestamps and actors

## Architecture Mapping

### Phase 1: Policy Lifecycle (Not demonstrated in UC1-UC5)

```text
PNP (Policy Negotiation Point)
  ├─ Input: Negotiation request (IDS Contract Negotiation protocol)
  ├─ Process: REQUESTED → OFFERED → AGREED → FINALIZED
  └─ Output: policy.json (Agreement created from Offer)

PNAP (Policy Negotiation Administration Point)
  ├─ Manages: Negotiation state machine
  └─ Coordinates: PNP operations and lifecycle

PAP (Policy Administration Point)
  ├─ Stores: policy.json (Offer, Agreement, Set)
  └─ Manages: Policy lifecycle and versioning
```

**Demonstrated in**: UC6 (Policy Negotiation - Offer to Agreement Lifecycle)

### Phase 2: Access Evaluation (UC1-UC5)

```text
Application Code (Consumer/Provider)
  ├─ Calls: PEP with access request and context
  └─ Receives: Authorized data or permit/deny decision

PEP (Policy Enforcement Point) - Entry point called by application code
  ├─ Receives: Access request from application
  ├─ Orchestrates: PMP → PDP → enforcement pipeline
  ├─ Pre-action: Authorization checks (permit/deny)
  ├─ Post-action: Data transformation (filtering, reduction)
  └─ Returns: Authorized data with transformations

PMP (Policy Management Point)
  ├─ Input: access-request.json (Policy Locator)
  ├─ Queries: PAP for matching policies
  └─ Output: policy.json to PDP

PDP (Policy Decision Point)
  ├─ Input: policy.json + pip-context.json
  ├─ Evaluates: Constraints and duties (duties are enforced synchronously by the
  │             Arbiter via a registered obligation enforcer, gating the decision)
  ├─ Internal: PXP before/after decision interception (not involved in duty enforcement itself)
  └─ Output: expected-decision.json

PIP (Policy Information Point)
  ├─ Aggregates: pip-context.json from Information Sources
  ├─ Sources: Identity systems, Federated Catalogue, resource storage
  └─ Provides: Runtime facts for PDP evaluation

PXP (Policy Execution Point)
  ├─ Used by: PDP for ordered before/after decision-computation interception
  ├─ Provides: Telemetry, context enrichment, or short-circuiting around a decision
  └─ Not involved in permission-duty enforcement (that happens inside the Arbiter itself)
```

**Demonstrated in**: UC1-UC5 (all current use cases)

## Standards Integration

### ODRL Standards (`@twin.org/standards-w3c-odrl`)

All policies conform to W3C ODRL 2.2 specification using TypeScript interfaces:

- **IOdrlPolicy** - Base policy interface
- **IOdrlAgreement** - Agreement policies (bilateral)
- **IOdrlOffer** - Offer policies (unilateral)
- **IOdrlSet** - Set policies (asset classes)
- **IOdrlPermission** - Permission rules
- **IOdrlConstraint** - Constraint expressions
- **IOdrlPartyCollection** - Filtered party collections

### Action Types

- **read** - Simple read access with PEP pre-action authorization (grant/deny) - UC1, UC3
- **view** - Read access with PEP post-action data filtering/reduction - UC2
- **use** - Service usage permission check (no data operations) - UC4, UC5 (UC5 also carries an attached duty clause enforced alongside the permission)

### Constraint Patterns

- **Geographic**: `leftOperand: "spatial"` or JSON Path selectors for country codes
- **Temporal**: `leftOperand: "dateTime"` with operators `gteq`, `lteq`, `eq`
- **Attribute**: JSON Path selectors with `propertyValue` for custom attributes
- **Logical**: Multiple constraints with implicit AND logic

### Use Case Categorization

#### Phase 2: Access Evaluation (UC1-UC5 - Current)

- **UC1**: Basic cross-node data access with PartyCollection constraints
- **UC2**: Asset class policies with PEP post-action data filtering
- **UC3**: Policy inheritance (Set + Agreement) with layered evaluation
- **UC4**: Multi-constraint AND logic (temporal + attribute) for permission checks
- **UC5**: ODRL duty clauses with Data Space Connector and Federated Catalogue integration

#### Phase 1: Policy Negotiation (UC6)

- **UC6**: IDS Contract Negotiation protocol demonstrating PNP with state machine transitions (REQUESTED → OFFERED → AGREED → FINALIZED)
- Shows how Offers become Agreements through negotiation
- Demonstrates Negotiator evaluation logic and Requester callbacks
- Creates the Agreement policy used by UC1 for runtime evaluation

### Connection Between Phase 1 and Phase 2

**UC6 creates the Agreements that UC1-UC5 evaluate:**

- **UC6 Output** → `finalized-agreement.json` (Agreement stored in PAP)
- **UC1 Input** → `policy.json` (Agreement from PAP)
- **Relationship**: The Agreement created in UC6's negotiation is the SAME policy that UC1 uses for runtime access control

**Complete Lifecycle Flow:**

1. **UC6 (Phase 1)**: Provider registers Offer → Consumer negotiates → Agreement finalized in PAP
2. **UC1-UC5 (Phase 2)**: Consumer requests data → PDP evaluates Agreement from PAP → PEP enforces decision

Without UC6, UC1-UC5 assume Agreements "magically exist" in PAP. UC6 shows where they come from.

### Extension Scenarios

**UC5 (Catalogue-Gated Notification)** extends beyond basic requirements to demonstrate advanced patterns:

- ✅ ODRL duty clause patterns (permissions with obligations)
- ✅ Data Space Connector integration with rights-managed notifications
- ✅ Federated Catalogue certification-based authorization
- ✅ Duty enforcement gated on the same permit decision via a registered obligation enforcer
- ✅ Notification trace audit trails for duty fulfillment

This use case prepares the framework for federated data space ecosystems with document-type-scoped delivery obligations between connectors.

## Usage Guidelines

### For Developers

1. **Understanding**: Read `description.md` to understand the business scenario
2. **Implementation**: Use component files as test fixtures for unit/integration tests
3. **Validation**: Ensure your implementation produces `expected-decision.json` from given inputs
4. **Extension**: Add new use cases following the 7-component format

### For Reviewers

1. **Completeness**: Verify all 7 components are present and consistent
2. **Standards**: Check ODRL policies conform to `@twin.org/standards-w3c-odrl` interfaces
3. **Realism**: Ensure scenarios reflect real-world TWIN Platform requirements
4. **Testability**: Confirm use cases can drive actual test implementation

## Adding New Use Cases

### For Phase 2 (Access Evaluation) Use Cases

To add a new Phase 2 use case:

1. Create a new directory: `XX-descriptive-name/`
2. Add all 6 required components:
   - `description.md` (with Prerequisites, Phase 1/Phase 2 flow, PEP integration)
   - `access-request.json` (Policy Locator with $comment)
   - `policy.json` (Agreement or Set)
   - `pdp-request.json` (same as access-request.json)
   - `pip-context.json` (runtime facts with $comment)
   - `expected-decision.json`
3. Add optional components if needed (notification-trace.json, source-data.json)
4. Update this README with a new entry in the index table
5. Ensure ODRL policy validation against JSON schemas in `@twin.org/standards-w3c-odrl`
6. Include PEP enforcement examples in `description.md` showing application code calling PEP

### For Phase 1 (Negotiation) Use Cases

To add a Phase 1 use case (like UC6):

1. Create directory demonstrating IDS Contract Negotiation
2. Include negotiation state machine transitions
3. Show Offer → Agreement transformation via PNP
4. Document PNAP state management
5. Reference UC6 implementation plan for guidance

## References

- [Rights Management Architecture](../architecture.md)
- [W3C ODRL 2.2 Specification](https://www.w3.org/TR/odrl-model/)
- [TWIN Platform Standards - W3C ODRL Package](../../../standards/packages/standards-w3c-odrl/)
- [IDS Contract Negotiation Protocol](https://github.com/International-Data-Spaces-Association/IDS-G)
