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

[`IPolicyExecutionPointServiceConstructorOptions`](../interfaces/IPolicyExecutionPointServiceConstructorOptions.md)

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

`PolicyDecisionStage`

The stage of the policy decision.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the action is complete.

#### Implementation of

`IPolicyExecutionAction.execute`
