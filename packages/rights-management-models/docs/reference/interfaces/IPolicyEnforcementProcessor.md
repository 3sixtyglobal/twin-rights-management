# Interface: IPolicyEnforcementProcessor

Interface for policy enforcement processors.

## Methods

### process()

> **process**\<`C`, `D`, `R`\>(`assetType`, `action`, `context`, `data`, `policies`): `Promise`\<`undefined` \| `R`\>

Process the response from the policy decision point.

#### Type Parameters

##### C

`C` *extends* [`IPolicyContext`](IPolicyContext.md) = [`IPolicyContext`](IPolicyContext.md)

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

##### context

The context information to use in the decision making.

`undefined` | `C`

##### data

The data to process.

`undefined` | `D`

##### policies

`IOdrlPolicy`[]

The policies that apply to the data.

#### Returns

`Promise`\<`undefined` \| `R`\>

The data after processing.
