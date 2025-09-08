# Class: StaticPolicyInformationSource

Policy information source which retrieves static information.

## Implements

- `IPolicyInformationSource`
- `IComponent`

## Constructors

### Constructor

> **new StaticPolicyInformationSource**(`options?`): `StaticPolicyInformationSource`

Create a new instance of StaticPolicyInformationSource.

#### Parameters

##### options?

[`IStaticPolicyInformationSourceConstructorOptions`](../interfaces/IStaticPolicyInformationSourceConstructorOptions.md)

The options for the logging policy source.

#### Returns

`StaticPolicyInformationSource`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

The class name of the Static Policy Information Source.

#### Implementation of

`IComponent.CLASS_NAME`

## Methods

### retrieve()

> **retrieve**\<`D`\>(`assetType`, `action`, `accessMode`, `nodeIdentity`, `data`, `policies`): `Promise`\<`undefined` \| `IJsonLdNodeObject`[]\>

Retrieve information from the sources.

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

The data to process.

`undefined` | `D`

##### policies

`IOdrlPolicy`[]

The policies that apply to the data.

#### Returns

`Promise`\<`undefined` \| `IJsonLdNodeObject`[]\>

The objects containing relevant information or undefined if nothing relevant is found.

#### Implementation of

`IPolicyInformationSource.retrieve`

***

### addInformation()

> **addInformation**(`info`): `void`

Add static policy information.

#### Parameters

##### info

[`IStaticPolicyInformationSource`](../interfaces/IStaticPolicyInformationSource.md)

The static policy information to add.

#### Returns

`void`
