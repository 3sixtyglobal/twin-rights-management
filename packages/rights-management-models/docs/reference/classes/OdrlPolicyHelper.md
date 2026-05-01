# Class: OdrlPolicyHelper

Helper methods for Odrl Policies.

## Constructors

### Constructor

> **new OdrlPolicyHelper**(): `OdrlPolicyHelper`

#### Returns

`OdrlPolicyHelper`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Administration Point Service.

## Methods

### getUid() {#getuid}

> `static` **getUid**(`object`): `string` \| `undefined`

Get the UID of an ODRL policy or related object if available.

#### Parameters

##### object

`object` \| `undefined`

The ODRL policy or related object to get the UID from.

#### Returns

`string` \| `undefined`

The UID of the object if available, otherwise undefined.

***

### getType() {#gettype}

> `static` **getType**(`object`): `string` \| `undefined`

Get the type of an ODRL policy or related object if available.

#### Parameters

##### object

`object` \| `undefined`

The ODRL policy or related object to get the type from.

#### Returns

`string` \| `undefined`

The type of the object if available, otherwise undefined.

***

### extractAssigneeIdentity() {#extractassigneeidentity}

> `static` **extractAssigneeIdentity**(`policy`): `ObjectOrArray`\<`string`\>

Extract assignee identity from policy.

#### Parameters

##### policy

`IDataspaceProtocolPolicy`

The policy to extract the assignee from.

#### Returns

`ObjectOrArray`\<`string`\>

Assignee id.

#### Throws

GeneralError if assignee is missing or invalid.

***

### extractAssignerIdentity() {#extractassigneridentity}

> `static` **extractAssignerIdentity**(`policy`): `ObjectOrArray`\<`string`\>

Extract assigner identity from policy.

#### Parameters

##### policy

`IDataspaceProtocolPolicy`

The policy to extract the assigner from.

#### Returns

`ObjectOrArray`\<`string`\>

Assigner id.

#### Throws

GeneralError if assigner is missing or invalid.

***

### getPartyIds() {#getpartyids}

> `static` **getPartyIds**(`party?`): `string`[]

Normalize party value(s) into identifier strings when possible.
Handles single parties or arrays of parties by returning all discovered identifiers.

#### Parameters

##### party?

`string` \| `IOdrlParty` \| `IOdrlPartyCollection` \| (`string` \| `IOdrlParty` \| `IOdrlPartyCollection`)[]

The party to normalize.

#### Returns

`string`[]

The party identifiers, or undefined when not available.

***

### getDatasetTargets() {#getdatasettargets}

> `static` **getDatasetTargets**(`policy`): `string`[]

Get the dataset targets from policy.

#### Parameters

##### policy

[`IRightsManagementPolicy`](../type-aliases/IRightsManagementPolicy.md)

The policy to extract the dataset targets from.

#### Returns

`string`[]

Top-level targets (deduped).

***

### getTargets() {#gettargets}

> `static` **getTargets**(`policy`): `string`[]

Get targets from policy.
Walks both the policy-level target field and the target field on every
permission, prohibition, and obligation rule so that policies that store
their target exclusively on a rule are correctly indexed for query().

#### Parameters

##### policy

[`IRightsManagementPolicy`](../type-aliases/IRightsManagementPolicy.md)

The policy to extract the targets from.

#### Returns

`string`[]

Targets.

***

### getActions() {#getactions}

> `static` **getActions**(`policy`): `string`[]

Get actions from policy.
Walks both the policy-level action field and the action field on every
permission, prohibition, and obligation rule so that policies that store
their action exclusively on a rule are correctly indexed for query().

#### Parameters

##### policy

[`IRightsManagementPolicy`](../type-aliases/IRightsManagementPolicy.md)

The policy to extract the actions from.

#### Returns

`string`[]

Actions.

***

### matchPolicy() {#matchpolicy}

> `static` **matchPolicy**(`policy`, `options`): `boolean`

Does the policy match.

#### Parameters

##### policy

[`IRightsManagementPolicy`](../type-aliases/IRightsManagementPolicy.md) \| `undefined`

The policy to try and match.

##### options

The matching options.

###### assignee?

`string`

The assignee to match.

###### assigner?

`string`

The assigner to match.

###### target?

`string`

The target to match.

###### action?

`string`

The action to match.

#### Returns

`boolean`

True if the policy matches.
