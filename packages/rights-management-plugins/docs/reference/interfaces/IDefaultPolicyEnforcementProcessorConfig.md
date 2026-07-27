# Interface: IDefaultPolicyEnforcementProcessorConfig

Configuration for the Default Policy Enforcement Processor.

## Properties

### structuralKeys? {#structuralkeys}

> `optional` **structuralKeys?**: `string`[]

Top-level keys that are treated as document-structural fields and are
passed through unconditionally, regardless of policy decisions.
Defaults to the standard JSON-LD envelope keys: @context, @type, @id, type, id.
