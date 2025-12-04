# Interface: IPolicyNegotiationPointServiceConfig

Options for the Policy Negotiation Point Component.

## Properties

### baseCallbackUrl

> **baseCallbackUrl**: `string`

The url to send in negotiation messages as the callback address.
This should be the externally reachable url of this PNP service.

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
