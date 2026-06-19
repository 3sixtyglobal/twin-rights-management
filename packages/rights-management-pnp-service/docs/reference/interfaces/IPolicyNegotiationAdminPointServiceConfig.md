# Interface: IPolicyNegotiationAdminPointServiceConfig

Options for the Policy Negotiation Admin Point Component.

## Properties

### negotiationStateTtlMinutes? {#negotiationstatettlminutes}

> `optional` **negotiationStateTtlMinutes?**: `number`

How long should the states live in the store after a negotiation.

#### Default

```ts
1440
```

***

### mutexTimeoutMs? {#mutextimeoutms}

> `optional` **mutexTimeoutMs?**: `number`

Timeout in milliseconds to wait when acquiring a mutex lock.
