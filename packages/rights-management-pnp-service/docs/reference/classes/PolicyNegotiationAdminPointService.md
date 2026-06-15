# Class: PolicyNegotiationAdminPointService

Class implementation of Policy Negotiation Admin Point Component.

## Implements

- `IPolicyNegotiationAdminPointComponent`

## Constructors

### Constructor

> **new PolicyNegotiationAdminPointService**(`options?`): `PolicyNegotiationAdminPointService`

Create a new instance of PolicyNegotiationPointService (PNP).

#### Parameters

##### options?

[`IPolicyNegotiationAdminPointServiceConstructorOptions`](../interfaces/IPolicyNegotiationAdminPointServiceConstructorOptions.md)

The options for the component.

#### Returns

`PolicyNegotiationAdminPointService`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Negotiation Admin Point Service.

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

### start() {#start}

> **start**(`nodeLoggingComponentType?`): `Promise`\<`void`\>

The component needs to be started when the node is initialized.

#### Parameters

##### nodeLoggingComponentType?

`string`

The node logging component type.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the component has started.

#### Implementation of

`IPolicyNegotiationAdminPointComponent.start`

***

### stop() {#stop}

> **stop**(`nodeLoggingComponentType?`): `Promise`\<`void`\>

The component needs to be stopped when the node is closed.

#### Parameters

##### nodeLoggingComponentType?

`string`

The node logging component type.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the component has stopped.

#### Implementation of

`IPolicyNegotiationAdminPointComponent.stop`

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

> **get**(`id`): `Promise`\<`IPolicyNegotiation`\>

Retrieves a policy negotiation.

#### Parameters

##### id

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
Acquires a per-id mutex so it cannot interleave with a concurrent setIfExists() call
in the Policy Negotiation Point service.

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

> **query**(`status?`, `cursor?`): `Promise`\<\{ `items`: `IPolicyNegotiation`[]; `cursor?`: `string`; \}\>

Get a list of the negotiations.

#### Parameters

##### status?

`DataspaceProtocolContractNegotiationStateType`

The status of the negotiations to retrieve.

##### cursor?

`string`

The cursor to use for pagination.

#### Returns

`Promise`\<\{ `items`: `IPolicyNegotiation`[]; `cursor?`: `string`; \}\>

A list of negotiations and cursor if there are more entries.

#### Implementation of

`IPolicyNegotiationAdminPointComponent.query`
