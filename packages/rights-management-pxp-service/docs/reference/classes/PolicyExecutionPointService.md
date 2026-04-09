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

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Execution Point Service.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyExecutionPointComponent.className`

***

### executeActions() {#executeactions}

> **executeActions**\<`D`\>(`policy`, `decisions`, `data`, `action`, `stage`): `Promise`\<`void`\>

Execute actions based on the PDP's decisions.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

`IRightsManagementPolicy`

The policy that applied to the data.

##### decisions

`IPolicyDecision`[]

The decisions made by the PDP.

##### data

`D` \| `undefined`

The data used in the decision by the PDP.

##### action

`string` \| `undefined`

The action used in the decision by the PDP.

##### stage

`PolicyDecisionStage`

The stage at which the PXP is executed in the PDP.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyExecutionPointComponent.executeActions`
