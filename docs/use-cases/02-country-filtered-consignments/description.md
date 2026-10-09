# Use Case 2: Cross-Node Consignment Access with Country Filtering

> **Note**: TypeScript snippets in this document are illustrative examples showing conceptual flow. For exact API signatures, refer to the interface definitions in `rights-management-models/src/models/`.

## Business Context

An exporter maintains a data resource containing consignment records for international shipments. The exporter wants to provide access to this data, but with intelligent filtering: requesting parties should only see consignments where the destination country matches their own country of registration. This use case demonstrates `view` actions with data filtering, asset class targeting (not specific resources), and PIP integration for dynamic data reduction.

## Prerequisites

This use case assumes an Agreement policy already exists in PAP. The Agreement was created through one of:

- **Policy Negotiation** (Phase 1): IDS Contract Negotiation between provider and consumer (see UC6)
- **Administrative Creation**: Data provider directly creates Agreement in PAP
- **Automated Onboarding**: Federated Catalogue registration generates default policies

For this scenario, the exporter has already created an Agreement policy with the freight forwarder that includes data filtering based on destination country.

## Component Files

This use case includes the following component example files:

**Policy Storage (PAP)**:

- [`pap-agreement.json`](./pap-agreement.json) - Agreement with `twin:jsonPath`/information-datasource pattern and dynamic evaluation flag

**Policy Lookup (PMP)**:

- [`pmp-policy-locator.json`](./pmp-policy-locator.json) - Asset class lookup with requiresDynamicEvaluation flag

**Runtime Context (PIP)**:

- [`pip-context.json`](./pip-context.json) - Assignee attributes and consignment data for filtering

**Policy Decision (PDP)**:

- [`pdp-request.json`](./pdp-request.json) - Asset class evaluation request
- [`pdp-decision.json`](./pdp-decision.json) - Partial grant with array element decisions

**Access Request**:

- [`access-request.json`](./access-request.json) - Asset class query request

**Data Examples**:

- [`source-data.json`](./source-data.json) - Unfiltered consignment data (before PEP filtering)

**Legacy/Reference**:

- [`policy.json`](./policy.json) - Agreement policy (also stored in PAP)
- [`expected-decision.json`](./expected-decision.json) - Legacy decision format

## Parties Involved

**Assigner (Data Provider)**:

- Identity: `did:iota:testnet:0x1ee831611a9fe9877c82e05075d9670c4970b4fd0904c208082ee50e45817a9d`
- Role: Polish exporter providing consignment data
- Resource: Export consignments data resource (asset class: Consignment)

**Assignee (Data Consumer)**:

- Identity: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- Role: Freight forwarder registered in Poland
- Attribute: Country code "PL"

## Scenario Flow

### Phase 1: Policy Lifecycle (Prior to Access Request)

The Agreement policy already exists in PAP through one of these paths:

- **Policy Negotiation (PNP)**: IDS Contract Negotiation between exporter and freight forwarder (see UC6 for negotiation flow)
- **Administrative Creation**: Exporter directly creates Agreement policy in PAP
- **Automated Onboarding**: Federated Catalogue registration automatically generates default Agreement

The Agreement includes:

- Assignee: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- Asset Class: `Consignment` (not specific resource)
- Action: `view` (data filtering action)
- Constraint: Filter based on destination country matching assignee's country

### Phase 2: Access Request and Evaluation (Runtime)

#### 1. Access Request (Application Code → PEP)

The freight forwarder's application code sends a query request to the exporter's API endpoint which calls PEP:

```typescript
// Remote consumer node application code
async function queryConsignments(requestingNode: string): Promise<Consignment[]> {
  // Application calls PEP for authorization and filtering
  const pepResult = await pep.intercept({
    action: 'view',
    assetType: 'Consignment',
    assignee: requestingNode
  });

  if (pepResult.decision === 'Permit') {
    // Retrieve all consignments
    const allConsignments = await storage.queryConsignments();

    // Apply PEP filtering based on dataDecisions
    return filterDataByDecisions(allConsignments, pepResult.dataDecisions);
  } else {
    throw new UnauthorizedError('Access denied');
  }
}

// Client calls the application endpoint
const consignments = await api.get('/consignments', {
  headers: {
    'Node-Identity':
      'did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246'
  }
});
```

#### 2. Policy Locator Construction (PMP)

PMP constructs a Policy Locator for PAP query:

- **assetType**: `"Consignment"` (asset class)
- **action**: `"view"` (query operation)
- **assignee**: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- **resourceId**: Not specified (asset class policy applies)

#### 3. Policy Evaluation (PDP)

The Policy Decision Point evaluates the request:

- PMP retrieves Agreement policy from PAP
- PIP provides assignee country code: `"PL"`
- PDP evaluates permission for asset class `"Consignment"`
- PDP determines data filtering requirements based on constraint
- Returns: **Permit** with transformation directive (filter by destination country)

#### 4. Data Access with Filtering (Application Code + PEP)

The application code retrieves data and applies PEP filtering:

```typescript
// Application code calls PEP and applies filtering
async function queryConsignments(requestingNode: string): Promise<Consignment[]> {
  // PEP pre-action authorization
  const pepDecision = await pep.authorize({
    action: 'view',
    assetType: 'Consignment',
    assignee: requestingNode
  });

  if (pepDecision !== 'Permit') {
    throw new UnauthorizedError('Access denied');
  }

  // Retrieve all consignments from storage
  const allConsignments = await storage.queryConsignments();

  // PEP post-action filtering
  const filteredResult = await pep.transformData({
    action: 'view',
    assetType: 'Consignment',
    assignee: requestingNode,
    data: allConsignments
  });

  return filteredResult.transformedData;
}
```

#### 5. PEP Post-Action Enforcement (Data Transformation)

After the handler returns data, PEP applies the filtering transformation:

```typescript
// INTERNAL PEP PROCESS (not application code):
// PEP obtains assignee country from PIP context
const assigneeCountry = /* PIP provides from identity source */ 'PL';
const filteredConsignments = allConsignments.filter(
  consignment => consignment.destinationCountry === assigneeCountry
);
// Returns only Poland-bound consignments to assignee
```

#### 6. Application Receives Filtered Data

The consumer's application code receives the filtered response:

```typescript
// Consumer receives only relevant consignments
console.log(consignments); // Only 2 consignments (destination: Poland)
```

## Expected Behavior

### Successful Access with Filtering (Assignee Country = "PL")

- PDP evaluates Agreement policy: Permission granted ✓
- Arbiter applies filtering: Select consignments where `destinationCountry === "PL"` ✓
- **Result**: Assignee receives subset of consignments (only Poland-bound shipments)

### Unfiltered Dataset

Original dataset contains consignments to multiple countries:

- Consignment 1: Destination → Poland
- Consignment 2: Destination → Germany
- Consignment 3: Destination → Poland
- Consignment 4: Destination → France

### Filtered Dataset (for Polish assignee)

Returned dataset contains only:

- Consignment 1: Destination → Poland
- Consignment 3: Destination → Poland

## PEP Integration (Application Code Pattern)

### Provider Node Setup

The exporter's application code exposes consignment data with PEP enforcement:

```typescript
import { ComponentFactory } from '@3sixty/framework';
import type { IPolicyEnforcementPoint } from '@3sixty/rights-management-models';

// Initialize PEP
const pep = ComponentFactory.get<IPolicyEnforcementPoint>('policy-enforcement-point');

// Application endpoint for consignment queries
app.post('/api/consignments/query', async (req, res) => {
  const requestingNode = req.headers['node-identity'];

  // Application calls PEP for authorization and filtering
  const pepResult = await pep.intercept({
    action: 'view',
    assetType: 'Consignment',
    assignee: requestingNode
  });

  if (pepResult.decision !== 'Permit') {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Retrieve all consignments from storage
  const allConsignments = await storage.queryConsignments(req.body.filters);

  // Apply PEP filtering transformation
  const filtered = await pep.transformData({
    action: 'view',
    assetType: 'Consignment',
    assignee: requestingNode,
    data: allConsignments
  });

  // Return filtered consignments
  res.json({ items: filtered.transformedData });
});
```

### Consumer Node Setup

The freight forwarder's application code queries remote consignment data:

```typescript
// Application code queries consignments
async function getRelevantConsignments(): Promise<IConsignment[]> {
  const response = await fetch('https://exporter.example.org/api/consignments/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Node-Identity':
        'did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246'
    },
    body: JSON.stringify({
      filters: { status: 'in-transit' } // Optional application-level conditions
    })
  });

  const result = await response.json();

  // Returns only consignments with destination country = "PL"
  // Server-side filtering already applied by provider's PEP
  return result.items as IConsignment[];
}
```

### Filtering Enforcement Flow

1. **Consumer Request**: Application sends query request with node identity
2. **Provider Reception**: Application receives request, authenticates consumer
3. **PEP Authorization**: Application calls PEP for access decision
4. **Data Retrieval**: Application retrieves all matching consignments
5. **PEP Transformation**: Application calls PEP for data filtering
6. **Filtered Response**: Only relevant consignments returned to consumer

This pattern ensures:

- **Privacy-Preserving**: Consumer never sees unauthorized data
- **Application Control**: Application code orchestrates enforcement flow
- **Policy-Driven**: Filtering rules defined in ODRL Agreement, not code
- **Transport Agnostic**: Works with REST, GraphQL, or any transport mechanism

## Architecture Components Used

### Phase 1 Components (Policy Lifecycle)

#### PAP (Policy Administration Point)

- Stores Offer and Agreement policies for Consignment asset class
- Manages policy lifecycle and versioning
- Indexed by asset type for efficient retrieval

#### PNP (Policy Negotiation Point) - Optional

- Converts initial Offer to Agreement during IDS Contract Negotiation (see UC6)
- Records assignee identity and negotiated constraints in resulting Agreement
- **Note**: Not required for this use case if Agreement already exists

### Phase 2 Components (Runtime Access Control)

#### Application Code - Consumer Side

- Client-side component on freight forwarder's node
- Sends authenticated query requests to remote API endpoints
- Receives filtered responses without knowing filtering occurred

#### Application Code - Provider Side

- Server-side API interface on exporter's node
- Calls PEP for authorization and data filtering
- Returns filtered data based on PEP enforcement

#### PMP (Policy Management Point)

- Constructs Policy Locator from access request parameters
- Queries PAP for matching Agreement policies
- Returns policy to PDP for evaluation

#### PDP (Policy Decision Point)

- Evaluates Agreement policy for asset class "Consignment"
- Coordinates with PIP to obtain assignee attributes
- Returns permit decision with data transformation directive
- **Note**: Asset class policies apply when no specific resourceId provided

#### PIP (Policy Information Point)

- Provides assignee country code attribute ("PL")
- Supplies consignment destination country data for filtering
- Aggregates runtime context for PDP evaluation

#### PEP (Policy Enforcement Point)

- Enforces PDP decision via post-action data transformation
- Applies filtering logic: `destinationCountry === assigneeCountryCode`
- Called by application code for enforcement
- Returns filtered consignment dataset to assignee

## Key Features Demonstrated

1. **View Action with Data Filtering**: Unlike simple `read` (grant/deny), `view` returns reduced dataset
2. **Asset Class Targeting**: Policy applies to `Consignment` type, not specific consignment IDs
3. **PIP Integration**: Arbiter uses PIP to access assignee attributes for filtering
4. **Data Minimization**: Only relevant consignments are returned (privacy-preserving)
5. **Offer → Agreement Negotiation**: Shows policy transformation during negotiation

## ODRL Standards Utilized

- `IOdrlOffer` - Initial offer policy
- `IOdrlAgreement` - Negotiated agreement policy
- `IOdrlPermission` - Permission rule with implicit filtering constraint
- Asset class targeting (target = "Consignment" without specific UID)

## Real-World Application

This pattern is commonly used in:

- **Supply chain visibility**: Partners see only relevant shipments in their jurisdiction
- **Multi-tenant systems**: Each tenant sees filtered view of shared datasets
- **Privacy-preserving data sharing**: Reduce data exposure to minimum necessary
- **Cross-border logistics**: Freight forwarders access consignments relevant to their operations

## Testing Focus

- Verify asset class policy matching (without specific resourceId)
- Test data filtering logic based on assignee country
- Validate that only matching consignments are returned
- Ensure PIP integration provides correct assignee attributes
- Confirm `view` action triggers data transformation, not just grant/deny
- Test with source data containing mixed destination countries
