# Class: RightsManagementTokenHelper

Helper methods for creating and verifying rights managements requests.

## Constructors

### Constructor

> **new RightsManagementTokenHelper**(): `RightsManagementTokenHelper`

#### Returns

`RightsManagementTokenHelper`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Rights Management Token Helper.

## Methods

### createToken()

> `static` **createToken**\<`T`\>(`identityConnector`, `verificationMethodId`, `item`, `tokenTtlInSeconds`): `Promise`\<`string`\>

Create the token for an object.

#### Type Parameters

##### T

`T` *extends* `object`

#### Parameters

##### identityConnector

`IIdentityConnector`

The identity connector to use for creating the token.

##### verificationMethodId

`string`

The verification method id to use for creating the token.

##### item

`T`

The item to create the token for.

##### tokenTtlInSeconds

`number`

The time-to-live (TTL) for the token in seconds.

#### Returns

`Promise`\<`string`\>

The token.

#### Throws

GeneralError is the token creation fails.

***

### verifyToken()

> `static` **verifyToken**(`identityConnector`, `checkProperties`, `token`, `tokenTtlInSeconds`): `Promise`\<`Omit`\<`IDidVerifiableCredential`, `"issuer"`\> & `object`\>

Verify the token.

#### Parameters

##### identityConnector

`IIdentityConnector`

The identity connector to use for verifying the token.

##### checkProperties

`object`

Properties to compare against the subject to see if they match.

##### token

`string`

The token containing the necessary information.

##### tokenTtlInSeconds

`number`

The time-to-live (TTL) for the token in seconds.

#### Returns

`Promise`\<`Omit`\<`IDidVerifiableCredential`, `"issuer"`\> & `object`\>

The verifiable credential if the token is valid.

#### Throws

GeneralError is the token verification fails.

***

### verifyIssuanceDate()

> `static` **verifyIssuanceDate**(`issuanceDate`, `assignee`, `tokenTtlInSeconds`): `Promise`\<`void`\>

Verify that the token has an issuance date and that it is within the allowed time-to-live (TTL).

#### Parameters

##### issuanceDate

The issuance date from the token.

`undefined` | `string`

##### assignee

`string`

The identity of the node performing the action.

##### tokenTtlInSeconds

`number`

The time-to-live (TTL) for the token in seconds.

#### Returns

`Promise`\<`void`\>

#### Throws

GeneralError if the token is missing the issuance date or if it has expired.
