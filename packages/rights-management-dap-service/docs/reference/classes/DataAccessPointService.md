# Class: DataAccessPointService

Class implementation of Data Access Point Component.

## Implements

- `IDataAccessPointComponent`

## Constructors

### Constructor

> **new DataAccessPointService**(`options?`): `DataAccessPointService`

Create a new instance of DataAccessPointService (DAP).

#### Parameters

##### options?

[`IDataAccessPointServiceConstructorOptions`](../interfaces/IDataAccessPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`DataAccessPointService`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

The class name of the Data Access Point Service.

#### Implementation of

`IDataAccessPointComponent.CLASS_NAME`

## Methods

### create()

> **create**(`assetType`, `item`, `proofToken`): `Promise`\<`string`\>

Create an item.

#### Parameters

##### assetType

`string`

The type of the item to create.

##### item

`IJsonLdNodeObject`

The item to create.

##### proofToken

`string`

The proof provided by the requester to support the creation.

#### Returns

`Promise`\<`string`\>

The id of the item created, for some items this is supplied in the `item`.

#### Implementation of

`IDataAccessPointComponent.create`

***

### get()

> **get**(`assetType`, `id`, `proofToken`): `Promise`\<`IJsonLdNodeObject`\>

Get an item.

#### Parameters

##### assetType

`string`

The type of the item to retrieve.

##### id

`string`

The ID of the item to retrieve.

##### proofToken

`string`

The proof provided by the requester to support the lookup.

#### Returns

`Promise`\<`IJsonLdNodeObject`\>

The item retrieved if the policies allow it.

#### Implementation of

`IDataAccessPointComponent.get`

***

### update()

> **update**(`assetType`, `item`, `proofToken`): `Promise`\<`void`\>

Update an item.

#### Parameters

##### assetType

`string`

The type of the item to update.

##### item

`IJsonLdNodeObject`

The item to update.

##### proofToken

`string`

The proof provided by the requester to support the update.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IDataAccessPointComponent.update`

***

### remove()

> **remove**(`assetType`, `id`, `proofToken`): `Promise`\<`void`\>

Remove an item.

#### Parameters

##### assetType

`string`

The type of the item to remove.

##### id

`string`

The id of the item to remove.

##### proofToken

`string`

The proof provided by the requester to support the update.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IDataAccessPointComponent.remove`

***

### query()

> **query**(`assetType`, `conditions`, `cursor`, `options`, `proofToken`): `Promise`\<\{ `items`: `IJsonLdNodeObject`[]; `cursor?`: `string`; \}\>

Query for items.

#### Parameters

##### assetType

`string`

The type of the item to query.

##### conditions

The conditions to apply to the query.

`undefined` | `EntityCondition`\<`IJsonLdNodeObject`\>

##### cursor

The cursor for pagination.

`undefined` | `string`

##### options

`unknown`

Additional options which might be supported by the handler.

##### proofToken

`string`

The proof provided by the requester to support the update.

#### Returns

`Promise`\<\{ `items`: `IJsonLdNodeObject`[]; `cursor?`: `string`; \}\>

The items matching the query and cursor if there are more items.

#### Implementation of

`IDataAccessPointComponent.query`

***

### registerHandler()

> **registerHandler**(`handlerId`, `handler`): `Promise`\<`void`\>

Register a handler to use for handling data.

#### Parameters

##### handlerId

`string`

The id of the handler to register.

##### handler

`IDataAccessHandler`

The handler to register.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IDataAccessPointComponent.registerHandler`

***

### unregisterHandler()

> **unregisterHandler**(`handlerId`): `Promise`\<`void`\>

Unregister a handler from the handling.

#### Parameters

##### handlerId

`string`

The id of the handler to unregister.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IDataAccessPointComponent.unregisterHandler`
