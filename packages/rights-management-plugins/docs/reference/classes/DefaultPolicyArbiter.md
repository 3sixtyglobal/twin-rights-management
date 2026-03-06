# Class: DefaultPolicyArbiter

Default Policy Arbiter.

## Implements

- `IPolicyArbiter`

## Constructors

### Constructor

> **new DefaultPolicyArbiter**(`options?`): `DefaultPolicyArbiter`

Create a new instance of DefaultPolicyArbiter.

#### Parameters

##### options?

[`IDefaultPolicyArbiterConstructorOptions`](../interfaces/IDefaultPolicyArbiterConstructorOptions.md)

The options for the default policy arbiter.

#### Returns

`DefaultPolicyArbiter`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Default Policy Arbiter.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyArbiter.className`

***

### decide()

> **decide**\<`D`\>(`agreement`, `information?`, `data?`, `action?`): `Promise`\<`IPolicyDecision`[]\>

Makes decisions regarding policy access to data.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### agreement

`IDataspaceProtocolAgreement`

The agreement to evaluate.

##### information?

Information provided by the requester to determine if a policy can be created.

##### data?

`D`

The data to make a decision on.

##### action?

`string`

Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.

#### Returns

`Promise`\<`IPolicyDecision`[]\>

The decisions about access to the data.

#### Implementation of

`IPolicyArbiter.decide`
