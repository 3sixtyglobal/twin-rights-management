# Class: RightsManagementService

Service for performing Rights Management operations.
This is a unified service that provides access to all Rights Management components.

## Implements

- `IRightsManagementComponent`

## Constructors

### Constructor

> **new RightsManagementService**(`options?`): `RightsManagementService`

Create a new instance of RightsManagementService.

#### Parameters

##### options?

[`IRightsManagementServiceConstructorOptions`](../interfaces/IRightsManagementServiceConstructorOptions.md)

The options for the service.

#### Returns

`RightsManagementService`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IRightsManagementComponent.CLASS_NAME`

## Methods

### papCreate()

> **papCreate**(`policy`): `Promise`\<`string`\>

PAP: Create a new policy with auto-generated UID.

#### Parameters

##### policy

`Omit`\<`IOdrlPolicy`, `"uid"`\> & `object`

The policy to create (uid will be auto-generated).

#### Returns

`Promise`\<`string`\>

The UID of the created policy.

#### Implementation of

`IRightsManagementComponent.papCreate`

***

### papUpdate()

> **papUpdate**(`policy`): `Promise`\<`void`\>

PAP: Update an existing policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to update (must include uid).

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IRightsManagementComponent.papUpdate`

***

### papRetrieve()

> **papRetrieve**(`policyId`): `Promise`\<`IOdrlPolicy`\>

PAP: Retrieve a policy.

#### Parameters

##### policyId

`string`

The id of the policy to retrieve.

#### Returns

`Promise`\<`IOdrlPolicy`\>

The policy.

#### Implementation of

`IRightsManagementComponent.papRetrieve`

***

### papRemove()

> **papRemove**(`policyId`): `Promise`\<`void`\>

PAP: Remove a policy.

#### Parameters

##### policyId

`string`

The id of the policy to remove.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IRightsManagementComponent.papRemove`

***

### papQuery()

> **papQuery**(`conditions?`, `cursor?`, `pageSize?`): `Promise`\<\{ `cursor?`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

PAP: Query the policies using the specified conditions.

#### Parameters

##### conditions?

`EntityCondition`\<`IOdrlPolicy`\>

The conditions to use for the query.

##### cursor?

`string`

The cursor to use for pagination.

##### pageSize?

`number`

The number of results to return per page.

#### Returns

`Promise`\<\{ `cursor?`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Cursor for next page of results and the policies matching the query.

#### Implementation of

`IRightsManagementComponent.papQuery`

***

### pepIntercept()

> **pepIntercept**\<`C`, `D`, `R`\>(`assetType`, `action`, `context`, `data`): `Promise`\<`undefined` \| `R`\>

PEP: Process the data using Policy Decision Point (PDP) and return the manipulated data.

#### Type Parameters

##### C

`C` *extends* `IPolicyContext` = `IPolicyContext`

##### D

`D` = `unknown`

##### R

`R` = `unknown`

#### Parameters

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

##### context

The context to use in the decision making.

`undefined` | `C`

##### data

The data to process.

`undefined` | `D`

#### Returns

`Promise`\<`undefined` \| `R`\>

The manipulated data with any policies applied.

#### Implementation of

`IRightsManagementComponent.pepIntercept`

***

### pnpNegotiate()

> **pnpNegotiate**\<`C`\>(`assetType`, `action`, `resourceId`, `context`, `requesterInformation`, `proof`): `Promise`\<`IPolicyState`\>

PNP: Negotiates the creation of a policy for the requested resource.

#### Type Parameters

##### C

`C` *extends* `IPolicyContext` = `IPolicyContext`

#### Parameters

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

##### resourceId

The ID of the resource being requested, can be empty if asset type access requested.

`undefined` | `string`

##### context

`C`

The context from the requesting node.

##### requesterInformation

Information provided by the requester to determine if a policy can be created.

`undefined` | \{\[`source`: `string`\]: `IJsonLdNodeObject`[]; \}

##### proof

`IProof`

The proof provided by the requester to support the policy creation.

#### Returns

`Promise`\<`IPolicyState`\>

The state of the policy.

#### Implementation of

`IRightsManagementComponent.pnpNegotiate`

***

### pnpNegotiationState()

> **pnpNegotiationState**(`policyId`, `nodeIdentity`, `proof`): `Promise`\<`IPolicyState`\>

PNP: Retrieves the current state of a policy.

#### Parameters

##### policyId

`string`

The ID of the policy to retrieve the state for.

##### nodeIdentity

`string`

The identity of the node requesting the state.

##### proof

`IProof`

The proof provided by the requester.

#### Returns

`Promise`\<`IPolicyState`\>

The current state of the policy.

#### Implementation of

`IRightsManagementComponent.pnpNegotiationState`

***

### pnpNegotiationCancel()

> **pnpNegotiationCancel**(`policyId`, `nodeIdentity`, `proof`): `Promise`\<`void`\>

PNP: Cancels an ongoing negotiation for a resource.

#### Parameters

##### policyId

`string`

The ID of the policy to cancel.

##### nodeIdentity

`string`

The identity of the node requesting the cancellation.

##### proof

`IProof`

The proof provided by the requester.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IRightsManagementComponent.pnpNegotiationCancel`

***

### pnapGet()

> **pnapGet**(`policyId`): `Promise`\<`IPolicyNegotiation`\>

PNAP: Retrieves a policy negotiation.

#### Parameters

##### policyId

`string`

The ID of the policy to retrieve the negotiation for.

#### Returns

`Promise`\<`IPolicyNegotiation`\>

The policy negotiation.

#### Implementation of

`IRightsManagementComponent.pnapGet`

***

### pnapSet()

> **pnapSet**(`negotiation`): `Promise`\<`void`\>

PNAP: Sets a policy negotiation.

#### Parameters

##### negotiation

`IPolicyNegotiation`

The updated policy negotiation.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IRightsManagementComponent.pnapSet`

***

### pnapRemove()

> **pnapRemove**(`policyId`): `Promise`\<`void`\>

PNAP: Cancels an ongoing negotiation for a resource.

#### Parameters

##### policyId

`string`

The ID of the policy to cancel.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IRightsManagementComponent.pnapRemove`

***

### pnapQuery()

> **pnapQuery**(`status?`, `cursor?`): `Promise`\<\{ `items`: `IPolicyNegotiation`[]; `cursor?`: `string`; \}\>

PNAP: Get a list of the negotiations.

#### Parameters

##### status?

`PolicyNegotiationStatus`

The state of the negotiations to retrieve.

##### cursor?

`string`

The cursor to use for pagination.

#### Returns

`Promise`\<\{ `items`: `IPolicyNegotiation`[]; `cursor?`: `string`; \}\>

A list of negotiations and cursor if there are more entries.

#### Implementation of

`IRightsManagementComponent.pnapQuery`
