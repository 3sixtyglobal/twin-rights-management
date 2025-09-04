# Interface: IPolicyNegotiationPointComponent

Interface describing a Policy Negotiation Point (PNP) contract.
When receiving a request from another component, the PNP will negotiate the terms
of the request and determine the appropriate policies to create.

## Extends

- `IComponent`

## Methods

### negotiate()

> **negotiate**\<`C`\>(`assetType`, `action`, `resourceId`, `context`, `requesterInformation`, `proof`): `Promise`\<[`IPolicyState`](IPolicyState.md)\>

Processes an incoming negotiation request for the resource.

#### Type Parameters

##### C

`C` *extends* [`IPolicyContext`](IPolicyContext.md) = [`IPolicyContext`](IPolicyContext.md)

#### Parameters

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

##### proof

`IProof`

The proof provided by the requester to support the policy creation.

#### Returns

`Promise`\<[`IPolicyState`](IPolicyState.md)\>

The state of the policy.

***

### negotiationState()

> **negotiationState**(`policyId`, `nodeIdentity`, `proof`): `Promise`\<[`IPolicyState`](IPolicyState.md)\>

Retrieves the current state of a policy.

#### Parameters

##### policyId

`string`

The ID of the policy to retrieve the state for.

##### nodeIdentity

`string`

The identity of the node requesting the state retrieval.

##### proof

`IProof`

The proof provided by the requester to support the state retrieval.

#### Returns

`Promise`\<[`IPolicyState`](IPolicyState.md)\>

The current state of the policy.

***

### negotiationCancel()

> **negotiationCancel**(`policyId`, `nodeIdentity`, `proof`): `Promise`\<`void`\>

Cancels an ongoing negotiation for a resource.

#### Parameters

##### policyId

`string`

The ID of the policy to cancel.

##### nodeIdentity

`string`

The identity of the node requesting the cancellation.

##### proof

`IProof`

The proof provided by the requester to support the cancellation.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### registerNegotiator()

> **registerNegotiator**(`negotiatorId`, `negotiator`): `Promise`\<`void`\>

Register a negotiator to use for handling data.

#### Parameters

##### negotiatorId

`string`

The id of the negotiator to register.

##### negotiator

[`IPolicyNegotiator`](IPolicyNegotiator.md)

The negotiator to register.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### unregisterNegotiator()

> **unregisterNegotiator**(`negotiatorId`): `Promise`\<`void`\>

Unregister a negotiator from the handling.

#### Parameters

##### negotiatorId

`string`

The id of the negotiator to unregister.

#### Returns

`Promise`\<`void`\>

Nothing.
