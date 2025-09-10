# Interface: IPolicyNegotiationPointComponent

Interface describing a Policy Negotiation Point (PNP) contract.
When receiving a request from another component, the PNP will negotiate the terms
of the request and determine the appropriate policies to create.

## Extends

- `IComponent`

## Methods

### negotiate()

> **negotiate**(`locator`, `information`, `proof`): `Promise`\<[`IPolicyState`](IPolicyState.md)\>

Processes an incoming negotiation request for the resource.

#### Parameters

##### locator

[`IPolicyLocator`](IPolicyLocator.md)

The locator to find relevant policies.

##### information

Information provided by the requester to determine if a policy can be created.

`undefined` | [`IPolicyInformation`](IPolicyInformation.md)

##### proof

`IProof`

The proof provided by the requester to support the policy creation.

#### Returns

`Promise`\<[`IPolicyState`](IPolicyState.md)\>

The state of the policy.

***

### negotiationState()

> **negotiationState**(`policyId`, `assignee`, `proof`): `Promise`\<[`IPolicyState`](IPolicyState.md)\>

Retrieves the current state of a policy.

#### Parameters

##### policyId

`string`

The ID of the policy to retrieve the state for.

##### assignee

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

> **negotiationCancel**(`policyId`, `assignee`, `proof`): `Promise`\<`void`\>

Cancels an ongoing negotiation for a resource.

#### Parameters

##### policyId

`string`

The ID of the policy to cancel.

##### assignee

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
