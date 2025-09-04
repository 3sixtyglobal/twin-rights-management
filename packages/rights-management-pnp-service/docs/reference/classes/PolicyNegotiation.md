# Class: PolicyNegotiation

Class describing a rights management policy negotiation.

## Constructors

### Constructor

> **new PolicyNegotiation**(): `PolicyNegotiation`

#### Returns

`PolicyNegotiation`

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

### context

> **context**: `IPolicyContext`

The context of the negotiation.

***

### requesterInformation?

> `optional` **requesterInformation**: `object`

The requester information.

#### Index Signature

\[`source`: `string`\]: `IJsonLdNodeObject`[]

***

### status

> **status**: `PolicyNegotiationStatus`

The status of the negotiation.

***

### reason?

> `optional` **reason**: `string`

A reason which might be provided if the negotiation status is not approved.

***

### expires?

> `optional` **expires**: `number`

The expiration time for the policy negotiation.
