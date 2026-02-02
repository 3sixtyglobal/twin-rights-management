# Class: PolicyNegotiationPointService

Class implementation of Policy Negotiation Point Component.

## Implements

- `IPolicyNegotiationPointComponent`

## Constructors

### Constructor

> **new PolicyNegotiationPointService**(`options`): `PolicyNegotiationPointService`

Create a new instance of PolicyNegotiationPointService (PNP).

#### Parameters

##### options

[`IPolicyNegotiationPointServiceConstructorOptions`](../interfaces/IPolicyNegotiationPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyNegotiationPointService`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Negotiation Point Service.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyNegotiationPointComponent.className`

***

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

#### Implementation of

`IPolicyNegotiationPointComponent.getNegotiation`

***

### sendRequestToProvider()

> **sendRequestToProvider**(`url`, `requesterType`, `odrlOfferId`, `publicOrigin`): `Promise`\<`string`\>

Send a request to a provider.

#### Parameters

##### url

`string`

The url of the provider to send the request to.

##### requesterType

`string`

The type of the requester to use for the request, will use the registered requester to provide update.

##### odrlOfferId

`string`

The id of the offer to request.

##### publicOrigin

`string`

The public origin url of this PNP service.

#### Returns

`Promise`\<`string`\>

The negotiation id.

#### Implementation of

`IPolicyNegotiationPointComponent.sendRequestToProvider`

***

### requestFromConsumer()

> **requestFromConsumer**(`message`, `publicOrigin`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

Processes an incoming request on a provider from a consumer.
https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#contract-request-message.

#### Parameters

##### message

`IDataspaceProtocolContractRequestMessage`

The negotiation request.

##### publicOrigin

`string`

The public origin url of this PNP service.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

The current state of the contract negotiation or an error.

#### Implementation of

`IPolicyNegotiationPointComponent.requestFromConsumer`

***

### offerFromProvider()

> **offerFromProvider**(`message`, `publicOrigin`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

An offer has been received by a consumer.

#### Parameters

##### message

`IDataspaceProtocolContractOfferMessage`

The offer being received by the consumer.

##### publicOrigin

`string`

The public origin url of this PNP service.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

The current state of the contract negotiation or an error.

#### Implementation of

`IPolicyNegotiationPointComponent.offerFromProvider`

***

### agreementFromProvider()

> **agreementFromProvider**(`message`, `publicOrigin`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

An agreement has been received by a consumer.

#### Parameters

##### message

`IDataspaceProtocolContractAgreementMessage`

The agreement message to send.

##### publicOrigin

`string`

The public origin url of this PNP service.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

The error if there is one.

#### Implementation of

`IPolicyNegotiationPointComponent.agreementFromProvider`

***

### agreementVerificationFromConsumer()

> **agreementVerificationFromConsumer**(`message`, `publicOrigin`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

An agreement verification has been received by a provider.

#### Parameters

##### message

`IDataspaceProtocolContractAgreementVerificationMessage`

The agreement message to send.

##### publicOrigin

`string`

The public origin url of this PNP service.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

The error if there is one.

#### Implementation of

`IPolicyNegotiationPointComponent.agreementVerificationFromConsumer`

***

### event()

> **event**(`message`, `destination`, `publicOrigin`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

An event has been received by the provider or consumer.

#### Parameters

##### message

`IDataspaceProtocolContractNegotiationEventMessage`

The event message to send.

##### destination

The destination is provider or consumer.

`"provider"` | `"consumer"`

##### publicOrigin

`string`

The public origin url of this PNP service.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

The error if there is one.

#### Implementation of

`IPolicyNegotiationPointComponent.event`

***

### terminate()

> **terminate**(`message`, `destination`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

A termination message has been received by the consumer.

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

#### Implementation of

`IPolicyNegotiationPointComponent.terminate`
