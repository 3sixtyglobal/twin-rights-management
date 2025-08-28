# Interface: IPolicyExecutionPointComponent

Interface describing a Policy Execution Point (PXP) contract.
When a decision is made by the Policy Decision Point (PDP),
the Policy Execution Point (PXP) will execute any
registered actions based on the decision.

## Extends

- `IComponent`

## Methods

### executeActions()

> **executeActions**(`stage`, `assetType`, `action`, `data`, `userIdentity`, `nodeIdentity`, `policies`): `Promise`\<`void`\>

Execute actions based on the PDP's decisions.

#### Parameters

##### stage

[`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)

The stage at which the PXP is executed in the PDP.

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

##### data

`unknown`

The data used in the decision by the PDP.

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

`Promise`\<`void`\>

Nothing.

***

### registerAction()

> **registerAction**(`actionId`, `stage`, `action`): `Promise`\<`void`\>

Register an action to be executed.

#### Parameters

##### actionId

`string`

The id of the action to register.

##### stage

[`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)

The stage at which the action should be executed.

##### action

[`IPolicyExecutionAction`](IPolicyExecutionAction.md)

The action to execute.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### unregisterAction()

> **unregisterAction**(`actionId`, `stage`): `Promise`\<`void`\>

Unregister an action from the execution point.

#### Parameters

##### actionId

`string`

The id of the action to unregister.

##### stage

[`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)

The stage at which the action was executed.

#### Returns

`Promise`\<`void`\>

Nothing.
