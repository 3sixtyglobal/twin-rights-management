# Class: ExampleDataAccessHandler

Example Data Access Handler.

## Implements

- `IDataAccessHandler`

## Constructors

### Constructor

> **new ExampleDataAccessHandler**(`options?`): `ExampleDataAccessHandler`

Create a new instance of ExampleDataAccessHandler.

#### Parameters

##### options?

[`IExampleDataAccessHandlerConstructorOptions`](../interfaces/IExampleDataAccessHandlerConstructorOptions.md)

The options for the example policy Requester.

#### Returns

`ExampleDataAccessHandler`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Example Data Access Handler.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IDataAccessHandler.className`

***

### supportedAssetTypes()

> **supportedAssetTypes**(): `string`[]

The asset types supported by this handler.

#### Returns

`string`[]

The supported asset types.

#### Implementation of

`IDataAccessHandler.supportedAssetTypes`

***

### create()

> **create**(`assetType`, `item`): `Promise`\<`string`\>

Create an item.

#### Parameters

##### assetType

`string`

The type of the item to create.

##### item

`IJsonLdNodeObject`

The item to create.

#### Returns

`Promise`\<`string`\>

The id of the item created, for some items this is supplied in the `item`.

#### Implementation of

`IDataAccessHandler.create`

***

### get()

> **get**(`assetType`, `id`): `Promise`\<`IJsonLdNodeObject`\>

Get an item.

#### Parameters

##### assetType

`string`

The type of the item to retrieve.

##### id

`string`

The ID of the item to retrieve.

#### Returns

`Promise`\<`IJsonLdNodeObject`\>

The item retrieved if the policies allow it.

#### Implementation of

`IDataAccessHandler.get`

***

### update()

> **update**(`assetType`, `item`): `Promise`\<`void`\>

Update an item.

#### Parameters

##### assetType

`string`

The type of the item to update.

##### item

`IJsonLdNodeObject`

The item to update.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IDataAccessHandler.update`

***

### remove()

> **remove**(`assetType`, `id`): `Promise`\<`void`\>

Remove an item.

#### Parameters

##### assetType

`string`

The type of the item to remove.

##### id

`string`

The id of the item to remove.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IDataAccessHandler.remove`

***

### query()

> **query**(`assetType`, `conditions`, `cursor`, `options`): `Promise`\<\{ `items`: `IJsonLdNodeObject`[]; `cursor?`: `string`; \}\>

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

#### Returns

`Promise`\<\{ `items`: `IJsonLdNodeObject`[]; `cursor?`: `string`; \}\>

The items matching the query and cursor if there are more items.

#### Implementation of

`IDataAccessHandler.query`
