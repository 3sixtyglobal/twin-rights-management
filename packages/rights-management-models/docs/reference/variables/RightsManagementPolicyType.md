# Variable: RightsManagementPolicyType

> `const` **RightsManagementPolicyType**: `object`

TWIN rights-management policy types.
Extends the W3C ODRL policy types with TWIN-specific types that are not part
of the ODRL specification but are used by the TWIN platform.

## Type Declaration

### EcosystemPolicy {#ecosystempolicy}

> `readonly` **EcosystemPolicy**: `"EcosystemPolicy"` = `"EcosystemPolicy"`

EcosystemPolicy type.
A TWIN platform-level governance policy that carries obligations for data events.
Not a bilateral contract — does not participate in DSP negotiation.
