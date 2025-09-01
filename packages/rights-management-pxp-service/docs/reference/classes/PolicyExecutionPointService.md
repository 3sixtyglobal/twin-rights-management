# Class: PolicyExecutionPointService

Class implementation of Policy Execution Point Component.

## Implements

- `IPolicyExecutionPointComponent`

## Constructors

### Constructor

> **new PolicyExecutionPointService**(`options?`): `PolicyExecutionPointService`

Create a new instance of PolicyExecutionPointService (PXP).

#### Parameters

##### options?

[`IPolicyExecutionPointServiceConstructorOptions`](../interfaces/IPolicyExecutionPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyExecutionPointService`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

The class name of the Policy Execution Point Service.

#### Implementation of

`IPolicyExecutionPointComponent.CLASS_NAME`

## Methods

### executeActions()

> **executeActions**\<`C`, `D`\>(`stage`, `assetType`, `action`, `context`, `data`, `policies`): `Promise`\<`void`\>

Execute actions based on the PDP's decisions.

#### Type Parameters

##### C

`C` *extends* `IPolicyContext` = `IPolicyContext`

##### D

`D` = `unknown`

#### Parameters

##### stage

`PolicyDecisionStage`

The stage at which the PXP is executed in the PDP.

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

The data used in the decision by the PDP.

`undefined` | `D`

##### policies

`IOdrlPolicy`[]

The policies that apply to the data.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyExecutionPointComponent.executeActions`

***

### registerAction()

> **registerAction**(`actionId`, `stage`, `action`): `Promise`\<`void`\>

Register an action to be executed.

#### Parameters

##### actionId

`string`

The id of the action to register.

##### stage

`PolicyDecisionStage`

The stage at which the action should be executed.

##### action

`IPolicyExecutionAction`

The action to execute.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyExecutionPointComponent.registerAction`

***

### unregisterAction()

> **unregisterAction**(`actionId`, `stage`): `Promise`\<`void`\>

Unregister an action from the execution point.

#### Parameters

##### actionId

`string`

The id of the action to unregister.

##### stage

`PolicyDecisionStage`

The stage at which the action was executed.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyExecutionPointComponent.unregisterAction`
