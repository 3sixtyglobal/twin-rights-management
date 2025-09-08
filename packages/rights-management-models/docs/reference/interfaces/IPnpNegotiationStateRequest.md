# Interface: IPnpNegotiationStateRequest

The request structure for negotiating a policy.

## Properties

### headers?

> `optional` **headers**: `object`

The headers which can be used to determine the response data type.

#### accept

> **accept**: `"application/ld+json"` \| `"application/json"`

***

### pathParams

> **pathParams**: `object`

The path parameters of the request.

#### policyId

> **policyId**: `string`

The ID of the policy being requested.

***

### body

> **body**: `Omit`\<[`IPolicyRequest`](IPolicyRequest.md), `"id"`\>

The body of the request.
