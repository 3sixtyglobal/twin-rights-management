# Class: PolicyEnforcementPointClient

Client for performing Rights Management Policy Enforcement through to REST endpoints.

## Extends

- `BaseRestClient`

## Implements

- `IPolicyEnforcementPointComponent`

## Constructors

### Constructor

> **new PolicyEnforcementPointClient**(`config`): `PolicyEnforcementPointClient`

Create a new instance of PolicyEnforcementPointClient.

#### Parameters

##### config

`IBaseRestClientConfig`

The configuration for the client.

#### Returns

`PolicyEnforcementPointClient`

#### Overrides

`BaseRestClient.constructor`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

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

The context in which the action is being performed.

`undefined` | `C`

##### data

The data to process.

`undefined` | `D`

#### Returns

`Promise`\<`undefined` \| `R`\>

The manipulated data with any policies applied.

#### Implementation of

`IPolicyEnforcementPointComponent.intercept`

***

### registerProcessor()

> **registerProcessor**(`processorId`, `processor`): `Promise`\<`void`\>

Register a processor to use for handling data.

#### Parameters

##### processorId

`string`

The id of the processor to register.

##### processor

`IPolicyEnforcementProcessor`

The processor to register.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyEnforcementPointComponent.registerProcessor`

***

### unregisterProcessor()

> **unregisterProcessor**(`processorId`): `Promise`\<`void`\>

Unregister a processor from the handling.

#### Parameters

##### processorId

`string`

The id of the processor to unregister.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyEnforcementPointComponent.unregisterProcessor`
