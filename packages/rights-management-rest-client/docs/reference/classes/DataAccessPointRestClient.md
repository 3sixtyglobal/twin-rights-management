# Class: DataAccessPointRestClient

Client for performing Rights Management Data Access through to REST endpoints.

## Extends

- `BaseRestClient`

## Implements

- `IDataAccessPointComponent`

## Constructors

### Constructor

> **new DataAccessPointRestClient**(`config`): `DataAccessPointRestClient`

Create a new instance of DataAccessPointRestClient.

#### Parameters

##### config

`IBaseRestClientConfig`

The configuration for the client.

#### Returns

`DataAccessPointRestClient`

#### Overrides

`BaseRestClient.constructor`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IDataAccessPointComponent.className`

***

### create()

> **create**(`assetType`, `item`, `trustPayload`): `Promise`\<`string`\>

Create an item.

#### Parameters

##### assetType

`string`

The type of the item to create.

##### item

`IJsonLdNodeObject`

The item to create.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`string`\>

The id of the item created, for some items this is supplied in the `item`.

#### Implementation of

`IDataAccessPointComponent.create`

***

### get()

> **get**(`assetType`, `id`, `trustPayload`): `Promise`\<`IJsonLdNodeObject`\>

Get an item.

#### Parameters

##### assetType

`string`

The type of the item to retrieve.

##### id

`string`

The ID of the item to retrieve.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IJsonLdNodeObject`\>

The item retrieved if the policies allow it.

#### Implementation of

`IDataAccessPointComponent.get`

***

### update()

> **update**(`assetType`, `item`, `trustPayload`): `Promise`\<`void`\>

Update an item.

#### Parameters

##### assetType

`string`

The type of the item to update.

##### item

`IJsonLdNodeObject`

The item to update.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IDataAccessPointComponent.update`

***

### remove()

> **remove**(`assetType`, `id`, `trustPayload`): `Promise`\<`void`\>

Remove an item.

#### Parameters

##### assetType

`string`

The type of the item to remove.

##### id

`string`

The id of the item to remove.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IDataAccessPointComponent.remove`

***

### query()

> **query**(`assetType`, `conditions`, `cursor`, `options`, `trustPayload`): `Promise`\<\{ `items`: `IJsonLdNodeObject`[]; `cursor?`: `string`; \}\>

Query for items.

#### Parameters

##### assetType

`string`

The type of the item to query.

##### conditions

The conditions to apply to the query.

`EntityCondition`\<`IJsonLdNodeObject`\> | `undefined`

##### cursor

The cursor for pagination.

`string` | `undefined`

##### options

`unknown`

Additional options which might be supported by the handler.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<\{ `items`: `IJsonLdNodeObject`[]; `cursor?`: `string`; \}\>

The items matching the query and cursor if there are more items.

#### Implementation of

`IDataAccessPointComponent.query`
