# UC5 – Catalogue-Gated Notification with ODRL Duty

> **Note**: TypeScript snippets in this document are illustrative examples showing conceptual flow. For exact API signatures, refer to the interface definitions in `rights-management-models/src/models/`.

## Business Context

The Polish Veterinary Agency publishes veterinary certificates for consignments bound to the United Kingdom. Their Data Space Connector automatically emits `Create` and `Add` activities as documents are attached to consignments. The UK Food Standards Agency needs to receive near-real-time notifications about new veterinary certificate documents, but only when:

1. The requesting connector proves specific certifications (FSA-Trusted-Notifier)
2. The consignment destination country matches "GB"
3. The consumer fulfills the duty obligation to notify a third-party clearing house

This use case demonstrates ODRL duty clauses, Data Space Connector integration, certification-based access, and notification obligations.

## Prerequisites

This use case assumes an Agreement policy already exists in PAP. The Agreement was created through one of:

- **Policy Negotiation** (Phase 1): IDS Contract Negotiation between Polish Veterinary Agency and UK FSA connector (see UC6)
- **Administrative Creation**: Agency directly creates Agreement in PAP with Data Space Connector
- **Federated Catalogue Onboarding**: Automated Agreement generation upon connector registration

For this scenario, the Polish Veterinary Agency has already created an Agreement policy with the UK FSA Data Space Connector that includes:

- PartyCollection refinement (certification: FSA-Trusted-Notifier)
- Geographic constraint (destination country: GB)
- ODRL duty clause (obligation to notify clearing house after receiving notification)

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

**Duty Tracking**:

- [`notification-trace.json`](./notification-trace.json) - Activity Stream notification with duty fulfillment tracking

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
- Action: `"notify"` (permission to receive notifications)
- Constraints:
  - **PartyCollection Refinement**: Assignee certifications must contain "FSA-Trusted-Notifier"
  - **Geographic Constraint**: Consignment destination country equals "GB"
- Duty:
  - **Obligation**: After receiving notification, assignee must notify clearing house endpoint
  - **Action**: `"notifyThirdParty"`
  - **Target**: `"https://clearing-house.federated-catalogue.eu/notifications"`

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
- **action**: `"notify"` (permission to receive notification)
- **assignee**: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246` (UK FSA)
- **resourceId**: `"https://twin.example.org/services/vet-cert-notifications"`

#### 3. Policy Evaluation (PDP) - Constraints + Duty

The PDP evaluates the Agreement policy with constraints and duty:

##### Step 1: Retrieve Agreement Policy

```typescript
// PMP queries PAP with Policy Locator
const policy = await pap.getPolicy({
  assetType: 'NotificationService',
  action: 'notify',
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

##### Step 4: Extract Duty Obligation

```typescript
// INTERNAL PDP PROCESS (not application code):
// PDP extracts duty from permission for PXP scheduling
const duty = policy.permission[0].duty[0];
// {
//   action: "notifyThirdParty",
//   target: "https://clearing-house.federated-catalogue.eu/notifications",
//   constraint: { event: "afterNotificationReceived" }
// }
```

##### Step 5: Combine Results

```typescript
// INTERNAL PDP PROCESS (not application code):
// All constraints satisfied + duty obligation identified
const finalDecision = certConstraint && geoConstraint; // true
// Result: Permit with duty obligation
```

#### 4. Notification Delivery with Duty (PEP + DSC)

The PEP authorizes notification delivery and tracks duty fulfillment:

```typescript
if (finalDecision) {
  // Send notification to UK FSA connector
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

  // PDP internally tracks duty obligation via PXP (not called directly by application)
  // PXP schedules duty monitoring with deadline: 2025-10-01T12:00:00Z (2 hours after notification)
}
```

#### 5. Duty Fulfillment (Consumer Obligation)

The UK FSA connector fulfills the duty obligation:

```typescript
// UK FSA Data Space Connector receives notification
dsc.onActivityReceived(async activity => {
  // Process notification
  await processVeterinaryCertificate(activity.object);

  // Fulfill duty: notify clearing house
  await http.post('https://clearing-house.federated-catalogue.eu/notifications', {
    notificationId: activity.id,
    receiver: 'did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246',
    timestamp: new Date().toISOString(),
    eventType: 'VeterinaryCertificateReceived'
  });

  // Report duty fulfillment back to provider (optional)
  await dsc.reportDutyFulfillment({
    policyId: policy.uid,
    dutyAction: 'notifyThirdParty',
    completedAt: new Date().toISOString()
  });
});
```

## Expected Behavior

### Successful Notification (All Constraints Satisfied + Duty Tracked)

- Certification constraint: FSA-Trusted-Notifier present ✓
- Geographic constraint: Destination country = "GB" ✓
- **Result**: Notification permitted and delivered
- **Duty**: Consumer obligated to notify clearing house within 2 hours

### Failed Notification Scenarios

#### Scenario A: Missing Required Certification

- Assignee certifications: ["ISO27001"]
- Certification constraint: "FSA-Trusted-Notifier" not present ✗
- **Result**: Notification denied (not authorized)

#### Scenario B: Wrong Destination Country

- Destination country: "FR"
- Geographic constraint: "FR" ≠ "GB" ✗
- **Result**: Notification denied (not relevant for UK FSA)

#### Scenario C: Duty Not Fulfilled

- Notification delivered ✓
- Clearing house notification not sent within deadline ✗
- **Result**: Duty violation recorded, potential policy revocation

## Expected Outcome

When the assignee provides valid certifications from the catalogue and the consignment's destination country equals `GB`, the PDP returns `permit` with duty obligation, enabling:

1. Release of the veterinary certificate metadata to the UK FSA connector
2. Emission of notification via the Data Space Connector
3. Tracking of duty obligation for clearing house notification
4. Potential compliance monitoring and policy enforcement based on duty fulfillment

## PEP Integration (Data Space Connector Notification)

### Provider Node Setup (Polish Veterinary Agency)

The Polish agency's Data Space Connector integrates with PEP for rights-managed notifications:

```typescript
import { ComponentFactory } from '@twin.org/framework';
import type { IDataSpaceConnector, IDataAccessPoint } from '@twin.org/rights-management-models';

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

  // Check each subscriber's authorization via PEP/PEP
  for (const subscriber of subscribers) {
    const authorized = await dap.checkPermission({
      assetType: 'NotificationService',
      resourceId: 'https://twin.example.org/services/vet-cert-notifications',
      action: 'notify',
      credentials: {
        nodeIdentity: subscriber.identity,
        context: {
          destinationCountry: activity.object.destinationCountry
        }
      }
    });

    if (authorized.permitted) {
      // Send notification to authorized subscriber
      await dsc.notifyActivity({
        to: subscriber.identity,
        activity: activity
      });

      // PDP internally tracks duty obligation via PXP if policy includes duty
      // (PXP is not called directly by application - it's internal to PDP)
      // Duty details are included in PDP decision annotations
    }
  }
});
```

### Consumer Node Setup (UK FSA Data Space Connector)

The UK FSA's Data Space Connector receives notifications and fulfills duties:

```typescript
import { ComponentFactory } from '@twin.org/framework';
import type { IDataSpaceConnector } from '@twin.org/rights-management-models';

// Initialize Data Space Connector
const dsc = ComponentFactory.get<IDataSpaceConnector>('data-space-connector');

// Handle incoming notifications
dsc.onActivityReceived(async (activity, policyContext) => {
  // Process veterinary certificate notification
  await processVeterinaryCertificate(activity.object);

  // Check if policy includes duty obligation
  if (policyContext.duty) {
    // Fulfill duty: notify clearing house
    await fulfillDutyObligation(policyContext.duty);

    // Report duty fulfillment (optional)
    await dsc.reportDutyFulfillment({
      policyId: policyContext.policyId,
      dutyAction: policyContext.duty.action,
      completedAt: new Date().toISOString()
    });
  }
});

async function fulfillDutyObligation(duty: IOdrlDuty): Promise<void> {
  // Notify clearing house as required by duty
  await http.post(duty.target, {
    notificationId: activity.id,
    receiver: dsc.identity,
    timestamp: new Date().toISOString(),
    eventType: 'VeterinaryCertificateReceived'
  });
}
```

### Notification Authorization Flow with Duty

1. **Event Emission**: Polish agency's DSC emits Create activity for veterinary certificate
2. **Subscriber Discovery**: Query Federated Catalogue for notification subscribers
3. **Authorization Check**: For each subscriber, PEP/PEP evaluates Agreement policy:
   - PMP constructs Policy Locator
   - PAP returns Agreement with constraints + duty
   - PDP evaluates certification + geographic constraints
   - PDP extracts duty obligation from policy
4. **Notification Delivery**: If permitted, send notification to authorized subscribers
5. **Duty Tracking**: PXP schedules duty obligation with deadline
6. **Duty Fulfillment**: Consumer fulfills obligation (notify clearing house)
7. **Compliance Monitoring**: Track duty fulfillment for policy enforcement

This pattern ensures:

- **Certification-Based Authorization**: Only certified connectors receive notifications
- **Geographic Filtering**: Notifications limited to relevant jurisdictions
- **ODRL Duty Compliance**: Consumers obligated to fulfill third-party notification
- **Federated Catalogue Integration**: Dynamic participant discovery and certification lookup
- **Rights-Managed Automation**: Policy-driven notification distribution with obligation tracking

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
- Extracts duty obligation from permission for PXP scheduling
- Returns permit decision with duty clause for PEP enforcement

#### PIP (Policy Information Point)

- Provides assignee certifications via Federated Catalogue lookup
- Supplies consignment destination country from resource attributes
- Aggregates runtime context for constraint evaluation
- Information Sources:
  - Federated Catalogue: Participant certifications
  - Resource Storage: Consignment attributes

#### PXP (Policy Execution Point)

- Schedules duty obligations with deadlines
- Tracks duty fulfillment status
- Monitors compliance and reports violations
- Integrated within application's notification delivery flow

#### PEP (Policy Enforcement Point)

- Enforces permit decision for notification delivery
- Coordinates with PXP to schedule duty obligations
- Controls notification distribution to authorized subscribers
- Integrated within Data Space Connector's activity flow

## Key Features Demonstrated

1. **ODRL Duty Clauses**: Permission with attached obligation (notify third party)
2. **Data Space Connector Integration**: Notification service authorization pattern
3. **Federated Catalogue Integration**: Dynamic certification lookup and participant discovery
4. **PartyCollection Refinement**: Certification-based access control
5. **Geographic Constraints**: Destination country filtering for notifications
6. **Obligation Tracking**: PXP schedules and monitors duty fulfillment
7. **Compliance Monitoring**: Track duty violations for policy enforcement
8. **Rights-Managed Automation**: Policy-driven notification distribution

## ODRL Standards Utilized

- `IOdrlAgreement` - Bilateral agreement with duty clause
- `IOdrlPermission` - Permission rule with attached duty
- `IOdrlDuty` - Obligation to notify third party after receiving notification
- `IOdrlConstraint` - PartyCollection refinement + geographic constraint + duty constraint
- `IOdrlPartyCollection` - Refinement with certification requirement
- Action: `"notify"` (notification permission), `"notifyThirdParty"` (duty action)
- Custom extension: `twin:jsonPath` leftOperand with companion `twin:jsonPathExpression` property for nested property extraction (`$.assigneeAttributes.certifications`, `$.resourceAttributes.consignment.destinationCountry.countryId`, `$.resourceAttributes.latestDocument.documentTypeCode` - each expression must start with `$`, the JSONPath root)

## Real-World Application

This pattern is commonly used in:

- **Regulatory Compliance**: Government agencies with notification obligations to clearing houses
- **Supply Chain Traceability**: Automated notifications with audit trail requirements
- **Data Space Ecosystems**: Federated notification systems with certification-based access
- **Multi-Party Workflows**: Notifications triggering third-party obligations
- **Compliance Monitoring**: Track obligation fulfillment for policy enforcement

## Testing Focus

- Verify PartyCollection constraint with Federated Catalogue certification lookup
- Test geographic constraint with consignment destination country filtering
- Validate duty extraction from permission and PXP scheduling
- Ensure notification delivery only to authorized, certified participants
- Test duty fulfillment tracking and compliance monitoring
- Confirm notification-trace.json audit trail for duty compliance
- Verify Data Space Connector integration with rights management
