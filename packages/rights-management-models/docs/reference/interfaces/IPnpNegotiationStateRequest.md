# Interface: IPnpNegotiationStateRequest

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

### pathParams

> **pathParams**: `object`

The path parameters of the request.

#### policyId

> **policyId**: `string`

The ID of the policy being requested.
