# Interface: IPolicyEnforcementPointComponent

Interface describing a Policy Enforcement Point (PEP) contract.
Intercepts data and uses the Policy Decision Point (PDP) to make decisions on
access to a resource, based on the decision a manipulated data object can
be returned.

## Extends

- `IComponent`

## Methods

### intercept()

> **intercept**\<`C`, `D`, `R`\>(`assetType`, `action`, `context`, `data`): `Promise`\<`undefined` \| `R`\>

Process the data using Policy Decision Point (PDP) and return the manipulated data.

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

#### Returns

`Promise`\<`undefined` \| `R`\>

The manipulated data with any policies applied.
