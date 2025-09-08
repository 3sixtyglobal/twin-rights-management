# Interface: IPolicyRequest

The JSON-LD definition for a proof request.

## Properties

### @context

> **@context**: \[`"https://www.w3.org/ns/credentials/v2"`, `"https://schema.twindev.org/rights-management"`\]

The JSON-LD context.

***

### type

> **type**: `"PolicyRequest"`

The type of the proof.

***

### id

> **id**: `string`

The id of the policy.

***

### nodeIdentity

> **nodeIdentity**: `string`

The id of the the node.

***

### proof

> **proof**: `IProof`

The proof object.
