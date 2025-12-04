# Class: ExamplePolicyEnforcementProcessor

Example Policy Enforcement Processor.

## Implements

- `IPolicyEnforcementProcessor`

## Constructors

### Constructor

> **new ExamplePolicyEnforcementProcessor**(`options?`): `ExamplePolicyEnforcementProcessor`

Create a new instance of ExamplePolicyEnforcementProcessor.

#### Parameters

##### options?

[`IExamplePolicyEnforcementProcessorConstructorOptions`](../interfaces/IExamplePolicyEnforcementProcessorConstructorOptions.md)

The options for the example policy enforcement processor.

#### Returns

`ExamplePolicyEnforcementProcessor`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Example Policy Enforcement Processor.

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

> **process**\<`D`, `R`\>(`locator`, `decisions`, `data?`): `Promise`\<`R`\>

Process the response from the policy decision point.

#### Type Parameters

##### D

`D` = `unknown`

##### R

`R` = `D`

#### Parameters

##### locator

`IPolicyLocator`

The locator to find relevant policies.

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
