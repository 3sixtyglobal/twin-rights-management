# Interface: IPolicyInformationPointComponent

Interface describing a Policy Information Point (PEP) contract.
Provides additional information to the Policy Decision Point (PDP) when
it is making decisions.

## Extends

- `IComponent`

## Methods

### retrieve()

> **retrieve**(`assetType`, `action`, `data`, `userIdentity`, `nodeIdentity`, `policies`): `Promise`\<\{\[`source`: `string`\]: `IJsonLdNodeObject`[]; \}\>

Retrieve additional information which is relevant in the PDP decision making.

#### Parameters

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

##### data

`unknown`

The data to get any additional information for.

##### userIdentity

`string`

The user identity to get additional information for.

##### nodeIdentity

`string`

The node identity to get additional information for.

##### policies

`IOdrlPolicy`[]

The policies that apply to the data.

#### Returns

`Promise`\<\{\[`source`: `string`\]: `IJsonLdNodeObject`[]; \}\>

Returns additional information based on the data and identities.

***

### registerSource()

> **registerSource**(`sourceId`, `source`): `Promise`\<`void`\>

Register a source to use for retrieval.

#### Parameters

##### sourceId

`string`

The id of the source to register.

##### source

[`IPolicyInformationSource`](IPolicyInformationSource.md)

The source to register.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### unregisterSource()

> **unregisterSource**(`sourceId`): `Promise`\<`void`\>

Unregister a source from the retrieval.

#### Parameters

##### sourceId

`string`

The id of the source to unregister.

#### Returns

`Promise`\<`void`\>

Nothing.
