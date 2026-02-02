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

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Administration Point Service.

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

Get a policy from the entity storage.

#### Parameters

##### policyId

`string`

The ID of the policy to get.

#### Returns

`Promise`\<`IOdrlPolicy`\>

The policy.

#### Implementation of

`IPolicyAdministrationPointComponent.get`

***

### getAgreement()

> **getAgreement**(`agreementId`): `Promise`\<`IOdrlAgreement`\>

Get an agreement from the entity storage.

#### Parameters

##### agreementId

`string`

The ID of the agreement to get.

#### Returns

`Promise`\<`IOdrlAgreement`\>

The agreement.

#### Implementation of

`IPolicyAdministrationPointComponent.getAgreement`

***

### getOffer()

> **getOffer**(`offerId`): `Promise`\<`IOdrlOffer`\>

Get an offer from the entity storage.

#### Parameters

##### offerId

`string`

The ID of the offer to get.

#### Returns

`Promise`\<`IOdrlOffer`\>

The offer.

#### Implementation of

`IPolicyAdministrationPointComponent.getOffer`

***

### getSet()

> **getSet**(`setId`): `Promise`\<`IOdrlSet`\>

Get a set from the entity storage.

#### Parameters

##### setId

`string`

The ID of the set to get.

#### Returns

`Promise`\<`IOdrlSet`\>

The set.

#### Implementation of

`IPolicyAdministrationPointComponent.getSet`

***

### remove()

> **remove**(`policyId`): `Promise`\<`void`\>

Remove a policy from the entity storage.

#### Parameters

##### policyId

`string`

The ID of the policy to remove.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IPolicyAdministrationPointComponent.remove`

***

### query()

> **query**(`options?`, `conditions?`, `cursor?`, `limit?`): `Promise`\<\{ `cursor?`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Query the entity storage for policies.

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

The conditions to query the entity storage with.

##### cursor?

`string`

The cursor to use for pagination.

##### limit?

`number`

The number of results to return per page.

#### Returns

`Promise`\<\{ `cursor?`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

The policies.

#### Implementation of

`IPolicyAdministrationPointComponent.query`
