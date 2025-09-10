# Interface: IPolicyNegotiationRequestPointComponent

Interface describing a Policy Negotiation Request Point (PNRP) contract.
Can be used to create the requests to send to other nodes.

## Extends

- `IComponent`

## Methods

### negotiate()

> **negotiate**(`url`, `locator`): `Promise`\<[`IPolicyState`](IPolicyState.md)\>

Send a negotiation request to an external node.

#### Parameters

##### url

`string`

The URL of the negotiation target.

##### locator

`Omit`\<[`IPolicyLocator`](IPolicyLocator.md), `"assignee"`\>

The locator to find relevant policies.

#### Returns

`Promise`\<[`IPolicyState`](IPolicyState.md)\>

The state of the policy.

***

### negotiationState()

> **negotiationState**(`url`, `policyId`): `Promise`\<[`IPolicyState`](IPolicyState.md)\>

Retrieves the current state of a policy from an external node.

#### Parameters

##### url

`string`

The URL of the negotiation target.

##### policyId

`string`

The ID of the policy to retrieve the state for.

#### Returns

`Promise`\<[`IPolicyState`](IPolicyState.md)\>

The current state of the policy.

***

### negotiationCancel()

> **negotiationCancel**(`url`, `policyId`): `Promise`\<`void`\>

Cancels an ongoing negotiation for a resource from an external node.

#### Parameters

##### url

`string`

The URL of the negotiation target.

##### policyId

`string`

The ID of the policy to cancel.

#### Returns

`Promise`\<`void`\>

Nothing.
