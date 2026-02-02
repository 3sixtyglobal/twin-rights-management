# Class: PolicyInformationPointService

Class implementation of Policy Information Point Component.

## Implements

- `IPolicyInformationPointComponent`

## Constructors

### Constructor

> **new PolicyInformationPointService**(`options?`): `PolicyInformationPointService`

Create a new instance of PolicyInformationPointService (PIP).

#### Parameters

##### options?

[`IPolicyInformationPointServiceConstructorOptions`](../interfaces/IPolicyInformationPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyInformationPointService`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Information Point Service.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyInformationPointComponent.className`

***

### retrieve()

> **retrieve**\<`D`\>(`policy`, `accessMode`, `data?`): `Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \}\>

Retrieve additional information which is relevant in the PDP decision making.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

The policy to retrieve the information for if available.

`IOdrlPolicy` | `undefined`

##### accessMode

`PolicyInformationAccessMode`

The access mode to use for the retrieval.

##### data?

`D`

The data to get any additional information for.

#### Returns

`Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \}\>

Returns additional information based on the data and identities.

#### Implementation of

`IPolicyInformationPointComponent.retrieve`
