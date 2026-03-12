# Interface: IPolicyNegotiationPointServiceConfig

Options for the Policy Negotiation Point Component.

## Properties

### callbackPath {#callbackpath}

> **callbackPath**: `string`

The path to send in negotiation messages as the callback address.
Will be combined with the public origin url from hosting component.

***

### overrideTrustGeneratorType? {#overridetrustgeneratortype}

> `optional` **overrideTrustGeneratorType**: `string`

Override the default trust generator.

***

### includeErrorDetails? {#includeerrordetails}

> `optional` **includeErrorDetails**: `boolean`

Whether to include error details in the responses from the admin point.
