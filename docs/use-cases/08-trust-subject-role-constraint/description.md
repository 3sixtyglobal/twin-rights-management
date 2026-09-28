# Use Case 8: Trust Subject Role Constraint

> **Note**: TypeScript snippets in this document are illustrative examples showing conceptual flow. For exact API signatures, refer to the interface definitions in `rights-management-models/src/models/`.

## Business Context

A veterinary agency publishes veterinary certificate documents to the border agencies of destination countries. The agency does not want to negotiate a separate offer with every agency, and it cannot look up a remote organisation's role itself. Instead the offer grants `read` to any consumer whose verified negotiation subject declares the role `BorderAgency`. This use case shows how that attribute travels from the consumer's information source into the trust token, onto the agreement as `trustData`, and into the arbiter's `information` data source, where a `$.subject.role` constraint grants or denies the read.

It is the first use case whose fixtures carry a trust subject. UC1 to UC7 evaluate attributes served by the provider's own information sources; this one evaluates an attribute asserted by the counterparty.

## Prerequisites

This use case assumes the agreement in PAP was produced by policy negotiation (Phase 1), because the trust subject only exists as a result of that negotiation. An administratively created agreement carries no `trustData` unless the administrator supplies it, in which case the `$.subject.role` constraint denies.

## Component Files

**Negotiation (Phase 1)**:

- [`trust-payload.json`](./trust-payload.json) - The decoded negotiation trust token: the consumer's public information as the credential subject, plus the static information source entry that produced it

**Policy Storage (PAP)**:

- [`pap-agreement.json`](./pap-agreement.json) - Stored agreement carrying the `trustData` block persisted at finalisation

**Policy Lookup (PMP)**:

- [`pmp-policy-locator.json`](./pmp-policy-locator.json) - Agreement lookup by assigner, assignee, action and target

**Runtime Context (PIP)**:

- [`pip-context.json`](./pip-context.json) - The `information` object the arbiter receives: information source output with `trustData` merged over it

**Policy Decision (PDP)**:

- [`pdp-request.json`](./pdp-request.json) - Evaluation request
- [`pdp-decision.json`](./pdp-decision.json) - Permit decision with the constraint evaluated against the trust subject

**Access Request**:

- [`access-request.json`](./access-request.json) - Policy locator for the read

**Data Examples**:

- [`source-data.json`](./source-data.json) - The veterinary certificate document being read

**Legacy/Reference**:

- [`policy.json`](./policy.json) - Agreement policy (also stored in PAP)
- [`expected-decision.json`](./expected-decision.json) - Expected decision, including the denied variant for a `Carrier` role

## Parties Involved

**Assigner (Data Provider)**:

- Identity: `did:iota:testnet:0x1ee831611a9fe9877c82e05075d9670c4970b4fd0904c208082ee50e45817a9d`
- Role: Polish Veterinary Agency (GIW) publishing veterinary certificate documents
- Resource: `https://twin.example.org/data-resources/vet-cert-doc-6ce567`

**Assignee (Data Consumer)**:

- Identity: `did:iota:testnet:0xac534b750ac453d573a55954760af140f87358c7be9a18000a831c452c32f246`
- Role: UK Food Standards Agency, acting as a border agency
- Published attributes: `role` = `BorderAgency`, `country` = `GB`

**Denied variant**: a consumer node whose published `role` is `Carrier` negotiates the same offer and is denied at access time.

## Scenario Flow

### Phase 1: Policy Negotiation (Where the Trust Subject Comes From)

1. **Consumer configuration.** The consumer node registers the static information source with a public entry:

   ```json
   {
     "information": [
       { "accessMode": "public", "objects": { "role": "BorderAgency", "country": "GB" } }
     ]
   }
   ```

2. **Consumer PNP request.** When the consumer requests the offer, `PolicyNegotiationPointService` calls `policyInformationPoint.retrieve(undefined, PolicyInformationAccessMode.Public)`. Only the static entry answers (the identity sources need a policy), so the result is `{ "role": "BorderAgency", "country": "GB" }`. The PNP passes it to the trust component as `{ subject }`, and the JWT verifiable credential generator issues a credential with that object as its `credentialSubject`, signed by the consumer organisation identity ([`trust-payload.json`](./trust-payload.json)).

3. **Provider PNP verification.** On the contract request the provider's PNP verifies the token with `TrustHelper.verifyTrust`: expiry, signature and revocation through the identity component, and the presence of an issuer and a credential subject. The verification info carries the issuer as the counterparty identity and two data objects, `verifiableCredential` and `subject`. The PNP stores it on the negotiation and hands the data to the negotiator's `handleOffer`.

4. **Agreement finalisation.** At finalisation the PNP creates the agreement in PAP with `trustData` set to the verified data. [`pap-agreement.json`](./pap-agreement.json) shows the stored result: the rules from the offer, the assignee pinned to the consumer identity, and the `trustData` block with `subject.role` = `BorderAgency`.

### Phase 2: Access Request and Evaluation (Runtime)

#### 1. Access Request (Application Code → PEP)

The consumer reads the document through the provider's data plane, or the provider's application code enforces the agreement directly:

```typescript
// Provider application code: enforce by agreement id.
// interceptWithId loads the agreement from PAP and forwards its trustData itself.
const released = await pep.interceptWithId(agreementId, document, 'read');
```

```typescript
// Provider application code holding the agreement already (the dataspace data plane path).
const released = await pep.interceptWithPolicy(agreement, document, 'read', agreement.trustData);
```

#### 2. Policy Lookup (PMP)

The locator matches on assigner, assignee, action and target ([`pmp-policy-locator.json`](./pmp-policy-locator.json)). The trust subject is not a lookup key; it is consulted only once the agreement has been found.

#### 3. Information Gathering and Merge (PIP + PDP)

The PDP calls the PIP with the agreement and `PolicyInformationAccessMode.Any`, then spreads the agreement's `trustData` over the result. [`pip-context.json`](./pip-context.json) shows the merged object: `subject` and `verifiableCredential` from the trust data, alongside whatever the registered information sources returned. The `subject` key wins on any collision.

#### 4. Policy Evaluation (Arbiter)

The permission has no target of its own, so it inherits the agreement target (the document identifier), which the arbiter resolves to the whole payload because it equals the policy-level asset. The constraint reads `$.subject.role` from the `information` data source and compares it with `BorderAgency`:

- `BorderAgency` → the constraint holds, the permission applies, decision `[{ target: "$", decision: "Granted" }]`.
- `Carrier` → the constraint fails, no permission applies, closed-world decision `[{ target: "$", decision: "Denied" }]`.

#### 5. Enforcement (PEP)

A single `Granted` decision on `$` returns the document unchanged; a single `Denied` decision on `$` returns an empty object (or `false` when no payload was supplied).

## Expected Behaviour

### Granted (Trust Subject Role = BorderAgency)

- PIP output merged with `trustData`: `information.subject.role` is `BorderAgency` ✓
- Constraint `$.subject.role eq BorderAgency` satisfied ✓
- **Result**: the consumer receives the full veterinary certificate document

### Denied (Trust Subject Role = Carrier)

- `information.subject.role` is `Carrier` ✗
- No permission applies; the closed-world default denies
- **Result**: the consumer receives nothing

### Denied (No Trust Data)

An agreement without `trustData` gives the arbiter an `information` object with no `subject` key. The constraint cannot be satisfied and the read is denied, which is the expected outcome for an agreement that was never negotiated.

## Alternative Form: Party Scoping

The same condition can be written as a `PartyCollection` refinement on the permission's `assignee` instead of a rule constraint:

```json
{
  "action": "read",
  "assignee": {
    "@type": "PartyCollection",
    "refinement": {
      "leftOperand": "twin:jsonPath",
      "twin:jsonPathDataSource": "information",
      "twin:jsonPathExpression": "$.subject.role",
      "operator": "eq",
      "rightOperand": "BorderAgency"
    }
  }
}
```

Both forms are evaluated against the same `information` object and give the same decisions. The party-scoped form is the ODRL-idiomatic way to say "applies to any assignee with this attribute"; the rule-constraint form used in [`policy.json`](./policy.json) keeps the assignee pinned to the negotiated identity and adds the attribute check on top.

## Security Note

The subject is self-asserted by the consumer node. Verification proves that the token was issued and signed by the identity it names, and that it is neither expired nor revoked; it does not attest that the organisation is a border agency. Treat `$.subject.*` constraints as checks on the counterparty's declaration.

## Architecture Components Used

### Phase 1 Components

#### PIP (Consumer Side)

- Answers the policy-less `Public` retrieve from the static source's public entries
- Produces the object that becomes the credential subject

#### PNP (Both Sides)

- Consumer: gathers the public information and issues the trust token through the trust component
- Provider: verifies the token on every message and persists the verified data as `trustData` at finalisation

#### PAP

- Stores the agreement together with `trustData`
- Returns `trustData` with the agreement on every read

### Phase 2 Components

#### PEP

- Forwards the agreement's `trustData` to the PDP (`interceptWithId` and `interceptWithLocator` do so automatically; `interceptWithPolicy` takes it as a parameter)

#### PDP

- Calls the PIP with `PolicyInformationAccessMode.Any` and merges `trustData` over the result

#### Arbiter

- Resolves the inherited plain target to `$`
- Evaluates the `$.subject.role` constraint against the `information` data source

## Key Features Demonstrated

1. **Trust subject flow**: consumer information source → trust token → `trustData` → `information` → constraint
2. **Policy-less Public retrieve**: which sources answer at negotiation start
3. **Information data source constraints**: `twin:jsonPathDataSource: "information"` with a `$.subject.*` path
4. **Inherited plain target**: an untargeted rule under an agreement whose target is the asset identifier resolves to the whole payload
5. **Closed-world denial**: a failed constraint with no other permission denies

## Testing Focus

- `policy.json` and `pip-context.json` are loaded by the arbiter test suite (`defaultPolicyArbiter.spec.ts`, "UC8 policy.json grants/denies via the trust subject"), which expects `Granted` for the fixture subject and `Denied` for a `Carrier` subject
- The same test asserts that `pap-agreement.json` stores the subject that `pip-context.json` shows, so the two fixtures cannot drift apart
- Verify that an agreement without `trustData` denies
- Verify that the subject nesting is one level deep: sources publish top-level keys, the verifier adds `subject`
