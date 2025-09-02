# Interface: IStaticPolicyInformationSource

Configuration for the Static Policy Information Source Component.

## Properties

### accessMode

> **accessMode**: `PolicyInformationAccessMode`

Is the information public, if so it will be shared with negotiation requests.

***

### assetTypeActions?

> `optional` **assetTypeActions**: `object`[]

Information is only provided for the specified asset types/action combination.
If undefined is provided matches all asset types/actions.
If assetType is undefined matches all asset types.
If action is undefined matches all actions.

#### assetType?

> `optional` **assetType**: `string`

#### action?

> `optional` **action**: `string`

***

### objects

> **objects**: `IJsonLdNodeObject`[]

The objects containing the information.
