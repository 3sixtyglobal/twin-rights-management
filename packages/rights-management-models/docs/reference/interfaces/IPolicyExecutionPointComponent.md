# Interface: IPolicyExecutionPointComponent

Interface describing a Policy Execution Point (PXP) contract.
When a decision is made by the Policy Decision Point (PDP),
the Policy Execution Point (PXP) will execute any
registered actions based on the decision.

## Extends

- `IComponent`

## Methods

### executeActions()

> **executeActions**\<`D`\>(`stage`, `locator`, `policies?`, `decisions?`, `data?`): `Promise`\<`void`\>

Execute actions based on the PDP's decisions.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### stage

[`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)

The stage at which the PXP is executed in the PDP.

##### locator

[`IPolicyLocator`](IPolicyLocator.md)

The locator to find relevant policies.

##### policies?

`IOdrlPolicy`[]

The policies that apply to the data.

##### decisions?

[`IPolicyDecision`](IPolicyDecision.md)[]

The decisions made by the PDP.

##### data?

`D`

The data used in the decision by the PDP.

#### Returns

`Promise`\<`void`\>

Nothing.
