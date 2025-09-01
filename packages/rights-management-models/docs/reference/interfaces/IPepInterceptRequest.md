# Interface: IPepInterceptRequest

The request structure for intercepting a request and enforcing a policy.

## Properties

### body

> **body**: `object`

The body parameters of the request.

#### assetType

> **assetType**: `string`

The type of the asset to enforce the policy on.

#### action

> **action**: `string`

The action to perform on the asset.

#### context?

> `optional` **context**: `unknown`

The context in which the action is being performed.
userIdentity and nodeIdentity should not be passed as they will
be populated by the authenticated context on the server side.

#### data?

> `optional` **data**: `unknown`

The data to include in the request.
