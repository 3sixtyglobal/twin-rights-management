# Interface: IRightsManagementComponent

Interface describing a unified Rights Management Component.
This serves as a single point of entry for all rights management operations.

## Extends

- `IComponent`

## Methods

### papCreate()

> **papCreate**(`policy`): `Promise`\<`string`\>

Create a new policy with auto-generated UID.

#### Parameters

##### policy

`Omit`\<`IOdrlPolicy`, `"uid"`\> & `object`

The policy to create (uid will be auto-generated).

#### Returns

`Promise`\<`string`\>

The UID of the created policy.

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

***

### pepIntercept()

> **pepIntercept**\<`C`, `D`\>(`assetType`, `action`, `context`, `data`): `Promise`\<`undefined` \| `Partial`\<`D`\>\>

PEP: Process the data using Policy Decision Point (PDP) and return the manipulated data.

#### Type Parameters

##### C

`C` *extends* [`IPolicyContext`](IPolicyContext.md) = [`IPolicyContext`](IPolicyContext.md)

##### D

`D` = `unknown`

#### Parameters

##### assetType

`string`

The type of asset being processed.

##### action

`string`

The action being performed on the asset.

##### context

The context information to use in the decision making.

`undefined` | `C`

##### data

The data to process.

`undefined` | `D`

#### Returns

`Promise`\<`undefined` \| `Partial`\<`D`\>\>

The manipulated data with any policies applied.

***

### pnpNegotiate()

> **pnpNegotiate**\<`C`\>(`assetType`, `action`, `resourceId`, `context`, `requesterInformation`, `proof`): `Promise`\<[`IPolicyState`](IPolicyState.md)\>

PNP: Negotiates the creation of a policy for the requested resource.

#### Type Parameters

##### C

`C` *extends* [`IPolicyContext`](IPolicyContext.md) = [`IPolicyContext`](IPolicyContext.md)

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

`Promise`\<[`IPolicyState`](IPolicyState.md)\>

The state of the policy.

***

### pnpNegotiationState()

> **pnpNegotiationState**(`policyId`, `nodeIdentity`, `proof`): `Promise`\<[`IPolicyState`](IPolicyState.md)\>

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

`Promise`\<[`IPolicyState`](IPolicyState.md)\>

The current state of the policy.

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

***

### pnapGet()

> **pnapGet**(`policyId`): `Promise`\<[`IPolicyNegotiation`](IPolicyNegotiation.md)\>

PNAP: Retrieves a policy negotiation.

#### Parameters

##### policyId

`string`

The ID of the policy to retrieve the negotiation for.

#### Returns

`Promise`\<[`IPolicyNegotiation`](IPolicyNegotiation.md)\>

The policy negotiation.

***

### pnapSet()

> **pnapSet**(`negotiation`): `Promise`\<`void`\>

PNAP: Sets a policy negotiation.

#### Parameters

##### negotiation

[`IPolicyNegotiation`](IPolicyNegotiation.md)

The updated policy negotiation.

#### Returns

`Promise`\<`void`\>

Nothing.

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

***

### pnapQuery()

> **pnapQuery**(`status?`, `cursor?`): `Promise`\<\{ `items`: [`IPolicyNegotiation`](IPolicyNegotiation.md)[]; `cursor?`: `string`; \}\>

PNAP: Get a list of the negotiations.

#### Parameters

##### status?

[`PolicyNegotiationStatus`](../type-aliases/PolicyNegotiationStatus.md)

The state of the negotiations to retrieve.

##### cursor?

`string`

The cursor to use for pagination.

#### Returns

`Promise`\<\{ `items`: [`IPolicyNegotiation`](IPolicyNegotiation.md)[]; `cursor?`: `string`; \}\>

A list of negotiations and cursor if there are more entries.
