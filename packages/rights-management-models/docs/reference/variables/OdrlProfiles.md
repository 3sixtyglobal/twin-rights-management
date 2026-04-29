# Variable: OdrlProfiles

> `const` **OdrlProfiles**: `object`

Well-known ODRL profile URIs used by the TWIN platform.

## Type Declaration

### Twin {#twin}

> `readonly` **Twin**: `"https://schema.twindev.org/odrl/v1/profile"` = `"https://schema.twindev.org/odrl/v1/profile"`

The TWIN platform ODRL profile URI.
Policies carrying this profile may use TWIN-specific vocabulary extensions
(e.g. EcosystemPolicy, canonical twin:jsonPath + twin:jsonPathExpression operands).
https://schema.twindev.org/odrl/v1/

### TwinVocabContext {#twinvocabcontext}

> `readonly` **TwinVocabContext**: `"https://schema.twindev.org/odrl/v1/"` = `"https://schema.twindev.org/odrl/v1/"`

The TWIN platform ODRL vocabulary context URL.
Used as the second entry in the `@context` array for EcosystemPolicy documents.
