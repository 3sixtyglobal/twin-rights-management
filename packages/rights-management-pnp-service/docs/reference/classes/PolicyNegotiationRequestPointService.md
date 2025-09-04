# Class: PolicyNegotiationRequestPointService

Class implementation of Policy Negotiation Request Point Component.

## Implements

- `IPolicyNegotiationRequestPointComponent`

## Constructors

### Constructor

> **new PolicyNegotiationRequestPointService**(`options`): `PolicyNegotiationRequestPointService`

Create a new instance of PolicyNegotiationRequestPointService (PNRP).

#### Parameters

##### options

[`IPolicyNegotiationRequestPointServiceConstructorOptions`](../interfaces/IPolicyNegotiationRequestPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyNegotiationRequestPointService`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

The class name of the Policy Negotiation Point Service.

#### Implementation of

`IPolicyNegotiationRequestPointComponent.CLASS_NAME`

## Methods

### start()

> **start**(`nodeIdentity`, `nodeLoggingComponentType`): `Promise`\<`void`\>

The component needs to be started when the node is initialized.

#### Parameters

##### nodeIdentity

`string`

The identity of the node starting the component.

##### nodeLoggingComponentType

The node logging component type.

`undefined` | `string`

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyNegotiationRequestPointComponent.start`

***

### negotiate()

> **negotiate**(`url`, `assetType`, `action`, `resourceId`): `Promise`\<`IPolicyState`\>

Send a negotiation request to an external node.

#### Parameters

##### url

`string`

The URL of the negotiation target.

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

##### resourceId

The ID of the resource being requested, can be empty if asset type access requested.

`undefined` | `string`

#### Returns

`Promise`\<`IPolicyState`\>

The state of the policy.

#### Implementation of

`IPolicyNegotiationRequestPointComponent.negotiate`

***

### negotiationState()

> **negotiationState**(`url`, `policyId`): `Promise`\<`IPolicyState`\>

Retrieves the current state of a policy from an external node.

#### Parameters

##### url

`string`

The URL of the negotiation target.

##### policyId

`string`

The ID of the policy to retrieve the state for.

#### Returns

`Promise`\<`IPolicyState`\>

The current state of the policy.

#### Implementation of

`IPolicyNegotiationRequestPointComponent.negotiationState`

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

#### Implementation of

`IPolicyNegotiationRequestPointComponent.negotiationCancel`
