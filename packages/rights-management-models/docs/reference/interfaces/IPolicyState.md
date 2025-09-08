# Interface: IPolicyState

The state of the policy negotiation.

## Properties

### @context

> **@context**: `"https://schema.twindev.org/rights-management"`

The JSON-LD context.

***

### type

> **type**: `"PolicyState"`

The type of the proof.

***

### id

> **id**: `string`

The id of the policy.

***

### status

> **status**: [`PolicyNegotiationStatus`](../type-aliases/PolicyNegotiationStatus.md)

The current status of the policy negotiation.

***

### reason?

> `optional` **reason**: `string`

A reason which might be provided if the negotiation status is not approved.

***

### expires?

> `optional` **expires**: `string`

The expiration date of the policy created by the negotiation if it was approved, and it has an expiration date.
