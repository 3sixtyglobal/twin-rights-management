# Interface: IPolicyExecutionAction

Interface for policy execution actions.

## Extends

- `IComponent`

## Methods

### supportedStages() {#supportedstages}

> **supportedStages**(): [`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)[]

Which stages should the action be executed at.

#### Returns

[`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)[]

List of stages.

***

### execute() {#execute}

> **execute**\<`D`\>(`policy`, `decisions`, `data`, `action`, `stage`): `Promise`\<`void`\>

Execute function type for policy actions.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

`IDataspaceProtocolPolicy`

The policy that applied to the data.

##### decisions

[`IPolicyDecision`](IPolicyDecision.md)[]

The decisions made by the PDP.

##### data

The data to process.

`D` | `undefined`

##### action

The action that was evaluated.

`string` | `undefined`

##### stage

[`PolicyDecisionStage`](../type-aliases/PolicyDecisionStage.md)

The stage of the policy decision.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the action is complete.
