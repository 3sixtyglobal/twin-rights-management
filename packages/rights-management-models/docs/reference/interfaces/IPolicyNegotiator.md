# Interface: IPolicyNegotiator

Interface describing a Policy Negotiator.

## Extends

- `IComponent`

## Methods

### supportsOffer() {#supportsoffer}

> **supportsOffer**(`offer`): `boolean`

Determines if the negotiator supports the given offer.

#### Parameters

##### offer

`IDataspaceProtocolOffer`

The offer to check.

#### Returns

`boolean`

True if the negotiator supports the given offer.

***

### handleOffer() {#handleoffer}

> **handleOffer**(`offer`, `information?`): `Promise`\<\{ `accepted`: `boolean`; `interventionRequired`: `boolean`; `directAgreement?`: `boolean`; \}\>

Handle the offer.

#### Parameters

##### offer

`IDataspaceProtocolOffer`

The offer to check.

##### information?

[`IRightsManagementInformation`](IRightsManagementInformation.md)

Information provided by the requester to determine if a policy can be created.

#### Returns

`Promise`\<\{ `accepted`: `boolean`; `interventionRequired`: `boolean`; `directAgreement?`: `boolean`; \}\>

Sets the accepted flag if it can be offered, the interventionRequired flag if manual agreement is needed, and the directAgreement flag if the offer/accept round-trip can be skipped (ignored by callers when interventionRequired is true).

***

### createAgreement() {#createagreement}

> **createAgreement**(`offer`, `assignee`, `information?`): `Promise`\<`IDataspaceProtocolAgreement` \| `undefined`\>

Create an agreement based on the offer.

#### Parameters

##### offer

`IDataspaceProtocolOffer`

The offer to create the agreement from.

##### assignee

`string` \| `IOdrlParty`

The assignee of the agreement.

##### information?

[`IRightsManagementInformation`](IRightsManagementInformation.md)

Information provided by the requester to aid in the creation of the agreement.

#### Returns

`Promise`\<`IDataspaceProtocolAgreement` \| `undefined`\>

The agreement created from the offer or undefined if an agreement could not be created.
