# Interface: IPolicyNegotiation

Interface describing a rights management policy negotiation.

## Properties

### id

> **id**: `string`

The unique identifier for the policy.

***

### dateCreated

> **dateCreated**: `string`

The date and time when the negotiation was created.

***

### assetType

> **assetType**: `string`

The asset type the negotiation is for.

***

### action

> **action**: `string`

The action the negotiation is for.

***

### resourceId?

> `optional` **resourceId**: `string`

The resource id the negotiation is for.

***

### nodeIdentity

> **nodeIdentity**: `string`

The identity of the node making the request.

***

### information?

> `optional` **information**: `object`

The requester information.

#### Index Signature

\[`source`: `string`\]: `IJsonLdNodeObject`[]

***

### status

> **status**: [`PolicyNegotiationStatus`](../type-aliases/PolicyNegotiationStatus.md)

The status of the negotiation.

***

### reason?

> `optional` **reason**: `string`

A reason which might be provided if the negotiation status is not approved.

***

### expires?

> `optional` **expires**: `number`

The expiration time for the policy negotiation.
