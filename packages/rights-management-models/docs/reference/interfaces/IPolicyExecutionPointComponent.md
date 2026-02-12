# Interface: IPolicyExecutionPointComponent

Interface describing a Policy Execution Point (PXP) contract.
When a decision is made by the Policy Decision Point (PDP),
the Policy Execution Point (PXP) will execute any
registered actions based on the decision.

## Extends

- `IComponent`

## Methods

### executeActions()

> **executeActions**\<`D`\>(`policy`, `decisions`, `data`, `action`, `stage`): `Promise`\<`void`\>

Execute actions based on the PDP's decisions.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

`IOdrlPolicy`

The policy that applied to the data.

##### decisions

[`IPolicyDecision`](IPolicyDecision.md)[]

The decisions made by the PDP.

##### data

The data used in the decision by the PDP.

`D` | `undefined`

##### action

The action that was evaluated.

`string` | `undefined`

##### stage

[`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)

The stage at which the PXP is executed in the PDP.

#### Returns

`Promise`\<`void`\>

Nothing.
