# Interface: IPnpNegotiationStateResponse

The response structure for negotiation state request.

## Properties

### headers?

> `optional` **headers**: `object`

The headers which can be used to determine the response data type.

#### content-type

> **content-type**: `"application/ld+json"` \| `"application/json"`

***

### body

> **body**: [`IPolicyState`](IPolicyState.md)

The state of the policy.
