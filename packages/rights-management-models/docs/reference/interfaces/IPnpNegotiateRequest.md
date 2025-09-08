# Interface: IPnpNegotiateRequest

The request structure for negotiating a policy.

## Properties

### headers?

> `optional` **headers**: `object`

The headers which can be used to determine the response data type.

#### accept

> **accept**: `"application/ld+json"` \| `"application/json"`

***

### body

> **body**: [`IPolicyNegotiationRequest`](IPolicyNegotiationRequest.md)

The body parameters of the request.
