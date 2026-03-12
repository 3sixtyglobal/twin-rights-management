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

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

The class name of the Default Policy Enforcement Processor.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IPolicyEnforcementProcessor.className`

***

### process() {#process}

> **process**\<`D`, `R`\>(`agreement`, `decisions`, `data?`, `action?`): `Promise`\<`R`\>

Process the response from the policy decision point.

#### Type Parameters

##### D

`D` = `unknown`

##### R

`R` = `D`

#### Parameters

##### agreement

`IDataspaceProtocolAgreement`

The agreement to process.

##### decisions

`IPolicyDecision`[]

The decisions made by the policy decision point.

##### data?

`D`

The data to process.

##### action?

`string`

Optional action to make a decision on, if not provided, the arbiter will evaluate all actions in the agreement.

#### Returns

`Promise`\<`R`\>

The data after processing.

#### Implementation of

`IPolicyEnforcementProcessor.process`
