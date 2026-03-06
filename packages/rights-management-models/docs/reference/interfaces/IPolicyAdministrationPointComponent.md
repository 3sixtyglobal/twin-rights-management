# Interface: IPolicyAdministrationPointComponent

Interface describing a Policy Administration Point (PAP) component that manages ODRL policies.

## Extends

- `IComponent`

## Methods

### create()

> **create**(`policy`): `Promise`\<`string`\>

Create a new policy with auto-generated UID.

#### Parameters

##### policy

`JsonLdObjectWithOptionalAtId`\<`IDataspaceProtocolPolicy`\>

The policy to create (uid will be auto-generated).

#### Returns

`Promise`\<`string`\>

The UID of the created policy.

***

### update()

> **update**(`policy`): `Promise`\<`void`\>

Update an existing policy.

#### Parameters

##### policy

`IDataspaceProtocolPolicy`

The policy to update (must include uid).

#### Returns

`Promise`\<`void`\>

Nothing.

***

### get()

> **get**(`policyId`): `Promise`\<`IDataspaceProtocolPolicy`\>

Get a policy.

#### Parameters

##### policyId

`string`

The id of the policy to get.

#### Returns

`Promise`\<`IDataspaceProtocolPolicy`\>

The policy.

***

### getAgreement()

> **getAgreement**(`agreementId`): `Promise`\<`IDataspaceProtocolAgreement`\>

Get an agreement.

#### Parameters

##### agreementId

`string`

The id of the agreement to get.

#### Returns

`Promise`\<`IDataspaceProtocolAgreement`\>

The agreement.

***

### getSet()

> **getSet**(`setId`): `Promise`\<`IDataspaceProtocolSet`\>

Get a set.

#### Parameters

##### setId

`string`

The id of the set to get.

#### Returns

`Promise`\<`IDataspaceProtocolSet`\>

The set.

***

### getOffer()

> **getOffer**(`offerId`): `Promise`\<`IDataspaceProtocolOffer`\>

Get an offer.

#### Parameters

##### offerId

`string`

The id of the offer to get.

#### Returns

`Promise`\<`IDataspaceProtocolOffer`\>

The offer.

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

***

### query()

> **query**(`options?`, `conditions?`, `cursor?`, `limit?`): `Promise`\<\{ `cursor?`: `string`; `policies`: `IDataspaceProtocolPolicy`[]; \}\>

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

`EntityCondition`\<`IDataspaceProtocolPolicy`\>

The conditions to use for the query.

##### cursor?

`string`

The cursor to use for pagination.

##### limit?

`number`

The number of results to return per page.

#### Returns

`Promise`\<\{ `cursor?`: `string`; `policies`: `IDataspaceProtocolPolicy`[]; \}\>

Cursor for next page of results and the policies matching the query.
