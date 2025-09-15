# Interface: IPolicyNegotiationRequest

The JSON-LD definition for the policy negotiation proof.

## Extends

- [`IPolicyLocator`](IPolicyLocator.md)

## Properties

### assignee?

> `optional` **assignee**: `string`

The assignee for the locator.

#### Inherited from

[`IPolicyLocator`](IPolicyLocator.md).[`assignee`](IPolicyLocator.md#assignee)

***

### action?

> `optional` **action**: `string`

The action for the locator.

#### Inherited from

[`IPolicyLocator`](IPolicyLocator.md).[`action`](IPolicyLocator.md#action)

***

### assetType?

> `optional` **assetType**: `string`

The asset type for the locator.

#### Inherited from

[`IPolicyLocator`](IPolicyLocator.md).[`assetType`](IPolicyLocator.md#assettype)

***

### resourceId?

> `optional` **resourceId**: `string`

A resource identifier for the locator.

#### Inherited from

[`IPolicyLocator`](IPolicyLocator.md).[`resourceId`](IPolicyLocator.md#resourceid)

***

### @context

> **@context**: `"https://schema.twindev.org/rights-management"`

The JSON-LD context.

***

### type

> **type**: `"PolicyNegotiationRequest"`

The type of the proof.

***

### information?

> `optional` **information**: [`IPolicyInformation`](IPolicyInformation.md)

Additional information provided by the requester to determine if a policy can be created.
