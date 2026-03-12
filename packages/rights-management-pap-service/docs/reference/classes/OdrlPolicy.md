# Class: OdrlPolicy

Class describing an ODRL policy for entity storage.

## Constructors

### Constructor

> **new OdrlPolicy**(): `OdrlPolicy`

#### Returns

`OdrlPolicy`

## Properties

### id {#id}

> **id**: `string`

The unique identifier for the policy.

***

### type {#type}

> **type**: `PolicyType`

The type of policy.

***

### profile? {#profile}

> `optional` **profile**: `string` \| `string`[]

The profile(s) this policy conforms to.

***

### assigner? {#assigner}

> `optional` **assigner**: `string` \| `IOdrlParty` \| `IOdrlPartyCollection` \| (`string` \| `IOdrlParty` \| `IOdrlPartyCollection`)[]

The assigner of the policy.

***

### assignee? {#assignee}

> `optional` **assignee**: `string` \| `IOdrlParty` \| `IOdrlPartyCollection` \| (`string` \| `IOdrlParty` \| `IOdrlPartyCollection`)[]

The assignee of the policy.

***

### target? {#target}

> `optional` **target**: `string` \| `IOdrlAsset` \| `IOdrlAssetCollection` \| (`string` \| `IOdrlAsset` \| `IOdrlAssetCollection`)[]

The target asset for the rule.

***

### action? {#action}

> `optional` **action**: `string` \| `IOdrlAction` \| (`string` \| `IOdrlAction`)[]

The action associated with the rule.

***

### inheritFrom? {#inheritfrom}

> `optional` **inheritFrom**: `string` \| `string`[]

The parent policy(ies) this policy inherits from.

***

### conflict? {#conflict}

> `optional` **conflict**: `ConflictStrategyType`

The conflict resolution strategy.

***

### permission? {#permission}

> `optional` **permission**: `IOdrlPermission` \| `IOdrlPermission`[]

The permissions in the policy.

***

### prohibition? {#prohibition}

> `optional` **prohibition**: `IOdrlProhibition` \| `IOdrlProhibition`[]

The prohibitions in the policy.

***

### obligation? {#obligation}

> `optional` **obligation**: `IOdrlDuty` \| `IOdrlDuty`[]

The obligations in the policy.

***

### assignerIndex {#assignerindex}

> **assignerIndex**: `string`

The assignerIndex.

***

### assigneeIndex {#assigneeindex}

> **assigneeIndex**: `string`

The assigneeIndex.

***

### targetIndex {#targetindex}

> **targetIndex**: `string`

The targetIndex.

***

### actionIndex {#actionindex}

> **actionIndex**: `string`

The actionIndex.
