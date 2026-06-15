# Class: PolicyNegotiationPointService

Class implementation of Policy Negotiation Point Component.

## Implements

- `IPolicyNegotiationPointComponent`

## Constructors

### Constructor

> **new PolicyNegotiationPointService**(`options?`): `PolicyNegotiationPointService`

Create a new instance of PolicyNegotiationPointService (PNP).

#### Parameters

##### options?

[`IPolicyNegotiationPointServiceConstructorOptions`](../interfaces/IPolicyNegotiationPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyNegotiationPointService`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Negotiation Point Service.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyNegotiationPointComponent.className`

***

### getNegotiation() {#getnegotiation}

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

### sendRequestToProvider() {#sendrequesttoprovider}

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

### requestFromConsumer() {#requestfromconsumer}

> **requestFromConsumer**(`message`, `trustPayload`, `publicOrigin?`): `Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

Processes an incoming request on a provider from a consumer.

#### Parameters

##### message

`IDataspaceProtocolContractRequestMessage`

The negotiation request.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

##### publicOrigin?

`string`

The public origin url of this PNP service.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiation` \| `IDataspaceProtocolContractNegotiationError`\>

The current state of the contract negotiation or an error.

#### See

https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/2025-1/#contract-request-message

#### Implementation of

`IPolicyNegotiationPointComponent.requestFromConsumer`

***

### offerFromProvider() {#offerfromprovider}

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

#### Implementation of

`IPolicyNegotiationPointComponent.offerFromProvider`

***

### agreementFromProvider() {#agreementfromprovider}

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

#### Implementation of

`IPolicyNegotiationPointComponent.agreementFromProvider`

***

### agreementVerificationFromConsumer() {#agreementverificationfromconsumer}

> **agreementVerificationFromConsumer**(`message`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

An agreement verification has been received by a provider.

#### Parameters

##### message

`IDataspaceProtocolContractAgreementVerificationMessage`

The agreement message to send.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

The error if there is one.

#### Implementation of

`IPolicyNegotiationPointComponent.agreementVerificationFromConsumer`

***

### event() {#event}

> **event**(`message`, `destination`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

An event has been received by the provider or consumer.

#### Parameters

##### message

`IDataspaceProtocolContractNegotiationEventMessage`

The event message to send.

##### destination

`"provider"` \| `"consumer"`

The destination is provider or consumer.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

The error if there is one.

#### Implementation of

`IPolicyNegotiationPointComponent.event`

***

### terminate() {#terminate}

> **terminate**(`message`, `destination`, `trustPayload`): `Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

A termination message has been received by the consumer.

#### Parameters

##### message

`IDataspaceProtocolContractNegotiationTerminationMessage`

The termination message to send.

##### destination

`"provider"` \| `"consumer"`

The destination is provider or consumer.

##### trustPayload

`unknown`

Trust payload to verify the requesters identity.

#### Returns

`Promise`\<`IDataspaceProtocolContractNegotiationError` \| `undefined`\>

The error if there is one.

#### Implementation of

`IPolicyNegotiationPointComponent.terminate`

***

### sendTerminateToConsumer() {#sendterminatetoconsumer}

> **sendTerminateToConsumer**(`callbackAddress`, `providerPid`, `consumerPid`): `Promise`\<`void`\>

Send a terminate message to a consumer at the given callback address.
Used by stall cleanup to notify consumers that their negotiation has been terminated.

#### Parameters

##### callbackAddress

`string`

The consumer callback URL to send the termination to.

##### providerPid

`string`

The provider negotiation id.

##### consumerPid

`string`

The consumer negotiation id.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the terminate message has been sent.

#### Implementation of

`IPolicyNegotiationPointComponent.sendTerminateToConsumer`
