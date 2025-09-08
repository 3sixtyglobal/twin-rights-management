# Interface: IPolicyDecisionPointComponent

Interface describing a Policy Decision Point (PDP) contract.
Decides if a party can be granted access to a resource, will retrieve policies
from the Policy Management Point (PMP) and any additional information from the
Policy Information Point (PIP). When a decision is made, the Policy Execution
Point (PEP) will execute any registered actions.

## Extends

- `IComponent`

## Methods

### evaluate()

> **evaluate**\<`D`\>(`assetType`, `action`, `nodeIdentity`, `data`): `Promise`\<`IOdrlPolicy`[]\>

Evaluate requests from a Policy Enforcement Point (PEP).
Uses the Policy Management Point (PMP) to retrieve the policies and the
Policy Information Point (PIP) to retrieve additional information.
Executes any actions on the Policy Execution Point (PXP) when the decision is made.

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

The data to make a decision on.

`undefined` | `D`

#### Returns

`Promise`\<`IOdrlPolicy`[]\>

Returns the policy decisions which apply to the data so that the PEP
can manipulate the data accordingly.
