# Type Alias: IRightsManagementEcosystemPolicy

> **IRightsManagementEcosystemPolicy** = `Omit`\<`IDataspaceProtocolPolicy`, `"@type"`\> & `object`

TWIN EcosystemPolicy in DSP storage shape.

Combines the DSP wire-format requirements (mandatory `@id`, no `uid`) from
`IDataspaceProtocolPolicy` with a narrowed `@type` discriminant so that callers
can rely on the type at compile time without any `as unknown as` cast.

Defined as an intersection type (rather than `extends IDataspaceProtocolPolicy`)
so that the narrowed `"@type": "EcosystemPolicy"` can override the base
`"@type": OdrlPolicyType` without a TS2430 extends-incompatibility error.
`"EcosystemPolicy"` is a TWIN extension — not in the W3C ODRL `OdrlPolicyType`
enum — so the interface hierarchy cannot express this narrowing directly.

Lives in `rights-management-models` (not `standards-dataspace-protocol`) because
EcosystemPolicy is a TWIN platform extension — not a DSP specification concept —
and `standards-dataspace-protocol` should remain a pure standards mirror.

## Type Declaration

### @type

> **@type**: *typeof* [`EcosystemPolicy`](../variables/RightsManagementPolicyType.md#ecosystempolicy)

The type must be "EcosystemPolicy".
