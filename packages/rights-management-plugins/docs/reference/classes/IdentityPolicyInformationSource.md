# Class: IdentityPolicyInformationSource

Policy information source which retrieves the identity information.

## Implements

- `IPolicyInformationSource`

## Constructors

### Constructor

> **new IdentityPolicyInformationSource**(`options?`): `IdentityPolicyInformationSource`

Create a new instance of IdentityPolicyInformationSource.

#### Parameters

##### options?

[`IIdentityPolicyInformationSourceConstructorOptions`](../interfaces/IIdentityPolicyInformationSourceConstructorOptions.md)

The options for the logging policy source.

#### Returns

`IdentityPolicyInformationSource`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Identity Policy Information Source.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyInformationSource.className`

***

### retrieve()

> **retrieve**\<`D`\>(`policy`, `accessMode`, `data?`): `Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \} \| `undefined`\>

Retrieve information from the sources.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

The policy to retrieve information for if available.

`IOdrlPolicy` | `undefined`

##### accessMode

`PolicyInformationAccessMode`

The access mode to use for the retrieval.

##### data?

`D`

The data to process.

#### Returns

`Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \} \| `undefined`\>

The objects containing relevant information or undefined if nothing relevant is found.

#### Implementation of

`IPolicyInformationSource.retrieve`
