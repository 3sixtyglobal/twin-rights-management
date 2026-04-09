# Interface: IPolicyInformationSource

Interface for policy information sources.

## Extends

- `IComponent`

## Methods

### retrieve() {#retrieve}

> **retrieve**\<`D`\>(`policy`, `accessMode`, `data?`, `action?`): `Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \} \| `undefined`\>

Retrieve information from the sources.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

[`IRightsManagementPolicy`](../type-aliases/IRightsManagementPolicy.md) \| `undefined`

The policy to retrieve information for if available.

##### accessMode

[`PolicyInformationAccessMode`](../type-aliases/PolicyInformationAccessMode.md)

The access mode to use for the retrieval.

##### data?

`D`

The data to process.

##### action?

`string`

Optional action to make a decision on, if not provided, the PIP will evaluate all actions in the policy.

#### Returns

`Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \} \| `undefined`\>

The objects containing relevant information or undefined if nothing relevant is found.
