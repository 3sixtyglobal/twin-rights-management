# Interface: IPolicyExecutionAction

Interface for policy execution actions.

## Methods

### supportedStages()

> **supportedStages**(): [`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)[]

Which stages should the action be executed at.

#### Returns

[`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)[]

List of stages.

***

### execute()

> **execute**\<`C`, `D`\>(`stage`, `assetType`, `action`, `context`, `data`, `policies`): `Promise`\<`void`\>

Execute function type for policy actions.

#### Type Parameters

##### C

`C` *extends* [`IPolicyContext`](IPolicyContext.md) = [`IPolicyContext`](IPolicyContext.md)

##### D

`D` = `unknown`

#### Parameters

##### stage

[`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)

The stage of the policy decision.

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

`Promise`\<`void`\>

A promise that resolves when the action is complete.
