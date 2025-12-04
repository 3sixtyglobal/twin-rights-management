# Class: ExamplePolicyRequester

Example Policy Requester.

## Implements

- `IPolicyRequester`

## Constructors

### Constructor

> **new ExamplePolicyRequester**(`options?`): `ExamplePolicyRequester`

Create a new instance of ExamplePolicyRequester.

#### Parameters

##### options?

[`IExamplePolicyRequesterConstructorOptions`](../interfaces/IExamplePolicyRequesterConstructorOptions.md)

The options for the example policy Requester.

#### Returns

`ExamplePolicyRequester`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Example Policy Requester.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyRequester.className`

***

### requesterId()

> **requesterId**(): `string`

The unique id of the requester.

#### Returns

`string`

The requester id.

#### Implementation of

`IPolicyRequester.requesterId`

***

### offer()

> **offer**(`negotiationId`, `offer`): `Promise`\<`boolean`\>

A policy has been offered by a provider, let the requester know about it.

#### Parameters

##### negotiationId

`string`

The id of the negotiation.

##### offer

`IOdrlOffer`

The offer sent by the provider.

#### Returns

`Promise`\<`boolean`\>

True if the offer was accepted, false otherwise.

#### Implementation of

`IPolicyRequester.offer`

***

### agreement()

> **agreement**(`negotiationId`, `agreement`): `Promise`\<`boolean`\>

A policy agreement has been sent by a provider, let the requester know about it.

#### Parameters

##### negotiationId

`string`

The id of the negotiation.

##### agreement

`IOdrlAgreement`

The agreement sent by the provider.

#### Returns

`Promise`\<`boolean`\>

True if the agreement was accepted, false otherwise.

#### Implementation of

`IPolicyRequester.agreement`

***

### finalised()

> **finalised**(`negotiationId`): `Promise`\<`void`\>

A policy finalisation has been sent by a provider, let the requester know about it.

#### Parameters

##### negotiationId

`string`

The id of the negotiation.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyRequester.finalised`

***

### terminated()

> **terminated**(`negotiationId`): `Promise`\<`void`\>

A policy termination has been sent by a provider, let the requester know about it.

#### Parameters

##### negotiationId

`string`

The id of the negotiation.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyRequester.terminated`
