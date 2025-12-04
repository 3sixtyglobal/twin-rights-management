# Class: ExamplePolicyNegotiator

Example Policy Negotiator.

## Implements

- `IPolicyNegotiator`

## Constructors

### Constructor

> **new ExamplePolicyNegotiator**(`options?`): `ExamplePolicyNegotiator`

Create a new instance of ExamplePolicyNegotiator.

#### Parameters

##### options?

[`IExamplePolicyNegotiatorConstructorOptions`](../interfaces/IExamplePolicyNegotiatorConstructorOptions.md)

The options for the example policy negotiator.

#### Returns

`ExamplePolicyNegotiator`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Example Policy Negotiator.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyNegotiator.className`

***

### supportsOffer()

> **supportsOffer**(`offer`): `boolean`

Determines if the negotiator supports the given offer.

#### Parameters

##### offer

`IOdrlOffer`

The offer to check.

#### Returns

`boolean`

Sets the supports flag if it can be offered, and the interventionRequired flag if manual agreement is needed.

#### Implementation of

`IPolicyNegotiator.supportsOffer`

***

### handleOffer()

> **handleOffer**(`offer`, `information?`): `Promise`\<\{ `accepted`: `boolean`; `interventionRequired`: `boolean`; \}\>

Handle the offer.

#### Parameters

##### offer

`IOdrlOffer`

The offer to check.

##### information?

`IPolicyInformation`

Information provided by the requester to determine if a policy can be created.

#### Returns

`Promise`\<\{ `accepted`: `boolean`; `interventionRequired`: `boolean`; \}\>

Sets the accepted flag if it can be offered, and the interventionRequired flag if manual agreement is needed.

#### Implementation of

`IPolicyNegotiator.handleOffer`

***

### createAgreement()

> **createAgreement**(`offer`, `information?`): `Promise`\<`IOdrlAgreement` \| `undefined`\>

Create an agreement based on the offer.

#### Parameters

##### offer

`IOdrlOffer`

The offer to create the agreement from.

##### information?

`IPolicyInformation`

Information provided by the requester to aid in the creation of the agreement.

#### Returns

`Promise`\<`IOdrlAgreement` \| `undefined`\>

The agreement created from the offer or undefined if an agreement could not be created.

#### Implementation of

`IPolicyNegotiator.createAgreement`
