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

> **type**: `OdrlPolicyType`

The type of policy.

***

### profile? {#profile}

> `optional` **profile?**: `ObjectOrArray`\<`string`\>

The profile(s) this policy conforms to.

***

### assigner? {#assigner}

> `optional` **assigner?**: `ObjectOrArray`\<`string` \| `IOdrlParty` \| `IOdrlPartyCollection`\>

The assigner of the policy.

***

### assignee? {#assignee}

> `optional` **assignee?**: `ObjectOrArray`\<`string` \| `IOdrlParty` \| `IOdrlPartyCollection`\>

The assignee of the policy.

***

### target? {#target}

> `optional` **target?**: `ObjectOrArray`\<`string` \| `IOdrlAsset` \| `IOdrlAssetCollection`\>

The target asset for the rule.

***

### action? {#action}

> `optional` **action?**: `ObjectOrArray`\<`string` \| `IOdrlAction`\>

The action associated with the rule.

***

### inheritFrom? {#inheritfrom}

> `optional` **inheritFrom?**: `ObjectOrArray`\<`string`\>

The parent policy(ies) this policy inherits from.

***

### conflict? {#conflict}

> `optional` **conflict?**: `OdrlConflictStrategyType`

The conflict resolution strategy.

***

### permission? {#permission}

> `optional` **permission?**: `ObjectOrArray`\<`IOdrlPermission`\>

The permissions in the policy.

***

### prohibition? {#prohibition}

> `optional` **prohibition?**: `ObjectOrArray`\<`IOdrlProhibition`\>

The prohibitions in the policy.

***

### obligation? {#obligation}

> `optional` **obligation?**: `ObjectOrArray`\<`IOdrlDuty`\>

The obligations in the policy.

***

### dateCreated? {#datecreated}

> `optional` **dateCreated?**: `string`

schema.org dateCreated — ISO 8601 date-time set by PAP on create.

***

### dateModified? {#datemodified}

> `optional` **dateModified?**: `string`

schema.org dateModified — ISO 8601 date-time set by PAP on create and update.

***

### context? {#context}

> `optional` **context?**: `OdrlContextType`

Server-controlled JSON-LD context persisted by PAP (entity field `context` avoids the at-prefix).

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
