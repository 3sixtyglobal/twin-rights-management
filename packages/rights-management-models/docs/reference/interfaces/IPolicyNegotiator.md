# Interface: IPolicyNegotiator

Interface describing a Policy Negotiator.

## Methods

### canNegotiate()

> **canNegotiate**(`assetType`, `action`): `boolean`

Determines if the negotiator can handle the specified asset type and action.

#### Parameters

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

#### Returns

`boolean`

True if the negotiator can handle the asset type and action, false otherwise.

***

### negotiate()

> **negotiate**\<`C`\>(`policyId`, `assetType`, `action`, `resourceId`, `context`, `requesterInformation`): `Promise`\<\{ `state`: [`IPolicyState`](IPolicyState.md); `policy?`: `IOdrlPolicy`; \}\>

Determines if a policy can be created for the requested resource.

#### Type Parameters

##### C

`C` *extends* [`IPolicyContext`](IPolicyContext.md) = [`IPolicyContext`](IPolicyContext.md)

#### Parameters

##### policyId

`string`

The policy id to use if creating a new policy.

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

##### resourceId

The ID of the resource being requested, can be empty if asset type access requested.

`undefined` | `string`

##### context

`C`

The context from the requesting node.

##### requesterInformation

Information provided by the requester to determine if a policy can be created.

`undefined` | \{\[`source`: `string`\]: `IJsonLdNodeObject`[]; \}

#### Returns

`Promise`\<\{ `state`: [`IPolicyState`](IPolicyState.md); `policy?`: `IOdrlPolicy`; \}\>

The state of the policy and the actual policy if it was approved.
