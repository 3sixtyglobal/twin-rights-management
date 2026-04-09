# Interface: IRightsManagementEcosystemPolicy

TWIN EcosystemPolicy in DSP storage shape.

Combines the DSP wire-format requirements (mandatory `@id`, no `uid`) from
`IDataspaceProtocolPolicy` with a narrowed `@type` discriminant so that callers
can rely on the type at compile time without any `as unknown as` cast.

Lives in `rights-management-models` (not `standards-dataspace-protocol`) because
EcosystemPolicy is a TWIN platform extension — not a DSP specification concept —
and `standards-dataspace-protocol` should remain a pure standards mirror.

## Extends

- `IDataspaceProtocolPolicy`

## Properties

### @type {#type}

> **@type**: `"EcosystemPolicy"`

The type must be "EcosystemPolicy".

#### Overrides

`IDataspaceProtocolPolicy.@type`
