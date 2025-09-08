# Interface: IPolicyEnforcementProcessor

Interface for policy enforcement processors.

## Methods

### process()

> **process**\<`D`, `R`\>(`assetType`, `action`, `nodeIdentity`, `data`, `policies`): `Promise`\<`undefined` \| `R`\>

Process the response from the policy decision point.

#### Type Parameters

##### D

`D` = `unknown`

##### R

`R` = `unknown`

#### Parameters

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

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

`Promise`\<`undefined` \| `R`\>

The data after processing.
