# Interface: IPolicyEnforcementProcessor

Interface for policy enforcement processors.

## Extends

- `IComponent`

## Methods

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

[`IPolicyDecision`](IPolicyDecision.md)[]

The decisions made by the policy decision point.

##### data?

`D`

The data to process.

#### Returns

`Promise`\<`R`\>

The data after processing.
