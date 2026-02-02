# Class: LoggingPolicyExecutionAction

Logging Policy Execution Action to send decisions to logging.

## Implements

- `IPolicyExecutionAction`

## Constructors

### Constructor

> **new LoggingPolicyExecutionAction**(`options?`): `LoggingPolicyExecutionAction`

Create a new instance of LoggingPolicyExecutionAction.

#### Parameters

##### options?

[`ILoggingPolicyExecutionActionConstructorOptions`](../interfaces/ILoggingPolicyExecutionActionConstructorOptions.md)

The options for the logging policy execution action.

#### Returns

`LoggingPolicyExecutionAction`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Logging Policy Execution Action.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyExecutionAction.className`

***

### supportedStages()

> **supportedStages**(): `PolicyDecisionStage`[]

Which stages should the action be executed at.

#### Returns

`PolicyDecisionStage`[]

List of stages.

#### Implementation of

`IPolicyExecutionAction.supportedStages`

***

### execute()

> **execute**\<`D`\>(`policy`, `decisions`, `data`, `stage`): `Promise`\<`void`\>

Execute function type for policy actions.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

`IOdrlPolicy`

The policy that applied to the data.

##### decisions

`IPolicyDecision`[]

The decisions made by the PDP.

##### data

The data to process.

`D` | `undefined`

##### stage

`PolicyDecisionStage`

The stage of the policy decision.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the action is complete.

#### Implementation of

`IPolicyExecutionAction.execute`
