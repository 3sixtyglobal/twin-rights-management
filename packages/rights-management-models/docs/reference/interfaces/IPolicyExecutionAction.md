# Interface: IPolicyExecutionAction

Interface for policy execution actions.

## Methods

### execute()

> **execute**(`assetType`, `action`, `data`, `userIdentity`, `nodeIdentity`, `policies`, `stage`): `Promise`\<`void`\>

Execute function type for policy actions.

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

##### stage

[`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)

The stage of the policy decision.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the action is complete.
