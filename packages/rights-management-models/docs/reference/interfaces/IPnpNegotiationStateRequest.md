# Interface: IPnpNegotiationStateRequest

The request structure for negotiating a policy.

## Properties

### pathParams

> **pathParams**: `object`

The path parameters of the request.

#### policyId

> **policyId**: `string`

The ID of the policy being requested.

***

### body

> **body**: `object`

The body of the request.

#### nodeIdentity

> **nodeIdentity**: `string`

The node sending the request.

#### proof

> **proof**: `IProof`

The proof provided by the requester to support the request.
