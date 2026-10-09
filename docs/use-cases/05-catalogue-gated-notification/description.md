# UC5 – Catalogue-Gated Notification with ODRL Duty

> **Note**: TypeScript snippets in this document are illustrative examples showing conceptual flow. For exact API signatures, refer to the interface definitions in `rights-management-models/src/models/`.

## Business Context

The Polish Veterinary Agency publishes veterinary certificates for consignments bound to the United Kingdom. Their Data Space Connector automatically emits `Create` and `Add` activities as documents are attached to consignments. The UK Food Standards Agency needs to receive near-real-time notifications about new veterinary certificate documents, but only when:

1. The requesting connector proves specific certifications (FSA-Trusted-Notifier)
2. The consignment destination country matches "GB"
3. The permission carries an attached duty: the Polish agency must actually deliver (`inform`) the notification to the FSA's own connector endpoint - checked and enforced as part of the same decision, and scoped to only apply when the document is specifically a veterinary certificate

This use case demonstrates ODRL duty clauses, Data Space Connector integration, certification-based access, and document-type-scoped duty enforcement.

## Prerequisites

This use case assumes an Agreement policy already exists in PAP. The Agreement was created through one of:

- **Policy Negotiation** (Phase 1): IDS Contract Negotiation between Polish Veterinary Agency and UK FSA connector (see UC6)
- **Administrative Creation**: Agency directly creates Agreement in PAP with Data Space Connector
- **Federated Catalogue Onboarding**: Automated Agreement generation upon connector registration

For this scenario, the Polish Veterinary Agency has already created an Agreement policy with the UK FSA Data Space Connector that includes:

- PartyCollection refinement (certification: FSA-Trusted-Notifier)
- Geographic constraint (destination country: GB)
- ODRL duty clause (obligation on the assigner to deliver the notification to the FSA's connector endpoint, scoped to veterinary-certificate documents)

## Component Files

This use case includes the following component example files:

**Policy Storage (PAP)**:

- [`pap-agreement.json`](./pap-agreement.json) - Agreement with duty clause and obligation tracking metadata

**Policy Lookup (PMP)**:

- [`pmp-policy-locator.json`](./pmp-policy-locator.json) - Federated catalogue integration with duty clause flag

**Runtime Context (PIP)**:

- [`pip-context.json`](./pip-context.json) - Certification and geographic attributes for duty evaluation

**Policy Decision (PDP)**:

- [`pdp-request.json`](./pdp-request.json) - Notification permission evaluation
- [`pdp-decision.json`](./pdp-decision.json) - Permission with duty obligations in response

**Access Request**:

- [`access-request.json`](./access-request.json) - Notification service access request

**Notification Trace**:

- [`notification-trace.json`](./notification-trace.json) - Activity Stream record of the notification delivery that satisfies the attached duty

**Legacy/Reference**:

- [`policy.json`](./policy.json) - Agreement policy
- [`expected-decision.json`](./expected-decision.json) - Legacy decision format

## Parties Involved

**Assigner (Data Provider)**:

- Identity: `did:iota:testnet:0x1ee831611a9fe9877c82e05075d9670c4970b4fd0904c208082ee50e45817a9d`
- Role: Polish Veterinary Agency (GIW) operating data space connector
- Resource: Veterinary certificate notification service

**Assignee (Data Consumer)**:

- Identity: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- Role: UK Food Standards Agency data space connector
- Attributes: Certification = "FSA-Trusted-Notifier" (from Federated Catalogue)

## Scenario Flow

### Phase 1: Policy Lifecycle (Prior to Access Request)

The Agreement policy already exists in PAP through negotiation or administrative creation:

**Agreement Policy Structure**:

- Type: `IOdrlAgreement` (bilateral with UK FSA connector)
- Assignee: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- Target: Notification service (veterinary certificate events)
- Action: `"use"` (permission to receive notifications)
- Constraints:
  - **PartyCollection Refinement**: Assignee certifications must contain "FSA-Trusted-Notifier"
  - **Geographic Constraint**: Consignment destination country equals "GB"
- Duty:
  - **Obligation**: Assigner must actually deliver (`inform`) the notification to the FSA's own connector endpoint - the delivery itself is what satisfies the duty
  - **Action**: `"inform"`
  - **Target**: `"https://my-ds-connectors.example.org/ds-connector-uk-fsa/notify"`
  - **Constraint**: Only applies when `documentTypeCode` equals `"unece:DocumentCodeList#853"` (veterinary certificates)

### Phase 2: Access Request and Evaluation (Runtime)

#### 1. Access Request (Data Space Connector Event)

The Polish agency's connector emits an activity event, triggering notification authorization:

```typescript
// Polish GIW Data Space Connector
const dsc = ComponentFactory.get<IDataSpaceConnector>('data-space-connector');

// Document attachment event occurs
await dsc.emitActivity({
  type: 'Create',
  actor: 'did:iota:testnet:0x1ee831611a9fe9877c82e05075d9670c4970b4fd0904c208082ee50e45817a9d',
  object: {
    type: 'VeterinaryCertificate',
    id: 'https://twin.example.org/documents/vet-cert-GB-2025-001',
    consignmentId: 'CONS-GB-2025-001',
    destinationCountry: 'GB'
  }
});

// Connector checks who is authorized to receive this notification
const authorizedSubscribers = await dsc.getAuthorizedNotificationRecipients({
  eventType: 'Create',
  objectType: 'VeterinaryCertificate',
  context: { destinationCountry: 'GB' }
});
```

#### 2. Policy Locator Construction (PMP)

The application's integrated PMP constructs a Policy Locator for each potential subscriber:

- **assetType**: `"NotificationService"`
- **action**: `"use"` (permission to receive notification)
- **assignee**: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246` (UK FSA)
- **resourceId**: `"https://twin.example.org/services/vet-cert-notifications"`

#### 3. Policy Evaluation (PDP) - Constraints + Duty

The PDP evaluates the Agreement policy with constraints and duty:

##### Step 1: Retrieve Agreement Policy

```typescript
// PMP queries PAP with Policy Locator
const policy = await pap.getPolicy({
  assetType: 'NotificationService',
  action: 'use',
  assignee: 'did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246',
  resourceId: 'https://twin.example.org/services/vet-cert-notifications'
});
// Returns Agreement with PartyCollection + geographic constraints + duty
```

##### Step 2: Evaluate PartyCollection Constraint (Certification)

```typescript
// INTERNAL PDP PROCESS (not application code):
// PDP obtains assignee certifications from Federated Catalogue via PIP context
// Using leftOperand: "twin:jsonPath", twin:jsonPathExpression: "$.assigneeAttributes.certifications"
const assigneeCerts = /* PIP provides from catalogue source */ ['FSA-Trusted-Notifier', 'ISO27001'];

// Constraint: certifications must contain "FSA-Trusted-Notifier"
const certConstraint = assigneeCerts.includes('FSA-Trusted-Notifier'); // ✓ true
```

##### Step 3: Evaluate Geographic Constraint

```typescript
// INTERNAL PDP PROCESS (not application code):
// PDP obtains consignment destination country from resource attributes via PIP context
// Using leftOperand: "twin:jsonPath", twin:jsonPathExpression: "$.resourceAttributes.consignment.destinationCountry.countryId"
const destinationCountry = /* PIP provides from resource source */ 'GB';

// Constraint: destinationCountry equals "GB"
const geoConstraint = destinationCountry === 'GB'; // ✓ true
```

##### Step 4: Enforce the Duty Obligation

```typescript
// INTERNAL PDP PROCESS (not application code):
// PDP extracts the duty attached to the permission and enforces it via a
// registered obligation enforcer, as part of the same decision - not a
// separately scheduled, best-effort follow-up
const duty = policy.permission[0].duty[0];
// {
//   action: { "@type": "Action", "rdf:value": "inform" },
//   target: "https://my-ds-connectors.example.org/ds-connector-uk-fsa/notify",
//   constraint: [{
//     leftOperand: "twin:jsonPath",
//     "twin:jsonPathExpression": "$.resourceAttributes.latestDocument.documentTypeCode",
//     operator: "eq",
//     rightOperand: "unece:DocumentCodeList#853"
//   }]
// }

// The registered enforcer confirms delivery to the duty's target can be made
// for this document type; if it can't, the whole permission is denied
const dutyEnforced = await dutyObligationEnforcer.enforce(policy, duty, information);
```

##### Step 5: Combine Results

```typescript
// INTERNAL PDP PROCESS (not application code):
// All constraints satisfied and the duty successfully enforced
const finalDecision = certConstraint && geoConstraint && dutyEnforced; // true
// Result: Permit
```

#### 4. Notification Delivery (Duty Fulfilled by the Delivery Itself)

The PEP authorizes and performs notification delivery - for this policy, that delivery _is_ the duty fulfillment:

```typescript
if (finalDecision) {
  // Send notification to UK FSA connector - this delivery, to the duty's
  // target endpoint, is what satisfies the duty for vet-cert documents
  await dsc.notifyActivity({
    to: 'did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246',
    activity: {
      type: 'Create',
      object: {
        type: 'VeterinaryCertificate',
        id: 'https://twin.example.org/documents/vet-cert-GB-2025-001'
      }
    }
  });

  // No separate deadline or downstream tracking is scheduled here - the
  // duty's obligation enforcer already confirmed (in Step 4) that this
  // delivery satisfies the duty, before the permission was granted
}
```

## Expected Behavior

### Successful Notification (All Constraints Satisfied, Duty Enforced)

- Certification constraint: FSA-Trusted-Notifier present ✓
- Geographic constraint: Destination country = "GB" ✓
- Duty: delivery to the FSA's connector endpoint enforced for this vet-cert document ✓
- **Result**: Notification permitted and delivered - the delivery itself satisfies the attached duty

### Failed Notification Scenarios

#### Scenario A: Missing Required Certification

- Assignee certifications: ["ISO27001"]
- Certification constraint: "FSA-Trusted-Notifier" not present ✗
- **Result**: Notification denied (not authorized)

#### Scenario B: Wrong Destination Country

- Destination country: "FR"
- Geographic constraint: "FR" ≠ "GB" ✗
- **Result**: Notification denied (not relevant for UK FSA)

#### Scenario C: Duty Cannot Be Enforced

- Certification and geographic constraints satisfied ✓
- The registered obligation enforcer(s) cannot confirm delivery to the duty's target for this document ✗ (with no enforcer registered at all, the arbiter fails loud with a `noObligationEnforcersRegistered` error instead of returning a decision)
- **Result**: Permission denied - the duty gates the decision, so an unenforceable duty blocks the notification even though the other constraints passed

## Expected Outcome

When the assignee provides valid certifications from the catalogue, the consignment's destination country equals `GB`, and the attached duty is successfully enforced for this document type, the PDP returns `permit`, enabling:

1. Release of the veterinary certificate metadata to the UK FSA connector
2. Emission of notification via the Data Space Connector
3. Delivery to the duty's target endpoint, satisfying the attached obligation as part of the same decision

## PEP Integration (Data Space Connector Notification)

### Provider Node Setup (Polish Veterinary Agency)

The Polish agency's Data Space Connector integrates with PEP for rights-managed notifications:

```typescript
import { ComponentFactory } from '@3sixty/framework';
import type { IDataSpaceConnector, IDataAccessPoint } from '@3sixty/rights-management-models';

// Initialize Data Space Connector with PEP integration
const dsc = ComponentFactory.get<IDataSpaceConnector>('data-space-connector');
const dap = ComponentFactory.get<IDataAccessPoint>('data-access-point');

// Register notification authorization handler
dsc.onActivityEmitted(async activity => {
  // Get potential notification subscribers from catalogue
  const subscribers = await catalogue.getSubscribers({
    activityType: activity.type,
    objectType: activity.object.type
  });

  // Check each subscriber's authorization via PEP
  for (const subscriber of subscribers) {
    const authorized = await dap.checkPermission({
      assetType: 'NotificationService',
      resourceId: 'https://twin.example.org/services/vet-cert-notifications',
      action: 'use',
      credentials: {
        nodeIdentity: subscriber.identity,
        context: {
          destinationCountry: activity.object.destinationCountry
        }
      }
    });

    if (authorized.permitted) {
      // Send notification to authorized subscriber - this delivery is what
      // satisfies the duty attached to the permission (see Step 4 above);
      // checkPermission() above would already have returned permitted: false
      // if the duty could not be enforced
      await dsc.notifyActivity({
        to: subscriber.identity,
        activity: activity
      });
    }
  }
});
```

### Notification Authorization Flow with Duty

1. **Event Emission**: Polish agency's DSC emits Create activity for veterinary certificate
2. **Subscriber Discovery**: Query Federated Catalogue for notification subscribers
3. **Authorization Check**: For each subscriber, PEP evaluates Agreement policy:
   - PMP constructs Policy Locator
   - PAP returns Agreement with constraints + duty
   - PDP evaluates certification + geographic constraints
   - PDP enforces the attached duty via a registered obligation enforcer
4. **Notification Delivery**: If permitted (constraints satisfied and duty enforced), send notification to the authorized subscriber - this delivery is what satisfies the duty for vet-cert documents

This pattern ensures:

- **Certification-Based Authorization**: Only certified connectors receive notifications
- **Geographic Filtering**: Notifications limited to relevant jurisdictions
- **ODRL Duty Enforcement**: The provider's delivery to the duty's target is checked as part of the same permit decision, scoped to veterinary-certificate documents
- **Federated Catalogue Integration**: Dynamic participant discovery and certification lookup
- **Rights-Managed Automation**: Policy-driven notification distribution with duty enforcement

## Architecture Components Used

### Phase 1 Components (Policy Lifecycle)

#### PAP (Policy Administration Point)

- Stores Agreement policy with PartyCollection refinement + geographic constraint + ODRL duty
- Manages policy lifecycle with duty clause definitions
- Indexes policies by NotificationService asset type

### Phase 2 Components (Runtime Access Control)

#### Application Code - Provider Side

- Server-side notification authorization interface on Polish agency's connector
- Integrates with Data Space Connector for activity-driven authorization
- Registers notification permission handlers for specific asset types
- Automatically integrates PEP enforcement with duty extraction

#### PMP (Policy Management Point)

- Constructs Policy Locator from notification authorization request
- Queries PAP for matching Agreement policy with duty clauses
- Returns policy with constraints + duty to PDP for evaluation

#### PDP (Policy Decision Point)

- Evaluates constraints (PartyCollection + geographic) with AND logic
- Coordinates with PIP to obtain runtime context:
  - Assignee certifications from Federated Catalogue
  - Consignment destination country from resource attributes
- Enforces the duty attached to the permission via a registered obligation enforcer, gating the permit decision
- Returns a permit decision only if all constraints are satisfied and the duty is successfully enforced

#### PIP (Policy Information Point)

- Provides assignee certifications via Federated Catalogue lookup
- Supplies consignment destination country from resource attributes
- Aggregates runtime context for constraint evaluation
- Information Sources:
  - Federated Catalogue: Participant certifications
  - Resource Storage: Consignment attributes

#### PXP (Policy Execution Point)

- Not directly involved in this use case's duty mechanism - the duty is enforced synchronously inside the Arbiter's own evaluation (`enforcePermissionDuties`/`enforceDuty`), not via PXP's before/after decision interception
- Available for other cross-cutting concerns (telemetry, enrichment) around the same PDP decision, if registered

#### PEP (Policy Enforcement Point)

- Enforces the permit decision for notification delivery
- Performs the actual notification delivery, which is also what satisfies the duty attached to the permission
- Controls notification distribution to authorized subscribers
- Integrated within Data Space Connector's activity flow

## Key Features Demonstrated

1. **ODRL Duty Clauses**: Permission with an attached duty (deliver notification to the FSA's connector endpoint, scoped to veterinary-certificate documents)
2. **Data Space Connector Integration**: Notification service authorization pattern
3. **Federated Catalogue Integration**: Dynamic certification lookup and participant discovery
4. **PartyCollection Refinement**: Certification-based access control
5. **Geographic Constraints**: Destination country filtering for notifications
6. **Duty Enforcement**: A registered obligation enforcer confirms delivery as part of the same permit decision
7. **Document-Type Scoping**: The registered enforcer evaluates the duty's own constraint to limit when it applies, independent of the top-level permission constraints (the arbiter hands the whole duty to the enforcer rather than evaluating duty constraints itself)
8. **Rights-Managed Automation**: Policy-driven notification distribution

## ODRL Standards Utilized

- `IOdrlAgreement` - Bilateral agreement with duty clause
- `IOdrlPermission` - Permission rule with attached duty
- `IOdrlDuty` - Obligation on the assigner to deliver (`inform`) the notification to the FSA's connector endpoint, scoped by a document-type constraint
- `IOdrlConstraint` - PartyCollection refinement + geographic constraint + duty constraint
- `IOdrlPartyCollection` - Refinement with certification requirement
- Action: `"use"` (notification permission), `"inform"` (duty action)
- Custom extension: `twin:jsonPath` leftOperand with companion `twin:jsonPathExpression` property for nested property extraction (`$.assigneeAttributes.certifications`, `$.resourceAttributes.consignment.destinationCountry.countryId`, `$.resourceAttributes.latestDocument.documentTypeCode` - each expression must start with `$`, the JSONPath root)

## Real-World Application

This pattern is commonly used in:

- **Regulatory Compliance**: Government agencies with document-type-scoped delivery obligations to counterpart agencies
- **Supply Chain Traceability**: Automated notifications with audit trail requirements
- **Data Space Ecosystems**: Federated notification systems with certification-based access
- **Bilateral Data Space Agreements**: Duties attached directly to the permission between two connectors, enforced as part of the same decision rather than tracked separately
- **Conditional Obligations**: Duties scoped to apply only for specific document types or attributes

## Testing Focus

- Verify PartyCollection constraint with Federated Catalogue certification lookup
- Test geographic constraint with consignment destination country filtering
- Validate that duty enforcement gates the permit decision via a registered obligation enforcer
- Ensure notification delivery only to authorized, certified participants
- Test that the duty's own constraint (document type) is evaluated independently of the top-level permission constraints
- Confirm notification-trace.json audit trail reflects delivery to the duty's target
- Verify Data Space Connector integration with rights management
