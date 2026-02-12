# Interface: IPolicyEnforcementProcessor

Interface for policy enforcement processors.

## Extends

- `IComponent`

## Methods

### process()

> **process**\<`D`, `R`\>(`agreement`, `decisions`, `data?`, `action?`): `Promise`\<`R`\>

Process the response from the policy decision point.

#### Type Parameters

##### D

`D` = `unknown`

##### R

`R` = `D`

#### Parameters

##### agreement

`IOdrlAgreement`

The agreement to process.

##### decisions

[`IPolicyDecision`](IPolicyDecision.md)[]

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
