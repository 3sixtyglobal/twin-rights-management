# Interface: IPolicyNegotiationRequestPointServiceConfig

Options for the Policy Negotiation Request Point Component.

## Properties

### proofTtlInSeconds?

> `optional` **proofTtlInSeconds**: `number`

The time-to-live (TTL) for proof in seconds.

#### Default

```ts
300 (5 minutes)
```

***

### rightsManagementMethodId?

> `optional` **rightsManagementMethodId**: `string`

The id of the identity method to use when signing/verifying proofs.

#### Default

```ts
rights-management-assertion
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
