# Interface: IRightsManagementPolicyTrust

PAP-managed trust data attached to stored and returned ODRL policies.

## Extended by

- [`IRightsManagementAgreement`](IRightsManagementAgreement.md)
- [`IRightsManagementOffer`](IRightsManagementOffer.md)
- [`IRightsManagementPolicy`](IRightsManagementPolicy.md)
- [`IRightsManagementSet`](IRightsManagementSet.md)

## Properties

### trustData? {#trustdata}

> `optional` **trustData?**: `object`

Trust verification data captured at the beginning of the negotiation.

#### Index Signature

\[`key`: `string`\]: `IJsonLdNodeObject`
