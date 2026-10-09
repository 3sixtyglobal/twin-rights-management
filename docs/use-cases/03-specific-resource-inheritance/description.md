# Use Case 3: Specific Resource Access with Policy Inheritance

> **Note**: TypeScript snippets in this document are illustrative examples showing conceptual flow. For exact API signatures, refer to the interface definitions in `rights-management-models/src/models/`.

## Business Context

A logistics provider maintains consignment records and wants to implement a layered access control model. There is a general policy that applies to all consignments (asset class policy), and specific consignments can have additional or overriding policies. This use case demonstrates ODRL policy inheritance, showing how a specific resource (`CONS000001`) inherits access rules from its asset class (`Consignment`), and how the PDP evaluates both policies to make an access decision.

## Prerequisites

This use case assumes TWO policies already exist in PAP:

1. **Asset Class Policy (Set)**: Created through administrative action or automated onboarding
   - Applies to all Consignment resources
   - No specific parties (assigner/assignee)
   - General constraints that establish baseline access rules

2. **Specific Resource Policy (Agreement)**: Created through one of:
   - **Policy Negotiation** (Phase 1): IDS Contract Negotiation between provider and partner (see UC6)
   - **Administrative Creation**: Provider directly creates Agreement in PAP
   - **Time-Limited Access Grant**: Provider issues temporary access for specific consignment

For this scenario, the logistics provider has already created:

- A Set policy for all Consignments (purpose-based constraint)
- An Agreement policy for CONS000001 (temporal constraint + purpose constraint inherited from Set)

## Component Files

This use case includes the following component example files:

**ODRL Policies (W3C Standard Format)**:

- [`policy-set-asset-class.json`](./policy-set-asset-class.json) - Asset class policy (Set) applying to all Consignments
- [`policy-agreement-specific-resource.json`](./policy-agreement-specific-resource.json) - Specific resource policy (Agreement) for CONS000001

**Policy Storage (PAP)**:

- [`pap-agreement.json`](./pap-agreement.json) - Policy hierarchy with Set (asset-class) + Agreement (specific-resource) and inheritance metadata

**Policy Lookup (PMP)**:

- [`pmp-policy-locator.json`](./pmp-policy-locator.json) - Hierarchical lookup showing policy inheritance sequence

**Runtime Context (PIP)**:

- [`pip-context.json`](./pip-context.json) - Temporal and purpose attributes for multi-constraint evaluation

**Policy Decision (PDP)**:

- [`pdp-request.json`](./pdp-request.json) - Specific resource evaluation with inheritance
- [`pdp-decision.json`](./pdp-decision.json) - Decision with inherited constraints evaluation

**Access Request**:

- [`access-request.json`](./access-request.json) - Specific resource access request

**Legacy/Reference**:

- [`expected-decision.json`](./expected-decision.json) - Legacy decision format

## Parties Involved

**Assigner (Data Provider)**:

- Identity: `did:iota:testnet:0x1ee831611a9fe9877c82e05075d9670c4970b4fd0904c208082ee50e45817a9d`
- Role: Logistics company managing consignment data
- Resources: Consignment asset class + specific consignment CONS000001

**Assignee (Data Consumer)**:

- Identity: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- Role: Logistics partner with specific access agreement
- Attributes: Purpose = "logistics-operation"

## Scenario Flow

### Phase 1: Policy Lifecycle (Prior to Access Request)

TWO policies already exist in PAP:

#### Asset Class Policy (Set)

Created through administrative action:

- Type: `IOdrlSet` (applies to asset class, no specific parties)
- Target: `"Consignment"` (asset class string)
- Action: `"read"`
- Constraint: Purpose equals `"logistics-operation"`
- Applies to ALL consignments by default

#### Specific Resource Policy (Agreement)

Created through negotiation or administrative action:

- Type: `IOdrlAgreement` (bilateral with specific partner)
- Assignee: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- Target: `{ uid: "https://twin.example.org/consignments/CONS000001" }` (specific resource)
- Action: `"read"`
- Constraint: Temporal (valid until 2025-12-31T23:59:59Z) + inherited purpose constraint
- Extends the asset class policy with additional temporal restriction

### Phase 2: Access Request and Evaluation (Runtime)

#### 1. Access Request

The logistics partner's application code sends a read request for specific consignment:

```typescript
// Remote consumer node
const darp = ComponentFactory.get<IDataAccessRequestPoint>('data-access-request-point');

const consignment = await darp.get(
  'https://logistics-provider.example.org/api/dap/consignment/CONS000001',
  'Consignment',
  'CONS000001'
);
```

#### 2. Policy Locator Construction (PMP)

The application's integrated PMP constructs a Policy Locator:

- **assetType**: `"Consignment"` (for asset class policy matching)
- **action**: `"read"`
- **assignee**: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- **resourceId**: `"https://twin.example.org/consignments/CONS000001"` (for specific policy matching)

#### 3. Policy Evaluation (PDP) - Layered Inheritance

The PDP performs hierarchical evaluation with BOTH policies:

##### Step 1: Query PAP for Matching Policies

- PMP queries PAP with Policy Locator
- PAP returns TWO policies:
  - Set policy (matches assetType + action)
  - Agreement policy (matches assetType + action + resourceId + assignee)

##### Step 2: Evaluate Asset Class Policy (Set)

```typescript
// INTERNAL PDP PROCESS (not application code):
// PDP evaluates Set policy first with PIP context
const pipContext = {
  assigneeAttributes: { purpose: 'logistics-operation' },
  currentDateTime: '2025-10-01T10:00:00Z'
};
// Constraint: purpose === "logistics-operation" ✓
// Result: Permit (base permission granted)
```

##### Step 3: Evaluate Specific Resource Policy (Agreement)

```typescript
// INTERNAL PDP PROCESS (not application code):
// PDP evaluates Agreement policy with PIP context
// Constraint 1: currentDateTime <= "2025-12-31T23:59:59Z" ✓
// Constraint 2: purpose === "logistics-operation" (inherited) ✓
// Result: Permit (specific permission granted)
```

##### Step 4: Combine Results (Inheritance Logic)

- Both policies evaluate to Permit
- Agreement (specific) takes precedence over Set (general)
- Final decision: **Permit** with specific policy obligations/duties

#### 4. Data Access with Enforcement (PEP + PEP)

The application's registered handler executes the read operation:

```typescript
// Provider node's PEP handler
dap.registerHandler('consignment-handler', {
  supportedAssetTypes(): string[] {
    return ['Consignment'];
  },

  async get(assetType: string, id: string): Promise<IJsonLdNodeObject> {
    // Retrieve specific consignment from storage
    const consignment = await storage.getConsignment(id);
    return consignment;
    // PEP applies PEP pre-action authorization (already done: Permit)
    // Returns consignment data to consumer
  }
});
```

#### 5. application code Receives Data

The consumer's application code receives the consignment data:

```typescript
// Consumer receives CONS000001 data
console.log(consignment); // Complete consignment object
```

## Expected Behavior

### Successful Access (All Constraints Satisfied)

- Asset class constraint: Purpose = "logistics-operation" ✓
- Specific resource constraint: Date ≤ 2025-12-31 ✓
- **Result**: Access granted to CONS000001

### Failed Access Scenarios

#### Scenario A: Wrong Purpose

- Asset class constraint: Purpose ≠ "logistics-operation" ✗
- **Result**: Access denied (base policy not satisfied)

#### Scenario B: Expired Specific Policy

- Asset class constraint: Satisfied ✓
- Specific resource constraint: Date > 2025-12-31 ✗
- **Result**: Access denied (specific policy expired)

#### Scenario C: Different Consignment

- Request for CONS000002 (different consignment)
- Only asset class policy applies (no specific policy)
- Evaluate based on asset class constraints only

## PEP Integration (Cross-Node Data Access with Inheritance)

### Provider Node Setup

The logistics provider's PEP exposes consignment data with automatic PEP enforcement and policy inheritance:

```typescript
import { ComponentFactory } from '@3sixty/framework';
import type { IDataAccessPoint } from '@3sixty/rights-management-models';

// Initialize PEP with PEP integration
const dap = ComponentFactory.get<IDataAccessPoint>('data-access-point');

// Register Consignment read handler
dap.registerHandler('consignment-handler', {
  supportedAssetTypes(): string[] {
    return ['Consignment'];
  },

  async get(assetType: string, id: string): Promise<IJsonLdNodeObject> {
    // Handler retrieves specific consignment from storage
    const consignment = await storage.getConsignment(id);

    return consignment;

    // PEP automatically invokes PEP pre-action authorization:
    // 1. PMP constructs Policy Locator with resourceId (specific) + assetType (class)
    // 2. PAP returns BOTH Set policy + Agreement policy
    // 3. PDP evaluates BOTH policies with inheritance logic
    // 4. PEP enforces combined decision (Agreement takes precedence)
    // 5. If Permit: continue; if Deny: throw UnauthorizedError
  }
});

// Expose PEP via REST endpoint
app.get('/api/dap/consignment/:id', async (req, res) => {
  const result = await dap.read('Consignment', req.params.id, req.body.credentials);
  res.json(result);
});
```

### Consumer Node Setup

The logistics partner's application code reads specific consignment:

```typescript
import { ComponentFactory } from '@3sixty/framework';
import type { IDataAccessRequestPoint } from '@3sixty/rights-management-models';

// Initialize application code for remote queries
const darp = ComponentFactory.get<IDataAccessRequestPoint>('data-access-request-point');

// Application code reads specific consignment
async function getConsignmentDetails(consignmentId: string): Promise<IConsignment> {
  const consignment = await darp.get(
    `https://logistics-provider.example.org/api/dap/consignment/${consignmentId}`,
    'Consignment',
    consignmentId
  );

  // Returns consignment data if BOTH policies permit access
  // Asset class policy: purpose constraint ✓
  // Specific resource policy: temporal constraint + inherited purpose ✓
  return consignment as IConsignment;
}
```

### Policy Inheritance Flow

1. **Consumer Request**: application code sends read request with resourceId + credentials
2. **Policy Locator**: PMP constructs locator with BOTH resourceId (specific) + assetType (class)
3. **Policy Retrieval**: PAP returns TWO policies (Set + Agreement)
4. **Layered Evaluation**: PDP evaluates BOTH policies:
   - Set policy: Evaluates base constraints (purpose)
   - Agreement policy: Evaluates specific constraints (temporal) + inherited constraints
5. **Inheritance Logic**: PDP combines results (Agreement takes precedence if both permit)
6. **Authorization**: PEP permits or denies based on combined evaluation
7. **Data Return**: If permitted, handler returns consignment data

This pattern ensures:

- **Hierarchical Access Control**: General rules with specific overrides
- **Policy Reuse**: Asset class policies apply to all resources by default
- **Flexible Granularity**: Can define broad policies and refine for specific resources
- **Temporal Access**: Time-limited access to specific resources with inherited base rules

## Architecture Components Used

### Phase 1 Components (Policy Lifecycle)

#### PAP (Policy Administration Point)

- Stores TWO policies: Set (asset class) + Agreement (specific resource)
- Manages policy hierarchy and version control
- Indexes policies by both assetType (class) and resourceId (specific)
- Returns multiple matching policies when queried with resourceId

### Phase 2 Components (Runtime Access Control)

#### Application Code - Consumer Side

- Client-side component on logistics partner's node
- Sends authenticated read requests to remote API endpoints
- Includes resourceId for specific resource access
- Receives data if layered evaluation permits access

#### Application Code - Provider Side

- Server-side unified data access interface on logistics provider's node
- Registers handlers for specific asset types (Consignment)
- Automatically integrates PEP enforcement with inheritance support
- Invokes PMP with resourceId to trigger layered policy retrieval

#### PMP (Policy Management Point)

- Constructs Policy Locator with BOTH resourceId + assetType
- Queries PAP for matching policies (returns multiple when resourceId provided)
- Returns Set policy + Agreement policy to PDP for layered evaluation

#### PDP (Policy Decision Point)

- Performs layered policy evaluation with inheritance logic
- Evaluates Set policy (asset class) first
- Evaluates Agreement policy (specific resource) second
- Implements precedence rules: Agreement > Set
- Combines constraint evaluations from both policies
- Coordinates with PIP to obtain runtime context for both evaluations

#### PIP (Policy Information Point)

- Provides assignee attributes (purpose context: "logistics-operation")
- Supplies current dateTime for temporal constraint evaluation
- Aggregates runtime context for BOTH policy evaluations

#### PEP (Policy Enforcement Point)

- Enforces combined decision from layered evaluation
- Applies precedence logic (specific overrides general)
- Controls access to specific consignment resource (CONS000001)
- Integrated within application's read operation flow

## Key Features Demonstrated

1. **Policy Inheritance**: Specific resources inherit policies from their asset class
2. **Layered Policy Evaluation**: PDP evaluates both asset class and resource-specific policies
3. **IOdrlSet vs IOdrlAgreement**: Set for general rules, Agreement for specific parties
4. **Policy Locator Matching**: Queries with resourceId match specific policies, assetType matches class policies
5. **Temporal Constraints**: Time-limited access using dateTime constraints
6. **Policy Precedence**: More specific policies take precedence over general policies

## ODRL Standards Utilized

- `IOdrlSet` - Asset class policy (no specific parties)
- `IOdrlAgreement` - Specific resource policy (bilateral)
- `IOdrlPermission` - Permission rules in both policies
- `IOdrlConstraint` - Purpose-based and temporal constraints
- Asset targeting: String (asset class) vs Object with uid (specific resource)

## Real-World Application

This pattern is commonly used in:

- **Hierarchical access control**: General policies with specific overrides
- **Time-limited access**: Grant temporary access to specific resources
- **Partner agreements**: General data sharing with specific bilateral agreements
- **Compliance**: Ensure general compliance rules with audit-specific policies

## Testing Focus

- Verify asset class policy matching when no resourceId provided
- Test specific resource policy matching when resourceId is provided
- Validate layered evaluation (both policies evaluated)
- Ensure specific policy constraints are checked in addition to class constraints
- Test policy precedence (specific overrides general)
- Confirm temporal constraint evaluation from PIP current dateTime
- Test scenario where specific policy exists but asset class policy fails
