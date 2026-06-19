# Interface: IPolicyNegotiationPointServiceConfig

Options for the Policy Negotiation Point Component.

## Properties

### callbackPath? {#callbackpath}

> `optional` **callbackPath?**: `string`

The path to send in negotiation messages as the callback address.
Combined with the public origin url at runtime to form the full callback URL.

***

### overrideTrustGeneratorType? {#overridetrustgeneratortype}

> `optional` **overrideTrustGeneratorType?**: `string`

Override the default trust generator.

***

### includeErrorDetails? {#includeerrordetails}

> `optional` **includeErrorDetails?**: `boolean`

Whether to include error details in the responses from the admin point.

#### Default

```ts
false
```

***

### mutexTimeoutMs? {#mutextimeoutms}

> `optional` **mutexTimeoutMs?**: `number`

Timeout in milliseconds to wait when acquiring a mutex lock.
