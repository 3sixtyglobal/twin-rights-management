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

> **retrieve**\<`D`\>(`assetType`, `action`, `nodeIdentity`, `data`, `cursor?`): `Promise`\<\{ `policies`: `IOdrlPolicy`[]; `cursor?`: `string`; \}\>

Get the policies from a PAP based on the data and identities.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### assetType

`string`

The type of asset being processed, wildcard * means all asset types.

##### action

`string`

The action being performed on the asset, wildcard * means all actions.

##### nodeIdentity

`string`

The identity of the node making the request, wildcard * means all node identities.

##### data

The data to retrieve the policies for.

`undefined` | `D`

##### cursor?

`string`

An optional cursor to continue a previous query.

#### Returns

`Promise`\<\{ `policies`: `IOdrlPolicy`[]; `cursor?`: `string`; \}\>

Returns the policies which apply to the data and context so that the PDP can make a decision.

#### Implementation of

`IPolicyManagementPointComponent.retrieve`
