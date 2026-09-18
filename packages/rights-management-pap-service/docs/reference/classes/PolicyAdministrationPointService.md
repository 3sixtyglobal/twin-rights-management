# Class: PolicyAdministrationPointService

Class implementation of Policy Administration Point Component.

## Implements

- `IPolicyAdministrationPointComponent`

## Constructors

### Constructor

> **new PolicyAdministrationPointService**(`options?`): `PolicyAdministrationPointService`

Create a new instance of PolicyAdministrationPointService (PAP).

#### Parameters

##### options?

[`IPolicyAdministrationPointServiceConstructorOptions`](../interfaces/IPolicyAdministrationPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyAdministrationPointService`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Administration Point Service.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyAdministrationPointComponent.className`

***

### create() {#create}

> **create**(`policy`): `Promise`\<`string`\>

Create a new policy with auto-generated UID.

#### Parameters

##### policy

`JsonLdObjectWithOptionalAtId`\<`IRightsManagementPolicy`\>

The policy to create (uid will be auto-generated).

#### Returns

`Promise`\<`string`\>

The UID of the created policy.

#### Implementation of

`IPolicyAdministrationPointComponent.create`

***

### update() {#update}

> **update**(`policy`): `Promise`\<`void`\>

Update an existing policy.

#### Parameters

##### policy

`IRightsManagementPolicy`

The policy to update (must include uid).

#### Returns

`Promise`\<`void`\>

A promise that resolves when the policy has been updated.

#### Implementation of

`IPolicyAdministrationPointComponent.update`

***

### get() {#get}

> **get**(`policyId`): `Promise`\<`IRightsManagementPolicy`\>

Get a policy from the entity storage.

#### Parameters

##### policyId

`string`

The ID of the policy to get.

#### Returns

`Promise`\<`IRightsManagementPolicy`\>

The policy.

#### Implementation of

`IPolicyAdministrationPointComponent.get`

***

### getAgreement() {#getagreement}

> **getAgreement**(`agreementId`): `Promise`\<`IRightsManagementAgreement`\>

Get an agreement from the entity storage.

#### Parameters

##### agreementId

`string`

The ID of the agreement to get.

#### Returns

`Promise`\<`IRightsManagementAgreement`\>

The agreement.

#### Implementation of

`IPolicyAdministrationPointComponent.getAgreement`

***

### getOffer() {#getoffer}

> **getOffer**(`offerId`): `Promise`\<`IRightsManagementOffer`\>

Get an offer from the entity storage.

#### Parameters

##### offerId

`string`

The ID of the offer to get.

#### Returns

`Promise`\<`IRightsManagementOffer`\>

The offer.

#### Implementation of

`IPolicyAdministrationPointComponent.getOffer`

***

### getSet() {#getset}

> **getSet**(`setId`): `Promise`\<`IRightsManagementSet`\>

Get a set from the entity storage.

#### Parameters

##### setId

`string`

The ID of the set to get.

#### Returns

`Promise`\<`IRightsManagementSet`\>

The set.

#### Implementation of

`IPolicyAdministrationPointComponent.getSet`

***

### remove() {#remove}

> **remove**(`policyId`): `Promise`\<`void`\>

Remove a policy from the entity storage.

#### Parameters

##### policyId

`string`

The ID of the policy to remove.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the policy has been removed.

#### Implementation of

`IPolicyAdministrationPointComponent.remove`

***

### query() {#query}

> **query**(`locator?`, `conditions?`, `cursor?`, `limit?`, `properties?`, `orderBy?`, `orderByDirection?`): `Promise`\<\{ `cursor?`: `string`; `policies`: `IRightsManagementPolicy`[]; \}\>

Query the entity storage for policies.
When the locator filters on assigner, assignee, target or action the page is driven by a
single lookup on the index storage, and the returned cursor encodes the index paging state.
The index orders by the policy creation date, so ordering by dateCreated applies across the
whole result while ordering by any other property only applies within a page. A page can
contain fewer policies than the limit, because the conditions can exclude some of them and
because a policy can hold several index entries which match a locator that does not pin every
field, so callers must page until the cursor is undefined rather than stop on a short page.
No policy is returned by more than one page.

#### Parameters

##### locator?

`IPolicyLocator`

Optional locator to filter by type, assigner, assignee, target, or action.

##### conditions?

`EntityCondition`\<`IRightsManagementPolicy`\>

The conditions to query the entity storage with.

##### cursor?

`string`

The cursor to use for pagination.

##### limit?

`number`

The number of results to return per page.

##### properties?

keyof `IRightsManagementPolicy`[]

Optional list of policy property names to include in the response, the policy "@id" is always included.

##### orderBy?

keyof IRightsManagementPolicy

The policy property to order the results by.

##### orderByDirection?

`SortDirection`

The direction for the order, defaults to descending.

#### Returns

`Promise`\<\{ `cursor?`: `string`; `policies`: `IRightsManagementPolicy`[]; \}\>

The matching policies and an optional cursor for the next page of results.

#### Implementation of

`IPolicyAdministrationPointComponent.query`
