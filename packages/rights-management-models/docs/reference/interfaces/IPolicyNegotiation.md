# Interface: IPolicyNegotiation

Interface describing a rights management policy negotiation.

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

### id

> **id**: `string`

The unique identifier for the policy.

***

### dateCreated

> **dateCreated**: `string`

The date and time when the negotiation was created.

***

### information?

> `optional` **information**: [`IPolicyInformation`](IPolicyInformation.md)

The requester information.

***

### status

> **status**: [`PolicyNegotiationStatus`](../type-aliases/PolicyNegotiationStatus.md)

The status of the negotiation.

***

### reason?

> `optional` **reason**: `string`

A reason which might be provided if the negotiation status is not approved.

***

### expires?

> `optional` **expires**: `number`

The expiration time for the policy negotiation.
