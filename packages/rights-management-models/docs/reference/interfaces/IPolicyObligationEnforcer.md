# Interface: IPolicyObligationEnforcer

Interface describing a Policy Obligation Enforcer.

## Extends

- `IComponent`

## Methods

### enforce() {#enforce}

> **enforce**\<`D`\>(`policy`, `duty`, `information?`, `data?`, `action?`): `Promise`\<`boolean`\>

Enforces obligations regarding policy access to data.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

[`IRightsManagementPolicy`](IRightsManagementPolicy.md)

The policy to evaluate.

##### duty

`IOdrlDuty`

The duty to enforce.

##### information?

[`IRightsManagementInformation`](IRightsManagementInformation.md)

Information provided by the requester to determine if a policy can be created.

##### data?

`D`

The data to make a decision on.

##### action?

`string`

Optional action to make a decision on, if not provided, the enforcer will evaluate all actions in the duty.

#### Returns

`Promise`\<`boolean`\>

Whether the obligations were successfully enforced.
