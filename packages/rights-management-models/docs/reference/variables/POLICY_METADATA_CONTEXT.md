# Variable: POLICY\_METADATA\_CONTEXT

> `const` **POLICY\_METADATA\_CONTEXT**: `object`

Minimal inline JSON-LD context for PAP-managed schema.org policy metadata terms.
Avoids importing the full schema.org vocabulary, which collides with ODRL terms such as Offer and target.

## Type Declaration

### dateCreated {#datecreated}

> `readonly` **dateCreated**: `"https://schema.org/dateCreated"` = `"https://schema.org/dateCreated"`

schema.org dateCreated term IRI.

### dateModified {#datemodified}

> `readonly` **dateModified**: `"https://schema.org/dateModified"` = `"https://schema.org/dateModified"`

schema.org dateModified term IRI.
