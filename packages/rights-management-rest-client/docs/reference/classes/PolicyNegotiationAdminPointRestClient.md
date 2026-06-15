# Class: PolicyNegotiationAdminPointRestClient

Client for performing Rights Management Policy Negotiation Admin through to REST endpoints.

## Extends

- `BaseRestClient`

## Implements

- `IPolicyNegotiationAdminPointComponent`

## Constructors

### Constructor

> **new PolicyNegotiationAdminPointRestClient**(`config`): `PolicyNegotiationAdminPointRestClient`

Create a new instance of PolicyNegotiationAdminPointClient.

#### Parameters

##### config

`IBaseRestClientConfig`

The configuration for the client.

#### Returns

`PolicyNegotiationAdminPointRestClient`

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

`IPolicyNegotiationAdminPointComponent.className`

***

### create() {#create}

> **create**(`negotiation`): `Promise`\<`string`\>

Pre-registers a consumer-side negotiation entry.

#### Parameters

##### negotiation

`IPnapCreateBody`

The partial negotiation data; id (consumerPid) is required.

#### Returns

`Promise`\<`string`\>

The negotiation id (same as the caller-supplied id).

#### Implementation of

`IPolicyNegotiationAdminPointComponent.create`

***

### get() {#get}

> **get**(`policyId`): `Promise`\<`IPolicyNegotiation`\>

Retrieves a policy negotiation.

#### Parameters

##### policyId

`string`

The ID of the policy to retrieve the negotiation for.

#### Returns

`Promise`\<`IPolicyNegotiation`\>

The policy negotiation.

#### Implementation of

`IPolicyNegotiationAdminPointComponent.get`

***

### set() {#set}

> **set**(`negotiation`): `Promise`\<`void`\>

Sets a policy negotiation.

#### Parameters

##### negotiation

`IPolicyNegotiation`

The updated policy negotiation.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the negotiation has been stored.

#### Implementation of

`IPolicyNegotiationAdminPointComponent.set`

***

### remove() {#remove}

> **remove**(`policyId`): `Promise`\<`void`\>

Cancels an ongoing negotiation for a resource.

#### Parameters

##### policyId

`string`

The ID of the policy to cancel.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the negotiation has been removed.

#### Implementation of

`IPolicyNegotiationAdminPointComponent.remove`

***

### query() {#query}

> **query**(`state?`, `cursor?`): `Promise`\<\{ `items`: `IPolicyNegotiation`[]; `cursor?`: `string`; \}\>

Get a list of the negotiations.

#### Parameters

##### state?

`DataspaceProtocolContractNegotiationStateType`

The state of the negotiations to retrieve.

##### cursor?

`string`

The cursor to use for pagination.

#### Returns

`Promise`\<\{ `items`: `IPolicyNegotiation`[]; `cursor?`: `string`; \}\>

A list of negotiations and cursor if there are more entries.

#### Implementation of

`IPolicyNegotiationAdminPointComponent.query`
