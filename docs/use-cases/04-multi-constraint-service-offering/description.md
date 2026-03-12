# Use Case 4: Multi-Constraint Service Offering Access

> **Note**: TypeScript snippets in this document are illustrative examples showing conceptual flow. For exact API signatures, refer to the interface definitions in `rights-management-models/src/models/`.

## Business Context

A service provider offers API access to their veterinary certificate lookup service. Access to this service requires multiple conditions to be satisfied simultaneously: the request must occur within a valid time period (temporal constraint), and the requesting organization must possess required security certifications (attribute constraint). This use case demonstrates complex constraint evaluation with AND logic, `permission` action type (simple grant/deny without data return), and multiple constraint types working together.

## Prerequisites

This use case assumes an Agreement policy already exists in PAP. The Agreement was created through one of:

- **Policy Negotiation** (Phase 1): IDS Contract Negotiation between service provider and consumer (see UC6)
- **Administrative Creation**: Service provider directly creates Agreement in PAP
- **Service Subscription**: Automated Agreement generation upon service subscription

For this scenario, the veterinary authority has already created an Agreement policy with the partner organization that includes:

- Temporal constraints (valid from 2025-01-01 to 2025-12-31)
- Certification constraints (requires ISO27001 OR SOC2)
- Service offering target (API access permission)

## Component Files

This use case includes the following component example files:

**Policy Storage (PAP)**:

- [`pap-agreement.json`](./pap-agreement.json) - ServiceOffering with multiple constraints and temporal metadata

**Policy Lookup (PMP)**:

- [`pmp-policy-locator.json`](./pmp-policy-locator.json) - ServiceOffering lookup with temporal filtering

**Runtime Context (PIP)**:

- [`pip-context.json`](./pip-context.json) - Temporal and certification attributes for multi-constraint evaluation

**Policy Decision (PDP)**:

- [`pdp-request.json`](./pdp-request.json) - Service access evaluation request
- [`pdp-decision.json`](./pdp-decision.json) - Multiple constraints with AND logic evaluation

**Access Request**:

- [`access-request.json`](./access-request.json) - Service offering access request

**Legacy/Reference**:

- [`policy.json`](./policy.json) - Agreement policy
- [`expected-decision.json`](./expected-decision.json) - Legacy decision format

## Parties Involved

**Assigner (Service Provider)**:

- Identity: `did:iota:testnet:0xfcfa55894cab90504af7eaf38087addd5f77791a89bd3ebbe76d9c2b1a6ce567`
- Role: Veterinary authority providing certificate lookup API
- Service: API access to veterinary certificate database

**Assignee (Service Consumer)**:

- Identity: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- Role: Authorized partner organization
- Attributes: Certifications = ["ISO27001", "SOC2"]

## Scenario Flow

### Phase 1: Policy Lifecycle (Prior to Access Request)

The Agreement policy already exists in PAP through negotiation or administrative creation:

**Agreement Policy Structure**:

- Type: `IOdrlAgreement` (bilateral with specific partner)
- Assignee: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- Target: ServiceOffering (API access)
- Action: `"use"` (permission action, not data retrieval)
- Constraints (ALL must be satisfied - implicit AND logic):
  - **Temporal Constraint 1**: Access valid from 2025-01-01T00:00:00Z
  - **Temporal Constraint 2**: Access valid until 2025-12-31T23:59:59Z
  - **Attribute Constraint**: Organization certifications include ISO27001 OR SOC2

### Phase 2: Access Request and Evaluation (Runtime)

#### 1. Access Request

The partner organization's application requests API access through the enforcement pipeline:

```typescript
// ILLUSTRATIVE: Permission check concept
// Actual implementation: Service access triggers PEP enforcement during handler execution
// The PDP evaluates all constraints (temporal + certification) with AND logic
// Returns permit/deny decision based on constraint satisfaction
```

#### 2. Policy Locator Construction (PMP)

The application's integrated PMP constructs a Policy Locator:

- **assetType**: `"ServiceOffering"`
- **action**: `"use"` (permission check, not data operation)
- **assignee**: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- **resourceId**: `"https://twin.example.org/services/vet-cert-lookup-api"`

#### 3. Policy Evaluation (PDP) - Multi-Constraint AND Logic

The PDP evaluates ALL constraints with AND logic:

##### Step 1: Retrieve Agreement Policy

```typescript
// PMP queries PAP with Policy Locator
const policy = await pap.getPolicy({
  assetType: 'ServiceOffering',
  action: 'use',
  assignee: 'did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246',
  resourceId: 'https://twin.example.org/services/vet-cert-lookup-api'
});
// Returns Agreement with 3 constraints
```

##### Step 2: Evaluate Temporal Constraints

```typescript
// INTERNAL PDP PROCESS (not application code):
// PDP obtains current dateTime from PIP context
const currentDateTime = /* PIP provides from time source */ '2025-09-30T10:00:00Z';

// Constraint 1: gteq (greater than or equal)
const constraint1 = currentDateTime >= '2025-01-01T00:00:00Z'; // ✓ true

// Constraint 2: lteq (less than or equal)
const constraint2 = currentDateTime <= '2025-12-31T23:59:59Z'; // ✓ true
```

##### Step 3: Evaluate Attribute Constraint

```typescript
// INTERNAL PDP PROCESS (not application code):
// PDP obtains assignee certifications from PIP context
const assigneeCerts = /* PIP provides from identity source */ ['ISO27001', 'SOC2'];

// Constraint 3: isAnyOf (set membership)
const requiredCerts = ['ISO27001', 'SOC2'];
const constraint3 = assigneeCerts.some(cert => requiredCerts.includes(cert)); // ✓ true
```

##### Step 4: Combine Constraint Results (AND Logic)

```typescript
// INTERNAL PDP PROCESS (not application code):
// All constraints must evaluate to true
const finalDecision = constraint1 && constraint2 && constraint3; // true
// Result: Permit
```

#### 4. Permission Enforcement (PEP)

The PEP enforces the decision:

```typescript
// ILLUSTRATIVE: Permission enforcement concept
// If all constraints satisfied → Permit (issue API access token)
// If any constraint fails → Deny (throw UnauthorizedError)
// Service-specific handler would implement token issuance logic
```

#### 5. Service Usage

The consumer uses the API with the granted permission:

```typescript
// Consumer makes API calls with access token
const certificates = await apiClient.searchCertificates({
  accessToken,
  query: { country: 'PL', status: 'valid' }
});
```

## Expected Behavior

### Successful Access (All Constraints Satisfied)

- Temporal constraints: Current date within valid range ✓
- Certification constraint: Possesses required certification ✓
- **Result**: Permission granted, API access allowed

### Failed Access Scenarios

#### Scenario A: Before Valid Period

- Current date: 2024-12-15
- Temporal constraint 1: 2024-12-15 < 2025-01-01 ✗
- **Result**: Permission denied (not yet valid)

#### Scenario B: After Valid Period

- Current date: 2026-01-15
- Temporal constraint 2: 2026-01-15 > 2025-12-31 ✗
- **Result**: Permission denied (expired)

#### Scenario C: Missing Required Certification

- Assignee certifications: ["ISO9001"]
- Certification constraint: No overlap with ["ISO27001", "SOC2"] ✗
- **Result**: Permission denied (insufficient certifications)

#### Scenario D: Partial Satisfaction

- Temporal constraints: Satisfied ✓
- Certification constraint: Not satisfied ✗
- **Result**: Permission denied (all constraints must be satisfied)

## PEP Integration (Service Access Permission)

### Provider Node Setup

The service provider's API endpoint uses PEP with automatic enforcement:

```typescript
import { ComponentFactory } from '@twin.org/framework';
import type { IDataAccessPoint } from '@twin.org/rights-management-models';

// ILLUSTRATIVE: Service access control concept
// Actual implementation would use PEP handlers with standard CRUD operations
// PEP enforcement happens automatically during handler execution
// Multi-constraint evaluation (temporal + certification) occurs in PDP
// Permit/Deny decision controls service access (e.g., API token issuance)

// Example: Service handler that triggers enforcement
dap.registerHandler('service-offering-handler', {
  supportedAssetTypes(): string[] {
    return ['ServiceOffering'];
  },

  async get(assetType: string, id: string): Promise<IJsonLdNodeObject> {
    // PEP invokes PEP pre-action: evaluates ALL constraints
    // If denied: throws UnauthorizedError before reaching here
    // If permitted: returns service access details (e.g., API endpoint, token)
    return {
      serviceId: id,
      endpoint: 'https://api.example.org/vet-certificates',
      accessGranted: true
    };
  }
});
```

### Consumer Node Setup

The partner organization accesses the service:

```typescript
import { ComponentFactory } from '@twin.org/framework';
import type { IDataAccessRequestPoint } from '@twin.org/rights-management-models';

// ILLUSTRATIVE: Service access concept
// Actual implementation: application code calls provider's PEP handler
// PEP enforcement occurs automatically on provider side
// If constraints satisfied: service details returned
// If constraints fail: UnauthorizedError thrown

async function accessVetCertAPI(): Promise<void> {
  const darp = ComponentFactory.get<IDataAccessRequestPoint>('data-access-request-point');

  // Access service offering (triggers enforcement)
  const serviceDetails = await darp.get(
    'https://provider.example.org/api/dap/service-offering',
    'ServiceOffering',
    'vet-cert-lookup-api'
  );

  // If we reach here, all constraints were satisfied
  // Use the service with granted permission
  await apiClient.searchCertificates({
    endpoint: serviceDetails.endpoint,
    query: { country: 'PL' }
  });
}
```

### Multi-Constraint Permission Flow

1. **Consumer Request**: Application requests permission to use service
2. **Policy Locator**: PMP constructs locator with ServiceOffering + action="use"
3. **Policy Retrieval**: PAP returns Agreement with 3 constraints
4. **Constraint Evaluation**: PDP evaluates ALL constraints with AND logic:
   - Temporal 1: currentDateTime >= validFrom ✓
   - Temporal 2: currentDateTime <= validUntil ✓
   - Attribute: assignee certifications include required cert ✓
5. **Combined Decision**: All constraints true → Permit
6. **Permission Enforcement**: PEP returns permit decision (no data operations)
7. **Service Access**: Consumer uses service with granted permission

This pattern ensures:

- **Multi-Factor Authorization**: Multiple conditions must be satisfied
- **Time-Limited Access**: Temporal constraints enforce validity periods
- **Certification-Based Access**: Attribute constraints verify qualifications
- **Simple Grant/Deny**: Permission actions don't involve data transformation
- **API Gateway Integration**: Supports service access control patterns

## Architecture Components Used

### Phase 1 Components (Policy Lifecycle)

#### PAP (Policy Administration Point)

- Stores Agreement policy with multiple constraints (temporal + attribute)
- Manages policy lifecycle and constraint versioning
- Indexes policies by ServiceOffering asset type

### Phase 2 Components (Runtime Access Control)

#### Application Code - Provider Side

- Server-side permission check interface on service provider's node
- Registers permission handlers for specific asset types (ServiceOffering)
- Automatically integrates PEP enforcement with multi-constraint evaluation
- Returns simple permit/deny decisions (no data operations)

#### PMP (Policy Management Point)

- Constructs Policy Locator from permission check request
- Queries PAP for matching Agreement policy
- Returns policy with all constraints to PDP for evaluation

#### PDP (Policy Decision Point)

- Evaluates ALL constraints with implicit AND logic
- Coordinates with PIP to obtain runtime context:
  - Current dateTime for temporal constraint evaluation
  - Assignee certifications for attribute constraint evaluation
- Combines constraint results: ALL must be true for Permit
- Returns simple permit/deny decision (no data payload)

#### PIP (Policy Information Point)

- Provides current system dateTime for temporal constraint evaluation
- Supplies assignee certification attributes from identity system
- Provides organizational attributes for constraint matching
- Aggregates runtime context for all constraint types

#### PEP (Policy Enforcement Point)

- Enforces simple permit/deny decision
- No data filtering or transformation (permission action, not view)
- Controls service access (e.g., API gateway, token issuance)
- Integrated within application's permission check operation flow

## Key Features Demonstrated

1. **Multiple Constraint Types**: Temporal (dateTime) + Attribute (certifications) in single policy
2. **Implicit AND Logic**: All constraints must be satisfied for permission grant
3. **Permission Action**: Simple grant/deny without data return (vs `view` which returns data)
4. **Temporal Constraints**: Date range validation using `gteq` and `lteq` operators
5. **Array Matching**: `isAnyOf` operator for checking certification membership
6. **JSON Path Selectors**: Custom property extraction for certification checking

## ODRL Standards Utilized

- `IOdrlAgreement` - Bilateral agreement policy
- `IOdrlPermission` - Permission rule with multiple constraints
- `IOdrlConstraint` - Multiple constraint instances with different leftOperands
- Constraint operators: `gteq` (greater than or equal), `lteq` (less than or equal), `isAnyOf` (set membership)
- Custom extension: `twin:jsonpath:` string format for certification property extraction (e.g., `twin:jsonpath:.certifications`)

## Real-World Application

This pattern is commonly used in:

- **API access control**: Time-limited API access with certification requirements
- **Service subscriptions**: Subscription-based services with validity periods
- **Compliance-based access**: Services requiring security certifications or regulatory compliance
- **Partner agreements**: Bilateral service agreements with multiple preconditions
- **Time-bound licensing**: Software or service licenses with expiration dates

## Testing Focus

- Verify multiple constraint evaluation with AND logic
- Test temporal constraint evaluation with current dateTime from PIP
- Validate attribute constraint with array membership (`isAnyOf`)
- Ensure all constraints must be satisfied (one failure = deny)
- Test edge cases: date exactly at boundary, single required certification
- Confirm `permission` action returns grant/deny only, no data
- Test constraint evaluation order and short-circuit behavior
