# Class: PolicyManagementPointService

Class implementation of Policy Management Point Component.

## Implements

- `IPolicyManagementPointComponent`

## Constructors

### Constructor

> **new PolicyManagementPointService**(`options?`): `PolicyManagementPointService`

Create a new instance of PolicyManagementPointService (PMP).

#### Parameters

##### options?

[`IPolicyManagementPointServiceConstructorOptions`](../interfaces/IPolicyManagementPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyManagementPointService`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Management Point Service.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyManagementPointComponent.className`

***

### retrieve()

> **retrieve**(`options?`, `cursor?`): `Promise`\<\{ `policies`: `IDataspaceProtocolPolicy`[]; `cursor?`: `string`; \}\>

Get the policies from a PAP based on the data and identities.

#### Parameters

##### options?

Optional options to filter by assigner or assignee.

###### assigner?

`string`

The assigner to filter by.

###### assignee?

`string`

The assignee to filter by.

###### target?

`string`

The target to filter by.

###### action?

`string`

The action to filter by.

##### cursor?

`string`

An optional cursor to continue a previous query.

#### Returns

`Promise`\<\{ `policies`: `IDataspaceProtocolPolicy`[]; `cursor?`: `string`; \}\>

Returns the policies which apply to the data and context so that the PDP can make a decision.

#### Implementation of

`IPolicyManagementPointComponent.retrieve`
