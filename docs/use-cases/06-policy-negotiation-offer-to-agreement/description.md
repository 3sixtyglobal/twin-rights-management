# Use Case 6: Policy Negotiation - Offer to Agreement Lifecycle

> **Note**: TypeScript snippets in this document are illustrative examples showing conceptual flow. For exact API signatures, refer to the interface definitions in `rights-management-models/src/models/`.

## Business Context

A Polish veterinary agency (GIW) wants to provide controlled access to veterinary certificate data for agricultural exports. The agency creates an Offer policy that specifies access conditions: only organizations legally registered in Poland may read the data. A Polish exporter wants access and initiates a contract negotiation. Through the IDS Contract Negotiation protocol, the Offer is evaluated, accepted, and transformed into a binding Agreement that enables runtime access control.

This use case demonstrates **Phase 1 (Policy Lifecycle)** - the negotiation process that creates the Agreements evaluated in UC1-UC5.

## Prerequisites

This use case demonstrates the **creation** of an Agreement policy. No prior Agreement exists - we start from an Offer and end with a finalized Agreement stored in PAP.

## Component Files

This use case includes the following component example files:

**Phase 1: Negotiation (Offer → Agreement)**:

- [`offer-registration.json`](./offer-registration.json) - Initial Offer policy from provider (PNP input)
- [`pnp-offer.json`](./pnp-offer.json) - Offer being negotiated
- [`finalized-agreement.json`](./finalized-agreement.json) - Agreement result stored in PAP (with derivedFrom property)

**Phase 2: Agreement Enforcement**:

- [`pap-agreement.json`](./pap-agreement.json) - Same as finalized-agreement.json, showing PAP storage format
- [`pmp-policy-locator.json`](./pmp-policy-locator.json) - Agreement lookup with negotiation metadata
- [`pip-context.json`](./pip-context.json) - Runtime context with negotiation reference
- [`pdp-request.json`](./pdp-request.json) - PDP evaluation of negotiated Agreement
- [`pdp-decision.json`](./pdp-decision.json) - Decision for Agreement enforcement
- [`access-request.json`](./access-request.json) - Access request with negotiation reference

**Negotiation Flow**:

- [`consumer-request.json`](./consumer-request.json) - Consumer initiates negotiation
- [`contract-request-message.json`](./contract-request-message.json) - IDS message requesting contract
- [`contract-agreement-message.json`](./contract-agreement-message.json) - IDS message finalizing agreement

**Legacy/Reference**:

- [`policy.json`](./policy.json) - Original Offer policy
- [`expected-decision.json`](./expected-decision.json) - Legacy decision format

## Parties Involved

**Provider (Assigner)**:

- Identity: `did:iota:testnet:0xfcfa55894cab90504af7eaf38087addd5f77791a89bd3ebbe76d9c2b1a6ce567`
- Role: Polish veterinary agency (GIW)
- Resource: Veterinary certificate documents data resource
- Action: Registers Offer in PNP, evaluates negotiation requests

**Consumer (Assignee)**:

- Identity: `did:iota:testnet:0x1ee831611a9fe9877c82e05075d9670c4970b4fd0904c208082ee50e45817a9d`
- Role: Polish exporter seeking data access
- Attribute: Legal address with country code "PL"
- Action: Initiates negotiation, accepts Agreement

## Scenario Flow

### Phase 1: Policy Negotiation (This use case demonstrates)

#### 1. Offer Registration (Provider → PNP)

The veterinary agency registers an Offer policy in PNP specifying:

- **Target**: DataResource assets
- **Action**: read
- **Assignee**: PartyCollection refined by country code constraint
- **Constraint**: `twin:jsonpath:.legalAddress.countryCode` equals "PL"

The Offer is stored in PNP's registry and available for negotiation.

#### 2. Negotiation Initiation (Consumer → Provider PNP)

The Polish exporter discovers the Offer (via Federated Catalogue or direct query) and initiates a contract negotiation:

- References the Offer ID
- Provides consumer identity (DID)
- Includes consumer context (legal address with country code)
- Specifies callback address for negotiation events

**PNP State**: REQUESTED

#### 3. Negotiator Evaluation (Provider Side)

The Provider's registered Negotiator evaluates the negotiation request:

**Evaluation Steps**:

1. **Validate consumer identity**: Verify DID on IOTA blockchain
2. **Check constraint satisfaction**: Extract country code from consumer context ("PL")
3. **Evaluate refinement**: Consumer's country code matches Offer requirement
4. **Assess data sensitivity**: Standard data, no manual approval required
5. **Decision**: Accept as-is (no counter-offer needed)

**PNP State**: REQUESTED → OFFERED

#### 4. Offer Presentation (Provider → Consumer)

PNP sends the Offer details to the consumer's callback endpoint via Requester:

- Full Offer policy with all constraints
- Provider identity
- Negotiation ID for tracking

**Consumer Requester**: Receives offer callback, validates terms

#### 5. Agreement Acceptance (Consumer → Provider PNP)

Consumer reviews Offer terms and accepts:

- Sends acceptance message with negotiation ID
- Confirms agreement to all constraints
- Provides signature/authentication

**PNP State**: OFFERED → AGREED

#### 6. Agreement Finalization (PNP → PAP)

PNP transforms the Offer into an Agreement:

**Transformations**:

- Policy type: Offer → Agreement
- Assignee: PartyCollection → Specific DID (consumer identity)
- Agreement ID: Generated unique identifier
- Target: Remains as AssetCollection refinement (for asset class policies)

The finalized Agreement is persisted to PAP for runtime evaluation.

**PNP State**: AGREED → FINALIZED

**Consumer Requester**: Receives finalized callback with Agreement ID

### Phase 2: Runtime Access (Demonstrated in UC1)

Once the Agreement exists in PAP, the consumer can request access to veterinary certificates. The PDP evaluates the Agreement using the Policy Locator pattern (UC1), and PEP enforces the decision via PEP.

**Connection to UC1**: The `finalized-agreement.json` in this use case is the SAME policy used in `UC1/policy.json`.

## Architecture Components Used

### Phase 1: Policy Negotiation (This Use Case)

#### PNP (Policy Negotiation Point)

- Manages IDS Contract Negotiation state machine
- Coordinates message exchange between Provider and Consumer
- Handles state transitions: REQUESTED → OFFERED → AGREED → FINALIZED
- Invokes Negotiator for Provider-side evaluation
- Dispatches events to Requester for Consumer-side callbacks
- Finalizes Agreement and persists to PAP

#### Negotiator (Provider Extension Point)

- Evaluates negotiation requests against business rules
- Checks constraint satisfaction (country code validation)
- Determines if counter-offer is needed
- Can request PNAP manual approval (not used in this scenario)
- Returns decision: accept, counter, reject, pause

#### Requester (Consumer Extension Point)

- Receives lifecycle callbacks from PNP:
  - `offered`: Offer details presented
  - `agreed`: Agreement accepted by Provider
  - `finalized`: Agreement persisted, ready for use
  - `terminated`: Negotiation failed with reason
- Validates terms and coordinates consumer-side acceptance
- Manages consumer negotiation state

#### PAP (Policy Administration Point)

- Receives finalized Agreement from PNP
- Stores Agreement for runtime evaluation
- Provides read-only access to PMP during Phase 2

### Phase 2: Runtime Access (UC1-UC5)

Once the Agreement is in PAP, all Phase 2 components are used:

- **PMP**: Resolves Agreement using Policy Locator
- **PDP**: Evaluates constraints with PIP context
- **PIP**: Provides runtime assignee attributes
- **PEP**: Enforces PDP decisions
- **PEP/application code**: Cross-node data access with enforcement

## IDS Contract Negotiation State Machine

```
REQUESTED → OFFERED → AGREED → FINALIZED
    ↓           ↓         ↓
TERMINATED  TERMINATED  TERMINATED
```

**States**:

- **REQUESTED**: Consumer initiates, awaiting Provider evaluation
- **OFFERED**: Provider presents Offer (or counter-offer), awaiting Consumer acceptance
- **AGREED**: Consumer accepts, awaiting finalization
- **FINALIZED**: Agreement persisted to PAP, negotiation complete
- **TERMINATED**: Negotiation failed at any stage (with reason code)

**Transitions**:

1. Consumer initiates → REQUESTED
2. Negotiator accepts → OFFERED
3. Consumer accepts → AGREED
4. PNP persists to PAP → FINALIZED

**Error Paths**:

- Negotiator rejects → TERMINATED (reason: constraintViolation)
- Consumer rejects Offer → TERMINATED (reason: termsUnacceptable)
- Timeout → TERMINATED (reason: timeout)
- System error → TERMINATED (reason: technicalFailure)

## Expected Behavior

### Successful Negotiation Flow

1. **Offer Registration**: Provider registers Offer in PNP ✓
2. **Consumer Initiation**: Consumer starts negotiation with valid context ✓
3. **Negotiator Evaluation**: Country code "PL" matches Offer constraint ✓
4. **Offer Acceptance**: Consumer accepts terms without modification ✓
5. **Agreement Finalization**: Agreement stored in PAP with specific assignee ✓
6. **State**: FINALIZED with Agreement ID

### Failed Negotiation Scenarios

#### Scenario 1: Constraint Violation

- Consumer country code: "DE" (Germany)
- Negotiator evaluation: Country code ≠ "PL" ✗
- Decision: REJECT
- State: TERMINATED (reason: constraintViolation)

#### Scenario 2: Consumer Rejection

- Consumer reviews Offer terms
- Consumer rejects constraints as too restrictive
- State: TERMINATED (reason: termsUnacceptable)

#### Scenario 3: Negotiation Timeout

- Consumer initiates but never responds to Offer
- PNP timeout (configurable, e.g., 24 hours)
- State: TERMINATED (reason: timeout)

## Key Features Demonstrated

1. **IDS Contract Negotiation Protocol**: Full state machine implementation
2. **PNP Component**: Offer registration and negotiation coordination
3. **Negotiator Extension Point**: Provider-side evaluation with constraint checking
4. **Requester Callbacks**: Consumer-side lifecycle event handling
5. **Offer → Agreement Transformation**: Policy type change with assignee binding
6. **PAP Integration**: Agreement persistence for runtime evaluation
7. **PartyCollection → Specific Assignee**: Refinement resolution during negotiation
8. **State Machine Persistence**: Atomic state transitions with audit trail
9. **Connection to Phase 2**: Shows where UC1-UC5 Agreements originate

## ODRL Standards Utilized

- `IOdrlOffer` - Initial Offer policy registered by Provider
- `IOdrlAgreement` - Finalized Agreement with specific assignee
- `IOdrlPermission` - Permission rule with action and constraints
- `IOdrlPartyCollection` - Filtered party collection in Offer
- `IOdrlConstraint` - Refinement constraint (country code)
- Custom extension: `twin:jsonpath:` string format for property value extraction (e.g., `twin:jsonpath:.legalAddress.countryCode`)

## IDS Protocol Standards

- **ContractRequestMessage**: Consumer initiates negotiation
- **ContractOfferMessage**: Provider presents Offer
- **ContractAgreementMessage**: Consumer accepts terms
- **ContractNegotiationEventMessage**: State change notifications
- **ContractNegotiationTerminationMessage**: Negotiation failure

## Real-World Application

This negotiation pattern is used in:

- **Federated Data Catalogues**: Automated policy negotiation for data space participants
- **Data Marketplaces**: Consumer-initiated access requests with automated evaluation
- **B2B Data Sharing**: Bilateral agreements for cross-organization data exchange
- **Regulated Data Access**: Compliance-checked access to sensitive data (medical, financial)
- **Supply Chain Networks**: Partner-to-partner data sharing with jurisdiction constraints

## Testing Focus

- Verify PNP state machine transitions (REQUESTED → OFFERED → AGREED → FINALIZED)
- Test Negotiator evaluation logic with various consumer contexts
- Validate Requester callback delivery for all lifecycle events
- Ensure Offer → Agreement transformation preserves constraints
- Verify PAP storage of finalized Agreement
- Test constraint satisfaction evaluation (country code matching)
- Validate termination scenarios with proper reason codes
- Ensure atomicity of state transitions
- Verify connection to Phase 2 (UC1 can retrieve and evaluate Agreement)

## Extension Points

### Negotiator Customization

Implementers can extend Negotiator for:

- **Multi-constraint evaluation**: Combine temporal, geographic, attribute checks
- **Dynamic pricing**: Calculate usage fees based on consumer attributes
- **Counter-offer generation**: Modify constraints if initial Offer too restrictive
- **PNAP integration**: Request manual approval for sensitive data
- **Third-party verification**: Check external certification authorities

### Requester Customization

Implementers can extend Requester for:

- **Automated acceptance**: Auto-accept Offers matching pre-defined criteria
- **Terms negotiation**: Generate counter-proposals programmatically
- **Multi-provider coordination**: Manage negotiations with multiple Providers
- **Compliance validation**: Verify Offers meet organizational policies
- **Budget management**: Track negotiation costs and approvals

## Relationship to Other Use Cases

- **UC1 (Basic Data Resource Access)**: Uses the Agreement created in UC6
- **UC2-UC5**: All assume pre-existing Agreements that could be created via UC6
- **UC7 (Future)**: Would extend UC6 with PNAP manual intervention for sensitive data

**Critical Connection**: Without UC6, developers don't understand where UC1-UC5 Agreements come from. UC6 completes the policy lifecycle story.
