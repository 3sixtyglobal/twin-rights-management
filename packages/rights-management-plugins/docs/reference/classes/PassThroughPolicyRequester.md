# Class: PassThroughPolicyRequester

Pass Through Policy Requester.

## Implements

- `IPolicyRequester`

## Constructors

### Constructor

> **new PassThroughPolicyRequester**(`options?`): `PassThroughPolicyRequester`

Create a new instance of PassThroughPolicyRequester.

#### Parameters

##### options?

[`IPassThroughPolicyRequesterConstructorOptions`](../interfaces/IPassThroughPolicyRequesterConstructorOptions.md)

The options for the pass through policy Requester.

#### Returns

`PassThroughPolicyRequester`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Pass Through Policy Requester.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyRequester.className`

***

### offer() {#offer}

> **offer**(`negotiationId`, `offer`): `Promise`\<`boolean`\>

A policy has been offered by a provider, let the request handler know about it.

#### Parameters

##### negotiationId

`string`

The id of the negotiation.

##### offer

`IDataspaceProtocolOffer`

The offer sent by the provider.

#### Returns

`Promise`\<`boolean`\>

True if the offer was accepted, false otherwise.

#### Implementation of

`IPolicyRequester.offer`

***

### agreement() {#agreement}

> **agreement**(`negotiationId`, `agreement`): `Promise`\<`boolean`\>

A policy agreement has been sent by a provider, let the request handler know about it.

#### Parameters

##### negotiationId

`string`

The id of the negotiation.

##### agreement

`IDataspaceProtocolAgreement`

The agreement sent by the provider.

#### Returns

`Promise`\<`boolean`\>

True if the agreement was accepted, false otherwise.

#### Implementation of

`IPolicyRequester.agreement`

***

### finalised() {#finalised}

> **finalised**(`negotiationId`): `Promise`\<`void`\>

A policy finalisation has been sent by a provider, let the request handler know about it.

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

### terminated() {#terminated}

> **terminated**(`negotiationId`): `Promise`\<`void`\>

A policy termination has been sent by a provider, let the request handler know about it.

#### Parameters

##### negotiationId

`string`

The id of the negotiation.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyRequester.terminated`
