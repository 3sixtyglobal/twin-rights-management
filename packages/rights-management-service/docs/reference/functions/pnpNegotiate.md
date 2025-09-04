# Function: pnpNegotiate()

> **pnpNegotiate**(`httpRequestContext`, `componentName`, `request`): `Promise`\<`IPnpNegotiateResponse`\>

PNP: Negotiate.

## Parameters

### httpRequestContext

`IHttpRequestContext`

The request context for the API.

### componentName

`string`

The name of the component to use in the routes.

### request

`IPnpNegotiateRequest`

The request.

## Returns

`Promise`\<`IPnpNegotiateResponse`\>

The response object with additional http response properties.
