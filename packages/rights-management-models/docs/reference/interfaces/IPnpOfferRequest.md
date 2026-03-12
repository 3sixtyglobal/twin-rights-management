# Interface: IPnpOfferRequest

The request structure for sending a contract negotiation offer.

## Properties

### headers {#headers}

> **headers**: `object`

The headers which can be used to determine the response data type.

#### accept?

> `optional` **accept**: `"application/ld+json"` \| `"application/json"`

#### authorization?

> `optional` **authorization**: `string`

***

### pathParams? {#pathparams}

> `optional` **pathParams**: `object`

The path parameters of the request.

#### id?

> `optional` **id**: `string`

The identifier of the consumer being offered, this can be undefined.

***

### body {#body}

> **body**: `IDataspaceProtocolContractOfferMessage`

The body parameters of the request.
