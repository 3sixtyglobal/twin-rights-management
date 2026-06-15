# Function: pnapCreate()

> **pnapCreate**(`httpRequestContext`, `componentName`, `request`): `Promise`\<`ICreatedResponse`\>

PNAP: Pre-register a consumer-side policy negotiation entry.

## Parameters

### httpRequestContext

`IHttpRequestContext`

The request context for the API.

### componentName

`string`

The name of the component to use in the routes.

### request

`IPnapCreateRequest`

The request.

## Returns

`Promise`\<`ICreatedResponse`\>

The response object with additional http response properties.
