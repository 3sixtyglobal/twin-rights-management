# Use Case 7: Policy Negotiation - Direct Agreement (REQUESTED → AGREED Shortcut)

> **Note**: TypeScript snippets in this document are illustrative examples showing conceptual flow. For exact API signatures, refer to the interface definitions in `rights-management-models/src/models/`.

## Business Context

The same Polish veterinary agency (GIW) from [UC6](../06-policy-negotiation-offer-to-agreement/) also publishes a second, lower-sensitivity Offer: public health advisory bulletins intended for broad, low-friction distribution to any verified Polish organization. Because this data class does not need per-request Negotiator review, GIW registers this Offer against a fast-track Negotiator that always signals `directAgreement: true` once the country-code constraint is satisfied.

The DSP 2025-1 Contract Negotiation state machine explicitly permits a Provider to respond to a `ContractRequestMessage` with a `ContractAgreementMessage` directly — collapsing `REQUESTED → OFFERED → ACCEPTED → AGREED` into a single `REQUESTED → AGREED` transition. This use case demonstrates that shortcut end-to-end, reusing UC6's Provider and Consumer identities so the two scenarios are directly comparable: same parties, same country-code constraint, same PDP/PEP runtime behavior — the only difference is how many negotiation messages it took to reach an Agreement.

This use case demonstrates **Phase 1 (Policy Lifecycle)**, specifically the `IPolicyNegotiator.handleOffer()` `directAgreement` signal introduced for this feature (`packages/rights-management-models/src/models/pnp/IPolicyNegotiator.ts`).

## Prerequisites

Like UC6, this use case demonstrates the **creation** of an Agreement policy from an Offer. No prior Agreement exists. Unlike UC6, no `OFFERED` or `ACCEPTED` intermediate state is ever observed for this negotiation — read UC6 first if you have not, since this use case is written as a direct contrast to it rather than a standalone introduction to PNP.

## Component Files

This use case includes the following component example files:

- [`offer-registration.json`](./offer-registration.json) - Offer policy registered against a fast-track Negotiator
- [`negotiation-initiation.json`](./negotiation-initiation.json) - Consumer's `ContractRequestMessage` (identical in shape to UC6's — the shortcut is a Provider-side decision, not something the Consumer requests)
- [`negotiator-evaluation.json`](./negotiator-evaluation.json) - Provider Negotiator evaluation trace, showing `directAgreement: true` in `finalDecision`
- [`agreement-message.json`](./agreement-message.json) - Provider-sent `ContractAgreementMessage`, arriving directly after the request with no prior Offer message (renamed from UC6's `agreement-acceptance.json` — see the correction note below)
- [`finalized-agreement.json`](./finalized-agreement.json) - Agreement result stored in PAP — structurally identical to a full-cycle Agreement
- [`state-transitions.json`](./state-transitions.json) - Complete audit trail showing `REQUESTED → AGREED → VERIFIED → FINALIZED`, with no `OFFERED`/`ACCEPTED` entries

**Correction note relative to UC6**: UC6's `agreement-acceptance.json` and `state-transitions.json` (prior to this feature's implementation) both misattributed `ContractAgreementMessage` to the Consumer and omitted the `ACCEPTED`/`VERIFIED` states entirely. Per the DSP 2025-1 spec (`specifications/negotiation/contract.negotiation.protocol.md`), `ContractAgreementMessage` is always Provider-sent, and `ACCEPTED` (Consumer, via `ContractNegotiationEventMessage`) is a mandatory intermediate state on the full cycle. UC6's files have been corrected alongside adding this use case, so the two can be read side by side without carrying forward the same inaccuracy into a second document.

## Parties Involved

**Provider (Assigner)** — identical to UC6:

- Identity: `did:iota:testnet:0xfcfa55894cab90504af7eaf38087addd5f77791a89bd3ebbe76d9c2b1a6ce567`
- Role: Polish veterinary agency (GIW)
- Resource: Public health advisory bulletins (lower sensitivity than UC6's veterinary certificates)
- Action: Registers Offer with a fast-track Negotiator configured for this asset class

**Consumer (Assignee)** — identical to UC6:

- Identity: `did:iota:testnet:0x1ee831611a9fe9877c82e05075d9670c4970b4fd0904c208082ee50e45817a9d`
- Role: Polish exporter seeking data access
- Attribute: Legal address with country code "PL"
- Action: Initiates negotiation; receives the Agreement directly

## Scenario Flow

### 1. Offer Registration (Provider → PNP)

GIW registers the health-bulletin Offer, associating it with `FastTrackHealthBulletinNegotiator` rather than the standard review negotiator used for UC6's veterinary certificate Offer. This association is a Provider-side deployment/configuration choice (which `IPolicyNegotiator` implementation is registered against which Offer's `supportsOffer()`), not part of the ODRL policy document itself.

**PNP State**: none yet — Offer registered but no negotiation started.

### 2. Negotiation Initiation (Consumer → Provider PNP)

The Polish exporter sends a `ContractRequestMessage` referencing the health-bulletin Offer — identical in every respect to how UC6's negotiation begins.

**PNP State**: REQUESTED

### 3. Negotiator Evaluation with `directAgreement` (Provider Side)

`FastTrackHealthBulletinNegotiator.handleOffer()` runs the same constraint checks as UC6's Negotiator (DID resolution, country-code match), but its `finalDecision` includes `directAgreement: true` alongside `accepted: true` and `interventionRequired: false`.

Inside `requestFromConsumer()` (`packages/rights-management-pnp-service/src/policyNegotiationPointService.ts`), the branch is:

```ts
if (negotiateResult.accepted) {
  if (!negotiateResult.interventionRequired) {
    if (negotiateResult.directAgreement) {
      // this use case: skip straight to building and sending the Agreement
      setTimeout(async () => {
        await this.sendAgreementToConsumer(callbackAddress, pol);
      }, 100);
    } else {
      // UC6: schedule the Offer message instead
      setTimeout(async () => {
        await this.sendOfferToConsumer(callbackAddress, pol);
      }, 100);
    }
  }
}
```

`interventionRequired` always takes precedence: a Negotiator that sets both `interventionRequired: true` and `directAgreement: true` on the same result stays at `REQUESTED` pending manual action — the shortcut never bypasses a pause for human review.

**PNP State**: REQUESTED → AGREED (direct)

### 4. Agreement Delivery (Provider → Consumer)

`sendAgreementToConsumer()` builds the Agreement (via `negotiator.createAgreement()`, exactly as UC6's `sendAgreementToConsumer()` does after `ACCEPTED`) and posts a `ContractAgreementMessage` to the Consumer's callback. Because there was no prior `OFFERED` interaction, the Consumer's `agreementFromProvider()` handler pins the Provider's verified identity on this call instead of checking it against an already-pinned value from an earlier step — see [Key Features Demonstrated](#key-features-demonstrated).

**Consumer Requester**: `agreement()` callback fires — same method, same signature as the full cycle.

### 5. Agreement Verification (Consumer → Provider)

Identical to the full cycle: the Consumer sends `ContractAgreementVerificationMessage`.

**PNP State**: AGREED → VERIFIED

### 6. Finalization (Provider → PAP → Consumer)

Identical to the full cycle: the Provider persists the Agreement to PAP and sends the `finalized` event.

**PNP State**: VERIFIED → FINALIZED

## Architecture Components Used

### PNP (Policy Negotiation Point)

- Same state machine implementation as UC6; the shortcut is a single conditional branch in `requestFromConsumer()`, not a separate code path
- `sendAgreementToConsumer()` is shared between the full cycle (called after `ACCEPTED`) and this shortcut (called after `REQUESTED`) — its internal state guard accepts either predecessor

### Negotiator (Provider Extension Point)

- `handleOffer()` return value gained an optional `directAgreement?: boolean` field for this feature
- `PassThroughPolicyNegotiator` (`rights-management-plugins`) always returns `directAgreement: true`, matching its always-auto-accept behavior
- A custom Negotiator (like the illustrative `FastTrackHealthBulletinNegotiator` in this use case) can set it conditionally, per-Offer or per-consumer

### Requester (Consumer Extension Point)

- Receives the same lifecycle callbacks as the full cycle (`agreement`, `finalised`) — `offer` is simply never called
- No changes were needed to `IPolicyRequester` for this feature

### PAP (Policy Administration Point)

- Identical role to UC6 — receives and stores the finalized Agreement, unaware of which negotiation path produced it

## IDS Contract Negotiation State Machine

```text
REQUESTED ────────────────────────► AGREED ──► VERIFIED ──► FINALIZED
    │  (skips OFFERED and ACCEPTED)    │             │
    ▼                                  ▼             ▼
TERMINATED                        TERMINATED    TERMINATED
```

Compare against UC6's full cycle:

```text
REQUESTED → OFFERED → ACCEPTED → AGREED → VERIFIED → FINALIZED
```

Both are valid DSP 2025-1 transitions from the same specification — `REQUESTED → AGREED: P` and `REQUESTED → OFFERED: P` are both explicit Provider-initiated transitions in the canonical state machine (`specifications/negotiation/figures/contract.negotiation.state.machine.puml`). Which one occurs is decided per-negotiation by the registered Negotiator, not by the protocol layer.

## Expected Behavior

### Successful Direct-Agreement Flow

1. **Offer Registration**: Provider registers Offer with a fast-track Negotiator ✓
2. **Consumer Initiation**: Consumer starts negotiation with valid context ✓
3. **Negotiator Evaluation**: Country code "PL" matches; `directAgreement: true` ✓
4. **Agreement Delivery**: Provider sends Agreement directly, no Offer/Accept round-trip ✓
5. **Verification & Finalization**: Proceeds identically to the full cycle ✓
6. **State**: FINALIZED with Agreement ID, `stateHistory` containing exactly 4 entries

### Full-Cycle Regression (Not a Failure Scenario — a Required Invariant)

A Negotiator that does **not** set `directAgreement` (or sets it `false`/`undefined`) must produce exactly UC6's behavior, unchanged. This is asserted directly in `tests/policyNegotiationPointService.spec.ts`'s `can perform the whole negotiation lifecycle` test, which uses a mock Negotiator without the field.

### `interventionRequired` Takes Precedence

- Negotiator sets both `interventionRequired: true` and `directAgreement: true`
- Negotiation stays at `REQUESTED`, pending manual PNAP intervention
- Neither `sendOfferToConsumer` nor `sendAgreementToConsumer` is scheduled

### Guard Widening Is Scoped Narrowly

- A `ContractAgreementMessage` arriving while the Consumer's local negotiation is at `OFFERED` (i.e. it never took the fast path) is still rejected with `invalidState`
- Same for `TERMINATED` and any other non-`REQUESTED`/`ACCEPTED` predecessor
- Only `REQUESTED` was added as a valid predecessor for this specific message type; nothing else about `agreementFromProvider`'s state gate changed

## Key Features Demonstrated

1. **DSP 2025-1 `REQUESTED → AGREED` Direct Transition**: Full state machine implementation of the Provider-initiated shortcut
2. **`IPolicyNegotiator.handleOffer()` `directAgreement` Signal**: How a Negotiator opts a negotiation into the shortcut
3. **Precedence Rule**: `interventionRequired` always overrides `directAgreement`
4. **Shared Agreement-Building Code Path**: `sendAgreementToConsumer()` serves both the full cycle and this shortcut without duplicated logic
5. **First-Contact Identity Pinning**: `agreementFromProvider()` pins the Provider's trust identity on first contact when no prior `OFFERED` interaction pinned it already — mirroring what `offerFromProvider()` does on the full cycle, so the "verify counterparty identity from first interaction" security property holds either way
6. **Requester Contract Is State-Agnostic**: `IPolicyRequester` needed no changes — `offer()` is simply never invoked on this path

## ODRL Standards Utilized

- `IOdrlOffer` - Initial Offer policy registered by Provider
- `IOdrlAgreement` - Finalized Agreement with specific assignee
- `IOdrlPermission` - Permission rule with action and constraints
- `IOdrlPartyCollection` - Filtered party collection in Offer
- `IOdrlConstraint` - Refinement constraint (country code)

## IDS Protocol Standards

- **ContractRequestMessage**: Consumer initiates negotiation (Consumer-sent)
- **ContractAgreementMessage**: Provider sends the Agreement (Provider-sent — arrives directly here, with no prior `ContractOfferMessage`)
- **ContractAgreementVerificationMessage**: Consumer confirms the Agreement (Consumer-sent)
- **ContractNegotiationEventMessage** (`event: FINALIZED`): Provider signals finalization (Provider-sent)

## Real-World Application

- **Low-Sensitivity Bulk Data Distribution**: Public advisories, open datasets, or catalogue-listed offers where per-request negotiator review adds latency without adding value
- **Pre-Vetted Partner Networks**: Government inter-agency exchanges or long-standing certified partners where the negotiation is a formality, not a decision point
- **High-Volume Automated Exchanges**: Data marketplaces where round-trip latency directly affects consumer experience at scale

## Testing Focus

- Verify the fast path reaches `AGREED` without ever being observed at `OFFERED` or `ACCEPTED` (`tests/policyNegotiationPointService.spec.ts`, `describe("direct agreement fast path (feat-150)")`)
- Verify `mockPolicyRequester.offer` is never called on the fast path
- Verify the full-cycle regression: a non-fast-track Negotiator still produces the UC6 behavior unchanged
- Verify `interventionRequired: true` + `directAgreement: true` stays at `REQUESTED`
- Verify `agreementFromProvider` still rejects `ContractAgreementMessage` arriving at `OFFERED` or `TERMINATED` — the widening is scoped to `REQUESTED`+`ACCEPTED` only
- Verify the Provider's trust identity is correctly pinned on first contact when arriving via the fast path (no prior `OFFERED` interaction to pin it)

## Extension Points

### Negotiator Customization

- **Per-asset-class fast-tracking**: Register different Negotiators for different Offers, as this use case does (`FastTrackHealthBulletinNegotiator` vs. UC6's standard review Negotiator)
- **Conditional `directAgreement`**: A single Negotiator implementation could return `directAgreement: true` only for consumers already known to the Provider (e.g. from a prior successful negotiation), and `false` for first-time consumers

## Relationship to Other Use Cases

- **UC6 (Policy Negotiation - Offer to Agreement)**: The full-cycle baseline this use case is a direct contrast to. Read UC6 first.
- **UC1 (Basic Data Resource Access)**: Could equally evaluate an Agreement created via this use case's fast path or UC6's full cycle — PDP/PEP behavior is identical either way, since the Agreement produced is structurally the same.

**Critical Connection**: Without this use case, a reader of UC6 might assume every negotiation always takes the full four-message round-trip. This use case shows that the DSP 2025-1 spec — and this codebase — support a shorter, equally valid path, and that the difference is entirely a Provider-side Negotiator decision, invisible to the Consumer's request and invisible to Phase 2 (PDP/PEP) evaluation.
