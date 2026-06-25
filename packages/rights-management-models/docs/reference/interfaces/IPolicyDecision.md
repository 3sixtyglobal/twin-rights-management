# Interface: IPolicyDecision

The information regarding a policy decision.

## Properties

### target {#target}

> **target**: `string`

The target object for the decision, using JSON-path syntax.

***

### decision {#decision}

> **decision**: [`PolicyDecision`](../type-aliases/PolicyDecision.md)

The outcome of the policy decision.

***

### replaceValue? {#replacevalue}

> `optional` **replaceValue?**: `unknown`

The value to replace with, if decision is Replace.
