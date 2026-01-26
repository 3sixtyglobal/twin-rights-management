# Interface: IPolicyNegotiationPointServiceConfig

Options for the Policy Negotiation Point Component.

## Properties

### callbackPath

> **callbackPath**: `string`

The path to send in negotiation messages as the callback address.
Will be combined with the public origin url from hosting component.

***

### negotiationComponentCreator()

> **negotiationComponentCreator**: (`url`) => `Promise`\<`IPolicyNegotiationPointComponent`\>

A method for creating a new instance of the policy negotiation point component.
To be used when sending request remotely to another node.

#### Parameters

##### url

`string`

#### Returns

`Promise`\<`IPolicyNegotiationPointComponent`\>

***

### overrideTrustGeneratorType?

> `optional` **overrideTrustGeneratorType**: `string`

Override the default trust generator.
