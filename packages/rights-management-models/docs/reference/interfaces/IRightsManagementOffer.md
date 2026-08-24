# Interface: IRightsManagementOffer

Offer policy returned by PAP, including optional PAP-managed lifecycle metadata.

## Extends

- `IDataspaceProtocolOffer`.[`IRightsManagementPolicyMetadata`](IRightsManagementPolicyMetadata.md).[`IRightsManagementPolicyTrust`](IRightsManagementPolicyTrust.md)

## Properties

### dateCreated? {#datecreated}

> `optional` **dateCreated?**: `string`

schema.org dateCreated - ISO 8601 date-time set by PAP on create.

#### Inherited from

[`IRightsManagementPolicyMetadata`](IRightsManagementPolicyMetadata.md).[`dateCreated`](IRightsManagementPolicyMetadata.md#datecreated)

***

### dateModified? {#datemodified}

> `optional` **dateModified?**: `string`

schema.org dateModified - ISO 8601 date-time set by PAP on create and update.

#### Inherited from

[`IRightsManagementPolicyMetadata`](IRightsManagementPolicyMetadata.md).[`dateModified`](IRightsManagementPolicyMetadata.md#datemodified)

***

### trustData? {#trustdata}

> `optional` **trustData?**: `object`

Trust verification data captured at the beginning of the negotiation.

#### Index Signature

\[`key`: `string`\]: `IJsonLdNodeObject`

#### Inherited from

[`IRightsManagementPolicyTrust`](IRightsManagementPolicyTrust.md).[`trustData`](IRightsManagementPolicyTrust.md#trustdata)
