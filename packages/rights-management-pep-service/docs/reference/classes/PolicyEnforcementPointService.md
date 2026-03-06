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

### interceptWithPolicy()

> **interceptWithPolicy**\<`D`, `R`\>(`agreement`, `data?`, `action?`): `Promise`\<`R`\>

Process the data using Policy Decision Point (PDP) and return the manipulated data.

#### Type Parameters

##### D

`D` = `unknown`

##### R

`R` = `D`

#### Parameters

##### agreement

`IDataspaceProtocolAgreement`

The agreement to enforce.

##### data?

`D`

The data to process.

##### action?

`string`

Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.

#### Returns

`Promise`\<`R`\>

The manipulated data with any policies applied.

#### Implementation of

`IPolicyEnforcementPointComponent.interceptWithPolicy`

***

### interceptWithId()

> **interceptWithId**\<`D`, `R`\>(`uid`, `data?`, `action?`): `Promise`\<`R`\>

Process the data using Policy Decision Point (PDP) and return the manipulated data.

#### Type Parameters

##### D

`D` = `unknown`

##### R

`R` = `D`

#### Parameters

##### uid

`string`

The uid of the policy to look up.

##### data?

`D`

The data to process.

##### action?

`string`

Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.

#### Returns

`Promise`\<`R`\>

The manipulated data with any policies applied.

#### Implementation of

`IPolicyEnforcementPointComponent.interceptWithId`

***

### interceptWithLocator()

> **interceptWithLocator**\<`D`, `R`\>(`locator`, `data?`, `action?`): `Promise`\<`R`\>

Process the data using Policy Decision Point (PDP) and return the manipulated data.

#### Type Parameters

##### D

`D` = `unknown`

##### R

`R` = `D`

#### Parameters

##### locator

The match criteria to look up agreements.

###### assigner?

`string`

The assigner attribute to match.

###### assignee?

`string`

The assignee attribute to match.

###### target?

`string`

The target attribute to match.

###### action?

`string`

The action attribute to match.

##### data?

`D`

The data to process.

##### action?

`string`

Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.

#### Returns

`Promise`\<`R`\>

The manipulated data with any policies applied.

#### Implementation of

`IPolicyEnforcementPointComponent.interceptWithLocator`
