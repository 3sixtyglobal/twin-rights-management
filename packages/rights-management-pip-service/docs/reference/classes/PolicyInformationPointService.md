# Class: PolicyInformationPointService

Class implementation of Policy Information Point Component.

## Implements

- `IPolicyInformationPointComponent`

## Constructors

### Constructor

> **new PolicyInformationPointService**(`options?`): `PolicyInformationPointService`

Create a new instance of PolicyInformationPointService (PIP).

#### Parameters

##### options?

[`IPolicyInformationPointServiceConstructorOptions`](../interfaces/IPolicyInformationPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyInformationPointService`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

The class name of the Policy Information Point Service.

#### Implementation of

`IPolicyInformationPointComponent.CLASS_NAME`

## Methods

### retrieve()

> **retrieve**\<`D`\>(`assetType`, `action`, `accessMode`, `nodeIdentity`, `data`, `policies`): `Promise`\<\{\[`source`: `string`\]: `IJsonLdNodeObject`[]; \}\>

Retrieve additional information which is relevant in the PDP decision making.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

##### accessMode

`PolicyInformationAccessMode`

The access mode to use for the retrieval.

##### nodeIdentity

`string`

The identity of the node making the request.

##### data

The data to get any additional information for.

`undefined` | `D`

##### policies

`IOdrlPolicy`[]

The policies that apply to the data.

#### Returns

`Promise`\<\{\[`source`: `string`\]: `IJsonLdNodeObject`[]; \}\>

Returns additional information based on the data and identities.

#### Implementation of

`IPolicyInformationPointComponent.retrieve`

***

### registerSource()

> **registerSource**(`sourceId`, `source`): `Promise`\<`void`\>

Register a source to use for retrieval.

#### Parameters

##### sourceId

`string`

The id of the source to register.

##### source

`IPolicyInformationSource`

The source to register.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyInformationPointComponent.registerSource`

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

#### Implementation of

`IPolicyInformationPointComponent.unregisterSource`
