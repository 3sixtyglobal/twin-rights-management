# Class: StaticPolicyInformationSource

Policy information source which retrieves static information.

## Implements

- `IPolicyInformationSource`

## Constructors

### Constructor

> **new StaticPolicyInformationSource**(`options?`): `StaticPolicyInformationSource`

Create a new instance of StaticPolicyInformationSource.

#### Parameters

##### options?

[`IStaticPolicyInformationSourceConstructorOptions`](../interfaces/IStaticPolicyInformationSourceConstructorOptions.md)

The options for the logging policy source.

#### Returns

`StaticPolicyInformationSource`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Static Policy Information Source.

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

> **retrieve**\<`D`\>(`policy`, `accessMode`, `data?`, `action?`): `Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \} \| `undefined`\>

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

##### action?

`string`

The action to get any additional information for.

#### Returns

`Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \} \| `undefined`\>

The objects containing relevant information or undefined if nothing relevant is found.

#### Implementation of

`IPolicyInformationSource.retrieve`

***

### addInformation()

> **addInformation**(`info`): `void`

Add static policy information.

#### Parameters

##### info

[`IStaticPolicyInformationSource`](../interfaces/IStaticPolicyInformationSource.md)

The static policy information to add.

#### Returns

`void`
