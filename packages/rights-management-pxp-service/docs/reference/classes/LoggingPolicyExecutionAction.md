# Class: LoggingPolicyExecutionAction

Logging Policy Execution Action to send decisions to logging.

## Implements

- `IPolicyExecutionAction`
- `IComponent`

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

> `readonly` **CLASS\_NAME**: `string`

The class name of the Policy Execution Point Service.

#### Implementation of

`IComponent.CLASS_NAME`

## Methods

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

> **execute**\<`C`, `D`\>(`stage`, `assetType`, `action`, `context`, `data`, `policies`): `Promise`\<`void`\>

Execute function type for policy actions.

#### Type Parameters

##### C

`C` *extends* `IPolicyContext` = `IPolicyContext`

##### D

`D` = `unknown`

#### Parameters

##### stage

`PolicyDecisionStage`

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

#### Implementation of

`IPolicyExecutionAction.execute`
