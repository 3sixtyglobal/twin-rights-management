# Interface: IStaticPolicyInformationSource

Configuration for the Static Policy Information Source Component.

## Properties

### accessMode

> **accessMode**: `PolicyInformationAccessMode`

Is the information public, if so it will be shared with negotiation requests.

***

### matchLocators?

> `optional` **matchLocators**: `object`[]

Information is only provided for the specified locator combination.

#### assignee?

> `optional` **assignee**: `string`

#### assigner?

> `optional` **assigner**: `string`

#### target?

> `optional` **target**: `string`

#### action?

> `optional` **action**: `string`

***

### objects

> **objects**: `object`

The objects containing the information.

#### Index Signature

\[`id`: `string`\]: `IJsonLdNodeObject`
