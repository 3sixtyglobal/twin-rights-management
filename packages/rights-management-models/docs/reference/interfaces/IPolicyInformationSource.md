# Interface: IPolicyInformationSource

Interface for policy information sources.

## Extends

- `IComponent`

## Methods

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

[`PolicyInformationAccessMode`](../type-aliases/PolicyInformationAccessMode.md)

The access mode to use for the retrieval.

##### data?

`D`

The data to process.

#### Returns

`Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \} \| `undefined`\>

The objects containing relevant information or undefined if nothing relevant is found.
