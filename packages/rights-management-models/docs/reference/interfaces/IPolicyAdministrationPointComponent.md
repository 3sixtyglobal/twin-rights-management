# Interface: IPolicyAdministrationPointComponent

Interface describing a Policy Administration Point (PAP) component that manages ODRL policies.

## Extends

- `IComponent`

## Methods

### create() {#create}

> **create**(`policy`): `Promise`\<`string`\>

Create a new policy with auto-generated UID.

#### Parameters

##### policy

`JsonLdObjectWithOptionalAtId`\<[`IRightsManagementPolicy`](IRightsManagementPolicy.md)\>

The policy to create (uid will be auto-generated).

#### Returns

`Promise`\<`string`\>

The UID of the created policy.

***

### update() {#update}

> **update**(`policy`): `Promise`\<`void`\>

Update an existing policy.

#### Parameters

##### policy

[`IRightsManagementPolicy`](IRightsManagementPolicy.md)

The policy to update (must include uid).

#### Returns

`Promise`\<`void`\>

A promise that resolves when the policy has been updated.

***

### get() {#get}

> **get**(`policyId`): `Promise`\<[`IRightsManagementPolicy`](IRightsManagementPolicy.md)\>

Get a policy.

#### Parameters

##### policyId

`string`

The id of the policy to get.

#### Returns

`Promise`\<[`IRightsManagementPolicy`](IRightsManagementPolicy.md)\>

The policy.

***

### getAgreement() {#getagreement}

> **getAgreement**(`agreementId`): `Promise`\<[`IRightsManagementAgreement`](IRightsManagementAgreement.md)\>

Get an agreement.

#### Parameters

##### agreementId

`string`

The id of the agreement to get.

#### Returns

`Promise`\<[`IRightsManagementAgreement`](IRightsManagementAgreement.md)\>

The agreement.

***

### getSet() {#getset}

> **getSet**(`setId`): `Promise`\<[`IRightsManagementSet`](IRightsManagementSet.md)\>

Get a set.

#### Parameters

##### setId

`string`

The id of the set to get.

#### Returns

`Promise`\<[`IRightsManagementSet`](IRightsManagementSet.md)\>

The set.

***

### getOffer() {#getoffer}

> **getOffer**(`offerId`): `Promise`\<[`IRightsManagementOffer`](IRightsManagementOffer.md)\>

Get an offer.

#### Parameters

##### offerId

`string`

The id of the offer to get.

#### Returns

`Promise`\<[`IRightsManagementOffer`](IRightsManagementOffer.md)\>

The offer.

***

### remove() {#remove}

> **remove**(`policyId`): `Promise`\<`void`\>

Remove a policy.

#### Parameters

##### policyId

`string`

The id of the policy to remove.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the policy has been removed.

***

### query() {#query}

> **query**(`locator?`, `conditions?`, `cursor?`, `limit?`, `properties?`, `orderBy?`, `orderByDirection?`): `Promise`\<\{ `cursor?`: `string`; `policies`: [`IRightsManagementPolicy`](IRightsManagementPolicy.md)[]; \}\>

Query the policies using the specified conditions.

#### Parameters

##### locator?

[`IPolicyLocator`](IPolicyLocator.md)

Optional locator to filter by type, assigner, assignee, target, or action.

##### conditions?

`EntityCondition`\<[`IRightsManagementPolicy`](IRightsManagementPolicy.md)\>

The conditions to use for the query.

##### cursor?

`string`

The cursor to use for pagination.

##### limit?

`number`

The number of results to return per page.

##### properties?

keyof [`IRightsManagementPolicy`](IRightsManagementPolicy.md)[]

Optional list of policy property names to include in the response, the policy "@id" is always included.

##### orderBy?

keyof IRightsManagementPolicy

The policy property to order the results by.

##### orderByDirection?

`SortDirection`

The direction for the order, defaults to descending.

#### Returns

`Promise`\<\{ `cursor?`: `string`; `policies`: [`IRightsManagementPolicy`](IRightsManagementPolicy.md)[]; \}\>

Cursor for next page of results and the policies matching the query.
