# Class: DefaultPolicyEnforcementProcessor

Default Policy Enforcement Processor.

## Implements

- `IPolicyEnforcementProcessor`

## Constructors

### Constructor

> **new DefaultPolicyEnforcementProcessor**(`options?`): `DefaultPolicyEnforcementProcessor`

Create a new instance of DefaultPolicyEnforcementProcessor.

#### Parameters

##### options?

[`IDefaultPolicyEnforcementProcessorConstructorOptions`](../interfaces/IDefaultPolicyEnforcementProcessorConstructorOptions.md)

The options for the default policy enforcement processor.

#### Returns

`DefaultPolicyEnforcementProcessor`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Default Policy Enforcement Processor.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyEnforcementProcessor.className`

***

### process()

> **process**\<`D`, `R`\>(`policy`, `decisions`, `data?`): `Promise`\<`R`\>

Process the response from the policy decision point.

#### Type Parameters

##### D

`D` = `unknown`

##### R

`R` = `D`

#### Parameters

##### policy

`IOdrlPolicy`

The policy to process.

##### decisions

`IPolicyDecision`[]

The decisions made by the policy decision point.

##### data?

`D`

The data to process.

#### Returns

`Promise`\<`R`\>

The data after processing.

#### Implementation of

`IPolicyEnforcementProcessor.process`
