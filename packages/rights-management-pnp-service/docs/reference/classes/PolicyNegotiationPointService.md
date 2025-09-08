# Class: PolicyNegotiationPointService

Class implementation of Policy Negotiation Point Component.

## Implements

- `IPolicyNegotiationPointComponent`

## Constructors

### Constructor

> **new PolicyNegotiationPointService**(`options?`): `PolicyNegotiationPointService`

Create a new instance of PolicyNegotiationPointService (PNP).

#### Parameters

##### options?

[`IPolicyNegotiationPointServiceConstructorOptions`](../interfaces/IPolicyNegotiationPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyNegotiationPointService`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

The class name of the Policy Negotiation Point Service.

#### Implementation of

`IPolicyNegotiationPointComponent.CLASS_NAME`

## Methods

### negotiate()

> **negotiate**(`assetType`, `action`, `resourceId`, `nodeIdentity`, `information`, `proof`): `Promise`\<`IPolicyState`\>

Processes an incoming negotiation request for the resource.

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

##### nodeIdentity

`string`

The identity of the node making the request.

##### information

Information provided by the requester to determine if a policy can be created.

`undefined` | \{\[`source`: `string`\]: `IJsonLdNodeObject`[]; \}

##### proof

`IProof`

The proof provided by the requester to support the policy creation.

#### Returns

`Promise`\<`IPolicyState`\>

The state of the policy.

#### Implementation of

`IPolicyNegotiationPointComponent.negotiate`

***

### negotiationState()

> **negotiationState**(`policyId`, `nodeIdentity`, `proof`): `Promise`\<`IPolicyState`\>

Retrieves the current state of a policy negotiation.

#### Parameters

##### policyId

`string`

The ID of the policy to retrieve the state for.

##### nodeIdentity

`string`

The identity of the node requesting the state retrieval.

##### proof

`IProof`

The proof provided by the requester to support the policy retrieval.

#### Returns

`Promise`\<`IPolicyState`\>

The current state of the policy.

#### Implementation of

`IPolicyNegotiationPointComponent.negotiationState`

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
