# Interface: IDataAccessPointComponent

Interface describing a Data Access Point (DAP) contract.
When receiving a request from another component, the DAP will perform
CRUD operations with enforcement of relevant policies using PEP.
The registered data handlers support specific asset types.

## Extends

- `IComponent`

## Methods

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
