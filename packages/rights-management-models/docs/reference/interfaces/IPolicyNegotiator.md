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

Sets the supports flag if it can be offered, and the interventionRequired flag if manual agreement is needed.

***

### handleOffer() {#handleoffer}

> **handleOffer**(`offer`, `information?`): `Promise`\<\{ `accepted`: `boolean`; `interventionRequired`: `boolean`; \}\>

Handle the offer.

#### Parameters

##### offer

`IDataspaceProtocolOffer`

The offer to check.

##### information?

Information provided by the requester to determine if a policy can be created.

#### Returns

`Promise`\<\{ `accepted`: `boolean`; `interventionRequired`: `boolean`; \}\>

Sets the accepted flag if it can be offered, and the interventionRequired flag if manual agreement is needed.

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

Information provided by the requester to aid in the creation of the agreement.

#### Returns

`Promise`\<`IDataspaceProtocolAgreement` \| `undefined`\>

The agreement created from the offer or undefined if an agreement could not be created.
