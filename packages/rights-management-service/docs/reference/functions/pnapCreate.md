# Function: pnapCreate()

> **pnapCreate**(`httpRequestContext`, `componentName`, `request`, `baseRouteName`): `Promise`\<`ICreatedResponse`\>

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

### baseRouteName

`string`

The base route name to use for the Location header.

## Returns

`Promise`\<`ICreatedResponse`\>

The response object with additional http response properties.
