# Class: PolicyNegotiation

Class describing a rights management policy negotiation.

## Constructors

### Constructor

> **new PolicyNegotiation**(): `PolicyNegotiation`

#### Returns

`PolicyNegotiation`

## Properties

### id {#id}

> **id**: `string`

An id to help identify the negotiation on the provider's side.

***

### correlationId {#correlationid}

> **correlationId**: `string`

This is used by the other side of the negotiation.

***

### policyId? {#policyid}

> `optional` **policyId?**: `string`

The unique identifier for the policy.

***

### dateCreated {#datecreated}

> **dateCreated**: `string`

The date and time when the negotiation was created.

***

### expires? {#expires}

> `optional` **expires?**: `number`

The expiration time for the policy negotiation.

***

### state {#state}

> **state**: `DataspaceProtocolContractNegotiationStateType`

The status of the negotiation.

***

### callbackAddress? {#callbackaddress}

> `optional` **callbackAddress?**: `string`

The callback address to send updates to the requester.

***

### publicOrigin? {#publicorigin}

> `optional` **publicOrigin?**: `string`

The public origin of the server that initiated or received this negotiation.
Used to construct callback URLs in subsequent async messages.

***

### organizationIdentity {#organizationidentity}

> **organizationIdentity**: `string`

Organization identity to be used when sending trust payloads.

***

### offer? {#offer}

> `optional` **offer?**: `IDataspaceProtocolOffer`

The offer being requested.

***

### agreement? {#agreement}

> `optional` **agreement?**: `IDataspaceProtocolAgreement`

The agreement being established if the negotiation was successful.

***

### trustVerificationInfo? {#trustverificationinfo}

> `optional` **trustVerificationInfo?**: `ITrustVerificationInfo`

The information from the trust provider.

***

### code? {#code}

> `optional` **code?**: `string`

A reason code for when the negotiation errors.

***

### reason? {#reason}

> `optional` **reason?**: `object`[]

A more detailed reason for the negotiation error reason.

#### @value

> **@value**: `string`

#### @language?

> `optional` **@language?**: `string`

***

### errorDetails? {#errordetails}

> `optional` **errorDetails?**: `IError`

Any additional error details that don't fit in the reason or description fields.

***

### description? {#description}

> `optional` **description?**: `object`[]

A more detailed reason for the negotiation error description.

#### @value

> **@value**: `string`

#### @language?

> `optional` **@language?**: `string`

***

### handlerId? {#handlerid}

> `optional` **handlerId?**: `string`

The id of the handler, on provider side this is the negotiator, on consumer side this is the requester.

***

### interventionRequired? {#interventionrequired}

> `optional` **interventionRequired?**: `boolean`

Is manual intervention required to complete the negotiation?
