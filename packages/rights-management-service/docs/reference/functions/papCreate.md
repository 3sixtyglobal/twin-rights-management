# Function: papCreate()

> **papCreate**(`httpRequestContext`, `componentName`, `request`, `baseRouteName`): `Promise`\<`ICreatedResponse`\>

PAP: Create a policy.

## Parameters

### httpRequestContext

`IHttpRequestContext`

The request context for the API.

### componentName

`string`

The name of the component to use in the routes.

### request

`IPapCreateRequest`

The request.

### baseRouteName

`string`

The base route name to use for generating the location header.

## Returns

`Promise`\<`ICreatedResponse`\>

The response object with additional http response properties.
