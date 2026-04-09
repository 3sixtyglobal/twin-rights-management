# Variable: RightsManagementPolicyType

> `const` **RightsManagementPolicyType**: `object`

TWIN rights-management policy types.
Extends the W3C ODRL policy types with TWIN-specific types that are not part
of the ODRL specification but are used by the TWIN platform.

The object-spread pattern `{ ...OdrlPolicyType, ... } as const` is used so that
this constant and its companion type union act as a single source of truth for all
valid `@type` strings the PAP accepts, without forking or re-exporting the
platform-level `OdrlPolicyType` enum from the standards package.

## Type Declaration

### EcosystemPolicy {#ecosystempolicy}

> `readonly` **EcosystemPolicy**: `"EcosystemPolicy"` = `"EcosystemPolicy"`

EcosystemPolicy type.
A TWIN platform-level governance policy that carries obligations for data events.
Not a bilateral contract — does not participate in DSP negotiation.
