# Interface: IPolicyArbiter

Interface describing a Policy Arbiter.

## Extends

- `IComponent`

## Methods

### decide()

> **decide**\<`D`\>(`agreement`, `information?`, `data?`, `action?`): `Promise`\<[`IPolicyDecision`](IPolicyDecision.md)[]\>

Makes decisions regarding policy access to data.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### agreement

`IDataspaceProtocolAgreement`

The agreement to evaluate.

##### information?

Information provided by the requester to determine if a policy can be created.

##### data?

`D`

The data to make a decision on.

##### action?

`string`

Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.

#### Returns

`Promise`\<[`IPolicyDecision`](IPolicyDecision.md)[]\>

The decisions about access to the data.
