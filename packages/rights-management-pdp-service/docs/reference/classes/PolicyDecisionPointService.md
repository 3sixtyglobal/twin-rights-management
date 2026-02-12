# Class: PolicyDecisionPointService

Class implementation of Policy Decision Point Component.

## Implements

- `IPolicyDecisionPointComponent`

## Constructors

### Constructor

> **new PolicyDecisionPointService**(`options?`): `PolicyDecisionPointService`

Create a new instance of PolicyDecisionPointService (PDP).

#### Parameters

##### options?

[`IPolicyDecisionPointServiceConstructorOptions`](../interfaces/IPolicyDecisionPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyDecisionPointService`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Decision Point Service.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyDecisionPointComponent.className`

***

### evaluate()

> **evaluate**\<`D`\>(`agreement`, `data?`, `action?`): `Promise`\<`IPolicyDecision`[]\>

Evaluate requests from a Policy Enforcement Point (PEP).
Uses the Policy Management Point (PMP) to retrieve the policies and the
Policy Information Point (PIP) to retrieve additional information.
Executes any actions on the Policy Execution Point (PXP) before and after decision is made.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### agreement

`IOdrlAgreement`

The agreement to evaluate.

##### data?

`D`

The data to make a decision on.

##### action?

`string`

Optional action to make a decision on, if not provided, the PDP will evaluate all actions in the agreement.

#### Returns

`Promise`\<`IPolicyDecision`[]\>

Returns the policy decisions which apply to the data so that the PEP
can manipulate the data accordingly.

#### Implementation of

`IPolicyDecisionPointComponent.evaluate`
