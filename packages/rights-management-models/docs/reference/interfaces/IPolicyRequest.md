# Interface: IPolicyRequest

The JSON-LD definition for a policy request.

## Properties

### @context

> **@context**: `"https://schema.twindev.org/rights-management"`

The JSON-LD context.

***

### type

> **type**: `"PolicyRequest"`

The type of the request.

***

### providerPid?

> `optional` **providerPid**: `string`

The provider id.

***

### consumerPid?

> `optional` **consumerPid**: `string`

The consumer id.

***

### information?

> `optional` **information**: [`IPolicyInformation`](IPolicyInformation.md)

Additional information that can be used in the request.
