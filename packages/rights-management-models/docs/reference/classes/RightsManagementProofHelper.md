# Class: RightsManagementProofHelper

Helper methods for creating and verifying rights management proofs.

## Constructors

### Constructor

> **new RightsManagementProofHelper**(): `RightsManagementProofHelper`

#### Returns

`RightsManagementProofHelper`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Rights Management Proof Helper.

## Methods

### createProofNegotiation()

> `static` **createProofNegotiation**(`identityConnector`, `verificationMethodId`, `locator`): `Promise`\<`IProof`\>

Create the proof for a specific action and asset type.

#### Parameters

##### identityConnector

`IIdentityConnector`

The identity connector to use for creating the proof.

##### verificationMethodId

`string`

The verification method id to use for creating the proof.

##### locator

[`IPolicyLocator`](../interfaces/IPolicyLocator.md)

The locator to find relevant policies.

#### Returns

`Promise`\<`IProof`\>

The proof object.

#### Throws

GeneralError is the proof creation fails.

***

### createProofPolicyId()

> `static` **createProofPolicyId**(`identityConnector`, `verificationMethodId`, `assignee`, `policyId`): `Promise`\<`IProof`\>

Create the proof for a policy id.

#### Parameters

##### identityConnector

`IIdentityConnector`

The identity connector to use for creating the proof.

##### verificationMethodId

`string`

The verification method id to use for creating the proof.

##### assignee

`string`

The identity of the node performing the action.

##### policyId

`string`

The id of the policy being accessed.

#### Returns

`Promise`\<`IProof`\>

The proof object.

#### Throws

GeneralError is the proof creation fails.

***

### verifyProofNegotiation()

> `static` **verifyProofNegotiation**(`identityConnector`, `locator`, `proof`, `proofTtlInSeconds`): `Promise`\<`void`\>

Verify the proof for a specific action and asset type.

#### Parameters

##### identityConnector

`IIdentityConnector`

The identity connector to use for verifying the proof.

##### locator

[`IPolicyLocator`](../interfaces/IPolicyLocator.md)

The locator to find relevant policies.

##### proof

`IProof`

The proof object containing the necessary information.

##### proofTtlInSeconds

`number`

The time-to-live (TTL) for the proof in seconds.

#### Returns

`Promise`\<`void`\>

#### Throws

GeneralError is the proof verification fails.

***

### verifyProofPolicyId()

> `static` **verifyProofPolicyId**(`identityConnector`, `assignee`, `policyId`, `proof`, `proofTtlInSeconds`): `Promise`\<`void`\>

Verify the proof for a policy id.

#### Parameters

##### identityConnector

`IIdentityConnector`

The identity connector to use for verifying the proof.

##### assignee

`string`

The identity of the node performing the action.

##### policyId

`string`

The id of the policy being accessed.

##### proof

`IProof`

The proof object containing the necessary information.

##### proofTtlInSeconds

`number`

The time-to-live (TTL) for the proof in seconds.

#### Returns

`Promise`\<`void`\>

#### Throws

GeneralError is the proof verification fails.

***

### verifyCreated()

> `static` **verifyCreated**(`proof`, `assignee`, `proofTtlInSeconds`): `Promise`\<`void`\>

Verify that the proof has a created date and that it is within the allowed time-to-live (TTL).

#### Parameters

##### proof

`IProof`

The proof object to verify.

##### assignee

`string`

The identity of the node performing the action.

##### proofTtlInSeconds

`number`

The time-to-live (TTL) for the proof in seconds.

#### Returns

`Promise`\<`void`\>

#### Throws

GeneralError if the proof is missing the created date or if it has expired.
