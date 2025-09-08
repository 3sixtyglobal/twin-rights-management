# Class: IdentityPolicyInformationSource

Policy information source which retrieves the identity information.

## Implements

- `IPolicyInformationSource`
- `IComponent`

## Constructors

### Constructor

> **new IdentityPolicyInformationSource**(`options?`): `IdentityPolicyInformationSource`

Create a new instance of IdentityPolicyInformationSource.

#### Parameters

##### options?

[`IIdentityPolicyInformationSourceConstructorOptions`](../interfaces/IIdentityPolicyInformationSourceConstructorOptions.md)

The options for the logging policy source.

#### Returns

`IdentityPolicyInformationSource`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

The class name of the Identity Policy Information Source.

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
