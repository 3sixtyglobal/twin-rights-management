# Class: PolicyAdministrationPointRestClient

Client for performing Rights Management Policy Administration through to REST endpoints.

## Extends

- `BaseRestClient`

## Implements

- `IPolicyAdministrationPointComponent`

## Constructors

### Constructor

> **new PolicyAdministrationPointRestClient**(`config`): `PolicyAdministrationPointRestClient`

Create a new instance of PolicyAdministrationPointRestClient.

#### Parameters

##### config

`IBaseRestClientConfig`

The configuration for the client.

#### Returns

`PolicyAdministrationPointRestClient`

#### Overrides

`BaseRestClient.constructor`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyAdministrationPointComponent.className`

***

### create()

> **create**(`policy`): `Promise`\<`string`\>

Create a new policy with auto-generated UID.

#### Parameters

##### policy

`Omit`\<`IOdrlPolicy`, `"uid"`\> & `object`

The policy to create (uid will be auto-generated).

#### Returns

`Promise`\<`string`\>

The UID of the created policy.

#### Implementation of

`IPolicyAdministrationPointComponent.create`

***

### update()

> **update**(`policy`): `Promise`\<`void`\>

Update an existing policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to update (must include uid).

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyAdministrationPointComponent.update`

***

### get()

> **get**(`policyId`): `Promise`\<`IOdrlPolicy`\>

Get a policy.

#### Parameters

##### policyId

`string`

The id of the policy to get.

#### Returns

`Promise`\<`IOdrlPolicy`\>

The policy.

#### Implementation of

`IPolicyAdministrationPointComponent.get`

***

### getAgreement()

> **getAgreement**(`agreementId`): `Promise`\<`IOdrlAgreement`\>

Get an agreement.

#### Parameters

##### agreementId

`string`

The id of the agreement to get.

#### Returns

`Promise`\<`IOdrlAgreement`\>

The agreement.

#### Implementation of

`IPolicyAdministrationPointComponent.getAgreement`

***

### getSet()

> **getSet**(`setId`): `Promise`\<`IOdrlSet`\>

Get a set.

#### Parameters

##### setId

`string`

The id of the set to get.

#### Returns

`Promise`\<`IOdrlSet`\>

The set.

#### Implementation of

`IPolicyAdministrationPointComponent.getSet`

***

### getOffer()

> **getOffer**(`offerId`): `Promise`\<`IOdrlOffer`\>

Get an offer.

#### Parameters

##### offerId

`string`

The id of the offer to get.

#### Returns

`Promise`\<`IOdrlOffer`\>

The offer.

#### Implementation of

`IPolicyAdministrationPointComponent.getOffer`

***

### remove()

> **remove**(`policyId`): `Promise`\<`void`\>

Remove a policy.

#### Parameters

##### policyId

`string`

The id of the policy to remove.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IPolicyAdministrationPointComponent.remove`

***

### query()

> **query**(`options?`, `conditions?`, `cursor?`, `limit?`): `Promise`\<\{ `cursor?`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Query the policies using the specified conditions.

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

##### conditions?

`EntityCondition`\<`IOdrlPolicy`\>

The conditions to use for the query.

##### cursor?

`string`

The cursor to use for pagination.

##### limit?

`number`

The number of results to return per page.

#### Returns

`Promise`\<\{ `cursor?`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Cursor for next page of results and the policies matching the query.

#### Implementation of

`IPolicyAdministrationPointComponent.query`
