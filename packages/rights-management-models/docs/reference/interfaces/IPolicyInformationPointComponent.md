# Interface: IPolicyInformationPointComponent

Interface describing a Policy Information Point (PEP) contract.
Provides additional information to the Policy Decision Point (PDP) when
it is making decisions.

## Extends

- `IComponent`

## Methods

### retrieve()

> **retrieve**\<`D`\>(`policy`, `accessMode`, `data?`, `action?`): `Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \}\>

Retrieve additional information which is relevant in the PDP decision making.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

The policy to retrieve the information for if available.

`IDataspaceProtocolPolicy` | `undefined`

##### accessMode

[`PolicyInformationAccessMode`](../type-aliases/PolicyInformationAccessMode.md)

The access mode to use for the retrieval.

##### data?

`D`

The data to get any additional information for.

##### action?

`string`

Optional action to make a decision on, if not provided, the PIP will evaluate all actions in the policy.

#### Returns

`Promise`\<\{\[`id`: `string`\]: `IJsonLdNodeObject`; \}\>

Returns additional information based on the data and identities.
