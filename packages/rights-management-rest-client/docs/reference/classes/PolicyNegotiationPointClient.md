# Class: PolicyNegotiationPointClient

Client for performing Rights Management Policy Negotiation through to REST endpoints.

## Extends

- `BaseRestClient`

## Implements

- `IPolicyNegotiationPointComponent`

## Constructors

### Constructor

> **new PolicyNegotiationPointClient**(`config`): `PolicyNegotiationPointClient`

Create a new instance of PolicyNegotiationPointClient.

#### Parameters

##### config

`IBaseRestClientConfig`

The configuration for the client.

#### Returns

`PolicyNegotiationPointClient`

#### Overrides

`BaseRestClient.constructor`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IPolicyNegotiationPointComponent.CLASS_NAME`

## Methods

### negotiate()

> **negotiate**(`locator`, `information`, `proofToken`): `Promise`\<`IPolicyState`\>

Processes an incoming negotiation request for the resource.

#### Parameters

##### locator

`IPolicyLocator`

The locator to find relevant policies.

##### information

Information provided by the requester to determine if a policy can be created.

`undefined` | `IPolicyInformation`

##### proofToken

`string`

The proof provided by the requester to support the policy creation.

#### Returns

`Promise`\<`IPolicyState`\>

The state of the policy.

#### Implementation of

`IPolicyNegotiationPointComponent.negotiate`

***

### negotiationState()

> **negotiationState**(`policyId`, `proofToken`): `Promise`\<`IPolicyState`\>

Retrieves the current state of a policy.

#### Parameters

##### policyId

`string`

The ID of the policy to retrieve the state for.

##### proofToken

`string`

The proof provided by the requester.

#### Returns

`Promise`\<`IPolicyState`\>

The current state of the policy.

#### Implementation of

`IPolicyNegotiationPointComponent.negotiationState`

***

### negotiationCancel()

> **negotiationCancel**(`policyId`, `proofToken`): `Promise`\<`void`\>

Cancels an ongoing negotiation for a resource.

#### Parameters

##### policyId

`string`

The ID of the policy to cancel.

##### proofToken

`string`

The proof provided by the requester.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyNegotiationPointComponent.negotiationCancel`

***

### registerNegotiator()

> **registerNegotiator**(`negotiatorId`, `negotiator`): `Promise`\<`void`\>

Register a negotiator to use for handling data.

#### Parameters

##### negotiatorId

`string`

The id of the negotiator to register.

##### negotiator

`IPolicyNegotiator`

The negotiator to register.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyNegotiationPointComponent.registerNegotiator`

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

#### Implementation of

`IPolicyNegotiationPointComponent.unregisterNegotiator`
