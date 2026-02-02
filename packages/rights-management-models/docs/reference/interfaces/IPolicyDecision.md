# Interface: IPolicyDecision

The information regarding a policy decision.

## Properties

### target

> **target**: `string`

The target object for the decision, using JSON-path syntax.

***

### decision

> **decision**: [`PolicyDecision`](../type-aliases/PolicyDecision.md)

The type of the proof.

***

### replaceValue?

> `optional` **replaceValue**: `unknown`

The value to replace with, if decision is Replace.
