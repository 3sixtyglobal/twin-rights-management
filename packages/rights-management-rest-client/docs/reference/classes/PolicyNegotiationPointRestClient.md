# Class: PolicyNegotiationPointRestClient

Client for performing Rights Management Policy Negotiation through to REST endpoints.

## Extends

- `BaseRestClient`

## Implements

- `IPolicyNegotiationPointComponent`

## Constructors

### Constructor

> **new PolicyNegotiationPointRestClient**(`config`): `PolicyNegotiationPointRestClient`

Create a new instance of PolicyNegotiationPointRestClient.

#### Parameters

##### config

`IBaseRestClientConfig`

The configuration for the client.

#### Returns

`PolicyNegotiationPointRestClient`

#### Overrides

`BaseRestClient.constructor`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

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

> **sendRequestToProvider**(`url`, `requesterType`, `odrlOfferId`): `Promise`\<`string`\>

Send a request to a provider - not supported in the REST client.

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

#### Returns

`Promise`\<`string`\>

The negotiation id.

#### Implementation of

`IPolicyNegotiationPointComponent.sendRequestToProvider`

***

### requestFromConsumer() {#requestfromconsumer}

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

The agreement verification message to send.

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

The destination is provider or consumer.

`"provider"` | `"consumer"`

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

#### Implementation of

`IPolicyNegotiationPointComponent.terminate`

***

### sendTerminateToConsumer() {#sendterminatetoconsumer}

> **sendTerminateToConsumer**(`callbackAddress`, `providerPid`, `consumerPid`): `Promise`\<`void`\>

Send a terminate message to a consumer at the given callback address.
Not supported on the REST client; use the policy negotiation point service when stall cleanup needs to notify consumers.

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

#### Implementation of

`IPolicyNegotiationPointComponent.sendTerminateToConsumer`
