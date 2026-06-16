# Class: IdentityProfilePolicyInformationSource

Policy information source which retrieves identity profile information.

## Implements

- `IPolicyInformationSource`

## Constructors

### Constructor

> **new IdentityProfilePolicyInformationSource**(`options?`): `IdentityProfilePolicyInformationSource`

Create a new instance of IdentityProfilePolicyInformationSource.

#### Parameters

##### options?

[`IIdentityProfilePolicyInformationSourceConstructorOptions`](../interfaces/IIdentityProfilePolicyInformationSourceConstructorOptions.md)

The options for the identity profile policy source.

#### Returns

`IdentityProfilePolicyInformationSource`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Identity Profile Policy Information Source.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyInformationSource.className`

***

### retrieve() {#retrieve}

> **retrieve**\<`D`\>(`policy`, `accessMode`, `data?`, `action?`): `Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \} \| `undefined`\>

Retrieve information from the sources.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

`IRightsManagementPolicy` \| `undefined`

The policy to retrieve information for if available.

##### accessMode

`PolicyInformationAccessMode`

The access mode to use for the retrieval.

##### data?

`D`

The data to process.

##### action?

`string`

The action that was evaluated.

#### Returns

`Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \} \| `undefined`\>

The objects containing relevant information or undefined if nothing relevant is found.

#### Implementation of

`IPolicyInformationSource.retrieve`
