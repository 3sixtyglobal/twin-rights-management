# Interface: IPnpNegotiateRequest

The request structure for negotiating a policy.

## Properties

### headers

> **headers**: `object`

The headers which can be used to determine the response data type.

#### accept?

> `optional` **accept**: `"application/ld+json"` \| `"application/json"`

#### authorization

> **authorization**: `string`

***

### body

> **body**: [`IPolicyNegotiationRequest`](IPolicyNegotiationRequest.md)

The body parameters of the request.
