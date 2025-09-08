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

> `readonly` **CLASS\_NAME**: `string`

The class name of the Policy Management Point Service.

#### Implementation of

`IPolicyManagementPointComponent.CLASS_NAME`

## Methods

### retrieve()

> **retrieve**\<`D`\>(`assetType`, `action`, `nodeIdentity`, `data`): `Promise`\<`IOdrlPolicy`[]\>

Get the policies from a PAP based on the data and identities.

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

The data to retrieve the policies for.

`undefined` | `D`

#### Returns

`Promise`\<`IOdrlPolicy`[]\>

Returns the policies which apply to the data and context so that the PDP can make a decision.

#### Implementation of

`IPolicyManagementPointComponent.retrieve`
