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

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Management Point Service.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyManagementPointComponent.className`

***

### retrieve() {#retrieve}

> **retrieve**(`locator?`, `cursor?`): `Promise`\<\{ `policies`: `IRightsManagementPolicy`[]; `cursor?`: `string`; \}\>

Get the policies from a PAP based on the data and identities.

#### Parameters

##### locator?

`IPolicyLocator`

Optional locator to filter by type, assigner, assignee, target, or action.

##### cursor?

`string`

An optional cursor to continue a previous query.

#### Returns

`Promise`\<\{ `policies`: `IRightsManagementPolicy`[]; `cursor?`: `string`; \}\>

Returns the policies which apply to the data and context so that the PDP can make a decision.

#### Implementation of

`IPolicyManagementPointComponent.retrieve`
