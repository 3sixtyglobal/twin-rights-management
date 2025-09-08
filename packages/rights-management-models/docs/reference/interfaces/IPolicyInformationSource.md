# Interface: IPolicyInformationSource

Interface for policy information sources.

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

[`PolicyInformationAccessMode`](../type-aliases/PolicyInformationAccessMode.md)

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
