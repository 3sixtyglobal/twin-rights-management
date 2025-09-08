# Interface: IPolicyManagementPointComponent

Interface describing a Policy Management Point (PMP) contract.
Provide the policies to the Policy Decision Point (PDP) based on the data and identities.

## Extends

- `IComponent`

## Methods

### retrieve()

> **retrieve**\<`D`\>(`assetType`, `action`, `nodeIdentity`, `data`): `Promise`\<`IOdrlPolicy`[]\>

Get the policies from a PAP based on the data and identities.

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

##### nodeIdentity

`string`

The identity of the node making the request.

##### data

The data to retrieve the policies for.

`undefined` | `D`

#### Returns

`Promise`\<`IOdrlPolicy`[]\>

Returns the policies which apply to the data and identities so that the PDP can make a decision.
