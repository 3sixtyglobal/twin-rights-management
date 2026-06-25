# Interface: IPolicyManagementPointComponent

Interface describing a Policy Management Point (PMP) contract.
Provide the policies to the Policy Decision Point (PDP) based on the data and identities.

## Extends

- `IComponent`

## Methods

### retrieve() {#retrieve}

> **retrieve**(`locator?`, `cursor?`): `Promise`\<\{ `policies`: [`IRightsManagementPolicy`](IRightsManagementPolicy.md)[]; `cursor?`: `string`; \}\>

Get the policies from a PAP based on the data and identities.

#### Parameters

##### locator?

[`IPolicyLocator`](IPolicyLocator.md)

Optional locator to filter by type, assigner, assignee, target, or action.

##### cursor?

`string`

An optional cursor to continue a previous query.

#### Returns

`Promise`\<\{ `policies`: [`IRightsManagementPolicy`](IRightsManagementPolicy.md)[]; `cursor?`: `string`; \}\>

Returns the policies which apply to the data and identities so that the PDP can make a decision.
