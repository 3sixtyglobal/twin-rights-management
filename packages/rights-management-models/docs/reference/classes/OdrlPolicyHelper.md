# Class: OdrlPolicyHelper

Helper methods for Odrl Policies.

## Constructors

### Constructor

> **new OdrlPolicyHelper**(): `OdrlPolicyHelper`

#### Returns

`OdrlPolicyHelper`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Policy Administration Point Service.

## Methods

### extractAssigneeIdentity()

> `static` **extractAssigneeIdentity**(`policy`): `ObjectOrArray`\<`string`\>

Extract assignee identity from policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to extract the assignee from.

#### Returns

`ObjectOrArray`\<`string`\>

Assignee id.

#### Throws

GeneralError if assignee is missing or invalid.

***

### extractAssignerIdentity()

> `static` **extractAssignerIdentity**(`policy`): `ObjectOrArray`\<`string`\>

Extract assigner identity from policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to extract the assigner from.

#### Returns

`ObjectOrArray`\<`string`\>

Assigner id.

#### Throws

GeneralError if assigner is missing or invalid.

***

### getAssigneeIdentity()

> `static` **getAssigneeIdentity**(`policy`): `ObjectOrArray`\<`string`\> \| `undefined`

Get assignee identity from policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to extract the assignee from.

#### Returns

`ObjectOrArray`\<`string`\> \| `undefined`

Assignee id.

#### Throws

GeneralError if assignee is missing or invalid.

***

### getAssignerIdentity()

> `static` **getAssignerIdentity**(`policy`): `ObjectOrArray`\<`string`\> \| `undefined`

Get assigner identity from policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to extract the assigner from.

#### Returns

`ObjectOrArray`\<`string`\> \| `undefined`

Assigner id.

#### Throws

GeneralError if assigner is missing or invalid.

***

### getTargets()

> `static` **getTargets**(`policy`): `string`[]

Get targets from policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to extract the targets from.

#### Returns

`string`[]

Targets.

***

### getActions()

> `static` **getActions**(`policy`): `string`[]

Get actions from policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to extract the actions from.

#### Returns

`string`[]

Actions.

***

### matchPolicy()

> `static` **matchPolicy**(`policy`, `options`): `boolean`

Does the policy match.

#### Parameters

##### policy

The policy to try and match.

`IOdrlPolicy` | `undefined`

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
