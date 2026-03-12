# Class: PassThroughPolicyObligationEnforcer

Pass Through Policy Obligation Enforcer.

## Implements

- `IPolicyObligationEnforcer`

## Constructors

### Constructor

> **new PassThroughPolicyObligationEnforcer**(`options?`): `PassThroughPolicyObligationEnforcer`

Create a new instance of Pass Through Policy Obligation Enforcer.

#### Parameters

##### options?

[`IPassThroughPolicyObligationEnforcerConstructorOptions`](../interfaces/IPassThroughPolicyObligationEnforcerConstructorOptions.md)

The options for the pass through policy obligation enforcer.

#### Returns

`PassThroughPolicyObligationEnforcer`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Pass Through Policy Obligation Enforcer.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyObligationEnforcer.className`

***

### enforce() {#enforce}

> **enforce**\<`D`\>(`policy`, `duty`, `information?`, `data?`, `action?`): `Promise`\<`boolean`\>

Enforces obligations regarding policy access to data.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### policy

`IDataspaceProtocolPolicy`

The policy to evaluate.

##### duty

`IOdrlDuty`

The duty to enforce.

##### information?

Information provided by the requester to determine if a policy can be created.

##### data?

`D`

The data to make a decision on.

##### action?

`string`

Optional action to make a decision on, if not provided, the enforcer will evaluate all actions in the duty.

#### Returns

`Promise`\<`boolean`\>

Whether the obligations were successfully enforced.

#### Implementation of

`IPolicyObligationEnforcer.enforce`
