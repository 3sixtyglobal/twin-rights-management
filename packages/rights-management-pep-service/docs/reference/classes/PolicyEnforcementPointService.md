# Class: PolicyEnforcementPointService

Class implementation of Policy Enforcement Point Component.

## Implements

- `IPolicyEnforcementPointComponent`

## Constructors

### Constructor

> **new PolicyEnforcementPointService**(`options?`): `PolicyEnforcementPointService`

Create a new instance of PolicyEnforcementPointService (PEP).

#### Parameters

##### options?

[`IPolicyEnforcementPointServiceConstructorOptions`](../interfaces/IPolicyEnforcementPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyEnforcementPointService`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

The class name of the Policy Enforcement Point Service.

#### Implementation of

`IPolicyEnforcementPointComponent.CLASS_NAME`

## Methods

### intercept()

> **intercept**\<`C`, `D`, `R`\>(`assetType`, `action`, `context`, `data`): `Promise`\<`undefined` \| `R`\>

Process the data using Policy Decision Point (PDP) and return the manipulated data.

#### Type Parameters

##### C

`C` *extends* `IPolicyContext` = `IPolicyContext`

##### D

`D` = `unknown`

##### R

`R` = `unknown`

#### Parameters

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

##### context

The context for the policy enforcement.

`undefined` | `C`

##### data

The data to process.

`undefined` | `D`

#### Returns

`Promise`\<`undefined` \| `R`\>

The manipulated data with any policies applied.

#### Implementation of

`IPolicyEnforcementPointComponent.intercept`
