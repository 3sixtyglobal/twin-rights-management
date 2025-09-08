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

> `readonly` **CLASS\_NAME**: `string`

The class name of the Policy Decision Point Service.

#### Implementation of

`IPolicyDecisionPointComponent.CLASS_NAME`

## Methods

### evaluate()

> **evaluate**\<`D`\>(`assetType`, `action`, `nodeIdentity`, `data`): `Promise`\<`IOdrlPolicy`[]\>

Evaluate requests from a Policy Enforcement Point (PEP).
Uses the Policy Management Point (PMP) to retrieve the policies and the
Policy Information Point (PIP) to retrieve additional information.
Executes any actions on the Policy Execution Point (PXP) when the decision is made.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

##### nodeIdentity

`string`

The identity of the node making the request.

##### data

The data to make a decision on.

`undefined` | `D`

#### Returns

`Promise`\<`IOdrlPolicy`[]\>

Returns the policy decisions which apply to the data so that the PEP
can manipulate the data accordingly.

#### Implementation of

`IPolicyDecisionPointComponent.evaluate`
