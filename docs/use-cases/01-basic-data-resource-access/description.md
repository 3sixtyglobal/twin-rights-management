# Use Case 1: Basic Data Resource Access (Veterinary Certificate)

> **Note**: TypeScript snippets in this document are illustrative examples showing conceptual flow. For exact API signatures, refer to the interface definitions in `rights-management-models/src/models/`.

## Business Context

A Polish veterinary agency (GIW) maintains a data resource containing veterinary certificates for agricultural exports. The agency wants to provide read access to these certificates, but only to exporters who are legally registered in Poland. This use case demonstrates geographic-based access control using ODRL PartyCollection with refinement constraints.

## Prerequisites

This use case assumes an Agreement policy already exists in PAP. The Agreement was created through one of:

- **Policy Negotiation** (Phase 1): IDS Contract Negotiation between provider and consumer (see UC6)
- **Administrative Creation**: Data provider directly creates Agreement in PAP
- **Automated Onboarding**: Federated Catalogue registration generates default policies

For this scenario, the veterinary agency has already created an Agreement policy allowing read access to Polish exporters.

## Component Files

This use case includes the following component example files that demonstrate the data flow and interactions:

**Policy Storage (PAP)**:

- [`pap-agreement.json`](./pap-agreement.json) - Agreement policy stored in PAP with metadata for indexing and lookup

**Policy Lookup (PMP)**:

- [`pmp-policy-locator.json`](./pmp-policy-locator.json) - How PMP queries PAP to find matching policies

**Runtime Context (PIP)**:

- [`pip-context.json`](./pip-context.json) - Runtime facts provided by PIP for constraint evaluation

**Policy Decision (PDP)**:

- [`pdp-request.json`](./pdp-request.json) - Request sent to PDP for policy evaluation
- [`pdp-decision.json`](./pdp-decision.json) - PDP decision with dataDecisions array showing granular access control

**Access Request**:

- [`access-request.json`](./access-request.json) - Initial access request format used by PMP

**Legacy/Reference**:

- [`policy.json`](./policy.json) - Agreement policy (also stored in PAP)
- [`expected-decision.json`](./expected-decision.json) - Legacy decision format (replaced by pdp-decision.json)

## Parties Involved

**Assigner (Data Provider)**:

- Identity: `did:iota:testnet:0xfcfa55894cab90504af7eaf38087addd5f77791a89bd3ebbe76d9c2b1a6ce567`
- Role: Polish veterinary agency (GIW)
- Resource: Veterinary certificate documents data resource

**Assignee (Data Consumer)**:

- Identity: `did:iota:testnet:0x1ee831611a9fe9877c82e05075d9670c4970b4fd0904c208082ee50e45817a9d`
- Role: Polish exporter
- Attribute: Legal address with country code "PL"

## Scenario Flow

### Phase 1: Agreement Creation (Prior to this use case - see UC6)

An Agreement policy was created and stored in PAP specifying that read access to veterinary certificates is granted to parties whose legal address country code equals "PL".

### Phase 2: Data Access (This use case demonstrates)

#### 1. Access Request (Application Code → PEP)

An exporter requests access to the veterinary certificate data resource:

**Application Code Entry Point**:

- Application code (local or remote node) calls PEP with access request
- Request includes: node identity, asset type, action, resource ID
- PEP validates authentication and orchestrates enforcement pipeline

**Implementation Options**:

- Cross-node access: Remote node's application code calls PEP via API
- Local access: Internal component calls `pep.intercept()` directly

For this use case, we demonstrate application code calling PEP.

#### 2. Policy Resolution (PMP → PDP)

**Policy Management Point (PMP)**:

- Translates access request into PAP query using Policy Locator:
  - `assetType`: "DataResource"
  - `action`: "read"
  - `resourceId`: "https://twin.example.org/data-resources/vet-cert-doc-6ce567"
  - `assignee`: "did:iota:testnet:0x1ee..."
- Queries PAP and returns the matching Agreement policy

**Policy Information Point (PIP)**:

- Aggregates contextual facts from registered Information Sources:
  - Current date/time
  - Assignee attributes (legal address with country code from identity system)
  - Resource attributes (from data handler)
  - Environment attributes (network, location)

**Policy Decision Point (PDP)**:

- Orchestrates evaluation pipeline:
  1. Invoke PXP `before` actions (pre-evaluation hooks)
  2. Pass Agreement + PIP context to registered Arbiters
  3. Arbiters evaluate PartyCollection refinement constraint (`.legalAddress.countryCode` eq "PL")
  4. Normalize and merge Arbiter decisions
  5. Invoke PXP `after` actions (telemetry, obligations)
  6. Return decision: **Permit** (country code matches) or **Deny** (doesn't match)

#### 3. Decision Enforcement (PEP)

PEP applies PDP decision to data access:

- If **deny**: Raise enforcement exception, no data returned
- If **permit**: Proceed to Handler execution

## PEP Integration

This use case demonstrates application code calling PEP for access enforcement.

### Application Code Pattern

The veterinary agency's application code calls PEP for data access:

```typescript
// Application code (local or remote)
async function getDataResource(
  resourceId: string,
  requestingNode: string
): Promise<IJsonLdNodeObject> {
  // Application calls PEP with access request
  const pepResult = await pep.intercept({
    action: 'read',
    assetType: 'DataResource',
    resourceId: resourceId,
    assignee: requestingNode,
    // Optional: include data for post-action transformation
    data: null
  });

  if (pepResult.decision === 'Permit') {
    // Retrieve data and apply PEP transformations
    const certificate = await storage.getDocument(resourceId);
    return pepResult.transformedData || certificate;
  } else {
    throw new UnauthorizedError('Access denied');
  }
}
```

### Access Flow via PEP

1. **Application code initiates request**:

   ```typescript
   // Remote or local application code
   const cert = await getDataResource('vet-cert-doc-6ce567', 'did:iota:testnet:0x1ee...');
   ```

2. **Application calls PEP**:
   - Validates authentication (node-to-node or user authentication)
   - Constructs access request with Policy Locator

3. **PEP orchestrates enforcement pipeline**:
   - Pre-action: Authorization check
   - PEP → PMP → PDP evaluation
   - PMP resolves Agreement from PAP
   - PDP evaluates with PIP context
   - Decision: Permit or Deny

4. **Application retrieves data** (only if permitted):
   - Application's logic retrieves certificate from storage

5. **PEP applies post-action transformations**:
   - Data transformation (filtering, redaction)
   - Returns final transformed data

6. **Application returns result**:
   - Returns authorized and transformed data to caller

### Enforcement Points

| Application Operation | Pre-Action            | Post-Action             | Effect                                |
| --------------------- | --------------------- | ----------------------- | ------------------------------------- |
| `getDataResource()`   | `use` (authorization) | `read` (transformation) | Permit/Deny + optional data filtering |

**Why PEP?**

- Application code maintains control of data access flow
- PEP provides centralized enforcement without tying to specific transport
- Consistent authorization across all asset types and access patterns

## Expected Behavior

### Successful Access (Country Code = "PL")

- PDP evaluates constraint: `.legalAddress.countryCode` equals "PL" ✓
- Decision: **Permit**
- Enforcement: Grant read access to veterinary certificates

### Failed Access (Country Code ≠ "PL")

- PDP evaluates constraint: `.legalAddress.countryCode` not equals "PL" ✗
- Decision: **Deny**
- Enforcement: Access denied, no data returned

## Architecture Components Used

### Phase 1: Policy Negotiation (Prior to this use case - see UC6)

- **PNP**: Created Agreement through IDS Contract Negotiation
- **PAP**: Stored finalized Agreement policy

### Phase 2: Access Evaluation (This use case demonstrates)

#### Application Code

- Initiates access request (local or remote)
- Calls PEP for authorization and enforcement
- Retrieves and returns data based on PEP decision

#### PEP (Policy Enforcement Point)

- Pre-action: Authorization check (action: `use`)
- Post-action: Data transformation (action: `read`)
- Applies Enforcement Processors sequentially

#### PDP (Policy Decision Point)

- Orchestrates evaluation pipeline
- Coordinates PMP, PIP, PXP, and Arbiters
- Returns authoritative decision

#### PMP (Policy Management Point)

- Translates Policy Locator into PAP query
- Returns matching Agreement policy

#### PIP (Policy Information Point)

- Aggregates contextual facts from Information Sources
- Provides assignee attributes (country code)

#### PXP (Policy Execution Point)

- Pre-evaluation hooks (context enrichment, telemetry)
- Post-evaluation hooks (obligation scheduling, metrics)

#### PAP (Policy Administration Point)

- Stores Agreement policy
- Provides read-only access to PMP

## Key Features Demonstrated

1. **ODRL Agreement Policy**: Bilateral policy with specific assigner and assignee pattern (PartyCollection)
2. **PartyCollection with Refinement**: Filters assignees based on attributes rather than specific identities
3. **JSON Path Selectors**: Custom ODRL extension using string format `twin:jsonpath:` for extracting nested attribute values (`.legalAddress.countryCode`)
4. **Geographic Constraints**: Country-based access control for cross-border data sharing
5. **Simple Read Permission**: Grant/deny decision without data filtering or transformation

## ODRL Standards Utilized

- `IOdrlAgreement` - Agreement policy type
- `IOdrlPermission` - Permission rule
- `IOdrlPartyCollection` - Filtered party collection
- `IOdrlConstraint` - Refinement constraint with leftOperand, operator, rightOperand
- Custom extension: `twin:jsonPathSelector` for property value extraction

## Real-World Application

This pattern is commonly used in:

- **Cross-border trade**: Restricting access to trade documents based on participant jurisdiction
- **Regional compliance**: Ensuring data access aligns with regional data protection regulations
- **Geographic licensing**: Granting access based on geographic location or registration
- **Federated catalogues**: Enabling discovery and access control for distributed data resources

## Testing Focus

- Verify PartyCollection refinement evaluation logic
- Test JSON Path selector extraction from PIP context
- Validate permit decision when constraint is satisfied
- Validate deny decision when constraint is not satisfied
- Ensure decision is based on assignee attributes, not hardcoded identities
