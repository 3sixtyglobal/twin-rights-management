# Interface: IPolicyInformationPointComponent

Interface describing a Policy Information Point (PEP) contract.
Provides additional information to the Policy Decision Point (PDP) when
it is making decisions.

## Extends

- `IComponent`

## Indexable

\[`key`: `string`\]: `any`

All methods are optional, so we introduce an index signature to allow
any additional properties or methods, which removes the TypeScript error where
the class has no properties in common with the type.

## Methods

### retrieve()

> **retrieve**\<`D`\>(`locator`, `accessMode`, `policies?`, `data?`): `Promise`\<[`IPolicyInformation`](IPolicyInformation.md)\>

Retrieve additional information which is relevant in the PDP decision making.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### locator

[`IPolicyLocator`](IPolicyLocator.md)

The locator to find relevant policies.

##### accessMode

[`PolicyInformationAccessMode`](../type-aliases/PolicyInformationAccessMode.md)

The access mode to use for the retrieval.

##### policies?

`IOdrlPolicy`[]

The policies that apply to the data.

##### data?

`D`

The data to get any additional information for.

#### Returns

`Promise`\<[`IPolicyInformation`](IPolicyInformation.md)\>

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
