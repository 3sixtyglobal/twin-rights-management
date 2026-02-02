# Interface: IPolicyArbiter

Interface describing a Policy Arbiter.

## Extends

- `IComponent`

## Methods

### decide()

> **decide**\<`D`\>(`policy`, `information?`, `data?`): `Promise`\<[`IPolicyDecision`](IPolicyDecision.md)[]\>

Makes decisions regarding policy access to data.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

`IOdrlPolicy`

The policy to evaluate.

##### information?

Information provided by the requester to determine if a policy can be created.

##### data?

`D`

The data to make a decision on.

#### Returns

`Promise`\<[`IPolicyDecision`](IPolicyDecision.md)[]\>

The decisions about access to the data.
