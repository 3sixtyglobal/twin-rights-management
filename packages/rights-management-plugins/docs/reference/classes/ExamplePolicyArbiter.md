# Class: ExamplePolicyArbiter

Example Policy Arbiter.

## Implements

- `IPolicyArbiter`

## Constructors

### Constructor

> **new ExamplePolicyArbiter**(`options?`): `ExamplePolicyArbiter`

Create a new instance of ExamplePolicyArbiter.

#### Parameters

##### options?

[`IExamplePolicyArbiterConstructorOptions`](../interfaces/IExamplePolicyArbiterConstructorOptions.md)

The options for the example policy arbiter.

#### Returns

`ExamplePolicyArbiter`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Example Policy Arbiter.

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

### supportedPolicies()

> **supportedPolicies**(): `IPolicyLocator`[]

The policies supported by this arbiter.

#### Returns

`IPolicyLocator`[]

The supported policies, if empty can be used for all.

#### Implementation of

`IPolicyArbiter.supportedPolicies`

***

### decide()

> **decide**\<`D`\>(`locator`, `information?`, `policies?`, `data?`): `Promise`\<`IPolicyDecision`[]\>

Makes decisions regarding policy access to data.

#### Type Parameters

##### D

`D` = `unknown`

#### Parameters

##### locator

`IPolicyLocator`

The locator to find relevant policies.

##### information?

`IPolicyInformation`

Information provided by the requester to determine if a policy can be created.

##### policies?

`IOdrlPolicy`[]

The policies that apply to the data.

##### data?

`D`

The data to make a decision on.

#### Returns

`Promise`\<`IPolicyDecision`[]\>

The decisions about access to the data.

#### Implementation of

`IPolicyArbiter.decide`
