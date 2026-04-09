# Interface: IPolicyManagementPointComponent

Interface describing a Policy Management Point (PMP) contract.
Provide the policies to the Policy Decision Point (PDP) based on the data and identities.

## Extends

- `IComponent`

## Methods

### retrieve() {#retrieve}

> **retrieve**(`options?`, `cursor?`): `Promise`\<\{ `policies`: [`IRightsManagementPolicy`](../type-aliases/IRightsManagementPolicy.md)[]; `cursor?`: `string`; \}\>

Get the policies from a PAP based on the data and identities.

#### Parameters

##### options?

Optional options to filter by assigner or assignee.

###### assigner?

`string`

The assigner to filter by.

###### assignee?

`string`

The assignee to filter by.

###### target?

`string`

The target to filter by.

###### action?

`string`

The action to filter by.

##### cursor?

`string`

An optional cursor to continue a previous query.

#### Returns

`Promise`\<\{ `policies`: [`IRightsManagementPolicy`](../type-aliases/IRightsManagementPolicy.md)[]; `cursor?`: `string`; \}\>

Returns the policies which apply to the data and identities so that the PDP can make a decision.
