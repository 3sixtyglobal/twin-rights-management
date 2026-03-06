# Interface: IPolicyNegotiation

Interface describing a rights management policy negotiation.

## Properties

### id

> **id**: `string`

The primary id used by the provider.

***

### correlationId

> **correlationId**: `string`

This is used by the other side of the negotiation.

***

### policyId?

> `optional` **policyId**: `string`

The unique identifier for the policy.

***

### dateCreated

> **dateCreated**: `string`

The date and time when the negotiation was created.

***

### expires?

> `optional` **expires**: `number`

The expiration time for the policy negotiation if it's a manual process.

***

### state

> **state**: `DataspaceProtocolContractNegotiationStateType`

The status of the negotiation.

***

### callbackAddress?

> `optional` **callbackAddress**: `string`

The callback address to send updates to the requester.

***

### organizationIdentity

> **organizationIdentity**: `string`

Organization identity to be used when sending trust payloads.

***

### offer?

> `optional` **offer**: `IDataspaceProtocolOffer`

The offer being requested.

***

### agreement?

> `optional` **agreement**: `IDataspaceProtocolAgreement`

The agreement being established if the negotiation was successful.

***

### trustVerificationInfo?

> `optional` **trustVerificationInfo**: `ITrustVerificationInfo`

The information from the trust provider.

***

### code?

> `optional` **code**: `string`

A reason code for when the negotiation errors.

***

### reason?

> `optional` **reason**: `object`[]

A more detailed reason for the negotiation error.

#### @value

> **@value**: `string`

#### @language?

> `optional` **@language**: `string`

***

### description?

> `optional` **description**: `object`[]

A more detailed reason for the negotiation error.

#### @value

> **@value**: `string`

#### @language?

> `optional` **@language**: `string`

***

### errorDetails?

> `optional` **errorDetails**: `IError`

Any additional error details that don't fit in the reason or description fields.

***

### handlerId?

> `optional` **handlerId**: `string`

The id of the handler, on provider side this is the negotiator, on consumer side this is the requester.

***

### interventionRequired?

> `optional` **interventionRequired**: `boolean`

Is manual intervention required to complete the negotiation?
