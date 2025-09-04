# Interface: IPolicyNegotiationRequestPointServiceConfig

Options for the Policy Negotiation RequestPoint Component.

## Properties

### negotiationMethodId?

> `optional` **negotiationMethodId**: `string`

The id of the identity method to use when signing/verifying negotiations.

#### Default

```ts
policy-negotiation-assertion
```

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
