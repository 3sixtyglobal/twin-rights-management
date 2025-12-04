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

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Enforcement Point Service.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyEnforcementPointComponent.className`

***

### intercept()

> **intercept**\<`D`, `R`\>(`locator`, `data?`): `Promise`\<`R`\>

Process the data using Policy Decision Point (PDP) and return the manipulated data.

#### Type Parameters

##### D

`D` = `unknown`

##### R

`R` = `D`

#### Parameters

##### locator

`IPolicyLocator`

The locator to find relevant policies.

##### data?

`D`

The data to process.

#### Returns

`Promise`\<`R`\>

The manipulated data with any policies applied.

#### Implementation of

`IPolicyEnforcementPointComponent.intercept`
