# Interface: IPolicyNegotiationPointComponent

Interface describing a Policy Negotiation Point (PNP) contract.
When receiving a request from another component, the PNP will negotiate the terms
of the request and determine the appropriate policies to create.
https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#negotiation-protocol

## Extends

- `IComponent`

## Methods

### getNegotiation()

> **getNegotiation**(`id`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

Get the current state of the negotiation.

#### Parameters

##### id

`string`

The id of the negotiation to retrieve.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

The current state of the negotiation or an error.

***

### sendRequestToProvider()

> **sendRequestToProvider**(`url`, `requesterId`, `odrlOfferId`): `Promise`\<`string`\>

Send a request to a provider.

#### Parameters

##### url

`string`

The url of the provider to send the request to.

##### requesterId

`string`

The id of the requester to use for the request, will use the registered requester to provide update.

##### odrlOfferId

`string`

The id of the offer to request.

#### Returns

`Promise`\<`string`\>

The negotiation id.

***

### requestFromConsumer()

> **requestFromConsumer**(`message`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

Processes an incoming request on a provider from a consumer.

#### Parameters

##### message

`IDataspaceProtocolContractRequestMessage`

The negotiation request.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

The current state of the contract negotiation or an error.

***

### offerFromProvider()

> **offerFromProvider**(`message`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

An offer has been received by a consumer.

#### Parameters

##### message

`IDataspaceProtocolContractOfferMessage`

The offer being received by the consumer.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

The current state of the contract negotiation or an error.

***

### agreementFromProvider()

> **agreementFromProvider**(`message`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

An agreement has been received by a consumer.

#### Parameters

##### message

`IDataspaceProtocolContractAgreementMessage`

The agreement message to send.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

The error if there is one.

***

### agreementVerificationFromConsumer()

> **agreementVerificationFromConsumer**(`message`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

An agreement verification has been received by a provider.

#### Parameters

##### message

`IDataspaceProtocolContractAgreementVerificationMessage`

The agreement verification message to send.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

The error if there is one.

***

### event()

> **event**(`message`, `destination`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

An event has been received by the provider or consumer.

#### Parameters

##### message

`IDataspaceProtocolContractNegotiationEventMessage`

The event message to send.

##### destination

The destination is provider or consumer.

`"provider"` | `"consumer"`

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

The error if there is one.

***

### terminate()

> **terminate**(`message`, `destination`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

A termination message has been received by the provider or consumer.

#### Parameters

##### message

`IDataspaceProtocolContractNegotiationTerminationMessage`

The termination message to send.

##### destination

The destination is provider or consumer.

`"provider"` | `"consumer"`

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

The error if there is one.
