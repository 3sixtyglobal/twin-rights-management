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

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Execution Point Service.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyExecutionPointComponent.className`

***

### executeActions()

> **executeActions**\<`D`\>(`policy`, `decisions`, `data`, `action`, `stage`): `Promise`\<`void`\>

Execute actions based on the PDP's decisions.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

`IDataspaceProtocolPolicy`

The policy that applied to the data.

##### decisions

`IPolicyDecision`[]

The decisions made by the PDP.

##### data

The data used in the decision by the PDP.

`D` | `undefined`

##### action

The action used in the decision by the PDP.

`string` | `undefined`

##### stage

`PolicyDecisionStage`

The stage at which the PXP is executed in the PDP.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyExecutionPointComponent.executeActions`
