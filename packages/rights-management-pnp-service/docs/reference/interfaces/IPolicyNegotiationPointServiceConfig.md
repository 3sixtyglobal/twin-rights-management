# Interface: IPolicyNegotiationPointServiceConfig

Options for the Policy Negotiation Point Component.

## Properties

### proofTtlInSeconds?

> `optional` **proofTtlInSeconds**: `number`

The time-to-live (TTL) for proof in seconds.

#### Default

```ts
300 (5 minutes)
```

***

### negotiators?

> `optional` **negotiators**: `object`[]

Initial negotiators to register with the PNP.

#### negotiatorId

> **negotiatorId**: `string`

#### negotiator

> **negotiator**: `IPolicyNegotiator`
