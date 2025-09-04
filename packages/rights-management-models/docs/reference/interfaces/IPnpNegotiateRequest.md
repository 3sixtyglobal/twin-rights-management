# Interface: IPnpNegotiateRequest

The request structure for negotiating a policy.

## Properties

### body

> **body**: `object`

The body parameters of the request.

#### assetType

> **assetType**: `string`

The type of the asset being requested.

#### action

> **action**: `string`

The action being performed on the asset.

#### resourceId?

> `optional` **resourceId**: `string`

The id of the item being requested.

#### context

> **context**: [`IPolicyContext`](IPolicyContext.md)

The context from the node making the request.

#### requesterInformation?

> `optional` **requesterInformation**: `object`

Additional information provided by the requester to determine if a policy can be created.

##### Index Signature

\[`source`: `string`\]: `IJsonLdNodeObject`[]

#### proof

> **proof**: `IProof`

The proof provided by the requester to support the policy creation.
