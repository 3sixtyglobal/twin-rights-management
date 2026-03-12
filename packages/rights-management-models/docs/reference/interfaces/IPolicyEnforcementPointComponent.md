# Interface: IPolicyEnforcementPointComponent

Interface describing a Policy Enforcement Point (PEP) contract.
Intercepts data and uses the Policy Decision Point (PDP) to make decisions on
access to a resource, based on the decision a manipulated data object can
be returned.

## Extends

- `IComponent`

## Methods

### interceptWithPolicy() {#interceptwithpolicy}

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

***

### interceptWithId() {#interceptwithid}

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

The uid of the agreement to look up.

##### data?

`D`

The data to process.

##### action?

`string`

Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.

#### Returns

`Promise`\<`R`\>

The manipulated data with any policies applied.

***

### interceptWithLocator() {#interceptwithlocator}

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
