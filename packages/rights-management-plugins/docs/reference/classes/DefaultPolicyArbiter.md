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

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Default Policy Arbiter.

***

### SUPPORTED\_PROFILES {#supported_profiles}

> `readonly` `static` **SUPPORTED\_PROFILES**: `ReadonlySet`\<`string`\>

ODRL profiles whose custom vocabulary this arbiter understands and supports.
Any policy declaring a profile not in this set will be rejected.
Add a new entry here when support for an additional profile is implemented.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyArbiter.className`

***

### decide() {#decide}

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
