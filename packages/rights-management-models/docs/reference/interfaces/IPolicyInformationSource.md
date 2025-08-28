# Interface: IPolicyInformationSource

Interface for policy information sources.

## Methods

### retrieve()

> **retrieve**(`assetType`, `action`, `data`, `userIdentity`, `nodeIdentity`, `policies`): `Promise`\<`undefined` \| `IJsonLdNodeObject`[]\>

Retrieve information from the sources.

#### Parameters

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

##### data

`unknown`

The data to process.

##### userIdentity

`string`

The user identity to use in the decision making.

##### nodeIdentity

`string`

The node identity to use in the decision making.

##### policies

`IOdrlPolicy`[]

The policies that apply to the data.

#### Returns

`Promise`\<`undefined` \| `IJsonLdNodeObject`[]\>

The objects containing relevant information or undefined if nothing relevant is found.
