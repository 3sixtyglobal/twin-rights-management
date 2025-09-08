# Interface: IPolicyNegotiationRequest

The JSON-LD definition for the policy negotiation proof.

## Properties

### @context

> **@context**: \[`"https://www.w3.org/ns/credentials/v2"`, `"https://schema.twindev.org/rights-management"`\]

The JSON-LD context.

***

### type

> **type**: `"PolicyNegotiationRequest"`

The type of the proof.

***

### assetType

> **assetType**: `string`

The asset type.

***

### action

> **action**: `string`

The action type.

***

### resourceId?

> `optional` **resourceId**: `string`

The specific resource id or can be left undefined for a whole asset class.

***

### nodeIdentity

> **nodeIdentity**: `string`

The id of the the node.

***

### information?

> `optional` **information**: `object`

Additional information provided by the requester to determine if a policy can be created.

#### Index Signature

\[`source`: `string`\]: `IJsonLdNodeObject`[]

***

### proof

> **proof**: `IProof`

The proof object.
