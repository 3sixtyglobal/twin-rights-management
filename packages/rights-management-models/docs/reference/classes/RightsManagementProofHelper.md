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

> `static` **createProofNegotiation**(`identityConnector`, `verificationMethodId`, `nodeIdentity`, `assetType`, `action`, `resourceId`): `Promise`\<`IProof`\>

Create the proof for a specific action and asset type.

#### Parameters

##### identityConnector

`IIdentityConnector`

The identity connector to use for creating the proof.

##### verificationMethodId

`string`

The verification method id to use for creating the proof.

##### nodeIdentity

`string`

The identity of the node performing the action.

##### assetType

`string`

The type of the asset being accessed.

##### action

`string`

The action being performed.

##### resourceId

The specific resource id or can be left undefined for a whole asset class.

`undefined` | `string`

#### Returns

`Promise`\<`IProof`\>

The proof object.

#### Throws

GeneralError is the proof creation fails.

***

### createProofPolicyId()

> `static` **createProofPolicyId**(`identityConnector`, `verificationMethodId`, `nodeIdentity`, `policyId`): `Promise`\<`IProof`\>

Create the proof for a policy id.

#### Parameters

##### identityConnector

`IIdentityConnector`

The identity connector to use for creating the proof.

##### verificationMethodId

`string`

The verification method id to use for creating the proof.

##### nodeIdentity

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

> `static` **verifyProofNegotiation**(`identityConnector`, `nodeIdentity`, `assetType`, `action`, `resourceId`, `proof`, `proofTtlInSeconds`): `Promise`\<`void`\>

Verify the proof for a specific action and asset type.

#### Parameters

##### identityConnector

`IIdentityConnector`

The identity connector to use for verifying the proof.

##### nodeIdentity

`string`

The identity of the node performing the action.

##### assetType

`string`

The type of the asset being accessed.

##### action

`string`

The action being performed.

##### resourceId

The specific resource id or can be left undefined for a whole asset class.

`undefined` | `string`

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

> `static` **verifyProofPolicyId**(`identityConnector`, `nodeIdentity`, `policyId`, `proof`, `proofTtlInSeconds`): `Promise`\<`void`\>

Verify the proof for a policy id.

#### Parameters

##### identityConnector

`IIdentityConnector`

The identity connector to use for verifying the proof.

##### nodeIdentity

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

> `static` **verifyCreated**(`proof`, `nodeIdentity`, `proofTtlInSeconds`): `Promise`\<`void`\>

Verify that the proof has a created date and that it is within the allowed time-to-live (TTL).

#### Parameters

##### proof

`IProof`

The proof object to verify.

##### nodeIdentity

`string`

The identity of the node performing the action.

##### proofTtlInSeconds

`number`

The time-to-live (TTL) for the proof in seconds.

#### Returns

`Promise`\<`void`\>

#### Throws

GeneralError if the proof is missing the created date or if it has expired.
